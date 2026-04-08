import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Conversation, CreateConversationInput, ChatType } from '@cliniq/shared-types';

@Injectable()
export class ConversationsService {
  private readonly logger = new Logger(ConversationsService.name);
  private prisma = new PrismaClient();

  async getUserConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                onlineStatus: true,
                lastSeenAt: true,
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return conversations.map((conversation: any) => {
      const lastMessage = conversation.messages[0];
      const userParticipant = conversation.participants.find((p: any) => p.userId === userId);
      
      // Calculate unread count
      const unreadCount = lastMessage && userParticipant?.lastReadAt
        ? lastMessage.createdAt > userParticipant.lastReadAt ? 1 : 0
        : 0;

      return {
        ...conversation,
        lastMessage: lastMessage?.content || null,
        lastMessageAt: lastMessage?.createdAt?.toISOString() || null,
        unreadCount,
        participantIds: conversation.participants.map((p: any) => p.userId),
        createdAt: conversation.createdAt.toISOString(),
        updatedAt: conversation.updatedAt.toISOString(),
      };
    });
  }

  async getConversationById(id: string, userId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id,
        participants: {
          some: { userId }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                onlineStatus: true,
                lastSeenAt: true,
                institution: true,
                program: true,
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 50,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              }
            }
          }
        }
      }
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const userParticipant = conversation.participants.find((p: any) => p.userId === userId);
    const unreadCount = userParticipant?.lastReadAt
      ? conversation.messages.filter((m: any) => 
          m.senderId !== userId && m.createdAt > userParticipant.lastReadAt
        ).length
      : conversation.messages.filter((m: any) => m.senderId !== userId).length;

    return {
      ...conversation,
      participantIds: conversation.participants.map(p => p.userId),
      unreadCount,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
      messages: conversation.messages.map((message: any) => ({
        ...message,
        createdAt: message.createdAt.toISOString(),
        updatedAt: message.updatedAt.toISOString(),
        readAt: message.readAt?.toISOString() || null,
      }))
    };
  }

  async createConversation(userId: string, data: CreateConversationInput) {
    // For direct messages, check if conversation already exists
    if (data.type === ChatType.DIRECT && data.participantIds.length === 1) {
      const existingConversation = await this.findDirectConversation(userId, data.participantIds[0]);
      if (existingConversation) {
        return existingConversation;
      }
    }

    const conversation = await this.prisma.conversation.create({
      data: {
        type: data.type,
        name: data.name,
        description: data.description,
        metadata: data.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                onlineStatus: true,
                lastSeenAt: true,
              }
            }
          }
        }
      }
    });

    // Add all participants including the creator
    const allParticipantIds = [userId, ...data.participantIds];
    await this.prisma.conversationParticipant.createMany({
      data: allParticipantIds.map(participantId => ({
        conversationId: conversation.id,
        userId: participantId,
        role: participantId === userId ? 'OWNER' : 'MEMBER',
        joinedAt: new Date(),
      }))
    });

    // Fetch the complete conversation with participants
    const completeConversation = await this.prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                onlineStatus: true,
                lastSeenAt: true,
              }
            }
          }
        }
      }
    });

    this.logger.log(`Conversation created: ${conversation.id} by user ${userId}`);

    return {
      ...completeConversation!,
      participantIds: allParticipantIds,
      lastMessage: null,
      lastMessageAt: null,
      unreadCount: 0,
      createdAt: completeConversation!.createdAt.toISOString(),
      updatedAt: completeConversation!.updatedAt.toISOString(),
    };
  }

  async updateConversation(id: string, userId: string, data: Partial<CreateConversationInput>) {
    // Check if user can update conversation
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId: id, userId },
      include: { conversation: true }
    });

    if (!participant) {
      throw new Error('Not a participant in this conversation');
    }

    const canEdit = participant.role === 'OWNER' || participant.role === 'ADMIN';
    if (!canEdit) {
      throw new Error('Insufficient permissions to update conversation');
    }

    const conversation = await this.prisma.conversation.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                onlineStatus: true,
                lastSeenAt: true,
              }
            }
          }
        }
      }
    });

    this.logger.log(`Conversation updated: ${id} by user ${userId}`);

    return {
      ...conversation,
      participantIds: conversation.participants.map(p => p.userId),
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
    };
  }

  async deleteConversation(id: string, userId: string) {
    // Check if user can delete conversation
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId: id, userId },
      include: { conversation: true }
    });

    if (!participant) {
      throw new Error('Not a participant in this conversation');
    }

    const canDelete = participant.role === 'OWNER';
    if (!canDelete) {
      throw new Error('Only conversation owners can delete conversations');
    }

    await this.prisma.conversation.delete({
      where: { id }
    });

    this.logger.log(`Conversation deleted: ${id} by user ${userId}`);
  }

  async getParticipants(conversationId: string, userId: string) {
    // Check if user is a participant
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, userId }
    });

    if (!participant) {
      throw new Error('Not a participant in this conversation');
    }

    const participants = await this.prisma.conversationParticipant.findMany({
      where: { conversationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            onlineStatus: true,
            lastSeenAt: true,
            institution: true,
            program: true,
          }
        }
      },
      orderBy: { joinedAt: 'asc' }
    });

    return participants.map(p => ({
      ...p,
      joinedAt: p.joinedAt.toISOString(),
      lastReadAt: p.lastReadAt?.toISOString() || null,
    }));
  }

  async addParticipant(conversationId: string, currentUserId: string, newUserId: string) {
    // Check if current user can add participants
    const currentParticipant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, userId: currentUserId }
    });

    if (!currentParticipant) {
      throw new Error('Not a participant in this conversation');
    }

    const canAdd = currentParticipant.role === 'OWNER' || currentParticipant.role === 'ADMIN';
    if (!canAdd) {
      throw new Error('Insufficient permissions to add participants');
    }

    // Check if user is already a participant
    const existingParticipant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, userId: newUserId }
    });

    if (existingParticipant) {
      throw new Error('User is already a participant');
    }

    const participant = await this.prisma.conversationParticipant.create({
      data: {
        conversationId,
        userId: newUserId,
        role: 'MEMBER',
        joinedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            onlineStatus: true,
            lastSeenAt: true,
            institution: true,
            program: true,
          }
        }
      }
    });

    this.logger.log(`User ${newUserId} added to conversation ${conversationId} by ${currentUserId}`);

    return {
      ...participant,
      joinedAt: participant.joinedAt.toISOString(),
      lastReadAt: participant.lastReadAt?.toISOString() || null,
    };
  }

  async removeParticipant(conversationId: string, currentUserId: string, targetUserId: string) {
    // Check if current user can remove participants
    const currentParticipant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, userId: currentUserId }
    });

    if (!currentParticipant) {
      throw new Error('Not a participant in this conversation');
    }

    const canRemove = currentParticipant.role === 'OWNER' || currentParticipant.role === 'ADMIN';
    if (!canRemove && currentUserId !== targetUserId) {
      throw new Error('Insufficient permissions to remove participants');
    }

    // Cannot remove owners
    const targetParticipant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, userId: targetUserId }
    });

    if (!targetParticipant) {
      throw new Error('User is not a participant');
    }

    if (targetParticipant.role === 'OWNER') {
      throw new Error('Cannot remove conversation owner');
    }

    await this.prisma.conversationParticipant.delete({
      where: { id: targetParticipant.id }
    });

    this.logger.log(`User ${targetUserId} removed from conversation ${conversationId} by ${currentUserId}`);
  }

  private async findDirectConversation(userId1: string, userId2: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        type: ChatType.DIRECT,
        participants: {
          every: {
            userId: { in: [userId1, userId2] }
          }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                onlineStatus: true,
                lastSeenAt: true,
              }
            }
          }
        }
      }
    });

    if (!conversation) return null;

    return {
      ...conversation,
      participantIds: conversation.participants.map(p => p.userId),
      lastMessage: null,
      lastMessageAt: null,
      unreadCount: 0,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
    };
  }

  async updateParticipantRole(conversationId: string, userId: string, newRole: string, adminId: string) {
    // Check if admin can update roles
    const admin = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, userId: adminId }
    });

    if (!admin || (admin.role !== 'OWNER' && admin.role !== 'ADMIN')) {
      throw new Error('Insufficient permissions to update roles');
    }

    const participant = await this.prisma.conversationParticipant.update({
      where: { 
        conversationId_userId: {
          conversationId,
          userId
        }
      },
      data: { role: newRole as any },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            onlineStatus: true,
            lastSeenAt: true,
          }
        }
      }
    });

    this.logger.log(`Role updated for user ${userId} in conversation ${conversationId} to ${newRole}`);

    return {
      ...participant,
      joinedAt: participant.joinedAt.toISOString(),
      lastReadAt: participant.lastReadAt?.toISOString() || null,
    };
  }
}
