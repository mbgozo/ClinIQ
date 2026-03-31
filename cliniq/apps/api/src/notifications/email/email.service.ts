import { Injectable, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private prisma = new PrismaClient();

  async sendNotificationEmail(
    to: string,
    subject: string,
    template: string,
    data: Record<string, any>,
  ) {
    // In development, just log the email
    if (process.env.NODE_ENV !== "production") {
      this.logger.log(`Email to ${to}: ${subject}`);
      this.logger.log(`Template: ${template}`);
      this.logger.log(`Data:`, data);
      return;
    }

    try {
      // TODO: Implement actual Postmark integration
      const templateId = this.getTemplateId(template);
      // const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
      // await client.sendEmailWithTemplate({
      //   From: process.env.POSTMARK_FROM_EMAIL,
      //   To: to,
      //   TemplateId: templateId,
      //   TemplateModel: data,
      // });

      this.logger.log(`Email sent successfully to ${to} with template ID ${templateId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  async sendAnswerPostedNotification(
    userEmail: string,
    answererName: string,
    questionTitle: string,
    questionLink: string,
  ) {
    await this.sendNotificationEmail(userEmail, "New answer on your question", "answer-posted", {
      answererName,
      questionTitle,
      questionLink,
    });
  }

  async sendAnswerAcceptedNotification(
    userEmail: string,
    questionTitle: string,
    questionLink: string,
  ) {
    await this.sendNotificationEmail(userEmail, "Your answer was accepted!", "answer-accepted", {
      questionTitle,
      questionLink,
    });
  }

  async sendBadgeEarnedNotification(userEmail: string, badgeType: string, description: string) {
    await this.sendNotificationEmail(
      userEmail,
      `You earned the ${badgeType} badge!`,
      "badge-earned",
      {
        badgeType,
        description,
      },
    );
  }

  async sendDigestEmail(
    userEmail: string,
    unansweredQuestions: Array<{
      title: string;
      category: string;
      link: string;
    }>,
  ) {
    await this.sendNotificationEmail(
      userEmail,
      "Daily ClinIQ Digest - Questions needing answers",
      "digest",
      {
        unansweredCount: unansweredQuestions.length,
        questions: unansweredQuestions,
      },
    );
  }

  private getTemplateId(templateName: string): number {
    // Map template names to Postmark template IDs
    const templateIds = {
      "answer-posted": 123456, // Replace with actual template ID
      "answer-accepted": 123457,
      "badge-earned": 123458,
      digest: 123459,
    };

    const templateId = templateIds[templateName as keyof typeof templateIds];
    if (!templateId) {
      throw new Error(`Unknown template: ${templateName}`);
    }

    return templateId;
  }

  async getUserEmailPreferences(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user?.email) {
      throw new Error("User email not found");
    }

    // TODO: Implement user notification preferences
    // For now, return default preferences
    return {
      email: user.email,
      preferences: {
        emailNotifications: true,
        digestEnabled: true,
        answerPosted: true,
        answerAccepted: true,
        questionUpvoted: true,
        mention: true,
        mentorReply: true,
        mentorRequest: true,
        badgeEarned: true,
        flagResolved: false,
      },
    };
  }
}
