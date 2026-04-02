import { z } from "zod";
export var ResourceType;
(function (ResourceType) {
    ResourceType["DOCUMENT"] = "DOCUMENT";
    ResourceType["PRESENTATION"] = "PRESENTATION";
    ResourceType["VIDEO"] = "VIDEO";
    ResourceType["IMAGE"] = "IMAGE";
    ResourceType["AUDIO"] = "AUDIO";
    ResourceType["LINK"] = "LINK";
    ResourceType["STUDY_GUIDE"] = "STUDY_GUIDE";
    ResourceType["CHEAT_SHEET"] = "CHEAT_SHEET";
    ResourceType["CASE_STUDY"] = "CASE_STUDY";
    ResourceType["RESEARCH_PAPER"] = "RESEARCH_PAPER";
    ResourceType["CLINICAL_GUIDELINE"] = "CLINICAL_GUIDELINE";
})(ResourceType || (ResourceType = {}));
export var ResourceCategory;
(function (ResourceCategory) {
    ResourceCategory["ANATOMY_PHYSIOLOGY"] = "ANATOMY_PHYSIOLOGY";
    ResourceCategory["PHARMACOLOGY"] = "PHARMACOLOGY";
    ResourceCategory["PATHOPHYSIOLOGY"] = "PATHOPHYSIOLOGY";
    ResourceCategory["MEDICAL_SURGICAL"] = "MEDICAL_SURGICAL";
    ResourceCategory["PEDIATRICS"] = "PEDIATRICS";
    ResourceCategory["OBSTETRICS_GYNECOLOGY"] = "OBSTETRICS_GYNECOLOGY";
    ResourceCategory["MENTAL_HEALTH"] = "MENTAL_HEALTH";
    ResourceCategory["COMMUNITY_HEALTH"] = "COMMUNITY_HEALTH";
    ResourceCategory["CRITICAL_CARE"] = "CRITICAL_CARE";
    ResourceCategory["EMERGENCY_NURSING"] = "EMERGENCY_NURSING";
    ResourceCategory["GERIATRICS"] = "GERIATRICS";
    ResourceCategory["NURSING_LEADERSHIP"] = "NURSING_LEADERSHIP";
    ResourceCategory["RESEARCH_METHODS"] = "RESEARCH_METHODS";
    ResourceCategory["HEALTH_ASSESSMENT"] = "HEALTH_ASSESSMENT";
    ResourceCategory["ETHICS_LEGAL"] = "ETHICS_LEGAL";
    ResourceCategory["NUTRITION"] = "NUTRITION";
    ResourceCategory["COMMUNICATION"] = "COMMUNICATION";
    ResourceCategory["EXAM_PREPARATION"] = "EXAM_PREPARATION";
})(ResourceCategory || (ResourceCategory = {}));
export var FlagStatus;
(function (FlagStatus) {
    FlagStatus["PENDING"] = "PENDING";
    FlagStatus["RESOLVED"] = "RESOLVED";
    FlagStatus["DISMISSED"] = "DISMISSED";
})(FlagStatus || (FlagStatus = {}));
export var FlagEntityType;
(function (FlagEntityType) {
    FlagEntityType["QUESTION"] = "QUESTION";
    FlagEntityType["ANSWER"] = "ANSWER";
    FlagEntityType["RESOURCE"] = "RESOURCE";
    FlagEntityType["GROUP_POST"] = "GROUP_POST";
})(FlagEntityType || (FlagEntityType = {}));
export const ResourceSchema = z.object({
    id: z.string(),
    userId: z.string(),
    categoryId: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    url: z.string().optional(),
    fileRef: z.string().optional(),
    fileType: z.string().optional(),
    course: z.string().optional(),
    year: z.number().optional(),
    copyrightAck: z.boolean(),
    downloads: z.number(),
    tags: z.array(z.string()),
    createdAt: z.string(),
    updatedAt: z.string(),
});
export const CreateResourceSchema = z.object({
    title: z.string().min(5).max(200),
    description: z.string().min(10).max(1000),
    url: z.string().url().optional(),
    categoryId: z.string().optional(),
    course: z.string().optional(),
    year: z.number().int().min(1950).max(new Date().getFullYear()).optional(),
    tags: z.array(z.string()).min(1).max(10),
    copyrightAck: z.boolean().refine(val => val === true, {
        message: "Copyright acknowledgment is required"
    }),
});
export const ResourceFilterSchema = z.object({
    categoryId: z.string().optional(),
    type: z.nativeEnum(ResourceType).optional(),
    course: z.string().optional(),
    year: z.number().optional(),
    tags: z.array(z.string()).optional(),
    userId: z.string().optional(),
    search: z.string().optional(),
    page: z.number().default(1),
    limit: z.number().max(20).default(10),
});
export const FlagSchema = z.object({
    id: z.string(),
    entityType: z.nativeEnum(FlagEntityType),
    entityId: z.string(),
    reporterId: z.string(),
    reason: z.string(),
    status: z.nativeEnum(FlagStatus),
    createdAt: z.string(),
    updatedAt: z.string(),
    resolvedBy: z.string().optional(),
    resolvedAt: z.string().optional(),
    notes: z.string().optional(),
});
export const CreateFlagSchema = z.object({
    entityType: z.nativeEnum(FlagEntityType),
    entityId: z.string(),
    reason: z.string().min(10).max(500),
});
// Resource type definitions
export const RESOURCE_TYPE_DEFINITIONS = {
    [ResourceType.DOCUMENT]: {
        name: "Document",
        description: "PDF, Word, and other document files",
        icon: "📄",
        color: "#3B82F6",
        allowedFormats: [".pdf", ".doc", ".docx", ".txt", ".rtf"],
        maxSize: 10 * 1024 * 1024, // 10MB
    },
    [ResourceType.PRESENTATION]: {
        name: "Presentation",
        description: "PowerPoint and presentation files",
        icon: "📊",
        color: "#10B981",
        allowedFormats: [".ppt", ".pptx", ".key"],
        maxSize: 20 * 1024 * 1024, // 20MB
    },
    [ResourceType.VIDEO]: {
        name: "Video",
        description: "Educational videos and recordings",
        icon: "🎥",
        color: "#EF4444",
        allowedFormats: [".mp4", ".avi", ".mov", ".wmv", ".webm"],
        maxSize: 100 * 1024 * 1024, // 100MB
    },
    [ResourceType.IMAGE]: {
        name: "Image",
        description: "Diagrams, charts, and visual aids",
        icon: "🖼️",
        color: "#F59E0B",
        allowedFormats: [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"],
        maxSize: 5 * 1024 * 1024, // 5MB
    },
    [ResourceType.AUDIO]: {
        name: "Audio",
        description: "Audio recordings and podcasts",
        icon: "🎵",
        color: "#8B5CF6",
        allowedFormats: [".mp3", ".wav", ".aac", ".m4a", ".ogg"],
        maxSize: 20 * 1024 * 1024, // 20MB
    },
    [ResourceType.LINK]: {
        name: "Link",
        description: "External websites and resources",
        icon: "🔗",
        color: "#6366F1",
        allowedFormats: [],
        maxSize: 0,
    },
    [ResourceType.STUDY_GUIDE]: {
        name: "Study Guide",
        description: "Comprehensive study materials",
        icon: "📚",
        color: "#059669",
        allowedFormats: [".pdf", ".doc", ".docx"],
        maxSize: 15 * 1024 * 1024, // 15MB
    },
    [ResourceType.CHEAT_SHEET]: {
        name: "Cheat Sheet",
        description: "Quick reference materials",
        icon: "📋",
        color: "#DC2626",
        allowedFormats: [".pdf", ".png", ".jpg"],
        maxSize: 2 * 1024 * 1024, // 2MB
    },
    [ResourceType.CASE_STUDY]: {
        name: "Case Study",
        description: "Clinical case studies and analyses",
        icon: "🔍",
        color: "#7C3AED",
        allowedFormats: [".pdf", ".doc", ".docx"],
        maxSize: 10 * 1024 * 1024, // 10MB
    },
    [ResourceType.RESEARCH_PAPER]: {
        name: "Research Paper",
        description: "Academic research and papers",
        icon: "📖",
        color: "#0EA5E9",
        allowedFormats: [".pdf", ".doc", ".docx"],
        maxSize: 10 * 1024 * 1024, // 10MB
    },
    [ResourceType.CLINICAL_GUIDELINE]: {
        name: "Clinical Guideline",
        description: "Medical and nursing guidelines",
        icon: "🏥",
        color: "#14B8A6",
        allowedFormats: [".pdf", ".doc", ".docx"],
        maxSize: 15 * 1024 * 1024, // 15MB
    },
};
// Category definitions
export const CATEGORY_DEFINITIONS = {
    [ResourceCategory.ANATOMY_PHYSIOLOGY]: {
        name: "Anatomy & Physiology",
        description: "Human anatomy, body systems, and physiological processes",
        icon: "🫀",
        color: "#3B82F6",
    },
    [ResourceCategory.PHARMACOLOGY]: {
        name: "Pharmacology",
        description: "Medications, drug actions, and pharmaceutical care",
        icon: "💊",
        color: "#10B981",
    },
    [ResourceCategory.PATHOPHYSIOLOGY]: {
        name: "Pathophysiology",
        description: "Disease processes and pathophysiological mechanisms",
        icon: "🔬",
        color: "#8B5CF6",
    },
    [ResourceCategory.MEDICAL_SURGICAL]: {
        name: "Medical-Surgical Nursing",
        description: "Adult health, surgical care, and medical conditions",
        icon: "🏥",
        color: "#EF4444",
    },
    [ResourceCategory.PEDIATRICS]: {
        name: "Pediatrics",
        description: "Child health, pediatric conditions, and neonatal care",
        icon: "👶",
        color: "#F59E0B",
    },
    [ResourceCategory.OBSTETRICS_GYNECOLOGY]: {
        name: "Obstetrics & Gynecology",
        description: "Maternal health, pregnancy, and women's health",
        icon: "🤱",
        color: "#EC4899",
    },
    [ResourceCategory.MENTAL_HEALTH]: {
        name: "Mental Health",
        description: "Psychiatric care, mental health conditions, and therapy",
        icon: "🧠",
        color: "#6366F1",
    },
    [ResourceCategory.COMMUNITY_HEALTH]: {
        name: "Community Health",
        description: "Public health, community nursing, and health promotion",
        icon: "🏘️",
        color: "#059669",
    },
    [ResourceCategory.CRITICAL_CARE]: {
        name: "Critical Care",
        description: "ICU, emergency care, and life support systems",
        icon: "🚑",
        color: "#DC2626",
    },
    [ResourceCategory.EMERGENCY_NURSING]: {
        name: "Emergency Nursing",
        description: "Emergency department, trauma care, and urgent conditions",
        icon: "🆘",
        color: "#F97316",
    },
    [ResourceCategory.GERIATRICS]: {
        name: "Geriatrics",
        description: "Elderly care, geriatric conditions, and age-related health",
        icon: "👴",
        color: "#7C3AED",
    },
    [ResourceCategory.NURSING_LEADERSHIP]: {
        name: "Nursing Leadership",
        description: "Nursing management, leadership, and healthcare administration",
        icon: "👔",
        color: "#0EA5E9",
    },
    [ResourceCategory.RESEARCH_METHODS]: {
        name: "Research Methods",
        description: "Nursing research, evidence-based practice, and academic writing",
        icon: "📊",
        color: "#14B8A6",
    },
    [ResourceCategory.HEALTH_ASSESSMENT]: {
        name: "Health Assessment",
        description: "Physical examination, health assessment, and clinical skills",
        icon: "🩺",
        color: "#84CC16",
    },
    [ResourceCategory.ETHICS_LEGAL]: {
        name: "Ethics & Legal",
        description: "Nursing ethics, legal issues, and professional standards",
        icon: "⚖️",
        color: "#6B7280",
    },
    [ResourceCategory.NUTRITION]: {
        name: "Nutrition",
        description: "Nutritional science, dietary guidelines, and patient nutrition",
        icon: "🥗",
        color: "#F97316",
    },
    [ResourceCategory.COMMUNICATION]: {
        name: "Communication",
        description: "Patient communication, therapeutic communication, and interpersonal skills",
        icon: "💬",
        color: "#06B6D4",
    },
    [ResourceCategory.EXAM_PREPARATION]: {
        name: "Exam Preparation",
        description: "Study materials, practice questions, and exam strategies",
        icon: "✍️",
        color: "#8B5CF6",
    },
};
// Common tags
export const COMMON_TAGS = [
    "NCLEX", "fundamentals", "assessment", "medication", "safety",
    "infection-control", "documentation", "leadership", "ethics",
    "pediatrics", "obstetrics", "mental-health", "critical-care",
    "pharmacology", "anatomy", "physiology", "pathophysiology",
    "evidence-based", "clinical-guidelines", "case-study",
    "study-guide", "cheat-sheet", "exam-prep", "review",
    "ghana", "nursing-council", "continuing-education"
];
// File validation
export function validateFileType(fileName, allowedFormats) {
    const extension = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));
    return allowedFormats.includes(extension);
}
export function getFileType(fileName) {
    const extension = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));
    const typeMap = {
        '.pdf': ResourceType.DOCUMENT,
        '.doc': ResourceType.DOCUMENT,
        '.docx': ResourceType.DOCUMENT,
        '.txt': ResourceType.DOCUMENT,
        '.rtf': ResourceType.DOCUMENT,
        '.ppt': ResourceType.PRESENTATION,
        '.pptx': ResourceType.PRESENTATION,
        '.key': ResourceType.PRESENTATION,
        '.mp4': ResourceType.VIDEO,
        '.avi': ResourceType.VIDEO,
        '.mov': ResourceType.VIDEO,
        '.wmv': ResourceType.VIDEO,
        '.webm': ResourceType.VIDEO,
        '.jpg': ResourceType.IMAGE,
        '.jpeg': ResourceType.IMAGE,
        '.png': ResourceType.IMAGE,
        '.gif': ResourceType.IMAGE,
        '.svg': ResourceType.IMAGE,
        '.webp': ResourceType.IMAGE,
        '.mp3': ResourceType.AUDIO,
        '.wav': ResourceType.AUDIO,
        '.aac': ResourceType.AUDIO,
        '.m4a': ResourceType.AUDIO,
        '.ogg': ResourceType.AUDIO,
    };
    return typeMap[extension] || ResourceType.DOCUMENT;
}
export function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
