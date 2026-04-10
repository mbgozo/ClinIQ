import { Injectable, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private prisma = new PrismaClient();
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

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
      // Basic HTML rendering based on template data
      const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${subject}</h2>
          <p><strong>Template:</strong> ${template}</p>
          <pre style="background: #f4f4f4; padding: 15px; border-radius: 5px;">${JSON.stringify(data, null, 2)}</pre>
          <br/>
          <p style="color: #666; font-size: 12px;">Sent via ClinIQ Notifications</p>
        </div>
      `;

      await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: to,
        subject: subject,
        html: htmlContent,
      });

      this.logger.log(`Email sent successfully to ${to} for template ${template}`);
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
