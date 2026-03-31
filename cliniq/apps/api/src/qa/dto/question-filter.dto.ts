import { z } from "zod";

export const QuestionFilterSchema = z.object({
  q: z.string().optional(),
  categoryId: z.string().optional(),
  answered: z.boolean().optional(),
  institution: z.string().optional(),
  year: z.coerce.number().optional(),
  sort: z.enum(["newest", "votes", "unanswered"]).default("newest"),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().max(50).default(20)
});

export type QuestionFilterDto = z.infer<typeof QuestionFilterSchema>;

