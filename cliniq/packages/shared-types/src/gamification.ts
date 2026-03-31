import { z } from "zod";

export enum BadgeType {
  FIRST_ANSWER = "FIRST_ANSWER",
  HELPFUL = "HELPFUL",
  ACCEPTED = "ACCEPTED",
  MENTOR_STAR = "MENTOR_STAR",
  AMBASSADOR = "AMBASSADOR",
  QUICK_DRAWER = "QUICK_DRAWER",
  NIGHT_OWL = "NIGHT_OWL",
  EARLY_BIRD = "EARLY_BIRD",
  TREND_SETTER = "TREND_SETTER",
  COMMUNITY_LEADER = "COMMUNITY_LEADER",
}

export const BadgeSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(BadgeType),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  color: z.string(),
  awardedAt: z.string(),
});

export type Badge = z.infer<typeof BadgeSchema>;

export const UserBadgeSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.nativeEnum(BadgeType),
  awardedAt: z.string(),
});

export type UserBadge = z.infer<typeof UserBadgeSchema>;

export const UserReputationSchema = z.object({
  userId: z.string(),
  totalReputation: z.number(),
  answerReputation: z.number(),
  questionReputation: z.number(),
  badgeCount: z.number(),
  rank: z.string().optional(),
  level: z.number(),
  nextLevelReputation: z.number(),
});

export type UserReputation = z.infer<typeof UserReputationSchema>;

export const BadgeRuleSchema = z.object({
  type: z.nativeEnum(BadgeType),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  color: z.string(),
  requirements: z.string(),
  category: z.enum(["ANSWERING", "PARTICIPATION", "QUALITY", "MENTORSHIP", "COMMUNITY"]),
  tier: z.enum(["BRONZE", "SILVER", "GOLD", "PLATINUM"]),
});

export type BadgeRule = z.infer<typeof BadgeRuleSchema>;

// Badge definitions with metadata
export const BADGE_DEFINITIONS: Record<BadgeType, BadgeRule> = {
  [BadgeType.FIRST_ANSWER]: {
    type: BadgeType.FIRST_ANSWER,
    name: "First Answer",
    description: "Posted your first answer to help a fellow student",
    icon: "zap",
    color: "#10B981",
    requirements: "Post your first answer",
    category: "ANSWERING",
    tier: "BRONZE",
  },
  [BadgeType.HELPFUL]: {
    type: BadgeType.HELPFUL,
    name: "Helpful",
    description: "Your answers received 5+ upvotes from the community",
    icon: "thumbs-up",
    color: "#3B82F6",
    requirements: "Get 5+ upvotes on your answers",
    category: "QUALITY",
    tier: "BRONZE",
  },
  [BadgeType.ACCEPTED]: {
    type: BadgeType.ACCEPTED,
    name: "Problem Solver",
    description: "3+ of your answers were marked as accepted",
    icon: "check-circle",
    color: "#059669",
    requirements: "Have 3+ answers accepted",
    category: "QUALITY",
    tier: "SILVER",
  },
  [BadgeType.MENTOR_STAR]: {
    type: BadgeType.MENTOR_STAR,
    name: "Mentor Star",
    description: "Verified mentor with 60%+ acceptance rate and 10+ answers",
    icon: "star",
    color: "#F59E0B",
    requirements: "Be a verified mentor with 60%+ acceptance rate and 10+ answers",
    category: "MENTORSHIP",
    tier: "GOLD",
  },
  [BadgeType.AMBASSADOR]: {
    type: BadgeType.AMBASSADOR,
    name: "ClinIQ Ambassador",
    description: "Top contributor recognized by the community",
    icon: "trophy",
    color: "#8B5CF6",
    requirements: "Recognized for outstanding community contributions",
    category: "COMMUNITY",
    tier: "PLATINUM",
  },
  [BadgeType.QUICK_DRAWER]: {
    type: BadgeType.QUICK_DRAWER,
    name: "Quick Drawer",
    description: "Answered a question within 5 minutes of it being posted",
    icon: "bolt",
    color: "#EF4444",
    requirements: "Answer a question within 5 minutes",
    category: "PARTICIPATION",
    tier: "BRONZE",
  },
  [BadgeType.NIGHT_OWL]: {
    type: BadgeType.NIGHT_OWL,
    name: "Night Owl",
    description: "Active helper between 10PM - 6AM Ghana time",
    icon: "moon",
    color: "#6366F1",
    requirements: "Post answers between 10PM - 6AM",
    category: "PARTICIPATION",
    tier: "SILVER",
  },
  [BadgeType.EARLY_BIRD]: {
    type: BadgeType.EARLY_BIRD,
    name: "Early Bird",
    description: "Active helper between 6AM - 9AM Ghana time",
    icon: "sun",
    color: "#84CC16",
    requirements: "Post answers between 6AM - 9AM",
    category: "PARTICIPATION",
    tier: "SILVER",
  },
  [BadgeType.TREND_SETTER]: {
    type: BadgeType.TREND_SETTER,
    name: "Trend Setter",
    description: "Your question received 10+ upvotes",
    icon: "trending-up",
    color: "#06B6D4",
    requirements: "Get 10+ upvotes on your questions",
    category: "QUALITY",
    tier: "SILVER",
  },
  [BadgeType.COMMUNITY_LEADER]: {
    type: BadgeType.COMMUNITY_LEADER,
    name: "Community Leader",
    description: "Top 10 contributor this month",
    icon: "crown",
    color: "#DC2626",
    requirements: "Be in top 10 contributors for the month",
    category: "COMMUNITY",
    tier: "GOLD",
  },
};

// Reputation calculation constants
export const REPUTATION_VALUES = {
  ANSWER_POSTED: 10,
  ANSWER_ACCEPTED: 50,
  ANSWER_UPVOTE: 5,
  QUESTION_UPVOTE: 2,
  BADGE_EARNED: {
    BRONZE: 25,
    SILVER: 50,
    GOLD: 100,
    PLATINUM: 200,
  },
} as const;

// Level thresholds
export const LEVEL_THRESHOLDS = [
  { level: 1, reputation: 0, title: "Novice" },
  { level: 2, reputation: 100, title: "Helper" },
  { level: 3, reputation: 250, title: "Contributor" },
  { level: 4, reputation: 500, title: "Expert" },
  { level: 5, reputation: 1000, title: "Master" },
  { level: 6, reputation: 2500, title: "Scholar" },
  { level: 7, reputation: 5000, title: "Mentor" },
  { level: 8, reputation: 10000, title: "Leader" },
  { level: 9, reputation: 25000, title: "Authority" },
  { level: 10, reputation: 50000, title: "Legend" },
];

export function getUserLevel(reputation: number) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (reputation >= LEVEL_THRESHOLDS[i].reputation) {
      return LEVEL_THRESHOLDS[i];
    }
  }
  return LEVEL_THRESHOLDS[0];
}

export function getNextLevelReputation(currentReputation: number) {
  const currentLevel = getUserLevel(currentReputation);
  const currentIndex = LEVEL_THRESHOLDS.findIndex(l => l.level === currentLevel.level);
  
  if (currentIndex < LEVEL_THRESHOLDS.length - 1) {
    return LEVEL_THRESHOLDS[currentIndex + 1].reputation;
  }
  
  return currentReputation; // Already at max level
}
