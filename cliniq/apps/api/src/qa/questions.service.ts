import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import type { CreateQuestionDto } from "./dto/create-question.dto";
import type { QuestionFilterDto } from "./dto/question-filter.dto";
import type { UpdateQuestionDto } from "./dto/update-question.dto";
import { SearchService } from "./search.service";
import { EmbeddingService } from "./embedding.service";

@Injectable()
export class QuestionsService {
  private prisma = new PrismaClient();
  constructor(
    private readonly searchService: SearchService,
    private readonly embeddingService: EmbeddingService
  ) {}

  async create(userId: string, dto: CreateQuestionDto) {
    const question = await this.prisma.question.create({
      data: {
        userId,
        categoryId: dto.categoryId,
        title: dto.title,
        body: dto.body,
        anonymous: dto.anonymous ?? false,
        tags: dto.tagIds?.length
          ? {
              create: dto.tagIds.map(tagId => ({
                tag: { connect: { id: tagId } }
              }))
            }
          : undefined
      },
      include: {
        user: true,
        category: true,
        tags: { include: { tag: true } }
      }
    });

    await this.embeddingService.embedQuestion(question.id, `${question.title}\n\n${question.body}`);
    return question;
  }

  async findAll(filters: QuestionFilterDto) {
    const page = Math.max(filters.page ?? 1, 1);
    const limit = Math.min(filters.limit ?? 20, 50);

    const where = {
      categoryId: filters.categoryId,
      answered: filters.answered,
      ...(filters.q
        ? {
            OR: [
              { title: { contains: filters.q, mode: "insensitive" as const } },
              { body: { contains: filters.q, mode: "insensitive" as const } }
            ]
          }
        : {})
    };

    const orderBy =
      filters.sort === "votes"
        ? [{ upvotes: "desc" as const }, { createdAt: "desc" as const }]
        : filters.sort === "unanswered"
          ? [{ answered: "asc" as const }, { createdAt: "desc" as const }]
          : [{ createdAt: "desc" as const }];

    const [data, total] = await Promise.all([
      this.prisma.question.findMany({
        where,
        include: {
          user: true,
          category: true,
          tags: { include: { tag: true } }
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      }),
      this.prisma.question.count({ where })
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        user: true,
        category: true,
        tags: { include: { tag: true } },
        answers: {
          include: { user: true },
          orderBy: [{ isAccepted: "desc" }, { upvotes: "desc" }, { createdAt: "asc" }]
        }
      }
    });

    if (!question) {
      throw new NotFoundException("Question not found");
    }

    await this.prisma.question.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    return question;
  }

  async search(filters: QuestionFilterDto) {
    if (!filters.q || !filters.q.trim()) {
      return this.findAll(filters);
    }
    const data = await this.searchService.search(filters.q, filters);
    return {
      data,
      meta: {
        page: filters.page ?? 1,
        limit: filters.limit ?? 20
      }
    };
  }

  async findSimilar(id: string, limit = 5) {
    return this.embeddingService.findSimilar(id, limit);
  }

  async update(
    id: string,
    actorId: string,
    role: string | undefined,
    dto: UpdateQuestionDto
  ) {
    const existing = await this.prisma.question.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("Question not found");
    }
    if (existing.userId !== actorId && role !== "MODERATOR" && role !== "ADMIN") {
      throw new ForbiddenException("Only owner/moderator can update this question");
    }
    return this.prisma.question.update({
      where: { id },
      data: dto
    });
  }

  async remove(id: string, actorId: string, role: string | undefined) {
    const existing = await this.prisma.question.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("Question not found");
    }
    if (existing.userId !== actorId && role !== "MODERATOR" && role !== "ADMIN") {
      throw new ForbiddenException("Only owner/moderator can delete this question");
    }
    await this.prisma.question.delete({ where: { id } });
    return { deleted: true };
  }
}

