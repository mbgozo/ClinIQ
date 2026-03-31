import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import type { CreateAnswerDto } from "./dto/create-answer.dto";
import { NotificationsService } from "../notifications/notifications.service";
import { GamificationService } from "../gamification/gamification.service";

@Injectable()
export class AnswersService {
  private prisma = new PrismaClient();

  constructor(
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
    @Inject(forwardRef(() => GamificationService))
    private readonly gamificationService: GamificationService,
  ) {}

  async create(questionId: string, userId: string, dto: CreateAnswerDto) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: { user: true },
    });

    if (!question) {
      throw new NotFoundException("Question not found");
    }

    const answer = await this.prisma.answer.create({
      data: {
        questionId,
        userId,
        body: dto.body,
      },
    });

    await this.prisma.question.update({
      where: { id: questionId },
      data: { answered: true },
    });

    // Trigger notification to question author (if not the same user)
    if (question.userId !== userId) {
      const answerer = await this.prisma.user.findUnique({ where: { id: userId } });
      await this.notificationsService.triggerAnswerPosted(
        question.userId,
        answerer?.name || "Anonymous",
        question.title,
        questionId,
        answer.id,
      );
    }

    // Check for badge awards
    await this.gamificationService.checkAndAwardBadges(userId);

    return answer;
  }

  async update(answerId: string, userId: string, body: string) {
    const answer = await this.prisma.answer.findUnique({ where: { id: answerId } });
    if (!answer) {
      throw new NotFoundException("Answer not found");
    }
    if (answer.userId !== userId) {
      throw new ForbiddenException("Only owner can update this answer");
    }
    return this.prisma.answer.update({
      where: { id: answerId },
      data: { body },
    });
  }

  async remove(answerId: string, userId: string, role?: string) {
    const answer = await this.prisma.answer.findUnique({ where: { id: answerId } });
    if (!answer) {
      throw new NotFoundException("Answer not found");
    }
    if (answer.userId !== userId && role !== "MODERATOR" && role !== "ADMIN") {
      throw new ForbiddenException("Only owner/moderator can delete this answer");
    }
    await this.prisma.answer.delete({ where: { id: answerId } });
    return { deleted: true };
  }

  async accept(answerId: string, actorId: string) {
    const answer = await this.prisma.answer.findUnique({ where: { id: answerId } });
    if (!answer) {
      throw new NotFoundException("Answer not found");
    }

    const question = await this.prisma.question.findUnique({ where: { id: answer.questionId } });
    if (!question) {
      throw new NotFoundException("Question not found");
    }
    if (question.userId !== actorId) {
      throw new ForbiddenException("Only question owner can accept an answer");
    }

    await this.prisma.answer.updateMany({
      where: { questionId: answer.questionId },
      data: { isAccepted: false },
    });

    const updatedAnswer = await this.prisma.answer.update({
      where: { id: answerId },
      data: { isAccepted: true },
    });

    // Trigger notification to answer author (if not the same user)
    if (answer.userId !== actorId) {
      await this.notificationsService.triggerAnswerAccepted(
        answer.userId,
        question.title,
        answer.questionId,
      );
    }

    // Check for badge awards for both answer author and question owner
    await this.gamificationService.checkAndAwardBadges(answer.userId);
    if (answer.userId !== actorId) {
      await this.gamificationService.checkAndAwardBadges(actorId);
    }

    return updatedAnswer;
  }

  async vote(answerId: string, userId: string, value: 1 | -1) {
    const answer = await this.prisma.answer.findUnique({ where: { id: answerId } });
    if (!answer) {
      throw new NotFoundException("Answer not found");
    }

    const existing = await this.prisma.vote.findUnique({
      where: { userId_answerId: { userId, answerId } },
    });

    if (!existing) {
      await this.prisma.vote.create({ data: { userId, answerId, value } });
      await this.prisma.answer.update({
        where: { id: answerId },
        data: value === 1 ? { upvotes: { increment: 1 } } : { downvotes: { increment: 1 } },
      });
    } else if (existing.value !== value) {
      await this.prisma.vote.update({
        where: { userId_answerId: { userId, answerId } },
        data: { value },
      });
      await this.prisma.answer.update({
        where: { id: answerId },
        data:
          value === 1
            ? { upvotes: { increment: 1 }, downvotes: { decrement: 1 } }
            : { upvotes: { decrement: 1 }, downvotes: { increment: 1 } },
      });
    }

    const updated = await this.prisma.answer.findUnique({
      where: { id: answerId },
      select: { upvotes: true, downvotes: true },
    });
    return {
      upvotes: updated?.upvotes ?? 0,
      downvotes: updated?.downvotes ?? 0,
    };
  }
}
