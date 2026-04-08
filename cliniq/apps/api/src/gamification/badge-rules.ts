import { BadgeType } from '@cliniq/shared-types';

// Pure functions for badge eligibility checking
export const BADGE_RULES = {
  [BadgeType.FIRST_ANSWER]: async (userId: string, prisma: any) => {
    const count = await prisma.answer.count({ where: { userId } });
    return count >= 1;
  },

  [BadgeType.HELPFUL]: async (userId: string, prisma: any) => {
    const answers = await prisma.answer.findMany({
      where: { userId },
      select: { upvotes: true }
    });
    return answers.some((a: any) => a.upvotes >= 5);
  },

  [BadgeType.ACCEPTED]: async (userId: string, prisma: any) => {
    const count = await prisma.answer.count({
      where: { userId, isAccepted: true }
    });
    return count >= 3;
  },

  [BadgeType.MENTOR_STAR]: async (userId: string, prisma: any) => {
    const profile = await prisma.mentorProfile.findUnique({ where: { userId } });
    return profile ? profile.acceptanceRate >= 0.6 && profile.totalAnswers >= 10 : false;
  },

  [BadgeType.QUICK_DRAWER]: async (userId: string, prisma: any) => {
    // Check if any answer was posted within 5 minutes of question creation
    const quickAnswer = await prisma.answer.findFirst({
      where: {
        userId,
        question: {
          createdAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
          }
        }
      }
    });
    return !!quickAnswer;
  },

  [BadgeType.NIGHT_OWL]: async (userId: string, prisma: any) => {
    // Check answers posted between 10PM - 6AM Ghana time (GMT+0)
    const nightAnswers = await prisma.answer.findMany({
      where: { userId }
    });

    return nightAnswers.some((answer: any) => {
      const hour = answer.createdAt.getUTCHours(); // Ghana time is GMT+0
      return hour >= 22 || hour < 6;
    });
  },

  [BadgeType.EARLY_BIRD]: async (userId: string, prisma: any) => {
    // Check answers posted between 6AM - 9AM Ghana time
    const morningAnswers = await prisma.answer.findMany({
      where: { userId }
    });

    return morningAnswers.some((answer: any) => {
      const hour = answer.createdAt.getUTCHours();
      return hour >= 6 && hour < 9;
    });
  },

  [BadgeType.TREND_SETTER]: async (userId: string, prisma: any) => {
    const questions = await prisma.question.findMany({
      where: { userId },
      select: { upvotes: true }
    });
    return questions.some((q: any) => q.upvotes >= 10);
  },

  [BadgeType.COMMUNITY_LEADER]: async (userId: string, prisma: any) => {
    // Check if user is in top 10 contributors this month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const topContributors = await prisma.user.findMany({
      select: {
        id: true,
        _count: {
          select: {
            answers: {
              where: {
                createdAt: { gte: oneMonthAgo }
              }
            }
          }
        }
      },
      orderBy: {
        answers: {
          _count: 'desc'
        }
      },
      take: 10
    });

    const userRank = topContributors.findIndex((u: any) => u.id === userId);
    return userRank >= 0 && userRank < 10;
  },

  [BadgeType.AMBASSADOR]: async (_userId: string, _prisma: any) => {
    // Manually awarded - return false for automatic checking
    return false;
  }
};

// Helper function to check all badge rules for a user
export async function checkAllBadgeRules(userId: string, prisma: any): Promise<BadgeType[]> {
  const eligibleBadges: BadgeType[] = [];

  for (const [badgeType, checkFn] of Object.entries(BADGE_RULES)) {
    try {
      const isEligible = await checkFn(userId, prisma);
      if (isEligible) {
        eligibleBadges.push(badgeType as BadgeType);
      }
    } catch (error) {
      console.error(`Error checking badge ${badgeType} for user ${userId}:`, error);
    }
  }

  return eligibleBadges;
}

// Helper function to check specific badge categories
export async function checkBadgeCategory(
  userId: string, 
  category: 'ANSWERING' | 'PARTICIPATION' | 'QUALITY' | 'MENTORSHIP' | 'COMMUNITY',
  prisma: any
): Promise<BadgeType[]> {
  const { BADGE_DEFINITIONS } = await import('@cliniq/shared-types');
  
  const categoryBadges = Object.entries(BADGE_DEFINITIONS)
    .filter(([_, definition]) => definition.category === category)
    .map(([type]) => type as BadgeType);

  const eligibleBadges: BadgeType[] = [];

  for (const badgeType of categoryBadges) {
    const checkFn = BADGE_RULES[badgeType];
    if (checkFn) {
      try {
        const isEligible = await checkFn(userId, prisma);
        if (isEligible) {
          eligibleBadges.push(badgeType);
        }
      } catch (error) {
        console.error(`Error checking badge ${badgeType} for user ${userId}:`, error);
      }
    }
  }

  return eligibleBadges;
}
