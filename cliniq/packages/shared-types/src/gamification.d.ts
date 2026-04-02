import { z } from "zod";
export declare enum BadgeType {
    FIRST_ANSWER = "FIRST_ANSWER",
    HELPFUL = "HELPFUL",
    ACCEPTED = "ACCEPTED",
    MENTOR_STAR = "MENTOR_STAR",
    AMBASSADOR = "AMBASSADOR",
    QUICK_DRAWER = "QUICK_DRAWER",
    NIGHT_OWL = "NIGHT_OWL",
    EARLY_BIRD = "EARLY_BIRD",
    TREND_SETTER = "TREND_SETTER",
    COMMUNITY_LEADER = "COMMUNITY_LEADER"
}
export declare const BadgeSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodNativeEnum<typeof BadgeType>;
    name: z.ZodString;
    description: z.ZodString;
    icon: z.ZodString;
    color: z.ZodString;
    awardedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: BadgeType;
    id: string;
    color: string;
    description: string;
    icon: string;
    awardedAt: string;
}, {
    name: string;
    type: BadgeType;
    id: string;
    color: string;
    description: string;
    icon: string;
    awardedAt: string;
}>;
export type Badge = z.infer<typeof BadgeSchema>;
export declare const UserBadgeSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    type: z.ZodNativeEnum<typeof BadgeType>;
    awardedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: BadgeType;
    id: string;
    userId: string;
    awardedAt: string;
}, {
    type: BadgeType;
    id: string;
    userId: string;
    awardedAt: string;
}>;
export type UserBadge = z.infer<typeof UserBadgeSchema>;
export declare const UserReputationSchema: z.ZodObject<{
    userId: z.ZodString;
    totalReputation: z.ZodNumber;
    answerReputation: z.ZodNumber;
    questionReputation: z.ZodNumber;
    badgeCount: z.ZodNumber;
    rank: z.ZodOptional<z.ZodString>;
    level: z.ZodNumber;
    nextLevelReputation: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    userId: string;
    totalReputation: number;
    answerReputation: number;
    questionReputation: number;
    badgeCount: number;
    level: number;
    nextLevelReputation: number;
    rank?: string | undefined;
}, {
    userId: string;
    totalReputation: number;
    answerReputation: number;
    questionReputation: number;
    badgeCount: number;
    level: number;
    nextLevelReputation: number;
    rank?: string | undefined;
}>;
export type UserReputation = z.infer<typeof UserReputationSchema>;
export declare const BadgeRuleSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof BadgeType>;
    name: z.ZodString;
    description: z.ZodString;
    icon: z.ZodString;
    color: z.ZodString;
    requirements: z.ZodString;
    category: z.ZodEnum<["ANSWERING", "PARTICIPATION", "QUALITY", "MENTORSHIP", "COMMUNITY"]>;
    tier: z.ZodEnum<["BRONZE", "SILVER", "GOLD", "PLATINUM"]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: BadgeType;
    color: string;
    category: "ANSWERING" | "PARTICIPATION" | "QUALITY" | "MENTORSHIP" | "COMMUNITY";
    description: string;
    icon: string;
    requirements: string;
    tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
}, {
    name: string;
    type: BadgeType;
    color: string;
    category: "ANSWERING" | "PARTICIPATION" | "QUALITY" | "MENTORSHIP" | "COMMUNITY";
    description: string;
    icon: string;
    requirements: string;
    tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
}>;
export type BadgeRule = z.infer<typeof BadgeRuleSchema>;
export declare const BADGE_DEFINITIONS: Record<BadgeType, BadgeRule>;
export declare const REPUTATION_VALUES: {
    readonly ANSWER_POSTED: 10;
    readonly ANSWER_ACCEPTED: 50;
    readonly ANSWER_UPVOTE: 5;
    readonly QUESTION_UPVOTE: 2;
    readonly BADGE_EARNED: {
        readonly BRONZE: 25;
        readonly SILVER: 50;
        readonly GOLD: 100;
        readonly PLATINUM: 200;
    };
};
export declare const LEVEL_THRESHOLDS: {
    level: number;
    reputation: number;
    title: string;
}[];
export declare function getUserLevel(reputation: number): {
    level: number;
    reputation: number;
    title: string;
};
export declare function getNextLevelReputation(currentReputation: number): number;
//# sourceMappingURL=gamification.d.ts.map