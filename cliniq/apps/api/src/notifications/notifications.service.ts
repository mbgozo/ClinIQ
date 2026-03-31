import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import {
  NotificationType,
  CreateNotificationInput,
  NotificationFilter,
  NotificationPreferences,
} from "@cliniq/shared-types";

@Injectable()
export class NotificationsService {
  private prisma = new PrismaClient();

  async create(data: CreateNotificationInput) {
    return this.prisma.notification.create({
      data: {
        ...data,
        createdAt: new Date(),
      },
    });
  }

  async getUserNotifications(userId: string, filters: NotificationFilter) {
    const { page = 1, limit = 20, read, type } = filters;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(read !== undefined && { read }),
      ...(type && { type }),
    };

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      notifications: notifications.map((n) => ({
        ...n,
        createdAt: n.createdAt.toISOString(),
      })),
      total,
    };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  async markAsRead(userId: string, notificationId: string) {
    return this.prisma.notification.update({
      where: {
        id: notificationId,
        userId, // Ensure user can only mark their own notifications
      },
      data: {
        read: true,
      },
    });
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return result.count;
  }

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    link?: string,
  ) {
    return this.create({
      userId,
      type,
      title,
      body,
      link,
    });
  }

  // Notification triggers for different events
  async triggerAnswerPosted(
    questionUserId: string,
    answererName: string,
    questionTitle: string,
    questionId: string,
    answerId: string,
  ) {
    await this.createNotification(
      questionUserId,
      NotificationType.ANSWER_POSTED,
      "New answer on your question",
      `${answererName} answered: "${questionTitle}"`,
      `/questions/${questionId}#answer-${answerId}`,
    );
  }

  async triggerAnswerAccepted(answererUserId: string, questionTitle: string, questionId: string) {
    await this.createNotification(
      answererUserId,
      NotificationType.ANSWER_ACCEPTED,
      "Your answer was accepted!",
      `Your answer to "${questionTitle}" was marked as accepted.`,
      `/questions/${questionId}`,
    );
  }

  async triggerQuestionUpvoted(questionUserId: string, questionTitle: string, questionId: string) {
    await this.createNotification(
      questionUserId,
      NotificationType.QUESTION_UPVOTED,
      "Your question received an upvote",
      `Your question "${questionTitle}" was upvoted by the community.`,
      `/questions/${questionId}`,
    );
  }

  async triggerBadgeEarned(userId: string, badgeType: string, description: string) {
    await this.createNotification(
      userId,
      NotificationType.BADGE_EARNED,
      `You earned the ${badgeType} badge!`,
      description,
      `/profile`,
    );
  }
}
