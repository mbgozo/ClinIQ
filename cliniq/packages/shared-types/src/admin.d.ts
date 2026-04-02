import { z } from "zod";
export declare enum AdminRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    ANALYST = "ANALYST"
}
export declare enum Permission {
    VIEW_USERS = "VIEW_USERS",
    MANAGE_USERS = "MANAGE_USERS",
    DELETE_USERS = "DELETE_USERS",
    BAN_USERS = "BAN_USERS",
    VIEW_CONTENT = "VIEW_CONTENT",
    MANAGE_CONTENT = "MANAGE_CONTENT",
    DELETE_CONTENT = "DELETE_CONTENT",
    APPROVE_CONTENT = "APPROVE_CONTENT",
    VIEW_FLAGS = "VIEW_FLAGS",
    MANAGE_FLAGS = "MANAGE_FLAGS",
    BAN_CONTENT = "BAN_CONTENT",
    VIEW_ANALYTICS = "VIEW_ANALYTICS",
    EXPORT_DATA = "EXPORT_DATA",
    VIEW_SETTINGS = "VIEW_SETTINGS",
    MANAGE_SETTINGS = "MANAGE_SETTINGS",
    MANAGE_STUDY_GROUPS = "MANAGE_STUDY_GROUPS",
    MANAGE_RESOURCES = "MANAGE_RESOURCES",
    MANAGE_CHAT = "MANAGE_CHAT",
    VIEW_CHAT_LOGS = "VIEW_CHAT_LOGS"
}
export declare enum ModerationAction {
    APPROVE = "APPROVE",
    REJECT = "REJECT",
    DELETE = "DELETE",
    BAN = "BAN",
    WARNING = "WARNING",
    SILENCE = "SILENCE"
}
export declare enum ContentType {
    QUESTION = "QUESTION",
    ANSWER = "ANSWER",
    RESOURCE = "RESOURCE",
    STUDY_GROUP = "STUDY_GROUP",
    GROUP_POST = "GROUP_POST",
    CHAT_MESSAGE = "CHAT_MESSAGE",
    USER_PROFILE = "USER_PROFILE"
}
export declare enum ReportReason {
    INAPPROPRIATE_CONTENT = "INAPPROPRIATE_CONTENT",
    SPAM = "SPAM",
    HARASSMENT = "HARASSMENT",
    MISINFORMATION = "MISINFORMATION",
    COPYRIGHT = "COPYRIGHT",
    OFF_TOPIC = "OFF_TOPIC",
    DUPLICATE = "DUPLICATE",
    OTHER = "OTHER"
}
export declare enum SystemAlertType {
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR",
    SUCCESS = "SUCCESS",
    MAINTENANCE = "MAINTENANCE"
}
export declare const AdminUserSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    role: z.ZodNativeEnum<typeof AdminRole>;
    permissions: z.ZodArray<z.ZodNativeEnum<typeof Permission>, "many">;
    isActive: z.ZodBoolean;
    lastLoginAt: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    user: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        avatarUrl: z.ZodOptional<z.ZodString>;
        institution: z.ZodString;
        program: z.ZodString;
        year: z.ZodNumber;
        reputation: z.ZodNumber;
        isVerified: z.ZodBoolean;
        isBanned: z.ZodBoolean;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        email: string;
        createdAt: string;
        institution: string;
        year: number;
        program: string;
        reputation: number;
        isVerified: boolean;
        isBanned: boolean;
        avatarUrl?: string | undefined;
    }, {
        name: string;
        id: string;
        email: string;
        createdAt: string;
        institution: string;
        year: number;
        program: string;
        reputation: number;
        isVerified: boolean;
        isBanned: boolean;
        avatarUrl?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    role: AdminRole;
    user: {
        name: string;
        id: string;
        email: string;
        createdAt: string;
        institution: string;
        year: number;
        program: string;
        reputation: number;
        isVerified: boolean;
        isBanned: boolean;
        avatarUrl?: string | undefined;
    };
    userId: string;
    createdAt: string;
    updatedAt: string;
    permissions: Permission[];
    isActive: boolean;
    lastLoginAt?: string | undefined;
}, {
    id: string;
    role: AdminRole;
    user: {
        name: string;
        id: string;
        email: string;
        createdAt: string;
        institution: string;
        year: number;
        program: string;
        reputation: number;
        isVerified: boolean;
        isBanned: boolean;
        avatarUrl?: string | undefined;
    };
    userId: string;
    createdAt: string;
    updatedAt: string;
    permissions: Permission[];
    isActive: boolean;
    lastLoginAt?: string | undefined;
}>;
export type AdminUser = z.infer<typeof AdminUserSchema>;
export declare const ModerationQueueSchema: z.ZodObject<{
    id: z.ZodString;
    contentType: z.ZodNativeEnum<typeof ContentType>;
    contentId: z.ZodString;
    reason: z.ZodNativeEnum<typeof ReportReason>;
    description: z.ZodString;
    reporterId: z.ZodString;
    moderatorId: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["PENDING", "IN_REVIEW", "RESOLVED", "DISMISSED"]>;
    action: z.ZodOptional<z.ZodNativeEnum<typeof ModerationAction>>;
    actionReason: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    resolvedAt: z.ZodOptional<z.ZodString>;
    content: z.ZodAny;
    reporter: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        avatarUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        avatarUrl?: string | undefined;
    }, {
        name: string;
        id: string;
        avatarUrl?: string | undefined;
    }>;
    moderator: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        avatarUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        avatarUrl?: string | undefined;
    }, {
        name: string;
        id: string;
        avatarUrl?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "PENDING" | "RESOLVED" | "DISMISSED" | "IN_REVIEW";
    createdAt: string;
    description: string;
    updatedAt: string;
    reporterId: string;
    reason: ReportReason;
    contentType: ContentType;
    contentId: string;
    reporter: {
        name: string;
        id: string;
        avatarUrl?: string | undefined;
    };
    content?: any;
    resolvedAt?: string | undefined;
    moderatorId?: string | undefined;
    action?: ModerationAction | undefined;
    actionReason?: string | undefined;
    moderator?: {
        name: string;
        id: string;
        avatarUrl?: string | undefined;
    } | undefined;
}, {
    id: string;
    status: "PENDING" | "RESOLVED" | "DISMISSED" | "IN_REVIEW";
    createdAt: string;
    description: string;
    updatedAt: string;
    reporterId: string;
    reason: ReportReason;
    contentType: ContentType;
    contentId: string;
    reporter: {
        name: string;
        id: string;
        avatarUrl?: string | undefined;
    };
    content?: any;
    resolvedAt?: string | undefined;
    moderatorId?: string | undefined;
    action?: ModerationAction | undefined;
    actionReason?: string | undefined;
    moderator?: {
        name: string;
        id: string;
        avatarUrl?: string | undefined;
    } | undefined;
}>;
export type ModerationQueue = z.infer<typeof ModerationQueueSchema>;
export declare const SystemAlertSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodNativeEnum<typeof SystemAlertType>;
    title: z.ZodString;
    message: z.ZodString;
    isActive: z.ZodBoolean;
    targetAudience: z.ZodArray<z.ZodEnum<["ALL", "ADMINS", "USERS", "VERIFIED"]>, "many">;
    startsAt: z.ZodString;
    endsAt: z.ZodOptional<z.ZodString>;
    createdBy: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    dismissCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: SystemAlertType;
    id: string;
    title: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    targetAudience: ("VERIFIED" | "ALL" | "ADMINS" | "USERS")[];
    startsAt: string;
    createdBy: string;
    dismissCount: number;
    endsAt?: string | undefined;
}, {
    type: SystemAlertType;
    id: string;
    title: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    targetAudience: ("VERIFIED" | "ALL" | "ADMINS" | "USERS")[];
    startsAt: string;
    createdBy: string;
    dismissCount: number;
    endsAt?: string | undefined;
}>;
export type SystemAlert = z.infer<typeof SystemAlertSchema>;
export declare const AdminLogSchema: z.ZodObject<{
    id: z.ZodString;
    adminId: z.ZodString;
    action: z.ZodString;
    entityType: z.ZodString;
    entityId: z.ZodString;
    details: z.ZodRecord<z.ZodString, z.ZodAny>;
    ipAddress: z.ZodOptional<z.ZodString>;
    userAgent: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    admin: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        email: string;
    }, {
        name: string;
        id: string;
        email: string;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    entityType: string;
    entityId: string;
    action: string;
    adminId: string;
    details: Record<string, any>;
    admin: {
        name: string;
        id: string;
        email: string;
    };
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
}, {
    id: string;
    createdAt: string;
    entityType: string;
    entityId: string;
    action: string;
    adminId: string;
    details: Record<string, any>;
    admin: {
        name: string;
        id: string;
        email: string;
    };
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
}>;
export type AdminLog = z.infer<typeof AdminLogSchema>;
export declare const SystemStatsSchema: z.ZodObject<{
    users: z.ZodObject<{
        total: z.ZodNumber;
        active: z.ZodNumber;
        new: z.ZodNumber;
        banned: z.ZodNumber;
        verified: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        total: number;
        active: number;
        new: number;
        banned: number;
        verified: number;
    }, {
        total: number;
        active: number;
        new: number;
        banned: number;
        verified: number;
    }>;
    content: z.ZodObject<{
        questions: z.ZodNumber;
        answers: z.ZodNumber;
        resources: z.ZodNumber;
        studyGroups: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        questions: number;
        answers: number;
        resources: number;
        studyGroups: number;
    }, {
        questions: number;
        answers: number;
        resources: number;
        studyGroups: number;
    }>;
    engagement: z.ZodObject<{
        totalInteractions: z.ZodNumber;
        dailyActive: z.ZodNumber;
        weeklyActive: z.ZodNumber;
        monthlyActive: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        totalInteractions: number;
        dailyActive: number;
        weeklyActive: number;
        monthlyActive: number;
    }, {
        totalInteractions: number;
        dailyActive: number;
        weeklyActive: number;
        monthlyActive: number;
    }>;
    moderation: z.ZodObject<{
        pendingFlags: z.ZodNumber;
        resolvedToday: z.ZodNumber;
        averageResolutionTime: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        pendingFlags: number;
        resolvedToday: number;
        averageResolutionTime: number;
    }, {
        pendingFlags: number;
        resolvedToday: number;
        averageResolutionTime: number;
    }>;
    system: z.ZodObject<{
        uptime: z.ZodNumber;
        errorRate: z.ZodNumber;
        responseTime: z.ZodNumber;
        storageUsed: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        uptime: number;
        errorRate: number;
        responseTime: number;
        storageUsed: number;
    }, {
        uptime: number;
        errorRate: number;
        responseTime: number;
        storageUsed: number;
    }>;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: {
        questions: number;
        answers: number;
        resources: number;
        studyGroups: number;
    };
    updatedAt: string;
    users: {
        total: number;
        active: number;
        new: number;
        banned: number;
        verified: number;
    };
    engagement: {
        totalInteractions: number;
        dailyActive: number;
        weeklyActive: number;
        monthlyActive: number;
    };
    moderation: {
        pendingFlags: number;
        resolvedToday: number;
        averageResolutionTime: number;
    };
    system: {
        uptime: number;
        errorRate: number;
        responseTime: number;
        storageUsed: number;
    };
}, {
    content: {
        questions: number;
        answers: number;
        resources: number;
        studyGroups: number;
    };
    updatedAt: string;
    users: {
        total: number;
        active: number;
        new: number;
        banned: number;
        verified: number;
    };
    engagement: {
        totalInteractions: number;
        dailyActive: number;
        weeklyActive: number;
        monthlyActive: number;
    };
    moderation: {
        pendingFlags: number;
        resolvedToday: number;
        averageResolutionTime: number;
    };
    system: {
        uptime: number;
        errorRate: number;
        responseTime: number;
        storageUsed: number;
    };
}>;
export type SystemStats = z.infer<typeof SystemStatsSchema>;
export declare const CreateAdminUserSchema: z.ZodObject<{
    userId: z.ZodString;
    role: z.ZodNativeEnum<typeof AdminRole>;
    permissions: z.ZodArray<z.ZodNativeEnum<typeof Permission>, "many">;
}, "strip", z.ZodTypeAny, {
    role: AdminRole;
    userId: string;
    permissions: Permission[];
}, {
    role: AdminRole;
    userId: string;
    permissions: Permission[];
}>;
export type CreateAdminUserInput = z.infer<typeof CreateAdminUserSchema>;
export declare const UpdateAdminUserSchema: z.ZodObject<{
    role: z.ZodOptional<z.ZodNativeEnum<typeof AdminRole>>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof Permission>, "many">>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    role?: AdminRole | undefined;
    permissions?: Permission[] | undefined;
    isActive?: boolean | undefined;
}, {
    role?: AdminRole | undefined;
    permissions?: Permission[] | undefined;
    isActive?: boolean | undefined;
}>;
export type UpdateAdminUserInput = z.infer<typeof UpdateAdminUserSchema>;
export declare const CreateSystemAlertSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof SystemAlertType>;
    title: z.ZodString;
    message: z.ZodString;
    targetAudience: z.ZodArray<z.ZodEnum<["ALL", "ADMINS", "USERS", "VERIFIED"]>, "many">;
    startsAt: z.ZodString;
    endsAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: SystemAlertType;
    title: string;
    message: string;
    targetAudience: ("VERIFIED" | "ALL" | "ADMINS" | "USERS")[];
    startsAt: string;
    endsAt?: string | undefined;
}, {
    type: SystemAlertType;
    title: string;
    message: string;
    targetAudience: ("VERIFIED" | "ALL" | "ADMINS" | "USERS")[];
    startsAt: string;
    endsAt?: string | undefined;
}>;
export type CreateSystemAlertInput = z.infer<typeof CreateSystemAlertSchema>;
export declare const ADMIN_ROLE_DEFINITIONS: {
    SUPER_ADMIN: {
        name: string;
        description: string;
        icon: string;
        color: string;
        permissions: Permission[];
    };
    ADMIN: {
        name: string;
        description: string;
        icon: string;
        color: string;
        permissions: Permission[];
    };
    MODERATOR: {
        name: string;
        description: string;
        icon: string;
        color: string;
        permissions: Permission[];
    };
    ANALYST: {
        name: string;
        description: string;
        icon: string;
        color: string;
        permissions: Permission[];
    };
};
export declare const PERMISSION_DEFINITIONS: {
    VIEW_USERS: {
        name: string;
        description: string;
        category: string;
    };
    MANAGE_USERS: {
        name: string;
        description: string;
        category: string;
    };
    DELETE_USERS: {
        name: string;
        description: string;
        category: string;
    };
    BAN_USERS: {
        name: string;
        description: string;
        category: string;
    };
    VIEW_CONTENT: {
        name: string;
        description: string;
        category: string;
    };
    MANAGE_CONTENT: {
        name: string;
        description: string;
        category: string;
    };
    DELETE_CONTENT: {
        name: string;
        description: string;
        category: string;
    };
    APPROVE_CONTENT: {
        name: string;
        description: string;
        category: string;
    };
    VIEW_FLAGS: {
        name: string;
        description: string;
        category: string;
    };
    MANAGE_FLAGS: {
        name: string;
        description: string;
        category: string;
    };
    BAN_CONTENT: {
        name: string;
        description: string;
        category: string;
    };
    VIEW_ANALYTICS: {
        name: string;
        description: string;
        category: string;
    };
    EXPORT_DATA: {
        name: string;
        description: string;
        category: string;
    };
    VIEW_SETTINGS: {
        name: string;
        description: string;
        category: string;
    };
    MANAGE_SETTINGS: {
        name: string;
        description: string;
        category: string;
    };
    MANAGE_STUDY_GROUPS: {
        name: string;
        description: string;
        category: string;
    };
    MANAGE_RESOURCES: {
        name: string;
        description: string;
        category: string;
    };
    MANAGE_CHAT: {
        name: string;
        description: string;
        category: string;
    };
    VIEW_CHAT_LOGS: {
        name: string;
        description: string;
        category: string;
    };
};
export declare const MODERATION_ACTION_DEFINITIONS: {
    APPROVE: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    REJECT: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    DELETE: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    BAN: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    WARNING: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    SILENCE: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
};
export declare const REPORT_REASON_DEFINITIONS: {
    INAPPROPRIATE_CONTENT: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    SPAM: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    HARASSMENT: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    MISINFORMATION: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    COPYRIGHT: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    OFF_TOPIC: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    DUPLICATE: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    OTHER: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
};
export declare function hasPermission(userPermissions: Permission[], requiredPermission: Permission): boolean;
export declare function hasAnyPermission(userPermissions: Permission[], requiredPermissions: Permission[]): boolean;
export declare function hasAllPermissions(userPermissions: Permission[], requiredPermissions: Permission[]): boolean;
export declare function getRolePermissions(role: AdminRole): Permission[];
export declare function canPerformAction(userRole: AdminRole, userPermissions: Permission[], requiredPermission: Permission): boolean;
export declare function formatModerationAction(action: ModerationAction): string;
export declare function formatReportReason(reason: ReportReason): string;
export declare function getContentTypeIcon(contentType: ContentType): string;
export declare function getSystemAlertIcon(type: SystemAlertType): string;
export declare function getSystemAlertColor(type: SystemAlertType): string;
//# sourceMappingURL=admin.d.ts.map