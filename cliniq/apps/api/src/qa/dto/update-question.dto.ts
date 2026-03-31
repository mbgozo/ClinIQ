import { z } from "zod";

export const UpdateQuestionDtoSchema = z.object({
  title: z.string().min(5).max(120).optional(),
  body: z.string().min(10).optional(),
  categoryId: z.string().min(1).optional(),
  anonymous: z.boolean().optional(),
  answered: z.boolean().optional()
});

export type UpdateQuestionDto = z.infer<typeof UpdateQuestionDtoSchema>;

