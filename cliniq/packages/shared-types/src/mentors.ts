import { z } from "zod";

export enum ExpertiseArea {
  MEDICAL_SURGICAL = "MEDICAL_SURGICAL",
  PEDIATRICS = "PEDIATRICS",
  OBSTETRICS_GYNECOLOGY = "OBSTETRICS_GYNECOLOGY",
  MENTAL_HEALTH = "MENTAL_HEALTH",
  COMMUNITY_HEALTH = "COMMUNITY_HEALTH",
  CRITICAL_CARE = "CRITICAL_CARE",
  EMERGENCY_NURSING = "EMERGENCY_NURSING",
  GERIATRICS = "GERIATRICS",
  PHARMACOLOGY = "PHARMACOLOGY",
  PATHOPHYSIOLOGY = "PATHOPHYSIOLOGY",
  NURSING_LEADERSHIP = "NURSING_LEADERSHIP",
  RESEARCH_METHODS = "RESEARCH_METHODS",
  HEALTH_ASSESSMENT = "HEALTH_ASSESSMENT",
}

export enum MentorshipStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum VerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export const MentorProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  bio: z.string(),
  experience: z.string(),
  expertiseAreas: z.array(z.nativeEnum(ExpertiseArea)),
  institution: z.string(),
  graduationYear: z.number(),
  currentRole: z.string(),
  linkedinUrl: z.string().optional(),
  availability: z.string(),
  languages: z.array(z.string()),
  verificationStatus: z.nativeEnum(VerificationStatus),
  verifiedAt: z.string().optional(),
  rejectionReason: z.string().optional(),
  totalAnswers: z.number(),
  acceptedAnswers: z.number(),
  acceptanceRate: z.number(),
  averageResponseTime: z.number(),
  mentorRating: z.number(),
  mentorshipCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type MentorProfile = z.infer<typeof MentorProfileSchema>;

export const CreateMentorProfileSchema = z.object({
  bio: z.string().min(50).max(500),
  experience: z.string().min(50).max(1000),
  expertiseAreas: z.array(z.nativeEnum(ExpertiseArea)).min(1).max(5),
  institution: z.string().min(2),
  graduationYear: z.number().int().min(1950).max(new Date().getFullYear()),
  currentRole: z.string().min(2).max(100),
  linkedinUrl: z.string().url().optional(),
  availability: z.string().min(10).max(200),
  languages: z.array(z.string()).min(1).max(5),
});

export type CreateMentorProfileInput = z.infer<typeof CreateMentorProfileSchema>;

export const MentorshipRequestSchema = z.object({
  id: z.string(),
  mentorId: z.string(),
  studentId: z.string(),
  topic: z.string(),
  description: z.string(),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH"]),
  preferredTime: z.string(),
  status: z.nativeEnum(MentorshipStatus),
  createdAt: z.string(),
  updatedAt: z.string(),
  scheduledAt: z.string().optional(),
  completedAt: z.string().optional(),
  rejectionReason: z.string().optional(),
  notes: z.string().optional(),
  studentRating: z.number().optional(),
  mentorRating: z.number().optional(),
});

export type MentorshipRequest = z.infer<typeof MentorshipRequestSchema>;

export const CreateMentorshipRequestSchema = z.object({
  mentorId: z.string(),
  topic: z.string().min(10).max(100),
  description: z.string().min(20).max(1000),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH"]),
  preferredTime: z.string().min(10).max(100),
});

export type CreateMentorshipRequestInput = z.infer<typeof CreateMentorshipRequestSchema>;

export const MentorFilterSchema = z.object({
  expertiseAreas: z.array(z.nativeEnum(ExpertiseArea)).optional(),
  institution: z.string().optional(),
  verificationStatus: z.nativeEnum(VerificationStatus).optional(),
  minRating: z.number().min(0).max(5).optional(),
  availability: z.string().optional(),
  languages: z.array(z.string()).optional(),
  page: z.number().default(1),
  limit: z.number().max(20).default(10),
});

export type MentorFilter = z.infer<typeof MentorFilterSchema>;

export const MentorshipRequestFilterSchema = z.object({
  status: z.nativeEnum(MentorshipStatus).optional(),
  mentorId: z.string().optional(),
  studentId: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().max(20).default(10),
});

export type MentorshipRequestFilter = z.infer<typeof MentorshipRequestFilterSchema>;

// Expertise area definitions
export const EXPERTISE_AREA_DEFINITIONS = {
  [ExpertiseArea.MEDICAL_SURGICAL]: {
    name: "Medical-Surgical Nursing",
    description: "Adult health, surgical care, and medical conditions",
    icon: "🏥",
    color: "#3B82F6",
  },
  [ExpertiseArea.PEDIATRICS]: {
    name: "Pediatrics",
    description: "Child health, pediatric conditions, and neonatal care",
    icon: "👶",
    color: "#10B981",
  },
  [ExpertiseArea.OBSTETRICS_GYNECOLOGY]: {
    name: "Obstetrics & Gynecology",
    description: "Maternal health, pregnancy, and women's health",
    icon: "🤱",
    color: "#EC4899",
  },
  [ExpertiseArea.MENTAL_HEALTH]: {
    name: "Mental Health Nursing",
    description: "Psychiatric care, mental health conditions, and therapy",
    icon: "🧠",
    color: "#8B5CF6",
  },
  [ExpertiseArea.COMMUNITY_HEALTH]: {
    name: "Community Health",
    description: "Public health, community nursing, and health promotion",
    icon: "🏘️",
    color: "#059669",
  },
  [ExpertiseArea.CRITICAL_CARE]: {
    name: "Critical Care",
    description: "ICU, emergency care, and life support systems",
    icon: "🚑",
    color: "#DC2626",
  },
  [ExpertiseArea.EMERGENCY_NURSING]: {
    name: "Emergency Nursing",
    description: "Emergency department, trauma care, and urgent conditions",
    icon: "🆘",
    color: "#F97316",
  },
  [ExpertiseArea.GERIATRICS]: {
    name: "Geriatrics",
    description: "Elderly care, geriatric conditions, and age-related health",
    icon: "👴",
    color: "#6366F1",
  },
  [ExpertiseArea.PHARMACOLOGY]: {
    name: "Pharmacology",
    description: "Medications, drug interactions, and pharmaceutical care",
    icon: "💊",
    color: "#84CC16",
  },
  [ExpertiseArea.PATHOPHYSIOLOGY]: {
    name: "Pathophysiology",
    description: "Disease processes, pathophysiology, and disease mechanisms",
    icon: "🔬",
    color: "#06B6D4",
  },
  [ExpertiseArea.NURSING_LEADERSHIP]: {
    name: "Nursing Leadership",
    description: "Nursing management, leadership, and healthcare administration",
    icon: "👔",
    color: "#7C3AED",
  },
  [ExpertiseArea.RESEARCH_METHODS]: {
    name: "Research Methods",
    description: "Nursing research, evidence-based practice, and academic writing",
    icon: "📊",
    color: "#0EA5E9",
  },
  [ExpertiseArea.HEALTH_ASSESSMENT]: {
    name: "Health Assessment",
    description: "Physical examination, health assessment, and clinical skills",
    icon: "🩺",
    color: "#14B8A6",
  },
};

// Verification requirements
export const VERIFICATION_REQUIREMENTS = {
  MIN_ANSWERS: 10,
  MIN_ACCEPTANCE_RATE: 0.6,
  MIN_REPUTATION: 250,
  REQUIRED_FIELDS: [
    "bio",
    "experience", 
    "expertiseAreas",
    "institution",
    "graduationYear",
    "currentRole",
    "availability",
    "languages"
  ],
  VERIFICATION_CRITERIA: [
    "Active contributor with 10+ answers",
    "60%+ answer acceptance rate",
    "250+ reputation points",
    "Complete professional profile",
    "Valid professional credentials"
  ]
};

// Mentorship session types
export enum MentorshipSessionType {
  ONE_ON_ONE = "ONE_ON_ONE",
  GROUP_SESSION = "GROUP_SESSION",
  STUDY_GROUP = "STUDY_GROUP",
  CAREER_GUIDANCE = "CAREER_GUIDANCE",
  CLINICAL_SUPPORT = "CLINICAL_SUPPORT",
}

export const SESSION_TYPE_DEFINITIONS = {
  [MentorshipSessionType.ONE_ON_ONE]: {
    name: "One-on-One Mentorship",
    description: "Personalized guidance and support",
    duration: "30-60 minutes",
    icon: "👥",
  },
  [MentorshipSessionType.GROUP_SESSION]: {
    name: "Group Session",
    description: "Small group learning and discussion",
    duration: "60-90 minutes",
    icon: "👥",
  },
  [MentorshipSessionType.STUDY_GROUP]: {
    name: "Study Group",
    description: "Collaborative study sessions",
    duration: "90-120 minutes",
    icon: "📚",
  },
  [MentorshipSessionType.CAREER_GUIDANCE]: {
    name: "Career Guidance",
    description: "Career planning and professional development",
    duration: "45-60 minutes",
    icon: "💼",
  },
  [MentorshipSessionType.CLINICAL_SUPPORT]: {
    name: "Clinical Support",
    description: "Clinical practice guidance and case review",
    duration: "60 minutes",
    icon: "🏥",
  },
};
