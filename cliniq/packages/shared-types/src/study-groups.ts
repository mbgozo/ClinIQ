import { z } from "zod";

export enum GroupType {
  STUDY_GROUP = "STUDY_GROUP",
  EXAM_PREP = "EXAM_PREP",
  COURSE_SPECIFIC = "COURSE_SPECIFIC",
  RESEARCH_GROUP = "RESEARCH_GROUP",
  MENTORSHIP_GROUP = "MENTORSHIP_GROUP",
  INTEREST_GROUP = "INTEREST_GROUP",
}

export enum GroupPrivacy {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  INVITE_ONLY = "INVITE_ONLY",
}

export enum MemberRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  MEMBER = "MEMBER",
}

export enum GroupCadence {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  BI_WEEKLY = "BI_WEEKLY",
  MONTHLY = "MONTHLY",
  AS_NEEDED = "AS_NEEDED",
}

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

export type Group = z.infer<typeof GroupSchema>;

export const CreateGroupSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  categoryId: z.string().optional(),
  institution: z.string().optional(),
  privacy: z.nativeEnum(GroupPrivacy),
  cadence: z.nativeEnum(GroupCadence),
  maxMembers: z.number().int().min(2).max(100),
});

export type CreateGroupInput = z.infer<typeof CreateGroupSchema>;

export const GroupMemberSchema = z.object({
  id: z.string(),
  groupId: z.string(),
  userId: z.string(),
  role: z.nativeEnum(MemberRole),
  joinedAt: z.string(),
});

export type GroupMember = z.infer<typeof GroupMemberSchema>;

export const GroupPostSchema = z.object({
  id: z.string(),
  groupId: z.string(),
  userId: z.string(),
  body: z.string(),
  pinned: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type GroupPost = z.infer<typeof GroupPostSchema>;

export const CreateGroupPostSchema = z.object({
  body: z.string().min(1).max(2000),
  pinned: z.boolean().optional(),
});

export type CreateGroupPostInput = z.infer<typeof CreateGroupPostSchema>;

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

export type GroupFilter = z.infer<typeof GroupFilterSchema>;

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
export enum GroupActivityType {
  MEMBER_JOINED = "MEMBER_JOINED",
  MEMBER_LEFT = "MEMBER_LEFT",
  ROLE_CHANGED = "ROLE_CHANGED",
  POST_CREATED = "POST_CREATED",
  POST_PINNED = "POST_PINNED",
  GROUP_CREATED = "GROUP_CREATED",
  GROUP_UPDATED = "GROUP_UPDATED",
}

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

// Group statistics
export interface GroupStats {
  memberCount: number;
  postCount: number;
  activeMembers: number;
  lastActivity: string;
  growthRate: number;
}

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

export type GroupInvite = z.infer<typeof GroupInviteSchema>;

export const CreateGroupInviteSchema = z.object({
  inviteeEmail: z.string().email(),
  message: z.string().max(500).optional(),
});

export type CreateGroupInviteInput = z.infer<typeof CreateGroupInviteSchema>;

// Helper functions
export function canUserPerformAction(userRole: MemberRole, action: keyof typeof ROLE_PERMISSIONS[MemberRole]): boolean {
  return ROLE_PERMISSIONS[userRole]?.[action] || false;
}

export function getRoleHierarchy(): MemberRole[] {
  return [MemberRole.OWNER, MemberRole.ADMIN, MemberRole.MODERATOR, MemberRole.MEMBER];
}

export function canManageRole(userRole: MemberRole, targetRole: MemberRole): boolean {
  const hierarchy = getRoleHierarchy();
  const userIndex = hierarchy.indexOf(userRole);
  const targetIndex = hierarchy.indexOf(targetRole);
  
  return userIndex < targetIndex && userIndex <= hierarchy.indexOf(MemberRole.ADMIN);
}

export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function isInviteCodeExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

export function getGroupMemberCount(group: { members: any[] }): number {
  return group.members.length;
}

export function getGroupActiveMembers(group: { members: any[] }): number {
  // This would be calculated based on recent activity
  // For now, return total members
  return group.members.length;
}

export function getGroupLastActivity(group: { posts: any[] }): string {
  if (group.posts.length === 0) {
    return group.createdAt;
  }
  
  const latestPost = group.posts.reduce((latest, post) => {
    return new Date(post.updatedAt) > new Date(latest.updatedAt) ? post : latest;
  });
  
  return latestPost.updatedAt;
}
