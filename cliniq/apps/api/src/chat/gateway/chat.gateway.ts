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
import { SocketEvent, OnlineStatus } from '@cliniq/shared-types';

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
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  private connectedClients = new Map<string, string>(); // socketId -> userId

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
    private readonly messagesService: MessagesService,
  ) {}

  afterInit(server: Server) {
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
      this.connectedClients.set(client.id, client.userId);

      // Set user online
      const onlineUsers = await this.chatService.handleSocketConnect(client.id, client.userId);
      
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
    if (client.userId) {
      this.connectedClients.delete(client.id);
      
      // Set user offline
      const onlineUsers = await this.chatService.handleSocketDisconnect(client.id, client.userId);
      
      // Notify others about user going offline
      client.broadcast.emit('user_offline', {
        userId: client.userId,
        status: OnlineStatus.OFFLINE,
        onlineUsers,
      });

      this.logger.log(`Client disconnected: ${client.id} (User: ${client.userId})`);
    }
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) return;

    try {
      // Verify user is a participant in the conversation
      await this.chatService.handleJoinRoom(client.id, client.userId, data.conversationId);
      
      // Join the conversation room
      client.join(`conversation:${data.conversationId}`);
      
      // Notify others in the room
      client.to(`conversation:${data.conversationId}`).emit('user_joined', {
        conversationId: data.conversationId,
        userId: client.userId,
      });

      this.logger.log(`User ${client.userId} joined room ${data.conversationId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to join room' });
    }
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) return;

    try {
      await this.chatService.handleLeaveRoom(client.id, client.userId, data.conversationId);
      
      // Leave the conversation room
      client.leave(`conversation:${data.conversationId}`);
      
      // Notify others in the room
      client.to(`conversation:${data.conversationId}`).emit('user_left', {
        conversationId: data.conversationId,
        userId: client.userId,
      });

      this.logger.log(`User ${client.userId} left room ${data.conversationId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to leave room' });
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { conversationId: string; content: string; type: string; replyToId?: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) return;

    try {
      const messageData = await this.chatService.handleSendMessage(client.id, client.userId, data);
      
      // Create the message in database
      const message = await this.messagesService.createMessage(client.userId, {
        conversationId: data.conversationId,
        type: data.type as any,
        content: data.content,
        replyToId: data.replyToId,
      });

      // Broadcast to all participants in the conversation
      this.server.to(`conversation:${data.conversationId}`).emit('new_message', message);

      this.logger.log(`Message sent in conversation ${data.conversationId} by user ${client.userId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('typing_start')
  async handleTypingStart(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) return;

    try {
      const typingIndicators = await this.chatService.handleTypingStart(client.id, client.userId, data.conversationId);
      
      // Broadcast typing indicator to other participants
      client.to(`conversation:${data.conversationId}`).emit('typing_start', {
        conversationId: data.conversationId,
        userId: client.userId,
        typingIndicators,
      });

      this.logger.log(`User ${client.userId} started typing in conversation ${data.conversationId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to update typing status' });
    }
  }

  @SubscribeMessage('typing_stop')
  async handleTypingStop(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) return;

    try {
      const typingIndicators = await this.chatService.handleTypingStop(client.id, client.userId, data.conversationId);
      
      // Broadcast typing indicator to other participants
      client.to(`conversation:${data.conversationId}`).emit('typing_stop', {
        conversationId: data.conversationId,
        userId: client.userId,
        typingIndicators,
      });

      this.logger.log(`User ${client.userId} stopped typing in conversation ${data.conversationId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to update typing status' });
    }
  }

  @SubscribeMessage('update_status')
  async handleStatusUpdate(
    @MessageBody() data: { status: OnlineStatus },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) return;

    try {
      const onlineUsers = await this.chatService.handleOnlineStatusUpdate(client.id, client.userId, data.status);
      
      // Broadcast status update to all connected clients
      this.server.emit('status_update', {
        userId: client.userId,
        status: data.status,
        onlineUsers,
      });

      this.logger.log(`User ${client.userId} updated status to ${data.status}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to update status' });
    }
  }

  @SubscribeMessage('message_read')
  async handleMessageRead(
    @MessageBody() data: { messageId: string; conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) return;

    try {
      await this.chatService.handleMessageRead(client.id, client.userId, data.messageId);
      
      // Notify the message sender about read receipt
      const message = await this.messagesService.getMessageById(data.messageId);
      if (message && message.senderId !== client.userId) {
        this.server.to(`user:${message.senderId}`).emit('message_read', {
          messageId: data.messageId,
          conversationId: data.conversationId,
          readBy: client.userId,
        });
      }

      this.logger.log(`Message ${data.messageId} marked as read by user ${client.userId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to mark message as read' });
    }
  }

  @SubscribeMessage('add_reaction')
  async handleAddReaction(
    @MessageBody() data: { messageId: string; emoji: string; conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) return;

    try {
      const reaction = await this.messagesService.addReaction(data.messageId, client.userId, data.emoji);
      
      // Broadcast reaction to all participants in the conversation
      this.server.to(`conversation:${data.conversationId}`).emit('reaction_added', {
        messageId: data.messageId,
        emoji: data.emoji,
        userId: client.userId,
        reaction,
      });

      this.logger.log(`Reaction ${data.emoji} added to message ${data.messageId} by user ${client.userId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to add reaction' });
    }
  }

  @SubscribeMessage('remove_reaction')
  async handleRemoveReaction(
    @MessageBody() data: { messageId: string; emoji: string; conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) return;

    try {
      await this.messagesService.removeReaction(data.messageId, client.userId, data.emoji);
      
      // Broadcast reaction removal to all participants in the conversation
      this.server.to(`conversation:${data.conversationId}`).emit('reaction_removed', {
        messageId: data.messageId,
        emoji: data.emoji,
        userId: client.userId,
      });

      this.logger.log(`Reaction ${data.emoji} removed from message ${data.messageId} by user ${client.userId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to remove reaction' });
    }
  }

  // Helper methods
  private async verifyUserInConversation(userId: string, conversationId: string): Promise<boolean> {
    try {
      // This would check if user is a participant in the conversation
      // Implementation would depend on your Prisma schema
      return true; // Placeholder
    } catch (error) {
      return false;
    }
  }

  private broadcastToConversationParticipants(conversationId: string, event: string, data: any) {
    this.server.to(`conversation:${conversationId}`).emit(event, data);
  }

  private sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
}
