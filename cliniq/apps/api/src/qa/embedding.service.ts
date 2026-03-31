import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

type EmbeddingResponse = {
  data?: Array<{ embedding: number[] }>;
};

@Injectable()
export class EmbeddingService {
  private prisma = new PrismaClient();

  private async createEmbedding(text: string): Promise<number[] | null> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return null;
    }

    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text
      })
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as EmbeddingResponse;
    return json.data?.[0]?.embedding ?? null;
  }

  async embedQuestion(questionId: string, text: string) {
    const vector = await this.createEmbedding(text);
    if (!vector) {
      return;
    }

    await this.prisma.questionEmbedding.upsert({
      where: { questionId },
      create: { questionId },
      update: {}
    });

    await this.prisma.$executeRaw`UPDATE "QuestionEmbedding"
      SET embedding = ${JSON.stringify(vector)}::vector
      WHERE "questionId" = ${questionId}`;
  }

  async findSimilar(questionId: string, limit = 5) {
    const rows = await this.prisma.$queryRaw<
      Array<Record<string, unknown>>
    >`SELECT q.* FROM "Question" q
      JOIN "QuestionEmbedding" qe ON qe."questionId" = q.id
      WHERE q.id != ${questionId}
      ORDER BY qe.embedding <=> (
        SELECT embedding FROM "QuestionEmbedding" WHERE "questionId" = ${questionId}
      )
      LIMIT ${limit}`;

    return rows;
  }
}

