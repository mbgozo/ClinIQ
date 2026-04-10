import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { OnlineStatus, TypingIndicator } from '@cliniq/shared-types';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private prisma = new PrismaClient();
  private onlineUsers = new Map<string, { status: OnlineStatus; lastSeen: string; socketId?: string }>();
  private typingIndicators = new Map<string, Map<string, { isTyping: boolean; timestamp: string }>>();

  async getOnlineUsers() {
    const onlineUsers = Array.from(this.onlineUsers.entries()).map(([userId, data]: [string, any]) => ({
      userId,
      status: data.status,
      lastSeenAt: data.lastSeen,
      socketId: data.socketId,
    }));

    return onlineUsers;
  }

  async setUserOnline(userId: string, socketId: string, status: OnlineStatus = OnlineStatus.ONLINE) {
    this.onlineUsers.set(userId, {
      status,
      lastSeen: new Date().toISOString(),
      socketId,
    });

    this.logger.log(`User ${userId} is now online with status ${status}`);
  }

  async setUserOffline(userId: string) {
    const userData = this.onlineUsers.get(userId);
    if (userData) {
      userData.status = OnlineStatus.OFFLINE;
      userData.lastSeen = new Date().toISOString();
      delete userData.socketId;
    }

    this.logger.log(`User ${userId} is now offline`);
  }

  async updateUserStatus(userId: string, status: OnlineStatus) {
    const userData = this.onlineUsers.get(userId);
    if (userData) {
      userData.status = status;
      userData.lastSeen = new Date().toISOString();
    }

    this.logger.log(`User ${userId} status updated to ${status}`);
  }

  async getTypingIndicators(conversationId: string) {
    const conversationTyping = this.typingIndicators.get(conversationId);
    if (!conversationTyping) return [];

    const now = new Date();
    const typingUsers: TypingIndicator[] = [];

    for (const [userId, indicator] of conversationTyping.entries()) {
      // Remove typing indicators older than 5 seconds
      const indicatorTime = new Date(indicator.timestamp);
      if (now.getTime() - indicatorTime.getTime() > 5000) {
        conversationTyping.delete(userId);
      } else if (indicator.isTyping) {
        typingUsers.push({
          conversationId,
          userId,
          isTyping: true,
          timestamp: indicator.timestamp,
        });
      }
    }

    return typingUsers;
  }

  async setTypingIndicator(conversationId: string, userId: string, isTyping: boolean) {
    if (!this.typingIndicators.has(conversationId)) {
      this.typingIndicators.set(conversationId, new Map());
    }

    const conversationTyping = this.typingIndicators.get(conversationId)!;
    
    if (isTyping) {
      conversationTyping.set(userId, {
        isTyping: true,
        timestamp: new Date().toISOString(),
      });
    } else {
      conversationTyping.delete(userId);
    }

    this.logger.log(`User ${userId} typing ${isTyping ? 'started' : 'stopped'} in conversation ${conversationId}`);
  }

  async searchMessages(userId: string, query: { q: string; conversationId?: string; limit?: number }) {
    const { q, conversationId, limit = 20 } = query;

    const where = {
      conversation: {
        participants: {
          some: { userId }
        }
      },
      ...(conversationId && { conversationId }),
      OR: [
        { content: { contains: q, mode: Prisma.QueryMode.insensitive } },
        { sender: { name: { contains: q, mode: Prisma.QueryMode.insensitive } } }
      ]
    };

    const messages = await this.prisma.message.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        },
        conversation: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return messages.map(message => ({
      ...message,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString(),
      readAt: message.readAt?.toISOString() || null,
    }));
  }

  async getUserUnreadCount(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId }
        }
      },
      include: {
        participants: {
          where: { userId },
          select: { lastReadAt: true }
        },
        messages: {
          where: {
            senderId: { not: userId },
          },
          select: { id: true }
        }
      }
    });

    let totalUnread = 0;
    for (const conversation of conversations) {
      const participant = conversation.participants[0];
      if (participant && participant.lastReadAt) {
        const unreadCount = await this.prisma.message.count({
          where: {
            conversationId: conversation.id,
            senderId: { not: userId },
            createdAt: { gt: participant.lastReadAt }
          }
        });
        totalUnread += unreadCount;
      }
    }

    return totalUnread;
  }

  async markConversationAsRead(conversationId: string, userId: string) {
    await this.prisma.conversationParticipant.updateMany({
      where: {
        conversationId,
        userId,
      },
      data: {
        lastReadAt: new Date(),
      }
    });

    this.logger.log(`Conversation ${conversationId} marked as read by user ${userId}`);
  }

  async getConversationStats(conversationId: string) {
    const [messageCount, participantCount, lastMessage] = await Promise.all([
      this.prisma.message.count({ where: { conversationId } }),
      this.prisma.conversationParticipant.count({ where: { conversationId } }),
      this.prisma.message.findFirst({
        where: { conversationId },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true }
      })
    ]);

    return {
      messageCount,
      participantCount,
      lastActivity: lastMessage?.createdAt?.toISOString() || null,
    };
  }

  async cleanupOldTypingIndicators() {
    const now = new Date();
    let cleanedCount = 0;

    for (const [conversationId, typingMap] of this.typingIndicators.entries()) {
      for (const [userId, indicator] of typingMap.entries()) {
        const indicatorTime = new Date(indicator.timestamp);
        if (now.getTime() - indicatorTime.getTime() > 5000) {
          typingMap.delete(userId);
          cleanedCount++;
        }
      }

      // Remove empty conversation maps
      if (typingMap.size === 0) {
        this.typingIndicators.delete(conversationId);
      }
    }

    if (cleanedCount > 0) {
      this.logger.log(`Cleaned up ${cleanedCount} old typing indicators`);
    }
  }

  // WebSocket event handlers
  async handleSocketConnect(socketId: string, userId: string) {
    await this.setUserOnline(userId, socketId);
    return this.getOnlineUsers();
  }

  async handleSocketDisconnect(_socketId: string, userId: string) {
    await this.setUserOffline(userId);
    return this.getOnlineUsers();
  }

  async handleJoinRoom(_socketId: string, userId: string, conversationId: string) {
    // User joins a conversation room for real-time updates
    this.logger.log(`User ${userId} joined conversation room ${conversationId}`);
    return { success: true };
  }

  async handleLeaveRoom(_socketId: string, userId: string, conversationId: string) {
    // User leaves a conversation room
    this.logger.log(`User ${userId} left conversation room ${conversationId}`);
    return { success: true };
  }

  async handleSendMessage(_socketId: string, userId: string, messageData: any) {
    // Handle real-time message sending
    this.logger.log(`Message sent by user ${userId} in conversation ${messageData.conversationId}`);
    return messageData;
  }

  async handleTypingStart(_socketId: string, userId: string, conversationId: string) {
    await this.setTypingIndicator(conversationId, userId, true);
    return this.getTypingIndicators(conversationId);
  }

  async handleTypingStop(_socketId: string, userId: string, conversationId: string) {
    await this.setTypingIndicator(conversationId, userId, false);
    return this.getTypingIndicators(conversationId);
  }

  async handleOnlineStatusUpdate(_socketId: string, userId: string, status: OnlineStatus) {
    await this.updateUserStatus(userId, status);
    return this.getOnlineUsers();
  }

  async handleMessageRead(_socketId: string, userId: string, messageId: string) {
    // Handle message read receipt
    await this.prisma.message.update({
      where: { id: messageId },
      data: { readAt: new Date() }
    });

    this.logger.log(`Message ${messageId} marked as read by user ${userId}`);
    return { success: true };
  }
}
