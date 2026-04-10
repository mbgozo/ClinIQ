import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from '../chat.service';
import { MessagesService } from '../messages.service';
import { OnlineStatus } from '@cliniq/shared-types';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  private readonly logger = new Logger(ChatGateway.name);
  private connectedClients = new Map<string, string>(); // socketId -> userId

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
    private readonly messagesService: MessagesService,
  ) {}

  afterInit(_server: Server) {
    this.logger.log('WebSocket Gateway initialized');
    
    // Clean up old typing indicators every 30 seconds
    setInterval(() => {
      this.chatService.cleanupOldTypingIndicators();
    }, 30000);
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Authenticate user from token
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        this.logger.warn('Connection rejected: No token provided');
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      client.userId = payload.sub;
      this.connectedClients.set(client.id, client.userId as string);

      // Set user online
      const onlineUsers = await this.chatService.handleSocketConnect(client.id, client.userId as string);
      
      // Join user to their personal room for notifications
      client.join(`user:${client.userId}`);
      
      // Notify others about user coming online
      client.broadcast.emit('user_online', {
        userId: client.userId,
        status: OnlineStatus.ONLINE,
        onlineUsers,
      });

      // Send current online status to the connected user
      client.emit('online_status', onlineUsers);

      this.logger.log(`Client connected: ${client.id} (User: ${client.userId})`);
    } catch (error) {
      this.logger.error('Authentication failed:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    const userId = client.userId;
    if (userId) {
      this.connectedClients.delete(client.id);
      
      // Set user offline
      const onlineUsers = await this.chatService.handleSocketDisconnect(client.id, userId);
      
      // Notify others about user going offline
      client.broadcast.emit('user_offline', {
        userId,
        status: OnlineStatus.OFFLINE,
        onlineUsers,
      });

      this.logger.log(`Client disconnected: ${client.id} (User: ${userId})`);
    }
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId = client.userId;
    if (!userId) return;

    try {
      // Verify user is a participant in the conversation
      await this.chatService.handleJoinRoom(client.id, userId, data.conversationId);
      
      // Join the conversation room
      client.join(`conversation:${data.conversationId}`);
      
      // Notify others in the room
      client.to(`conversation:${data.conversationId}`).emit('user_joined', {
        conversationId: data.conversationId,
        userId,
      });

      this.logger.log(`User ${userId} joined room ${data.conversationId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to join room' });
    }
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId = client.userId;
    if (!userId) return;

    try {
      await this.chatService.handleLeaveRoom(client.id, userId, data.conversationId);
      
      // Leave the conversation room
      client.leave(`conversation:${data.conversationId}`);
      
      // Notify others in the room
      client.to(`conversation:${data.conversationId}`).emit('user_left', {
        conversationId: data.conversationId,
        userId,
      });

      this.logger.log(`User ${userId} left room ${data.conversationId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to leave room' });
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { conversationId: string; content: string; type: string; replyToId?: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId = client.userId;
    if (!userId) return;

    try {
      await this.chatService.handleSendMessage(client.id, userId, data);
      
      // Create the message in database
      const message = await this.messagesService.createMessage(userId, {
        conversationId: data.conversationId,
        type: data.type as any,
        content: data.content,
        replyToId: data.replyToId,
      });

      // Broadcast to all participants in the conversation
      this.server.to(`conversation:${data.conversationId}`).emit('new_message', message);

      this.logger.log(`Message sent in conversation ${data.conversationId} by user ${userId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('typing_start')
  async handleTypingStart(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId = client.userId;
    if (!userId) return;

    try {
      const typingIndicators = await this.chatService.handleTypingStart(client.id, userId, data.conversationId);
      
      // Broadcast typing indicator to other participants
      client.to(`conversation:${data.conversationId}`).emit('typing_start', {
        conversationId: data.conversationId,
        userId,
        typingIndicators,
      });

      this.logger.log(`User ${userId} started typing in conversation ${data.conversationId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to update typing status' });
    }
  }

  @SubscribeMessage('typing_stop')
  async handleTypingStop(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId = client.userId;
    if (!userId) return;

    try {
      const typingIndicators = await this.chatService.handleTypingStop(client.id, userId, data.conversationId);
      
      // Broadcast typing indicator to other participants
      client.to(`conversation:${data.conversationId}`).emit('typing_stop', {
        conversationId: data.conversationId,
        userId,
        typingIndicators,
      });

      this.logger.log(`User ${userId} stopped typing in conversation ${data.conversationId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to update typing status' });
    }
  }

  @SubscribeMessage('update_status')
  async handleStatusUpdate(
    @MessageBody() data: { status: OnlineStatus },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId = client.userId;
    if (!userId) return;

    try {
      const onlineUsers = await this.chatService.handleOnlineStatusUpdate(client.id, userId, data.status);
      
      // Broadcast status update to all connected clients
      this.server.emit('status_update', {
        userId,
        status: data.status,
        onlineUsers,
      });

      this.logger.log(`User ${userId} updated status to ${data.status}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to update status' });
    }
  }

  @SubscribeMessage('message_read')
  async handleMessageRead(
    @MessageBody() data: { messageId: string; conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId = client.userId;
    if (!userId) return;

    try {
      await this.chatService.handleMessageRead(client.id, userId, data.messageId);
      
      // Notify the message sender about read receipt
      const message = await this.messagesService.getMessageById(data.messageId);
      if (message && message.senderId !== userId) {
        this.server.to(`user:${message.senderId}`).emit('message_read', {
          messageId: data.messageId,
          conversationId: data.conversationId,
          readBy: userId,
        });
      }

      this.logger.log(`Message ${data.messageId} marked as read by user ${userId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to mark message as read' });
    }
  }

  @SubscribeMessage('add_reaction')
  async handleAddReaction(
    @MessageBody() data: { messageId: string; emoji: string; conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId = client.userId;
    if (!userId) return;

    try {
      const reaction = await this.messagesService.addReaction(data.messageId, userId, data.emoji);
      
      // Broadcast reaction to all participants in the conversation
      this.server.to(`conversation:${data.conversationId}`).emit('reaction_added', {
        messageId: data.messageId,
        emoji: data.emoji,
        userId,
        reaction,
      });

      this.logger.log(`Reaction ${data.emoji} added to message ${data.messageId} by user ${userId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to add reaction' });
    }
  }

  @SubscribeMessage('remove_reaction')
  async handleRemoveReaction(
    @MessageBody() data: { messageId: string; emoji: string; conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId = client.userId;
    if (!userId) return;

    try {
      await this.messagesService.removeReaction(data.messageId, userId, data.emoji);
      
      // Broadcast reaction removal to all participants in the conversation
      this.server.to(`conversation:${data.conversationId}`).emit('reaction_removed', {
        messageId: data.messageId,
        emoji: data.emoji,
        userId,
      });

      this.logger.log(`Reaction ${data.emoji} removed from message ${data.messageId} by user ${userId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to remove reaction' });
    }
  }

}
