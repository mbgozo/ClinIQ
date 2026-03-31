import { z } from "zod";

export const CreateQuestionDtoSchema = z.object({
  categoryId: z.string().min(1),
  title: z.string().min(5).max(120),
  body: z.string().min(10),
  anonymous: z.boolean().optional().default(false),
  tagIds: z.array(z.string()).optional().default([])
});

export type CreateQuestionDto = z.infer<typeof CreateQuestionDtoSchema>;

