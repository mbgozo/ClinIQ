import { z } from "zod";
export var GroupType;
(function (GroupType) {
    GroupType["STUDY_GROUP"] = "STUDY_GROUP";
    GroupType["EXAM_PREP"] = "EXAM_PREP";
    GroupType["COURSE_SPECIFIC"] = "COURSE_SPECIFIC";
    GroupType["RESEARCH_GROUP"] = "RESEARCH_GROUP";
    GroupType["MENTORSHIP_GROUP"] = "MENTORSHIP_GROUP";
    GroupType["INTEREST_GROUP"] = "INTEREST_GROUP";
})(GroupType || (GroupType = {}));
export var GroupPrivacy;
(function (GroupPrivacy) {
    GroupPrivacy["PUBLIC"] = "PUBLIC";
    GroupPrivacy["PRIVATE"] = "PRIVATE";
    GroupPrivacy["INVITE_ONLY"] = "INVITE_ONLY";
})(GroupPrivacy || (GroupPrivacy = {}));
export var MemberRole;
(function (MemberRole) {
    MemberRole["OWNER"] = "OWNER";
    MemberRole["ADMIN"] = "ADMIN";
    MemberRole["MODERATOR"] = "MODERATOR";
    MemberRole["MEMBER"] = "MEMBER";
})(MemberRole || (MemberRole = {}));
export var GroupCadence;
(function (GroupCadence) {
    GroupCadence["DAILY"] = "DAILY";
    GroupCadence["WEEKLY"] = "WEEKLY";
    GroupCadence["BI_WEEKLY"] = "BI_WEEKLY";
    GroupCadence["MONTHLY"] = "MONTHLY";
    GroupCadence["AS_NEEDED"] = "AS_NEEDED";
})(GroupCadence || (GroupCadence = {}));
export const GroupSchema = z.object({
    id: z.string(),
    ownerId: z.string(),
    name: z.string(),
    description: z.string(),
    categoryId: z.string().optional(),
    institution: z.string().optional(),
    privacy: z.nativeEnum(GroupPrivacy),
    cadence: z.nativeEnum(GroupCadence),
    maxMembers: z.number(),
    inviteCode: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
export const CreateGroupSchema = z.object({
    name: z.string().min(3).max(100),
    description: z.string().min(10).max(500),
    categoryId: z.string().optional(),
    institution: z.string().optional(),
    privacy: z.nativeEnum(GroupPrivacy),
    cadence: z.nativeEnum(GroupCadence),
    maxMembers: z.number().int().min(2).max(100),
});
export const GroupMemberSchema = z.object({
    id: z.string(),
    groupId: z.string(),
    userId: z.string(),
    role: z.nativeEnum(MemberRole),
    joinedAt: z.string(),
});
export const GroupPostSchema = z.object({
    id: z.string(),
    groupId: z.string(),
    userId: z.string(),
    body: z.string(),
    pinned: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
export const CreateGroupPostSchema = z.object({
    body: z.string().min(1).max(2000),
    pinned: z.boolean().optional(),
});
export const GroupFilterSchema = z.object({
    categoryId: z.string().optional(),
    institution: z.string().optional(),
    privacy: z.nativeEnum(GroupPrivacy).optional(),
    cadence: z.nativeEnum(GroupCadence).optional(),
    search: z.string().optional(),
    hasSpace: z.boolean().optional(),
    page: z.number().default(1),
    limit: z.number().max(20).default(10),
});
// Group type definitions
export const GROUP_TYPE_DEFINITIONS = {
    [GroupType.STUDY_GROUP]: {
        name: "Study Group",
        description: "Collaborative study sessions and exam preparation",
        icon: "📚",
        color: "#3B82F6",
    },
    [GroupType.EXAM_PREP]: {
        name: "Exam Preparation",
        description: "Focused preparation for specific exams and assessments",
        icon: "✍️",
        color: "#10B981",
    },
    [GroupType.COURSE_SPECIFIC]: {
        name: "Course Specific",
        description: "Groups dedicated to specific courses or subjects",
        icon: "🎓",
        color: "#F59E0B",
    },
    [GroupType.RESEARCH_GROUP]: {
        name: "Research Group",
        description: "Academic research and evidence-based practice discussions",
        icon: "🔬",
        color: "#8B5CF6",
    },
    [GroupType.MENTORSHIP_GROUP]: {
        name: "Mentorship Group",
        description: "Mentor-led groups for guidance and support",
        icon: "👥",
        color: "#059669",
    },
    [GroupType.INTEREST_GROUP]: {
        name: "Interest Group",
        description: "Groups based on specific nursing interests and specialties",
        icon: "💡",
        color: "#EC4899",
    },
};
// Privacy definitions
export const PRIVACY_DEFINITIONS = {
    [GroupPrivacy.PUBLIC]: {
        name: "Public",
        description: "Anyone can find and join this group",
        icon: "🌍",
        color: "#10B981",
    },
    [GroupPrivacy.PRIVATE]: {
        name: "Private",
        description: "Group is hidden, requires invite code to join",
        icon: "🔒",
        color: "#EF4444",
    },
    [GroupPrivacy.INVITE_ONLY]: {
        name: "Invite Only",
        description: "Only invited members can join",
        icon: "📧",
        color: "#F59E0B",
    },
};
// Cadence definitions
export const CADENCE_DEFINITIONS = {
    [GroupCadence.DAILY]: {
        name: "Daily",
        description: "Group meets every day",
        icon: "📅",
        color: "#3B82F6",
    },
    [GroupCadence.WEEKLY]: {
        name: "Weekly",
        description: "Group meets once per week",
        icon: "📆",
        color: "#10B981",
    },
    [GroupCadence.BI_WEEKLY]: {
        name: "Bi-Weekly",
        description: "Group meets twice per week",
        icon: "📋",
        color: "#F59E0B",
    },
    [GroupCadence.MONTHLY]: {
        name: "Monthly",
        description: "Group meets once per month",
        icon: "🗓️",
        color: "#8B5CF6",
    },
    [GroupCadence.AS_NEEDED]: {
        name: "As Needed",
        description: "Group meets as needed",
        icon: "⏰",
        color: "#6B7280",
    },
};
// Role permissions
export const ROLE_PERMISSIONS = {
    [MemberRole.OWNER]: {
        canEditGroup: true,
        canDeleteGroup: true,
        canInviteMembers: true,
        canRemoveMembers: true,
        canManageRoles: true,
        canPinPosts: true,
        canDeletePosts: true,
        canBanMembers: true,
    },
    [MemberRole.ADMIN]: {
        canEditGroup: true,
        canDeleteGroup: false,
        canInviteMembers: true,
        canRemoveMembers: true,
        canManageRoles: false,
        canPinPosts: true,
        canDeletePosts: true,
        canBanMembers: false,
    },
    [MemberRole.MODERATOR]: {
        canEditGroup: false,
        canDeleteGroup: false,
        canInviteMembers: true,
        canRemoveMembers: false,
        canManageRoles: false,
        canPinPosts: true,
        canDeletePosts: true,
        canBanMembers: false,
    },
    [MemberRole.MEMBER]: {
        canEditGroup: false,
        canDeleteGroup: false,
        canInviteMembers: false,
        canRemoveMembers: false,
        canManageRoles: false,
        canPinPosts: false,
        canDeletePosts: false,
        canBanMembers: false,
    },
};
// Group activity types
export var GroupActivityType;
(function (GroupActivityType) {
    GroupActivityType["MEMBER_JOINED"] = "MEMBER_JOINED";
    GroupActivityType["MEMBER_LEFT"] = "MEMBER_LEFT";
    GroupActivityType["ROLE_CHANGED"] = "ROLE_CHANGED";
    GroupActivityType["POST_CREATED"] = "POST_CREATED";
    GroupActivityType["POST_PINNED"] = "POST_PINNED";
    GroupActivityType["GROUP_CREATED"] = "GROUP_CREATED";
    GroupActivityType["GROUP_UPDATED"] = "GROUP_UPDATED";
})(GroupActivityType || (GroupActivityType = {}));
export const ACTIVITY_TYPE_DEFINITIONS = {
    [GroupActivityType.MEMBER_JOINED]: {
        name: "Member Joined",
        icon: "👋",
        color: "#10B981",
    },
    [GroupActivityType.MEMBER_LEFT]: {
        name: "Member Left",
        icon: "👋",
        color: "#EF4444",
    },
    [GroupActivityType.ROLE_CHANGED]: {
        name: "Role Changed",
        icon: "🔄",
        color: "#F59E0B",
    },
    [GroupActivityType.POST_CREATED]: {
        name: "New Post",
        icon: "📝",
        color: "#3B82F6",
    },
    [GroupActivityType.POST_PINNED]: {
        name: "Post Pinned",
        icon: "📌",
        color: "#8B5CF6",
    },
    [GroupActivityType.GROUP_CREATED]: {
        name: "Group Created",
        icon: "🆕",
        color: "#10B981",
    },
    [GroupActivityType.GROUP_UPDATED]: {
        name: "Group Updated",
        icon: "✏️",
        color: "#6B7280",
    },
};
// Group invitation
export const GroupInviteSchema = z.object({
    id: z.string(),
    groupId: z.string(),
    inviterId: z.string(),
    inviteeId: z.string(),
    inviteeEmail: z.string().optional(),
    status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "EXPIRED"]),
    message: z.string().optional(),
    createdAt: z.string(),
    expiresAt: z.string(),
    respondedAt: z.string().optional(),
});
export const CreateGroupInviteSchema = z.object({
    inviteeEmail: z.string().email(),
    message: z.string().max(500).optional(),
});
// Helper functions
export function canUserPerformAction(userRole, action) {
    return ROLE_PERMISSIONS[userRole]?.[action] || false;
}
export function getRoleHierarchy() {
    return [MemberRole.OWNER, MemberRole.ADMIN, MemberRole.MODERATOR, MemberRole.MEMBER];
}
export function canManageRole(userRole, targetRole) {
    const hierarchy = getRoleHierarchy();
    const userIndex = hierarchy.indexOf(userRole);
    const targetIndex = hierarchy.indexOf(targetRole);
    return userIndex < targetIndex && userIndex <= hierarchy.indexOf(MemberRole.ADMIN);
}
export function generateInviteCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
export function isInviteCodeExpired(expiresAt) {
    return new Date(expiresAt) < new Date();
}
export function getGroupMemberCount(group) {
    return group.members.length;
}
export function getGroupActiveMembers(group) {
    // This would be calculated based on recent activity
    // For now, return total members
    return group.members.length;
}
export function getGroupLastActivity(group) {
    if (group.posts.length === 0) {
        return group.createdAt;
    }
    const latestPost = group.posts.reduce((latest, post) => {
        return new Date(post.updatedAt) > new Date(latest.updatedAt) ? post : latest;
    });
    return latestPost.updatedAt;
}
