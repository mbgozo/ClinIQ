import { z } from "zod";
export declare const RegisterSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
    institution: z.ZodString;
    year: z.ZodNumber;
    program: z.ZodEnum<["NURSING", "MIDWIFERY", "COMMUNITY_HEALTH"]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    password: string;
    institution: string;
    year: number;
    program: "COMMUNITY_HEALTH" | "NURSING" | "MIDWIFERY";
    email?: string | undefined;
    phone?: string | undefined;
}, {
    name: string;
    password: string;
    institution: string;
    year: number;
    program: "COMMUNITY_HEALTH" | "NURSING" | "MIDWIFERY";
    email?: string | undefined;
    phone?: string | undefined;
}>, {
    name: string;
    password: string;
    institution: string;
    year: number;
    program: "COMMUNITY_HEALTH" | "NURSING" | "MIDWIFERY";
    email?: string | undefined;
    phone?: string | undefined;
}, {
    name: string;
    password: string;
    institution: string;
    year: number;
    program: "COMMUNITY_HEALTH" | "NURSING" | "MIDWIFERY";
    email?: string | undefined;
    phone?: string | undefined;
}>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export * from "./notifications";
export * from "./gamification";
export * from "./mentors";
export * from "./resources";
export * from "./study-groups";
export * from "./chat";
export * from "./admin";
//# sourceMappingURL=index.d.ts.map