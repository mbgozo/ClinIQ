import { z } from "zod";
export declare enum GroupType {
    STUDY_GROUP = "STUDY_GROUP",
    EXAM_PREP = "EXAM_PREP",
    COURSE_SPECIFIC = "COURSE_SPECIFIC",
    RESEARCH_GROUP = "RESEARCH_GROUP",
    MENTORSHIP_GROUP = "MENTORSHIP_GROUP",
    INTEREST_GROUP = "INTEREST_GROUP"
}
export declare enum GroupPrivacy {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    INVITE_ONLY = "INVITE_ONLY"
}
export declare enum MemberRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    MEMBER = "MEMBER"
}
export declare enum GroupCadence {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    BI_WEEKLY = "BI_WEEKLY",
    MONTHLY = "MONTHLY",
    AS_NEEDED = "AS_NEEDED"
}
export declare const GroupSchema: z.ZodObject<{
    id: z.ZodString;
    ownerId: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    categoryId: z.ZodOptional<z.ZodString>;
    institution: z.ZodOptional<z.ZodString>;
    privacy: z.ZodNativeEnum<typeof GroupPrivacy>;
    cadence: z.ZodNativeEnum<typeof GroupCadence>;
    maxMembers: z.ZodNumber;
    inviteCode: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    createdAt: string;
    description: string;
    updatedAt: string;
    ownerId: string;
    privacy: GroupPrivacy;
    cadence: GroupCadence;
    maxMembers: number;
    inviteCode: string;
    institution?: string | undefined;
    categoryId?: string | undefined;
}, {
    name: string;
    id: string;
    createdAt: string;
    description: string;
    updatedAt: string;
    ownerId: string;
    privacy: GroupPrivacy;
    cadence: GroupCadence;
    maxMembers: number;
    inviteCode: string;
    institution?: string | undefined;
    categoryId?: string | undefined;
}>;
export type Group = z.infer<typeof GroupSchema>;
export declare const CreateGroupSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    categoryId: z.ZodOptional<z.ZodString>;
    institution: z.ZodOptional<z.ZodString>;
    privacy: z.ZodNativeEnum<typeof GroupPrivacy>;
    cadence: z.ZodNativeEnum<typeof GroupCadence>;
    maxMembers: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    privacy: GroupPrivacy;
    cadence: GroupCadence;
    maxMembers: number;
    institution?: string | undefined;
    categoryId?: string | undefined;
}, {
    name: string;
    description: string;
    privacy: GroupPrivacy;
    cadence: GroupCadence;
    maxMembers: number;
    institution?: string | undefined;
    categoryId?: string | undefined;
}>;
export type CreateGroupInput = z.infer<typeof CreateGroupSchema>;
export declare const GroupMemberSchema: z.ZodObject<{
    id: z.ZodString;
    groupId: z.ZodString;
    userId: z.ZodString;
    role: z.ZodNativeEnum<typeof MemberRole>;
    joinedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    role: MemberRole;
    userId: string;
    groupId: string;
    joinedAt: string;
}, {
    id: string;
    role: MemberRole;
    userId: string;
    groupId: string;
    joinedAt: string;
}>;
export type GroupMember = z.infer<typeof GroupMemberSchema>;
export declare const GroupPostSchema: z.ZodObject<{
    id: z.ZodString;
    groupId: z.ZodString;
    userId: z.ZodString;
    body: z.ZodString;
    pinned: z.ZodBoolean;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    body: string;
    createdAt: string;
    updatedAt: string;
    groupId: string;
    pinned: boolean;
}, {
    id: string;
    userId: string;
    body: string;
    createdAt: string;
    updatedAt: string;
    groupId: string;
    pinned: boolean;
}>;
export type GroupPost = z.infer<typeof GroupPostSchema>;
export declare const CreateGroupPostSchema: z.ZodObject<{
    body: z.ZodString;
    pinned: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    body: string;
    pinned?: boolean | undefined;
}, {
    body: string;
    pinned?: boolean | undefined;
}>;
export type CreateGroupPostInput = z.infer<typeof CreateGroupPostSchema>;
export declare const GroupFilterSchema: z.ZodObject<{
    categoryId: z.ZodOptional<z.ZodString>;
    institution: z.ZodOptional<z.ZodString>;
    privacy: z.ZodOptional<z.ZodNativeEnum<typeof GroupPrivacy>>;
    cadence: z.ZodOptional<z.ZodNativeEnum<typeof GroupCadence>>;
    search: z.ZodOptional<z.ZodString>;
    hasSpace: z.ZodOptional<z.ZodBoolean>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    search?: string | undefined;
    institution?: string | undefined;
    categoryId?: string | undefined;
    privacy?: GroupPrivacy | undefined;
    cadence?: GroupCadence | undefined;
    hasSpace?: boolean | undefined;
}, {
    search?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    institution?: string | undefined;
    categoryId?: string | undefined;
    privacy?: GroupPrivacy | undefined;
    cadence?: GroupCadence | undefined;
    hasSpace?: boolean | undefined;
}>;
export type GroupFilter = z.infer<typeof GroupFilterSchema>;
export declare const GROUP_TYPE_DEFINITIONS: {
    STUDY_GROUP: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    EXAM_PREP: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    COURSE_SPECIFIC: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    RESEARCH_GROUP: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    MENTORSHIP_GROUP: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    INTEREST_GROUP: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
};
export declare const PRIVACY_DEFINITIONS: {
    PUBLIC: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    PRIVATE: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    INVITE_ONLY: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
};
export declare const CADENCE_DEFINITIONS: {
    DAILY: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    WEEKLY: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    BI_WEEKLY: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    MONTHLY: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    AS_NEEDED: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
};
export declare const ROLE_PERMISSIONS: {
    OWNER: {
        canEditGroup: boolean;
        canDeleteGroup: boolean;
        canInviteMembers: boolean;
        canRemoveMembers: boolean;
        canManageRoles: boolean;
        canPinPosts: boolean;
        canDeletePosts: boolean;
        canBanMembers: boolean;
    };
    ADMIN: {
        canEditGroup: boolean;
        canDeleteGroup: boolean;
        canInviteMembers: boolean;
        canRemoveMembers: boolean;
        canManageRoles: boolean;
        canPinPosts: boolean;
        canDeletePosts: boolean;
        canBanMembers: boolean;
    };
    MODERATOR: {
        canEditGroup: boolean;
        canDeleteGroup: boolean;
        canInviteMembers: boolean;
        canRemoveMembers: boolean;
        canManageRoles: boolean;
        canPinPosts: boolean;
        canDeletePosts: boolean;
        canBanMembers: boolean;
    };
    MEMBER: {
        canEditGroup: boolean;
        canDeleteGroup: boolean;
        canInviteMembers: boolean;
        canRemoveMembers: boolean;
        canManageRoles: boolean;
        canPinPosts: boolean;
        canDeletePosts: boolean;
        canBanMembers: boolean;
    };
};
export declare enum GroupActivityType {
    MEMBER_JOINED = "MEMBER_JOINED",
    MEMBER_LEFT = "MEMBER_LEFT",
    ROLE_CHANGED = "ROLE_CHANGED",
    POST_CREATED = "POST_CREATED",
    POST_PINNED = "POST_PINNED",
    GROUP_CREATED = "GROUP_CREATED",
    GROUP_UPDATED = "GROUP_UPDATED"
}
export declare const ACTIVITY_TYPE_DEFINITIONS: {
    MEMBER_JOINED: {
        name: string;
        icon: string;
        color: string;
    };
    MEMBER_LEFT: {
        name: string;
        icon: string;
        color: string;
    };
    ROLE_CHANGED: {
        name: string;
        icon: string;
        color: string;
    };
    POST_CREATED: {
        name: string;
        icon: string;
        color: string;
    };
    POST_PINNED: {
        name: string;
        icon: string;
        color: string;
    };
    GROUP_CREATED: {
        name: string;
        icon: string;
        color: string;
    };
    GROUP_UPDATED: {
        name: string;
        icon: string;
        color: string;
    };
};
export interface GroupStats {
    memberCount: number;
    postCount: number;
    activeMembers: number;
    lastActivity: string;
    growthRate: number;
}
export declare const GroupInviteSchema: z.ZodObject<{
    id: z.ZodString;
    groupId: z.ZodString;
    inviterId: z.ZodString;
    inviteeId: z.ZodString;
    inviteeEmail: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["PENDING", "ACCEPTED", "REJECTED", "EXPIRED"]>;
    message: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    expiresAt: z.ZodString;
    respondedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "ACCEPTED" | "PENDING" | "REJECTED" | "EXPIRED";
    createdAt: string;
    groupId: string;
    inviterId: string;
    inviteeId: string;
    expiresAt: string;
    message?: string | undefined;
    inviteeEmail?: string | undefined;
    respondedAt?: string | undefined;
}, {
    id: string;
    status: "ACCEPTED" | "PENDING" | "REJECTED" | "EXPIRED";
    createdAt: string;
    groupId: string;
    inviterId: string;
    inviteeId: string;
    expiresAt: string;
    message?: string | undefined;
    inviteeEmail?: string | undefined;
    respondedAt?: string | undefined;
}>;
export type GroupInvite = z.infer<typeof GroupInviteSchema>;
export declare const CreateGroupInviteSchema: z.ZodObject<{
    inviteeEmail: z.ZodString;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    inviteeEmail: string;
    message?: string | undefined;
}, {
    inviteeEmail: string;
    message?: string | undefined;
}>;
export type CreateGroupInviteInput = z.infer<typeof CreateGroupInviteSchema>;
export declare function canUserPerformAction(userRole: MemberRole, action: keyof typeof ROLE_PERMISSIONS[MemberRole]): boolean;
export declare function getRoleHierarchy(): MemberRole[];
export declare function canManageRole(userRole: MemberRole, targetRole: MemberRole): boolean;
export declare function generateInviteCode(): string;
export declare function isInviteCodeExpired(expiresAt: string): boolean;
export declare function getGroupMemberCount(group: {
    members: any[];
}): number;
export declare function getGroupActiveMembers(group: {
    members: any[];
}): number;
export declare function getGroupLastActivity(group: {
    posts: any[];
    createdAt: string;
}): string;
//# sourceMappingURL=study-groups.d.ts.map