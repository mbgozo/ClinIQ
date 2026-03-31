import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards
} from "@nestjs/common";
import { QuestionsService } from "./questions.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateQuestionDtoSchema } from "./dto/create-question.dto";
import { QuestionFilterSchema } from "./dto/question-filter.dto";
import { UpdateQuestionDtoSchema } from "./dto/update-question.dto";

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

  @Get("search")
  async search(@Query() query: Record<string, unknown>) {
    const filters = QuestionFilterSchema.parse(query);
    const result = await this.questionsService.search(filters);
    return { data: result.data, meta: result.meta };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const data = await this.questionsService.findById(id);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(@Param("id") id: string, @Request() req: any, @Body() body: unknown) {
    const dto = UpdateQuestionDtoSchema.parse(body);
    const data = await this.questionsService.update(id, req.user.sub, req.user.role, dto);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param("id") id: string, @Request() req: any) {
    const data = await this.questionsService.remove(id, req.user.sub, req.user.role);
    return { data };
  }

  @Get(":id/similar")
  async similar(@Param("id") id: string) {
    const data = await this.questionsService.findSimilar(id);
    return { data };
  }
}

