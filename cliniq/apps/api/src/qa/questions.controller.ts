import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from "@nestjs/common";
import { QuestionsService } from "./questions.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateQuestionDtoSchema } from "./dto/create-question.dto";
import { QuestionFilterSchema } from "./dto/question-filter.dto";

@Controller("questions")
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: any, @Body() body: unknown) {
    const dto = CreateQuestionDtoSchema.parse(body);
    const data = await this.questionsService.create(req.user.sub, dto);
    return { data };
  }

  @Get()
  async findAll(@Query() query: Record<string, unknown>) {
    const filters = QuestionFilterSchema.parse(query);
    const result = await this.questionsService.findAll(filters);
    return { data: result.data, meta: result.meta };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const data = await this.questionsService.findById(id);
    return { data };
  }
}

