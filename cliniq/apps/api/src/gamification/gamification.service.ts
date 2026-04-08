import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import {
  BadgeType,
  UserReputation,
  BADGE_DEFINITIONS,
  REPUTATION_VALUES,
  getUserLevel,
  getNextLevelReputation,
} from "@cliniq/shared-types";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);
  private prisma = new PrismaClient();

  constructor(
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  async getUserProfile(userId: string): Promise<UserReputation> {
    // Get user's badges count
    const badgeCount = await this.prisma.userBadge.count({
      where: { userId },
    });

    // Calculate reputation from various sources
    const [answerReputation, questionReputation, badgeReputation] = await Promise.all([
      this.calculateAnswerReputation(userId),
      this.calculateQuestionReputation(userId),
      this.calculateBadgeReputation(userId),
    ]);

    const totalReputation = answerReputation + questionReputation + badgeReputation;
    const level = getUserLevel(totalReputation);
    const nextLevelReputation = getNextLevelReputation(totalReputation);

    return {
      userId,
      totalReputation,
      answerReputation,
      questionReputation,
      badgeCount,
      rank: level.title,
      level: level.level,
      nextLevelReputation,
    };
  }

  async getUserBadges(userId: string) {
    const userBadges = await this.prisma.userBadge.findMany({
      where: { userId },
      include: {
        // TODO: Include badge details when we have a Badge table
      },
      orderBy: { awardedAt: "desc" },
    });

    return userBadges.map((badge) => {
      const definition = BADGE_DEFINITIONS[badge.type as BadgeType];
      return {
        ...badge,
        ...definition,
        awardedAt: badge.awardedAt.toISOString(),
      };
    });
  }

  async getLeaderboard(limit = 50) {
    // Get top users by reputation
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        institution: true,
        program: true,
      },
      take: limit,
    });

    // Calculate reputation for each user
    const leaderboard = await Promise.all(
      users.map(async (user) => {
        const profile = await this.getUserProfile(user.id);
        return {
          ...user,
          ...profile,
        };
      }),
    );

    // Sort by total reputation
    return leaderboard.sort((a, b) => b.totalReputation - a.totalReputation);
  }

  async getBadgeDefinitions() {
    return Object.values(BADGE_DEFINITIONS);
  }

  async checkAndAwardBadges(userId: string) {
    const alreadyHasBadges = await this.prisma.userBadge.findMany({
      where: { userId },
      select: { type: true },
    });

    const earnedBadgeTypes = new Set(alreadyHasBadges.map((b) => b.type));

    for (const [badgeType] of Object.entries(BADGE_DEFINITIONS)) {
      if (!earnedBadgeTypes.has(badgeType as any)) {
        const isEligible = await this.checkBadgeEligibility(userId, badgeType as BadgeType);

        if (isEligible) {
          await this.awardBadge(userId, badgeType as BadgeType);
        }
      }
    }
  }

  private async checkBadgeEligibility(userId: string, badgeType: BadgeType): Promise<boolean> {
    switch (badgeType) {
      case BadgeType.FIRST_ANSWER:
        return this.checkFirstAnswer(userId);
      case BadgeType.HELPFUL:
        return this.checkHelpful(userId);
      case BadgeType.ACCEPTED:
        return this.checkAccepted(userId);
      case BadgeType.MENTOR_STAR:
        return this.checkMentorStar(userId);
      case BadgeType.QUICK_DRAWER:
        return this.checkQuickDrawer(userId);
      case BadgeType.NIGHT_OWL:
        return this.checkNightOwl(userId);
      case BadgeType.EARLY_BIRD:
        return this.checkEarlyBird(userId);
      case BadgeType.TREND_SETTER:
        return this.checkTrendSetter(userId);
      case BadgeType.COMMUNITY_LEADER:
        return this.checkCommunityLeader(userId);
      case BadgeType.AMBASSADOR:
        return false; // Manually awarded
      default:
        return false;
    }
  }

  private async awardBadge(userId: string, badgeType: BadgeType) {
    const definition = BADGE_DEFINITIONS[badgeType];

    const userBadge = await this.prisma.userBadge.create({
      data: {
        userId,
        type: badgeType as any,
        awardedAt: new Date(),
      },
    });

    // Send notification
    await this.notificationsService.triggerBadgeEarned(
      userId,
      definition.name,
      definition.description,
    );

    // Add reputation for earning badge
    await this.addReputation(userId, REPUTATION_VALUES.BADGE_EARNED[definition.tier]);

    this.logger.log(`Awarded badge ${badgeType} to user ${userId}`);

    return userBadge;
  }

  // Badge eligibility check methods
  private async checkFirstAnswer(userId: string): Promise<boolean> {
    const answerCount = await this.prisma.answer.count({ where: { userId } });
    return answerCount >= 1;
  }

  private async checkHelpful(userId: string): Promise<boolean> {
    const answers = await this.prisma.answer.findMany({
      where: { userId },
      select: { upvotes: true },
    });
    return answers.some((a) => a.upvotes >= 5);
  }

  private async checkAccepted(userId: string): Promise<boolean> {
    const count = await this.prisma.answer.count({
      where: { userId, isAccepted: true },
    });
    return count >= 3;
  }

  private async checkMentorStar(userId: string): Promise<boolean> {
    const profile = await this.prisma.mentorProfile.findUnique({ where: { userId } });
    if (!profile || !profile.verifiedAt) return false;

    return profile.acceptanceRate >= 0.6 && profile.totalAnswers >= 10;
  }

  private async checkQuickDrawer(userId: string): Promise<boolean> {
    // Check if any answer was posted within 5 minutes of question creation
    const quickAnswer = await this.prisma.answer.findFirst({
      where: {
        userId,
        question: {
          createdAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
          },
        },
      },
    });
    return !!quickAnswer;
  }

  private async checkNightOwl(userId: string): Promise<boolean> {
    // Check answers posted between 10PM - 6AM Ghana time (GMT+0)
    const nightAnswers = await this.prisma.answer.findMany({
      where: { userId },
    });

    return nightAnswers.some((answer) => {
      const hour = answer.createdAt.getUTCHours(); // Ghana time is GMT+0
      return hour >= 22 || hour < 6;
    });
  }

  private async checkEarlyBird(userId: string): Promise<boolean> {
    // Check answers posted between 6AM - 9AM Ghana time
    const morningAnswers = await this.prisma.answer.findMany({
      where: { userId },
    });

    return morningAnswers.some((answer) => {
      const hour = answer.createdAt.getUTCHours();
      return hour >= 6 && hour < 9;
    });
  }

  private async checkTrendSetter(userId: string): Promise<boolean> {
    const questions = await this.prisma.question.findMany({
      where: { userId },
      select: { upvotes: true },
    });
    return questions.some((q) => q.upvotes >= 10);
  }

  private async checkCommunityLeader(userId: string): Promise<boolean> {
    // Check if user is in top 10 contributors this month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const topContributors = await this.getLeaderboard(10);
    const userRank = topContributors.findIndex((u) => u.id === userId);
    return userRank >= 0 && userRank < 10;
  }

  // Reputation calculation methods
  private async calculateAnswerReputation(userId: string): Promise<number> {
    const [answerCount, acceptedCount, upvotes] = await Promise.all([
      this.prisma.answer.count({ where: { userId } }),
      this.prisma.answer.count({ where: { userId, isAccepted: true } }),
      this.prisma.vote.count({
        where: {
          answer: { userId },
          value: 1,
        },
      }),
    ]);

    return (
      answerCount * REPUTATION_VALUES.ANSWER_POSTED +
      acceptedCount * REPUTATION_VALUES.ANSWER_ACCEPTED +
      upvotes * REPUTATION_VALUES.ANSWER_UPVOTE
    );
  }

  private async calculateQuestionReputation(userId: string): Promise<number> {
    const upvotes = await this.prisma.question.count({
      where: {
        userId,
        upvotes: { gte: 1 },
      },
    });

    // This is simplified - should count actual upvote count
    return upvotes * REPUTATION_VALUES.QUESTION_UPVOTE;
  }

  private async calculateBadgeReputation(userId: string): Promise<number> {
    const userBadges = await this.prisma.userBadge.findMany({
      where: { userId },
    });

    return userBadges.reduce((total, badge) => {
      const definition = BADGE_DEFINITIONS[badge.type as BadgeType];
      return total + REPUTATION_VALUES.BADGE_EARNED[definition.tier];
    }, 0);
  }

  async addReputation(userId: string, amount: number, reason?: string) {
    // This would update a user_reputation table in a real implementation
    this.logger.log(
      `Added ${amount} reputation to user ${userId}${reason ? ` for ${reason}` : ""}`,
    );
  }
}
