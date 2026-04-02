import { z } from "zod";
export declare enum NotificationType {
    ANSWER_POSTED = "ANSWER_POSTED",
    ANSWER_ACCEPTED = "ANSWER_ACCEPTED",
    QUESTION_UPVOTED = "QUESTION_UPVOTED",
    MENTION = "MENTION",
    MENTOR_REPLY = "MENTOR_REPLY",
    MENTOR_REQUEST = "MENTOR_REQUEST",
    BADGE_EARNED = "BADGE_EARNED",
    FLAG_RESOLVED = "FLAG_RESOLVED"
}
export declare const NotificationSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    type: z.ZodNativeEnum<typeof NotificationType>;
    title: z.ZodString;
    body: z.ZodString;
    read: z.ZodDefault<z.ZodBoolean>;
    link: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: NotificationType;
    id: string;
    title: string;
    userId: string;
    body: string;
    read: boolean;
    createdAt: string;
    link?: string | undefined;
}, {
    type: NotificationType;
    id: string;
    title: string;
    userId: string;
    body: string;
    createdAt: string;
    link?: string | undefined;
    read?: boolean | undefined;
}>;
export type Notification = z.infer<typeof NotificationSchema>;
export declare const CreateNotificationSchema: z.ZodObject<{
    userId: z.ZodString;
    type: z.ZodNativeEnum<typeof NotificationType>;
    title: z.ZodString;
    body: z.ZodString;
    link: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: NotificationType;
    title: string;
    userId: string;
    body: string;
    link?: string | undefined;
}, {
    type: NotificationType;
    title: string;
    userId: string;
    body: string;
    link?: string | undefined;
}>;
export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;
export declare const NotificationFilterSchema: z.ZodObject<{
    read: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof NotificationType>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    type?: NotificationType | undefined;
    read?: boolean | undefined;
}, {
    type?: NotificationType | undefined;
    page?: number | undefined;
    read?: boolean | undefined;
    limit?: number | undefined;
}>;
export type NotificationFilter = z.infer<typeof NotificationFilterSchema>;
export declare const NotificationPreferencesSchema: z.ZodObject<{
    emailNotifications: z.ZodDefault<z.ZodBoolean>;
    digestEnabled: z.ZodDefault<z.ZodBoolean>;
    answerPosted: z.ZodDefault<z.ZodBoolean>;
    answerAccepted: z.ZodDefault<z.ZodBoolean>;
    questionUpvoted: z.ZodDefault<z.ZodBoolean>;
    mention: z.ZodDefault<z.ZodBoolean>;
    mentorReply: z.ZodDefault<z.ZodBoolean>;
    mentorRequest: z.ZodDefault<z.ZodBoolean>;
    badgeEarned: z.ZodDefault<z.ZodBoolean>;
    flagResolved: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    emailNotifications: boolean;
    digestEnabled: boolean;
    answerPosted: boolean;
    answerAccepted: boolean;
    questionUpvoted: boolean;
    mention: boolean;
    mentorReply: boolean;
    mentorRequest: boolean;
    badgeEarned: boolean;
    flagResolved: boolean;
}, {
    emailNotifications?: boolean | undefined;
    digestEnabled?: boolean | undefined;
    answerPosted?: boolean | undefined;
    answerAccepted?: boolean | undefined;
    questionUpvoted?: boolean | undefined;
    mention?: boolean | undefined;
    mentorReply?: boolean | undefined;
    mentorRequest?: boolean | undefined;
    badgeEarned?: boolean | undefined;
    flagResolved?: boolean | undefined;
}>;
export type NotificationPreferences = z.infer<typeof NotificationPreferencesSchema>;
//# sourceMappingURL=notifications.d.ts.map