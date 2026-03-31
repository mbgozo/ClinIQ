import { z } from "zod";

export const LoginDtoSchema = z.object({
  emailOrPhone: z.string(),
  password: z.string().min(1)
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;

