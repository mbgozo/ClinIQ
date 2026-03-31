import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import {
  MentorshipRequest,
  CreateMentorshipRequestInput,
  MentorshipRequestFilter,
  MentorshipStatus,
} from "@cliniq/shared-types";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class MentorshipService {
  private readonly logger = new Logger(MentorshipService.name);
  private prisma = new PrismaClient();

  constructor(
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  async createMentorshipRequest(
    studentId: string,
    data: CreateMentorshipRequestInput,
  ): Promise<MentorshipRequest> {
    // Check if mentor exists and is verified
    const mentor = await this.prisma.mentorProfile.findFirst({
      where: {
        id: data.mentorId,
        verifiedAt: { not: null }, // Verified mentors have verifiedAt set
      },
    });

    if (!mentor) {
      throw new Error("Mentor not found or not verified");
    }

    // Check if student already has a pending request with this mentor
    const existingRequest = await this.prisma.mentorRequest.findFirst({
      where: {
        mentorId: data.mentorId,
        studentId,
        status: "PENDING",
      },
    });

    if (existingRequest) {
      throw new Error("You already have a pending request with this mentor");
    }

    const request = await this.prisma.mentorRequest.create({
      data: {
        ...data,
        studentId,
        status: MentorshipStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Send notification to mentor
    await this.notificationsService.createNotification(
      data.mentorId,
      "MENTOR_REQUEST" as any,
      "New Mentorship Request",
      `A student requested mentorship on: ${data.topic}`,
      `/mentors/requests`,
    );

    this.logger.log(`Created mentorship request from ${studentId} to mentor ${data.mentorId}`);

    return {
      ...request,
      createdAt: request.createdAt.toISOString(),
      updatedAt: request.updatedAt.toISOString(),
      scheduledAt: request.scheduledAt?.toISOString() || null,
      completedAt: request.completedAt?.toISOString() || null,
    };
  }

  async getSentRequests(studentId: string, filters: MentorshipRequestFilter) {
    const { page = 1, limit = 10, status } = filters;
    const skip = (page - 1) * limit;

    const where = {
      studentId,
      ...(status && { status }),
    };

    const [requests, total] = await Promise.all([
      this.prisma.mentorRequest.findMany({
        where,
        include: {
          mentor: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.mentorRequest.count({ where }),
    ]);

    return {
      requests: requests.map((request) => ({
        ...request,
        createdAt: request.createdAt.toISOString(),
        updatedAt: request.updatedAt.toISOString(),
        scheduledAt: request.scheduledAt?.toISOString() || null,
        completedAt: request.completedAt?.toISOString() || null,
      })),
      total,
    };
  }

  async getReceivedRequests(mentorId: string, filters: MentorshipRequestFilter) {
    const { page = 1, limit = 10, status } = filters;
    const skip = (page - 1) * limit;

    const where = {
      mentorId,
      ...(status && { status }),
    };

    const [requests, total] = await Promise.all([
      this.prisma.mentorRequest.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              institution: true,
              program: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.mentorRequest.count({ where }),
    ]);

    return {
      requests: requests.map((request) => ({
        ...request,
        createdAt: request.createdAt.toISOString(),
        updatedAt: request.updatedAt.toISOString(),
        scheduledAt: request.scheduledAt?.toISOString() || null,
        completedAt: request.completedAt?.toISOString() || null,
      })),
      total,
    };
  }

  async acceptMentorshipRequest(requestId: string, mentorId: string): Promise<MentorshipRequest> {
    const request = await this.prisma.mentorRequest.findFirst({
      where: { id: requestId, mentorId },
    });

    if (!request) {
      throw new Error("Request not found");
    }

    if (request.status !== MentorshipStatus.PENDING) {
      throw new Error("Request cannot be accepted");
    }

    const updatedRequest = await this.prisma.mentorRequest.update({
      where: { id: requestId },
      data: {
        status: MentorshipStatus.ACCEPTED,
        updatedAt: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        mentor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    // Send notification to student
    await this.notificationsService.createNotification(
      request.studentId,
      "MENTOR_REQUEST" as any,
      "Mentorship Request Accepted",
      `${updatedRequest.mentor.user.name} accepted your mentorship request on: ${request.topic}`,
      `/mentors/requests`,
    );

    // Update mentor's mentorship count
    await this.prisma.mentorProfile.update({
      where: { id: mentorId },
      data: {
        mentorshipCount: { increment: 1 },
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Mentor ${mentorId} accepted request ${requestId}`);

    return {
      ...updatedRequest,
      createdAt: updatedRequest.createdAt.toISOString(),
      updatedAt: updatedRequest.updatedAt.toISOString(),
      scheduledAt: updatedRequest.scheduledAt?.toISOString() || null,
      completedAt: updatedRequest.completedAt?.toISOString() || null,
    };
  }

  async rejectMentorshipRequest(
    requestId: string,
    reason: string,
    mentorId: string,
  ): Promise<MentorshipRequest> {
    const request = await this.prisma.mentorRequest.findFirst({
      where: { id: requestId, mentorId },
    });

    if (!request) {
      throw new Error("Request not found");
    }

    if (request.status !== MentorshipStatus.PENDING) {
      throw new Error("Request cannot be rejected");
    }

    const updatedRequest = await this.prisma.mentorRequest.update({
      where: { id: requestId },
      data: {
        status: MentorshipStatus.REJECTED,
        rejectionReason: reason,
        updatedAt: new Date(),
      },
      include: {
        mentor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    // Send notification to student
    await this.notificationsService.createNotification(
      request.studentId,
      "MENTOR_REQUEST" as any,
      "Mentorship Request Updated",
      `${updatedRequest.mentor.user.name} declined your mentorship request. Reason: ${reason}`,
      `/mentors/requests`,
    );

    this.logger.log(`Mentor ${mentorId} rejected request ${requestId}: ${reason}`);

    return {
      ...updatedRequest,
      createdAt: updatedRequest.createdAt.toISOString(),
      updatedAt: updatedRequest.updatedAt.toISOString(),
      scheduledAt: updatedRequest.scheduledAt?.toISOString() || null,
      completedAt: updatedRequest.completedAt?.toISOString() || null,
    };
  }

  async completeMentorshipRequest(requestId: string, userId: string): Promise<MentorshipRequest> {
    const request = await this.prisma.mentorRequest.findFirst({
      where: { id: requestId },
    });

    if (!request) {
      throw new Error("Request not found");
    }

    if (request.status !== MentorshipStatus.ACCEPTED) {
      throw new Error("Request cannot be completed");
    }

    // Only mentor or student can complete
    if (request.mentorId !== userId && request.studentId !== userId) {
      throw new Error("Unauthorized to complete this request");
    }

    const updatedRequest = await this.prisma.mentorRequest.update({
      where: { id: requestId },
      data: {
        status: MentorshipStatus.COMPLETED,
        completedAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        mentor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    // Send completion notifications
    const otherUserId = request.mentorId === userId ? request.studentId : request.mentorId;
    const completerName =
      request.mentorId === userId ? updatedRequest.mentor.user.name : updatedRequest.student.name;

    await this.notificationsService.createNotification(
      otherUserId,
      "MENTOR_REQUEST" as any,
      "Mentorship Session Completed",
      `${completerName} marked the mentorship session as completed`,
      `/mentors/requests`,
    );

    this.logger.log(`Request ${requestId} completed by ${userId}`);

    return {
      ...updatedRequest,
      createdAt: updatedRequest.createdAt.toISOString(),
      updatedAt: updatedRequest.updatedAt.toISOString(),
      scheduledAt: updatedRequest.scheduledAt?.toISOString() || null,
      completedAt: updatedRequest.completedAt.toISOString(),
    };
  }

  async rateMentorshipSession(
    requestId: string,
    rating: number,
    userId: string,
    isMentor: boolean,
  ) {
    const request = await this.prisma.mentorRequest.findFirst({
      where: { id: requestId },
    });

    if (!request) {
      throw new Error("Request not found");
    }

    if (request.status !== MentorshipStatus.COMPLETED) {
      throw new Error("Cannot rate an incomplete session");
    }

    const updateData = isMentor ? { mentorRating: rating } : { studentRating: rating };

    await this.prisma.mentorRequest.update({
      where: { id: requestId },
      data: updateData,
    });

    // Update mentor's overall rating
    if (isMentor) {
      const allRatings = await this.prisma.mentorRequest.findMany({
        where: {
          mentorId: request.mentorId,
          status: MentorshipStatus.COMPLETED,
          studentRating: { not: null },
        },
        select: { studentRating: true },
      });

      const averageRating =
        allRatings.reduce((sum, r) => sum + r.studentRating!, 0) / allRatings.length;

      await this.prisma.mentorProfile.update({
        where: { id: request.mentorId },
        data: { mentorRating: averageRating },
      });
    }

    this.logger.log(`Rated mentorship session ${requestId} by ${userId}: ${rating}`);
  }
}
