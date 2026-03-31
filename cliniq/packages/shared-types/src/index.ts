import { z } from "zod";

export const RegisterSchema = z
  .object({
    name: z.string().min(2).max(80),
    email: z.string().email().optional(),
    phone: z
      .string()
      .regex(/^\+?[0-9]{10,15}$/)
      .optional(),
    password: z.string().min(8),
    institution: z.string().min(2),
    year: z.number().int().min(1).max(6),
    program: z.enum(["NURSING", "MIDWIFERY", "COMMUNITY_HEALTH"]),
  })
  .refine((d) => d.email || d.phone, {
    message: "Either email or phone is required",
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;

export * from "./notifications";
