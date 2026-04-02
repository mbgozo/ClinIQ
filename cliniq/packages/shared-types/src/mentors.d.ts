import { z } from "zod";
export declare enum ExpertiseArea {
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
    HEALTH_ASSESSMENT = "HEALTH_ASSESSMENT"
}
export declare enum MentorshipStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare enum VerificationStatus {
    PENDING = "PENDING",
    VERIFIED = "VERIFIED",
    REJECTED = "REJECTED"
}
export declare const MentorProfileSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    bio: z.ZodString;
    experience: z.ZodString;
    expertiseAreas: z.ZodArray<z.ZodNativeEnum<typeof ExpertiseArea>, "many">;
    institution: z.ZodString;
    graduationYear: z.ZodNumber;
    currentRole: z.ZodString;
    linkedinUrl: z.ZodOptional<z.ZodString>;
    availability: z.ZodString;
    languages: z.ZodArray<z.ZodString, "many">;
    verificationStatus: z.ZodNativeEnum<typeof VerificationStatus>;
    verifiedAt: z.ZodOptional<z.ZodString>;
    rejectionReason: z.ZodOptional<z.ZodString>;
    totalAnswers: z.ZodNumber;
    acceptedAnswers: z.ZodNumber;
    acceptanceRate: z.ZodNumber;
    averageResponseTime: z.ZodNumber;
    mentorRating: z.ZodNumber;
    mentorshipCount: z.ZodNumber;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    createdAt: string;
    bio: string;
    experience: string;
    expertiseAreas: ExpertiseArea[];
    institution: string;
    graduationYear: number;
    currentRole: string;
    availability: string;
    languages: string[];
    verificationStatus: VerificationStatus;
    totalAnswers: number;
    acceptedAnswers: number;
    acceptanceRate: number;
    averageResponseTime: number;
    mentorRating: number;
    mentorshipCount: number;
    updatedAt: string;
    linkedinUrl?: string | undefined;
    verifiedAt?: string | undefined;
    rejectionReason?: string | undefined;
}, {
    id: string;
    userId: string;
    createdAt: string;
    bio: string;
    experience: string;
    expertiseAreas: ExpertiseArea[];
    institution: string;
    graduationYear: number;
    currentRole: string;
    availability: string;
    languages: string[];
    verificationStatus: VerificationStatus;
    totalAnswers: number;
    acceptedAnswers: number;
    acceptanceRate: number;
    averageResponseTime: number;
    mentorRating: number;
    mentorshipCount: number;
    updatedAt: string;
    linkedinUrl?: string | undefined;
    verifiedAt?: string | undefined;
    rejectionReason?: string | undefined;
}>;
export type MentorProfile = z.infer<typeof MentorProfileSchema>;
export declare const CreateMentorProfileSchema: z.ZodObject<{
    bio: z.ZodString;
    experience: z.ZodString;
    expertiseAreas: z.ZodArray<z.ZodNativeEnum<typeof ExpertiseArea>, "many">;
    institution: z.ZodString;
    graduationYear: z.ZodNumber;
    currentRole: z.ZodString;
    linkedinUrl: z.ZodOptional<z.ZodString>;
    availability: z.ZodString;
    languages: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    bio: string;
    experience: string;
    expertiseAreas: ExpertiseArea[];
    institution: string;
    graduationYear: number;
    currentRole: string;
    availability: string;
    languages: string[];
    linkedinUrl?: string | undefined;
}, {
    bio: string;
    experience: string;
    expertiseAreas: ExpertiseArea[];
    institution: string;
    graduationYear: number;
    currentRole: string;
    availability: string;
    languages: string[];
    linkedinUrl?: string | undefined;
}>;
export type CreateMentorProfileInput = z.infer<typeof CreateMentorProfileSchema>;
export declare const MentorshipRequestSchema: z.ZodObject<{
    id: z.ZodString;
    mentorId: z.ZodString;
    studentId: z.ZodString;
    topic: z.ZodString;
    description: z.ZodString;
    urgency: z.ZodEnum<["LOW", "MEDIUM", "HIGH"]>;
    preferredTime: z.ZodString;
    status: z.ZodNativeEnum<typeof MentorshipStatus>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    scheduledAt: z.ZodOptional<z.ZodString>;
    completedAt: z.ZodOptional<z.ZodString>;
    rejectionReason: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    studentRating: z.ZodOptional<z.ZodNumber>;
    mentorRating: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: MentorshipStatus;
    createdAt: string;
    description: string;
    updatedAt: string;
    mentorId: string;
    studentId: string;
    topic: string;
    urgency: "LOW" | "MEDIUM" | "HIGH";
    preferredTime: string;
    rejectionReason?: string | undefined;
    mentorRating?: number | undefined;
    scheduledAt?: string | undefined;
    completedAt?: string | undefined;
    notes?: string | undefined;
    studentRating?: number | undefined;
}, {
    id: string;
    status: MentorshipStatus;
    createdAt: string;
    description: string;
    updatedAt: string;
    mentorId: string;
    studentId: string;
    topic: string;
    urgency: "LOW" | "MEDIUM" | "HIGH";
    preferredTime: string;
    rejectionReason?: string | undefined;
    mentorRating?: number | undefined;
    scheduledAt?: string | undefined;
    completedAt?: string | undefined;
    notes?: string | undefined;
    studentRating?: number | undefined;
}>;
export type MentorshipRequest = z.infer<typeof MentorshipRequestSchema>;
export declare const CreateMentorshipRequestSchema: z.ZodObject<{
    mentorId: z.ZodString;
    topic: z.ZodString;
    description: z.ZodString;
    urgency: z.ZodEnum<["LOW", "MEDIUM", "HIGH"]>;
    preferredTime: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    mentorId: string;
    topic: string;
    urgency: "LOW" | "MEDIUM" | "HIGH";
    preferredTime: string;
}, {
    description: string;
    mentorId: string;
    topic: string;
    urgency: "LOW" | "MEDIUM" | "HIGH";
    preferredTime: string;
}>;
export type CreateMentorshipRequestInput = z.infer<typeof CreateMentorshipRequestSchema>;
export declare const MentorFilterSchema: z.ZodObject<{
    expertiseAreas: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof ExpertiseArea>, "many">>;
    institution: z.ZodOptional<z.ZodString>;
    verificationStatus: z.ZodOptional<z.ZodNativeEnum<typeof VerificationStatus>>;
    minRating: z.ZodOptional<z.ZodNumber>;
    availability: z.ZodOptional<z.ZodString>;
    languages: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    expertiseAreas?: ExpertiseArea[] | undefined;
    institution?: string | undefined;
    availability?: string | undefined;
    languages?: string[] | undefined;
    verificationStatus?: VerificationStatus | undefined;
    minRating?: number | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    expertiseAreas?: ExpertiseArea[] | undefined;
    institution?: string | undefined;
    availability?: string | undefined;
    languages?: string[] | undefined;
    verificationStatus?: VerificationStatus | undefined;
    minRating?: number | undefined;
}>;
export type MentorFilter = z.infer<typeof MentorFilterSchema>;
export declare const MentorshipRequestFilterSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodNativeEnum<typeof MentorshipStatus>>;
    mentorId: z.ZodOptional<z.ZodString>;
    studentId: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: MentorshipStatus | undefined;
    mentorId?: string | undefined;
    studentId?: string | undefined;
}, {
    status?: MentorshipStatus | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    mentorId?: string | undefined;
    studentId?: string | undefined;
}>;
export type MentorshipRequestFilter = z.infer<typeof MentorshipRequestFilterSchema>;
export declare const EXPERTISE_AREA_DEFINITIONS: {
    MEDICAL_SURGICAL: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    PEDIATRICS: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    OBSTETRICS_GYNECOLOGY: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    MENTAL_HEALTH: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    COMMUNITY_HEALTH: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    CRITICAL_CARE: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    EMERGENCY_NURSING: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    GERIATRICS: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    PHARMACOLOGY: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    PATHOPHYSIOLOGY: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    NURSING_LEADERSHIP: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    RESEARCH_METHODS: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    HEALTH_ASSESSMENT: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
};
export declare const VERIFICATION_REQUIREMENTS: {
    MIN_ANSWERS: number;
    MIN_ACCEPTANCE_RATE: number;
    MIN_REPUTATION: number;
    REQUIRED_FIELDS: string[];
    VERIFICATION_CRITERIA: string[];
};
export declare enum MentorshipSessionType {
    ONE_ON_ONE = "ONE_ON_ONE",
    GROUP_SESSION = "GROUP_SESSION",
    STUDY_GROUP = "STUDY_GROUP",
    CAREER_GUIDANCE = "CAREER_GUIDANCE",
    CLINICAL_SUPPORT = "CLINICAL_SUPPORT"
}
export declare const SESSION_TYPE_DEFINITIONS: {
    ONE_ON_ONE: {
        name: string;
        description: string;
        duration: string;
        icon: string;
    };
    GROUP_SESSION: {
        name: string;
        description: string;
        duration: string;
        icon: string;
    };
    STUDY_GROUP: {
        name: string;
        description: string;
        duration: string;
        icon: string;
    };
    CAREER_GUIDANCE: {
        name: string;
        description: string;
        duration: string;
        icon: string;
    };
    CLINICAL_SUPPORT: {
        name: string;
        description: string;
        duration: string;
        icon: string;
    };
};
//# sourceMappingURL=mentors.d.ts.map