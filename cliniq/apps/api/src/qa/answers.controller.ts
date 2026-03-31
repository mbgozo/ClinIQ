import { Body, Controller, Delete, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AnswersService } from "./answers.service";
import { CreateAnswerDtoSchema } from "./dto/create-answer.dto";
import { z } from "zod";

const UpdateAnswerSchema = z.object({
  body: z.string().min(5)
});

const VoteSchema = z.object({
  value: z.union([z.literal(1), z.literal(-1)])
});

@Controller()
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @UseGuards(JwtAuthGuard)
  @Post("questions/:id/answers")
  async create(@Param("id") questionId: string, @Request() req: any, @Body() body: unknown) {
    const dto = CreateAnswerDtoSchema.parse(body);
    const data = await this.answersService.create(questionId, req.user.sub, dto);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Patch("answers/:id")
  async update(@Param("id") answerId: string, @Request() req: any, @Body() body: unknown) {
    const dto = UpdateAnswerSchema.parse(body);
    const data = await this.answersService.update(answerId, req.user.sub, dto.body);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Delete("answers/:id")
  async remove(@Param("id") answerId: string, @Request() req: any) {
    const data = await this.answersService.remove(answerId, req.user.sub, req.user.role);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Post("answers/:id/accept")
  async accept(@Param("id") answerId: string, @Request() req: any) {
    const data = await this.answersService.accept(answerId, req.user.sub);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Post("answers/:id/vote")
  async vote(@Param("id") answerId: string, @Request() req: any, @Body() body: unknown) {
    const dto = VoteSchema.parse(body);
    const data = await this.answersService.vote(answerId, req.user.sub, dto.value);
    return { data };
  }
}

