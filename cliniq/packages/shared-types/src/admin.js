import { z } from "zod";
export var AdminRole;
(function (AdminRole) {
    AdminRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    AdminRole["ADMIN"] = "ADMIN";
    AdminRole["MODERATOR"] = "MODERATOR";
    AdminRole["ANALYST"] = "ANALYST";
})(AdminRole || (AdminRole = {}));
export var Permission;
(function (Permission) {
    // User Management
    Permission["VIEW_USERS"] = "VIEW_USERS";
    Permission["MANAGE_USERS"] = "MANAGE_USERS";
    Permission["DELETE_USERS"] = "DELETE_USERS";
    Permission["BAN_USERS"] = "BAN_USERS";
    // Content Management
    Permission["VIEW_CONTENT"] = "VIEW_CONTENT";
    Permission["MANAGE_CONTENT"] = "MANAGE_CONTENT";
    Permission["DELETE_CONTENT"] = "DELETE_CONTENT";
    Permission["APPROVE_CONTENT"] = "APPROVE_CONTENT";
    // Moderation
    Permission["VIEW_FLAGS"] = "VIEW_FLAGS";
    Permission["MANAGE_FLAGS"] = "MANAGE_FLAGS";
    Permission["BAN_CONTENT"] = "BAN_CONTENT";
    // Analytics
    Permission["VIEW_ANALYTICS"] = "VIEW_ANALYTICS";
    Permission["EXPORT_DATA"] = "EXPORT_DATA";
    // System Settings
    Permission["VIEW_SETTINGS"] = "VIEW_SETTINGS";
    Permission["MANAGE_SETTINGS"] = "MANAGE_SETTINGS";
    // Study Groups
    Permission["MANAGE_STUDY_GROUPS"] = "MANAGE_STUDY_GROUPS";
    // Resources
    Permission["MANAGE_RESOURCES"] = "MANAGE_RESOURCES";
    // Chat
    Permission["MANAGE_CHAT"] = "MANAGE_CHAT";
    Permission["VIEW_CHAT_LOGS"] = "VIEW_CHAT_LOGS";
})(Permission || (Permission = {}));
export var ModerationAction;
(function (ModerationAction) {
    ModerationAction["APPROVE"] = "APPROVE";
    ModerationAction["REJECT"] = "REJECT";
    ModerationAction["DELETE"] = "DELETE";
    ModerationAction["BAN"] = "BAN";
    ModerationAction["WARNING"] = "WARNING";
    ModerationAction["SILENCE"] = "SILENCE";
})(ModerationAction || (ModerationAction = {}));
export var ContentType;
(function (ContentType) {
    ContentType["QUESTION"] = "QUESTION";
    ContentType["ANSWER"] = "ANSWER";
    ContentType["RESOURCE"] = "RESOURCE";
    ContentType["STUDY_GROUP"] = "STUDY_GROUP";
    ContentType["GROUP_POST"] = "GROUP_POST";
    ContentType["CHAT_MESSAGE"] = "CHAT_MESSAGE";
    ContentType["USER_PROFILE"] = "USER_PROFILE";
})(ContentType || (ContentType = {}));
export var ReportReason;
(function (ReportReason) {
    ReportReason["INAPPROPRIATE_CONTENT"] = "INAPPROPRIATE_CONTENT";
    ReportReason["SPAM"] = "SPAM";
    ReportReason["HARASSMENT"] = "HARASSMENT";
    ReportReason["MISINFORMATION"] = "MISINFORMATION";
    ReportReason["COPYRIGHT"] = "COPYRIGHT";
    ReportReason["OFF_TOPIC"] = "OFF_TOPIC";
    ReportReason["DUPLICATE"] = "DUPLICATE";
    ReportReason["OTHER"] = "OTHER";
})(ReportReason || (ReportReason = {}));
export var SystemAlertType;
(function (SystemAlertType) {
    SystemAlertType["INFO"] = "INFO";
    SystemAlertType["WARNING"] = "WARNING";
    SystemAlertType["ERROR"] = "ERROR";
    SystemAlertType["SUCCESS"] = "SUCCESS";
    SystemAlertType["MAINTENANCE"] = "MAINTENANCE";
})(SystemAlertType || (SystemAlertType = {}));
export const AdminUserSchema = z.object({
    id: z.string(),
    userId: z.string(),
    role: z.nativeEnum(AdminRole),
    permissions: z.array(z.nativeEnum(Permission)),
    isActive: z.boolean(),
    lastLoginAt: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    user: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        avatarUrl: z.string().optional(),
        institution: z.string(),
        program: z.string(),
        year: z.number(),
        reputation: z.number(),
        isVerified: z.boolean(),
        isBanned: z.boolean(),
        createdAt: z.string(),
    }),
});
export const ModerationQueueSchema = z.object({
    id: z.string(),
    contentType: z.nativeEnum(ContentType),
    contentId: z.string(),
    reason: z.nativeEnum(ReportReason),
    description: z.string(),
    reporterId: z.string(),
    moderatorId: z.string().optional(),
    status: z.enum(["PENDING", "IN_REVIEW", "RESOLVED", "DISMISSED"]),
    action: z.nativeEnum(ModerationAction).optional(),
    actionReason: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    resolvedAt: z.string().optional(),
    content: z.any(),
    reporter: z.object({
        id: z.string(),
        name: z.string(),
        avatarUrl: z.string().optional(),
    }),
    moderator: z.object({
        id: z.string(),
        name: z.string(),
        avatarUrl: z.string().optional(),
    }).optional(),
});
export const SystemAlertSchema = z.object({
    id: z.string(),
    type: z.nativeEnum(SystemAlertType),
    title: z.string(),
    message: z.string(),
    isActive: z.boolean(),
    targetAudience: z.array(z.enum(["ALL", "ADMINS", "USERS", "VERIFIED"])),
    startsAt: z.string(),
    endsAt: z.string().optional(),
    createdBy: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    dismissCount: z.number(),
});
export const AdminLogSchema = z.object({
    id: z.string(),
    adminId: z.string(),
    action: z.string(),
    entityType: z.string(),
    entityId: z.string(),
    details: z.record(z.any()),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    createdAt: z.string(),
    admin: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
    }),
});
export const SystemStatsSchema = z.object({
    users: z.object({
        total: z.number(),
        active: z.number(),
        new: z.number(),
        banned: z.number(),
        verified: z.number(),
    }),
    content: z.object({
        questions: z.number(),
        answers: z.number(),
        resources: z.number(),
        studyGroups: z.number(),
    }),
    engagement: z.object({
        totalInteractions: z.number(),
        dailyActive: z.number(),
        weeklyActive: z.number(),
        monthlyActive: z.number(),
    }),
    moderation: z.object({
        pendingFlags: z.number(),
        resolvedToday: z.number(),
        averageResolutionTime: z.number(),
    }),
    system: z.object({
        uptime: z.number(),
        errorRate: z.number(),
        responseTime: z.number(),
        storageUsed: z.number(),
    }),
    updatedAt: z.string(),
});
export const CreateAdminUserSchema = z.object({
    userId: z.string(),
    role: z.nativeEnum(AdminRole),
    permissions: z.array(z.nativeEnum(Permission)),
});
export const UpdateAdminUserSchema = z.object({
    role: z.nativeEnum(AdminRole).optional(),
    permissions: z.array(z.nativeEnum(Permission)).optional(),
    isActive: z.boolean().optional(),
});
export const CreateSystemAlertSchema = z.object({
    type: z.nativeEnum(SystemAlertType),
    title: z.string(),
    message: z.string(),
    targetAudience: z.array(z.enum(["ALL", "ADMINS", "USERS", "VERIFIED"])),
    startsAt: z.string(),
    endsAt: z.string().optional(),
});
// Admin role definitions
export const ADMIN_ROLE_DEFINITIONS = {
    [AdminRole.SUPER_ADMIN]: {
        name: "Super Admin",
        description: "Full system access and control",
        icon: "crown",
        color: "#DC2626",
        permissions: Object.values(Permission),
    },
    [AdminRole.ADMIN]: {
        name: "Admin",
        description: "Administrative access to most features",
        icon: "bolt",
        color: "#F59E0B",
        permissions: [
            Permission.VIEW_USERS,
            Permission.MANAGE_USERS,
            Permission.VIEW_CONTENT,
            Permission.MANAGE_CONTENT,
            Permission.VIEW_FLAGS,
            Permission.MANAGE_FLAGS,
            Permission.VIEW_ANALYTICS,
            Permission.VIEW_SETTINGS,
            Permission.MANAGE_STUDY_GROUPS,
            Permission.MANAGE_RESOURCES,
            Permission.MANAGE_CHAT,
        ],
    },
    [AdminRole.MODERATOR]: {
        name: "Moderator",
        description: "Content moderation and user management",
        icon: "shield",
        color: "#10B981",
        permissions: [
            Permission.VIEW_USERS,
            Permission.VIEW_CONTENT,
            Permission.MANAGE_CONTENT,
            Permission.VIEW_FLAGS,
            Permission.MANAGE_FLAGS,
            Permission.VIEW_ANALYTICS,
            Permission.MANAGE_STUDY_GROUPS,
            Permission.MANAGE_RESOURCES,
            Permission.VIEW_CHAT_LOGS,
        ],
    },
    [AdminRole.ANALYST]: {
        name: "Analyst",
        description: "Analytics and reporting access",
        icon: "chart-bar",
        color: "#6366F1",
        permissions: [
            Permission.VIEW_USERS,
            Permission.VIEW_CONTENT,
            Permission.VIEW_FLAGS,
            Permission.VIEW_ANALYTICS,
            Permission.EXPORT_DATA,
            Permission.VIEW_SETTINGS,
        ],
    },
};
// Permission definitions
export const PERMISSION_DEFINITIONS = {
    [Permission.VIEW_USERS]: {
        name: "View Users",
        description: "View user profiles and information",
        category: "Users",
    },
    [Permission.MANAGE_USERS]: {
        name: "Manage Users",
        description: "Edit, ban, and manage user accounts",
        category: "Users",
    },
    [Permission.DELETE_USERS]: {
        name: "Delete Users",
        description: "Permanently delete user accounts",
        category: "Users",
    },
    [Permission.BAN_USERS]: {
        name: "Ban Users",
        description: "Ban and unban user accounts",
        category: "Users",
    },
    [Permission.VIEW_CONTENT]: {
        name: "View Content",
        description: "View all platform content",
        category: "Content",
    },
    [Permission.MANAGE_CONTENT]: {
        name: "Manage Content",
        description: "Edit and manage platform content",
        category: "Content",
    },
    [Permission.DELETE_CONTENT]: {
        name: "Delete Content",
        description: "Delete platform content",
        category: "Content",
    },
    [Permission.APPROVE_CONTENT]: {
        name: "Approve Content",
        description: "Approve pending content",
        category: "Content",
    },
    [Permission.VIEW_FLAGS]: {
        name: "View Flags",
        description: "View content flags and reports",
        category: "Moderation",
    },
    [Permission.MANAGE_FLAGS]: {
        name: "Manage Flags",
        description: "Manage and resolve content flags",
        category: "Moderation",
    },
    [Permission.BAN_CONTENT]: {
        name: "Ban Content",
        description: "Ban inappropriate content",
        category: "Moderation",
    },
    [Permission.VIEW_ANALYTICS]: {
        name: "View Analytics",
        description: "View system analytics and reports",
        category: "Analytics",
    },
    [Permission.EXPORT_DATA]: {
        name: "Export Data",
        description: "Export system data and reports",
        category: "Analytics",
    },
    [Permission.VIEW_SETTINGS]: {
        name: "View Settings",
        description: "View system settings",
        category: "System",
    },
    [Permission.MANAGE_SETTINGS]: {
        name: "Manage Settings",
        description: "Manage system settings",
        category: "System",
    },
    [Permission.MANAGE_STUDY_GROUPS]: {
        name: "Manage Study Groups",
        description: "Manage study groups",
        category: "Study Groups",
    },
    [Permission.MANAGE_RESOURCES]: {
        name: "Manage Resources",
        description: "Manage resource library",
        category: "Resources",
    },
    [Permission.MANAGE_CHAT]: {
        name: "Manage Chat",
        description: "Manage chat system",
        category: "Chat",
    },
    [Permission.VIEW_CHAT_LOGS]: {
        name: "View Chat Logs",
        description: "View chat logs and history",
        category: "Chat",
    },
};
// Moderation action definitions
export const MODERATION_ACTION_DEFINITIONS = {
    [ModerationAction.APPROVE]: {
        name: "Approve",
        description: "Approve the reported content",
        icon: "check-circle",
        color: "#10B981",
    },
    [ModerationAction.REJECT]: {
        name: "Reject",
        description: "Reject the report",
        icon: "x-circle",
        color: "#EF4444",
    },
    [ModerationAction.DELETE]: {
        name: "Delete",
        description: "Delete the content",
        icon: "trash",
        color: "#DC2626",
    },
    [ModerationAction.BAN]: {
        name: "Ban",
        description: "Ban the user",
        icon: "ban",
        color: "#DC2626",
    },
    [ModerationAction.WARNING]: {
        name: "Warning",
        description: "Issue a warning to the user",
        icon: "alert-triangle",
        color: "#F59E0B",
    },
    [ModerationAction.SILENCE]: {
        name: "Silence",
        description: "Silence the user temporarily",
        icon: "volume-x",
        color: "#6B7280",
    },
};
// Report reason definitions
export const REPORT_REASON_DEFINITIONS = {
    [ReportReason.INAPPROPRIATE_CONTENT]: {
        name: "Inappropriate Content",
        description: "Content that violates community guidelines",
        icon: "ban",
        color: "#EF4444",
    },
    [ReportReason.SPAM]: {
        name: "Spam",
        description: "Unsolicited or repetitive content",
        icon: "mail",
        color: "#F59E0B",
    },
    [ReportReason.HARASSMENT]: {
        name: "Harassment",
        description: "Bullying or harassing behavior",
        icon: "alert-octagon",
        color: "#DC2626",
    },
    [ReportReason.MISINFORMATION]: {
        name: "Misinformation",
        description: "False or misleading information",
        icon: "help-circle",
        color: "#8B5CF6",
    },
    [ReportReason.COPYRIGHT]: {
        name: "Copyright Violation",
        description: "Content that infringes copyright",
        icon: "copyright",
        color: "#6B7280",
    },
    [ReportReason.OFF_TOPIC]: {
        name: "Off Topic",
        description: "Content not relevant to the platform",
        icon: "pin",
        color: "#6B7280",
    },
    [ReportReason.DUPLICATE]: {
        name: "Duplicate",
        description: "Duplicate content",
        icon: "refresh-cw",
        color: "#6B7280",
    },
    [ReportReason.OTHER]: {
        name: "Other",
        description: "Other issues not covered above",
        icon: "file-text",
        color: "#6B7280",
    },
};
// Helper functions
export function hasPermission(userPermissions, requiredPermission) {
    return userPermissions.includes(requiredPermission);
}
export function hasAnyPermission(userPermissions, requiredPermissions) {
    return requiredPermissions.some(permission => userPermissions.includes(permission));
}
export function hasAllPermissions(userPermissions, requiredPermissions) {
    return requiredPermissions.every(permission => userPermissions.includes(permission));
}
export function getRolePermissions(role) {
    return ADMIN_ROLE_DEFINITIONS[role]?.permissions || [];
}
export function canPerformAction(userRole, userPermissions, requiredPermission) {
    const rolePermissions = getRolePermissions(userRole);
    return hasPermission([...rolePermissions, ...userPermissions], requiredPermission);
}
export function formatModerationAction(action) {
    return MODERATION_ACTION_DEFINITIONS[action]?.name || action;
}
export function formatReportReason(reason) {
    return REPORT_REASON_DEFINITIONS[reason]?.name || reason;
}
export function getContentTypeIcon(contentType) {
    const icons = {
        [ContentType.QUESTION]: "help-circle",
        [ContentType.ANSWER]: "message-circle",
        [ContentType.RESOURCE]: "paperclip",
        [ContentType.STUDY_GROUP]: "users",
        [ContentType.GROUP_POST]: "file-text",
        [ContentType.CHAT_MESSAGE]: "message-square",
        [ContentType.USER_PROFILE]: "user",
    };
    return icons[contentType] || "file";
}
export function getSystemAlertIcon(type) {
    const icons = {
        [SystemAlertType.INFO]: "info",
        [SystemAlertType.WARNING]: "alert-triangle",
        [SystemAlertType.ERROR]: "x-circle",
        [SystemAlertType.SUCCESS]: "check-circle",
        [SystemAlertType.MAINTENANCE]: "settings",
    };
    return icons[type] || "info";
}
export function getSystemAlertColor(type) {
    const colors = {
        [SystemAlertType.INFO]: "#3B82F6",
        [SystemAlertType.WARNING]: "#F59E0B",
        [SystemAlertType.ERROR]: "#EF4444",
        [SystemAlertType.SUCCESS]: "#10B981",
        [SystemAlertType.MAINTENANCE]: "#6B7280",
    };
    return colors[type] || "#6B7280";
}
