import { z } from "zod";
export var NotificationType;
(function (NotificationType) {
    NotificationType["ANSWER_POSTED"] = "ANSWER_POSTED";
    NotificationType["ANSWER_ACCEPTED"] = "ANSWER_ACCEPTED";
    NotificationType["QUESTION_UPVOTED"] = "QUESTION_UPVOTED";
    NotificationType["MENTION"] = "MENTION";
    NotificationType["MENTOR_REPLY"] = "MENTOR_REPLY";
    NotificationType["MENTOR_REQUEST"] = "MENTOR_REQUEST";
    NotificationType["BADGE_EARNED"] = "BADGE_EARNED";
    NotificationType["FLAG_RESOLVED"] = "FLAG_RESOLVED";
})(NotificationType || (NotificationType = {}));
export const NotificationSchema = z.object({
    id: z.string(),
    userId: z.string(),
    type: z.nativeEnum(NotificationType),
    title: z.string(),
    body: z.string(),
    read: z.boolean().default(false),
    link: z.string().optional(),
    createdAt: z.string(),
});
export const CreateNotificationSchema = z.object({
    userId: z.string(),
    type: z.nativeEnum(NotificationType),
    title: z.string(),
    body: z.string(),
    link: z.string().optional(),
});
export const NotificationFilterSchema = z.object({
    read: z.boolean().optional(),
    type: z.nativeEnum(NotificationType).optional(),
    page: z.number().default(1),
    limit: z.number().max(50).default(20),
});
export const NotificationPreferencesSchema = z.object({
    emailNotifications: z.boolean().default(true),
    digestEnabled: z.boolean().default(true),
    answerPosted: z.boolean().default(true),
    answerAccepted: z.boolean().default(true),
    questionUpvoted: z.boolean().default(true),
    mention: z.boolean().default(true),
    mentorReply: z.boolean().default(true),
    mentorRequest: z.boolean().default(true),
    badgeEarned: z.boolean().default(true),
    flagResolved: z.boolean().default(false),
});
