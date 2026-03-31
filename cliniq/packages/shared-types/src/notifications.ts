import { z } from "zod";

export enum NotificationType {
  ANSWER_POSTED = "ANSWER_POSTED",
  ANSWER_ACCEPTED = "ANSWER_ACCEPTED",
  QUESTION_UPVOTED = "QUESTION_UPVOTED",
  MENTION = "MENTION",
  MENTOR_REPLY = "MENTOR_REPLY",
  MENTOR_REQUEST = "MENTOR_REQUEST",
  BADGE_EARNED = "BADGE_EARNED",
  FLAG_RESOLVED = "FLAG_RESOLVED",
}

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

export type Notification = z.infer<typeof NotificationSchema>;

export const CreateNotificationSchema = z.object({
  userId: z.string(),
  type: z.nativeEnum(NotificationType),
  title: z.string(),
  body: z.string(),
  link: z.string().optional(),
});

export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;

export const NotificationFilterSchema = z.object({
  read: z.boolean().optional(),
  type: z.nativeEnum(NotificationType).optional(),
  page: z.number().default(1),
  limit: z.number().max(50).default(20),
});

export type NotificationFilter = z.infer<typeof NotificationFilterSchema>;

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

export type NotificationPreferences = z.infer<typeof NotificationPreferencesSchema>;
