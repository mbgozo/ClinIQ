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
        userId: data.mentorId, // data.mentorId is the User ID
        verifiedAt: { not: null },
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
        mentorId: data.mentorId,
        studentId,
        topic: data.topic,
        description: data.description,
        urgency: data.urgency,
        preferredTime: data.preferredTime,
        status: MentorshipStatus.PENDING,
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

    return this.mapToMentorshipRequest(request);
  }

  async getSentRequests(studentId: string, filters: MentorshipRequestFilter) {
    const { page = 1, limit = 10, status } = filters;
    const skip = (page - 1) * limit;

    const where = {
      studentId,
      ...(status && { status: status as string }),
    };

    const [requests, total] = await Promise.all([
      this.prisma.mentorRequest.findMany({
        where,
        include: {
          mentor: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          student: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
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
      requests: requests.map((request) => this.mapToMentorshipRequest(request)),
      total,
    };
  }

  async getReceivedRequests(mentorId: string, filters: MentorshipRequestFilter) {
    const { page = 1, limit = 10, status } = filters;
    const skip = (page - 1) * limit;

    const where = {
      mentorId,
      ...(status && { status: status as string }),
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
      requests: requests.map((request) => this.mapToMentorshipRequest(request)),
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

    if (request.status !== "PENDING") {
      throw new Error("Request cannot be accepted");
    }

    const updatedRequest = await this.prisma.mentorRequest.update({
      where: { id: requestId },
      data: {
        status: "ACCEPTED",
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
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Send notification to student
    await this.notificationsService.createNotification(
      request.studentId,
      "MENTOR_REQUEST" as any,
      "Mentorship Request Accepted",
      `${(updatedRequest as any).mentor.name} accepted your mentorship request on: ${request.topic}`,
      `/mentors/requests`,
    );

    // Update mentor's mentorship count
    await this.prisma.mentorProfile.update({
      where: { userId: mentorId },
      data: {
        mentorshipCount: { increment: 1 },
      },
    });

    this.logger.log(`Mentor ${mentorId} accepted request ${requestId}`);

    return this.mapToMentorshipRequest(updatedRequest);
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

    if (request.status !== "PENDING") {
      throw new Error("Request cannot be rejected");
    }

    const updatedRequest = await this.prisma.mentorRequest.update({
      where: { id: requestId },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
        updatedAt: new Date(),
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Send notification to student
    await this.notificationsService.createNotification(
      request.studentId,
      "MENTOR_REQUEST" as any,
      "Mentorship Request Updated",
      `${(updatedRequest as any).mentor.name} declined your mentorship request. Reason: ${reason}`,
      `/mentors/requests`,
    );

    this.logger.log(`Mentor ${mentorId} rejected request ${requestId}: ${reason}`);

    return this.mapToMentorshipRequest(updatedRequest);
  }

  async completeMentorshipRequest(requestId: string, userId: string): Promise<MentorshipRequest> {
    const request = await this.prisma.mentorRequest.findFirst({
      where: { id: requestId },
    });

    if (!request) {
      throw new Error("Request not found");
    }

    if (request.status !== "ACCEPTED") {
      throw new Error("Request cannot be completed");
    }

    // Only mentor or student can complete
    if (request.mentorId !== userId && request.studentId !== userId) {
      throw new Error("Unauthorized to complete this request");
    }

    const updatedRequest = await this.prisma.mentorRequest.update({
      where: { id: requestId },
      data: {
        status: "COMPLETED",
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
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Send completion notifications
    const otherUserId = request.mentorId === userId ? request.studentId : request.mentorId;
    const completerName =
      request.mentorId === userId ? (updatedRequest as any).mentor.name : (updatedRequest as any).student.name;

    await this.notificationsService.createNotification(
      otherUserId,
      "MENTOR_REQUEST" as any,
      "Mentorship Session Completed",
      `${completerName} marked the mentorship session as completed`,
      `/mentors/requests`,
    );

    this.logger.log(`Request ${requestId} completed by ${userId}`);

    return this.mapToMentorshipRequest(updatedRequest);
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

    if (request.status !== "COMPLETED") {
      throw new Error("Cannot rate an incomplete session");
    }

    const updateData = isMentor ? { mentorRating: rating } : { studentRating: rating };

    await this.prisma.mentorRequest.update({
      where: { id: requestId },
      data: updateData,
    });

    // Update mentor's overall rating
    if (!isMentor) { // Student rates mentor
      const allRatings = await this.prisma.mentorRequest.findMany({
        where: {
          mentorId: request.mentorId,
          status: "COMPLETED",
          studentRating: { not: null },
        },
        select: { studentRating: true },
      });

      const sum = allRatings.reduce((acc: number, curr: any) => acc + (curr.studentRating || 0), 0);
      const averageRating = allRatings.length > 0 ? sum / allRatings.length : 0;

      await this.prisma.mentorProfile.update({
        where: { userId: request.mentorId },
        data: { mentorRating: averageRating },
      });
    }

    this.logger.log(`Rated mentorship session ${requestId} by ${userId}: ${rating}`);
  }

  private mapToMentorshipRequest(request: any): MentorshipRequest {
    return {
      id: request.id,
      mentorId: request.mentorId,
      studentId: request.studentId,
      topic: request.topic,
      description: request.description,
      urgency: (request.urgency as any) || "MEDIUM",
      preferredTime: request.preferredTime || "",
      status: request.status as MentorshipStatus,
      createdAt: request.createdAt.toISOString(),
      updatedAt: request.updatedAt.toISOString(),
      scheduledAt: request.scheduledAt?.toISOString() || undefined,
      completedAt: request.completedAt?.toISOString() || undefined,
      rejectionReason: request.rejectionReason || undefined,
      notes: request.notes || undefined,
      studentRating: request.studentRating || undefined,
      mentorRating: request.mentorRating || undefined,
    };
  }
}
