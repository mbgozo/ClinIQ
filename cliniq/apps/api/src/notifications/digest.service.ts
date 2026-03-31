import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { EmailService } from './email/email.service';

@Injectable()
export class DigestService {
  private readonly logger = new Logger(DigestService.name);
  private prisma = new PrismaClient();

  constructor(private readonly emailService: EmailService) {}

  async sendDailyDigest() {
    this.logger.log('Starting daily digest job...');

    try {
      // Get all users with digest enabled
      const users = await this.prisma.user.findMany({
        where: {
          // TODO: Add notification preferences filter when implemented
          email: { not: null },
        },
        select: {
          id: true,
          name: true,
          email: true,
          program: true,
          institution: true,
        },
      });

      this.logger.log(`Processing digest for ${users.length} users`);

      for (const user of users) {
        try {
          await this.sendUserDigest(user);
        } catch (error) {
          this.logger.error(`Failed to send digest to user ${user.id}:`, error);
        }
      }

      this.logger.log('Daily digest job completed successfully');
    } catch (error) {
      this.logger.error('Daily digest job failed:', error);
      throw error;
    }
  }

  private async sendUserDigest(user: any) {
    // Get unanswered questions from user's categories/program
    const unansweredQuestions = await this.getUnansweredQuestions(user);

    if (unansweredQuestions.length === 0) {
      this.logger.log(`No unanswered questions for user ${user.id} - skipping digest`);
      return;
    }

    await this.emailService.sendDigestEmail(
      user.email,
      unansweredQuestions,
    );

    this.logger.log(`Digest sent to user ${user.id} with ${unansweredQuestions.length} questions`);
  }

  private async getUnansweredQuestions(user: any) {
    // Get questions from the last 24 hours that are unanswered
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const questions = await this.prisma.question.findMany({
      where: {
        answered: false,
        createdAt: { gte: oneDayAgo },
        // TODO: Filter by user's categories/program when implemented
        // For now, get all unanswered questions
      },
      include: {
        category: true,
        user: {
          select: { name: true }
        }
      },
      orderBy: {
        upvotes: 'desc', // Prioritize questions with more upvotes
      },
      take: 10, // Limit to top 10 questions
    });

    return questions.map(q => ({
      title: q.title,
      category: q.category?.name || 'General',
      link: `/questions/${q.id}`,
      upvotes: q.upvotes,
      author: q.anonymous ? 'Anonymous' : q.user?.name || 'Anonymous',
    }));
  }

  async sendWeeklyDigest() {
    this.logger.log('Starting weekly digest job...');

    try {
      const users = await this.prisma.user.findMany({
        where: {
          email: { not: null },
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      for (const user of users) {
        try {
          await this.sendUserWeeklyDigest(user);
        } catch (error) {
          this.logger.error(`Failed to send weekly digest to user ${user.id}:`, error);
        }
      }

      this.logger.log('Weekly digest job completed successfully');
    } catch (error) {
      this.logger.error('Weekly digest job failed:', error);
      throw error;
    }
  }

  private async sendUserWeeklyDigest(user: any) {
    // Get weekly stats and top content
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [newQuestions, topQuestions, userStats] = await Promise.all([
      // New questions in user's area
      this.prisma.question.count({
        where: {
          createdAt: { gte: oneWeekAgo },
          // TODO: Filter by user's interests
        },
      }),
      // Top questions this week
      this.prisma.question.findMany({
        where: {
          createdAt: { gte: oneWeekAgo },
        },
        orderBy: { upvotes: 'desc' },
        take: 5,
        select: {
          title: true,
          upvotes: true,
          category: { select: { name: true } },
        },
      }),
      // User's activity stats
      this.getUserWeeklyStats(user.id, oneWeekAgo),
    ]);

    // TODO: Create weekly digest email template
    this.logger.log(`Weekly digest data prepared for user ${user.id}`);
  }

  private async getUserWeeklyStats(userId: string, since: Date) {
    const [questionsAsked, answersGiven, earnedBadges] = await Promise.all([
      this.prisma.question.count({
        where: {
          userId,
          createdAt: { gte: since },
        },
      }),
      this.prisma.answer.count({
        where: {
          userId,
          createdAt: { gte: since },
        },
      }),
      this.prisma.userBadge.count({
        where: {
          userId,
          awardedAt: { gte: since },
        },
      }),
    ]);

    return {
      questionsAsked,
      answersGiven,
      earnedBadges,
    };
  }
}
