import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import type { QuestionFilterDto } from "./dto/question-filter.dto";

@Injectable()
export class SearchService {
  private prisma = new PrismaClient();

  // Full-text search with pg_trgm — raw query is allowed by spec here.
  async search(q: string, filters: QuestionFilterDto) {
    const page = Math.max(filters.page ?? 1, 1);
    const limit = Math.min(filters.limit ?? 20, 50);
    const offset = (page - 1) * limit;

    const rows = await this.prisma.$queryRaw<
      Array<Record<string, unknown>>
    >`SELECT q.*, similarity(q.title, ${q}) AS score
      FROM "Question" q
      WHERE q.title % ${q} OR q.body ILIKE ${"%" + q + "%"}
      ORDER BY score DESC, q."createdAt" DESC
      LIMIT ${limit} OFFSET ${offset}`;

    return rows;
  }
}

