import { z } from "zod";

export const CreateAnswerDtoSchema = z.object({
  body: z.string().min(5)
});

export type CreateAnswerDto = z.infer<typeof CreateAnswerDtoSchema>;

