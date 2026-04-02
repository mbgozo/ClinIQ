import { z } from "zod";
export declare enum ResourceType {
    DOCUMENT = "DOCUMENT",
    PRESENTATION = "PRESENTATION",
    VIDEO = "VIDEO",
    IMAGE = "IMAGE",
    AUDIO = "AUDIO",
    LINK = "LINK",
    STUDY_GUIDE = "STUDY_GUIDE",
    CHEAT_SHEET = "CHEAT_SHEET",
    CASE_STUDY = "CASE_STUDY",
    RESEARCH_PAPER = "RESEARCH_PAPER",
    CLINICAL_GUIDELINE = "CLINICAL_GUIDELINE"
}
export declare enum ResourceCategory {
    ANATOMY_PHYSIOLOGY = "ANATOMY_PHYSIOLOGY",
    PHARMACOLOGY = "PHARMACOLOGY",
    PATHOPHYSIOLOGY = "PATHOPHYSIOLOGY",
    MEDICAL_SURGICAL = "MEDICAL_SURGICAL",
    PEDIATRICS = "PEDIATRICS",
    OBSTETRICS_GYNECOLOGY = "OBSTETRICS_GYNECOLOGY",
    MENTAL_HEALTH = "MENTAL_HEALTH",
    COMMUNITY_HEALTH = "COMMUNITY_HEALTH",
    CRITICAL_CARE = "CRITICAL_CARE",
    EMERGENCY_NURSING = "EMERGENCY_NURSING",
    GERIATRICS = "GERIATRICS",
    NURSING_LEADERSHIP = "NURSING_LEADERSHIP",
    RESEARCH_METHODS = "RESEARCH_METHODS",
    HEALTH_ASSESSMENT = "HEALTH_ASSESSMENT",
    ETHICS_LEGAL = "ETHICS_LEGAL",
    NUTRITION = "NUTRITION",
    COMMUNICATION = "COMMUNICATION",
    EXAM_PREPARATION = "EXAM_PREPARATION"
}
export declare enum FlagStatus {
    PENDING = "PENDING",
    RESOLVED = "RESOLVED",
    DISMISSED = "DISMISSED"
}
export declare enum FlagEntityType {
    QUESTION = "QUESTION",
    ANSWER = "ANSWER",
    RESOURCE = "RESOURCE",
    GROUP_POST = "GROUP_POST"
}
export declare const ResourceSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    categoryId: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    fileRef: z.ZodOptional<z.ZodString>;
    fileType: z.ZodOptional<z.ZodString>;
    course: z.ZodOptional<z.ZodString>;
    year: z.ZodOptional<z.ZodNumber>;
    copyrightAck: z.ZodBoolean;
    downloads: z.ZodNumber;
    tags: z.ZodArray<z.ZodString, "many">;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    copyrightAck: boolean;
    downloads: number;
    tags: string[];
    url?: string | undefined;
    description?: string | undefined;
    categoryId?: string | undefined;
    fileRef?: string | undefined;
    fileType?: string | undefined;
    course?: string | undefined;
    year?: number | undefined;
}, {
    id: string;
    title: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    copyrightAck: boolean;
    downloads: number;
    tags: string[];
    url?: string | undefined;
    description?: string | undefined;
    categoryId?: string | undefined;
    fileRef?: string | undefined;
    fileType?: string | undefined;
    course?: string | undefined;
    year?: number | undefined;
}>;
export type Resource = z.infer<typeof ResourceSchema>;
export declare const CreateResourceSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    url: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    course: z.ZodOptional<z.ZodString>;
    year: z.ZodOptional<z.ZodNumber>;
    tags: z.ZodArray<z.ZodString, "many">;
    copyrightAck: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    copyrightAck: boolean;
    tags: string[];
    url?: string | undefined;
    categoryId?: string | undefined;
    course?: string | undefined;
    year?: number | undefined;
}, {
    title: string;
    description: string;
    copyrightAck: boolean;
    tags: string[];
    url?: string | undefined;
    categoryId?: string | undefined;
    course?: string | undefined;
    year?: number | undefined;
}>;
export type CreateResourceInput = z.infer<typeof CreateResourceSchema>;
export declare const ResourceFilterSchema: z.ZodObject<{
    categoryId: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof ResourceType>>;
    course: z.ZodOptional<z.ZodString>;
    year: z.ZodOptional<z.ZodNumber>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    userId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    type?: ResourceType | undefined;
    search?: string | undefined;
    userId?: string | undefined;
    categoryId?: string | undefined;
    course?: string | undefined;
    year?: number | undefined;
    tags?: string[] | undefined;
}, {
    type?: ResourceType | undefined;
    search?: string | undefined;
    page?: number | undefined;
    userId?: string | undefined;
    limit?: number | undefined;
    categoryId?: string | undefined;
    course?: string | undefined;
    year?: number | undefined;
    tags?: string[] | undefined;
}>;
export type ResourceFilter = z.infer<typeof ResourceFilterSchema>;
export declare const FlagSchema: z.ZodObject<{
    id: z.ZodString;
    entityType: z.ZodNativeEnum<typeof FlagEntityType>;
    entityId: z.ZodString;
    reporterId: z.ZodString;
    reason: z.ZodString;
    status: z.ZodNativeEnum<typeof FlagStatus>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    resolvedBy: z.ZodOptional<z.ZodString>;
    resolvedAt: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: FlagStatus;
    createdAt: string;
    updatedAt: string;
    entityType: FlagEntityType;
    entityId: string;
    reporterId: string;
    reason: string;
    notes?: string | undefined;
    resolvedBy?: string | undefined;
    resolvedAt?: string | undefined;
}, {
    id: string;
    status: FlagStatus;
    createdAt: string;
    updatedAt: string;
    entityType: FlagEntityType;
    entityId: string;
    reporterId: string;
    reason: string;
    notes?: string | undefined;
    resolvedBy?: string | undefined;
    resolvedAt?: string | undefined;
}>;
export type Flag = z.infer<typeof FlagSchema>;
export declare const CreateFlagSchema: z.ZodObject<{
    entityType: z.ZodNativeEnum<typeof FlagEntityType>;
    entityId: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    entityType: FlagEntityType;
    entityId: string;
    reason: string;
}, {
    entityType: FlagEntityType;
    entityId: string;
    reason: string;
}>;
export type CreateFlagInput = z.infer<typeof CreateFlagSchema>;
export declare const RESOURCE_TYPE_DEFINITIONS: {
    DOCUMENT: {
        name: string;
        description: string;
        icon: string;
        color: string;
        allowedFormats: string[];
        maxSize: number;
    };
    PRESENTATION: {
        name: string;
        description: string;
        icon: string;
        color: string;
        allowedFormats: string[];
        maxSize: number;
    };
    VIDEO: {
        name: string;
        description: string;
        icon: string;
        color: string;
        allowedFormats: string[];
        maxSize: number;
    };
    IMAGE: {
        name: string;
        description: string;
        icon: string;
        color: string;
        allowedFormats: string[];
        maxSize: number;
    };
    AUDIO: {
        name: string;
        description: string;
        icon: string;
        color: string;
        allowedFormats: string[];
        maxSize: number;
    };
    LINK: {
        name: string;
        description: string;
        icon: string;
        color: string;
        allowedFormats: never[];
        maxSize: number;
    };
    STUDY_GUIDE: {
        name: string;
        description: string;
        icon: string;
        color: string;
        allowedFormats: string[];
        maxSize: number;
    };
    CHEAT_SHEET: {
        name: string;
        description: string;
        icon: string;
        color: string;
        allowedFormats: string[];
        maxSize: number;
    };
    CASE_STUDY: {
        name: string;
        description: string;
        icon: string;
        color: string;
        allowedFormats: string[];
        maxSize: number;
    };
    RESEARCH_PAPER: {
        name: string;
        description: string;
        icon: string;
        color: string;
        allowedFormats: string[];
        maxSize: number;
    };
    CLINICAL_GUIDELINE: {
        name: string;
        description: string;
        icon: string;
        color: string;
        allowedFormats: string[];
        maxSize: number;
    };
};
export declare const CATEGORY_DEFINITIONS: {
    ANATOMY_PHYSIOLOGY: {
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
    ETHICS_LEGAL: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    NUTRITION: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    COMMUNICATION: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    EXAM_PREPARATION: {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
};
export declare const COMMON_TAGS: string[];
export declare function validateFileType(fileName: string, allowedFormats: string[]): boolean;
export declare function getFileType(fileName: string): ResourceType;
export declare function formatFileSize(bytes: number): string;
//# sourceMappingURL=resources.d.ts.map