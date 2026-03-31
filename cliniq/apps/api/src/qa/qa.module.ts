import { Module } from "@nestjs/common";
import { QuestionsController } from "./questions.controller";
import { QuestionsService } from "./questions.service";
import { AnswersController } from "./answers.controller";
import { AnswersService } from "./answers.service";
import { SearchService } from "./search.service";
import { EmbeddingService } from "./embedding.service";

@Module({
  controllers: [QuestionsController, AnswersController],
  providers: [QuestionsService, AnswersService, SearchService, EmbeddingService],
  exports: [QuestionsService, AnswersService]
})
export class QaModule {}

