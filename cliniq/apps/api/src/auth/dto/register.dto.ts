import { RegisterSchema } from "@cliniq/shared-types";
import { z } from "zod";

export const RegisterDtoSchema = RegisterSchema;
export type RegisterDto = z.infer<typeof RegisterDtoSchema>;

