import { Injectable, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CreateMessageInput, MessageStatus, MessageType } from "@cliniq/shared-types";

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);
  private prisma = new PrismaClient();

  async getConversationMessages(conversationId: string, query: { page?: number; limit?: number }) {
    const { page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
          },
        },
        replyTo: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    return messages
      .map((message) => ({
        ...message,
        createdAt: message.createdAt.toISOString(),
        updatedAt: message.updatedAt.toISOString(),
        readAt: message.readAt?.toISOString() || null,
        reactions: (message as any).reactions.reduce((a: any[], r2: any) => {
          const existing = a.find((r: any) => r.emoji === r2.emoji);
          if (existing) {
            existing.userIds.push(r2.userId);
            existing.count++;
          } else {
            a.push({
              emoji: r2.emoji,
              userIds: [r2.userId],
              count: 1,
            });
          }
          return a;
        }, [] as any[]),
      }))
      .reverse(); // Return in chronological order
  }

  async createMessage(userId: string, data: CreateMessageInput) {
    // Check if user is a participant in the conversation
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId: data.conversationId, userId },
    });

    if (!participant) {
      throw new Error("Not a participant in this conversation");
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId: data.conversationId,
        senderId: userId,
        type: data.type,
        body: data.content,
        content: data.content,
        status: MessageStatus.SENT,
        replyToId: data.replyToId,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
          },
        },
        replyTo: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    // Update conversation's last message and timestamp
    await this.prisma.conversation.update({
      where: { id: data.conversationId },
      data: {
        lastMessage: data.content,
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Update participant's last read at (mark own message as read)
    await this.prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId: data.conversationId,
          userId,
        },
      },
      data: { lastReadAt: new Date() },
    });

    this.logger.log(
      `Message created: ${message.id} in conversation ${data.conversationId} by user ${userId}`,
    );

    return {
      ...message,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString(),
      readAt: message.readAt?.toISOString() || null,
      reactions: (message as any).reactions.reduce((a: any[], r2: any) => {
        const existing = a.find((r: any) => r.emoji === r2.emoji);
        if (existing) {
          existing.userIds.push(r2.userId);
          existing.count++;
        } else {
          a.push({
            emoji: r2.emoji,
            userIds: [r2.userId],
            count: 1,
          });
        }
        return a;
      }, [] as any[]),
    };
  }

  async updateMessage(messageId: string, userId: string, data: Partial<CreateMessageInput>) {
    const message = await this.prisma.message.findFirst({
      where: { id: messageId },
      include: { conversation: true },
    });

    if (!message) {
      throw new Error("Message not found");
    }

    // Check if user can edit this message
    if (message.senderId !== userId) {
      const participant = await this.prisma.conversationParticipant.findFirst({
        where: { conversationId: message.conversationId as string, userId },
      });

      const canEdit = participant && (participant.role === "OWNER" || participant.role === "ADMIN");
      if (!canEdit) {
        throw new Error("Insufficient permissions to edit message");
      }
    }

    const updatedMessage = await this.prisma.message.update({
      where: { id: messageId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
          },
        },
        replyTo: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    this.logger.log(`Message updated: ${messageId} by user ${userId}`);

    return {
      ...updatedMessage,
      createdAt: updatedMessage.createdAt.toISOString(),
      updatedAt: updatedMessage.updatedAt.toISOString(),
      readAt: updatedMessage.readAt?.toISOString() || null,
      reactions: (updatedMessage as any).reactions.reduce((a: any[], r2: any) => {
        const existing = a.find((r: any) => r.emoji === r2.emoji);
        if (existing) {
          existing.userIds.push(r2.userId);
          existing.count++;
        } else {
          a.push({
            emoji: r2.emoji,
            userIds: [r2.userId],
            count: 1,
          });
        }
        return a;
      }, [] as any[]),
    };
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.prisma.message.findFirst({
      where: { id: messageId },
      include: { conversation: true },
    });

    if (!message) {
      throw new Error("Message not found");
    }

    // Check if user can delete this message
    if (message.senderId !== userId) {
      const participant = await this.prisma.conversationParticipant.findFirst({
        where: { conversationId: message.conversationId as string, userId },
      });

      const canDelete =
        participant && (participant.role === "OWNER" || participant.role === "ADMIN");
      if (!canDelete) {
        throw new Error("Insufficient permissions to delete message");
      }
    }

    await this.prisma.message.delete({
      where: { id: messageId },
    });

    this.logger.log(`Message deleted: ${messageId} by user ${userId}`);
  }

  async markMessageAsRead(messageId: string, userId: string) {
    const message = await this.prisma.message.findFirst({
      where: { id: messageId },
      include: { conversation: true },
    });

    if (!message) {
      throw new Error("Message not found");
    }

    if (!message.conversationId) {
      throw new Error("Message is not part of a conversation");
    }

    // Check if user is a participant
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId: message.conversationId as string as string, userId },
    });

    if (!participant) {
      throw new Error("Not a participant in this conversation");
    }

    await this.prisma.message.update({
      where: { id: messageId },
      data: { readAt: new Date() },
    });

    // Update participant's last read at
    await this.prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId: message.conversationId as string as string,
          userId,
        },
      },
      data: { lastReadAt: new Date() },
    });

    this.logger.log(`Message ${messageId} marked as read by user ${userId}`);
  }

  async markAllMessagesAsRead(conversationId: string, userId: string) {
    // Check if user is a participant
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, userId },
    });

    if (!participant) {
      throw new Error("Not a participant in this conversation");
    }

    // Mark all unread messages as read
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    // Update participant's last read at
    await this.prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
      data: { lastReadAt: new Date() },
    });

    this.logger.log(
      `All messages in conversation ${conversationId} marked as read by user ${userId}`,
    );
  }

  async addReaction(messageId: string, userId: string, emoji: string) {
    // Check if user is a participant in the message's conversation
    const message = await this.prisma.message.findFirst({
      where: { id: messageId },
      include: { conversation: true },
    });

    if (!message) {
      throw new Error("Message not found");
    }

    if (!message.conversationId) {
      throw new Error("Message is not part of a conversation");
    }

    const participant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId: message.conversationId as string, userId },
    });

    if (!participant) {
      throw new Error("Not a participant in this conversation");
    }

    // Check if user already reacted with this emoji
    const existingReaction = await this.prisma.messageReaction.findFirst({
      where: { messageId, userId, emoji },
    });

    if (existingReaction) {
      throw new Error("Already reacted with this emoji");
    }

    const reaction = await this.prisma.messageReaction.create({
      data: {
        messageId,
        userId,
        emoji,
        createdAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    this.logger.log(`Reaction added: ${emoji} to message ${messageId} by user ${userId}`);

    return {
      ...reaction,
      createdAt: reaction.createdAt.toISOString(),
    };
  }

  async removeReaction(messageId: string, userId: string, emoji: string) {
    const reaction = await this.prisma.messageReaction.findFirst({
      where: { messageId, userId, emoji },
    });

    if (!reaction) {
      throw new Error("Reaction not found");
    }

    await this.prisma.messageReaction.delete({
      where: { id: reaction.id },
    });

    this.logger.log(`Reaction removed: ${emoji} from message ${messageId} by user ${userId}`);
  }

  async getMessageStats(conversationId: string) {
    const [totalMessages, textMessages, fileMessages, imageMessages] = await Promise.all([
      this.prisma.message.count({ where: { conversationId } }),
      this.prisma.message.count({ where: { conversationId, type: MessageType.TEXT } }),
      this.prisma.message.count({ where: { conversationId, type: MessageType.FILE } }),
      this.prisma.message.count({ where: { conversationId, type: MessageType.IMAGE } }),
    ]);

    return {
      totalMessages,
      textMessages,
      fileMessages,
      imageMessages,
    };
  }

  async getMessageById(messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!message) {
      throw new Error("Message not found");
    }

    return {
      ...message,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString(),
      readAt: message.readAt?.toISOString() || null,
    };
  }

  async searchMessagesInConversation(conversationId: string, query: string, limit = 20) {
    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
        content: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return messages.map((message) => ({
      ...message,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString(),
      readAt: message.readAt?.toISOString() || null,
    }));
  }
}
