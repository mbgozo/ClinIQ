import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { 
  MentorProfile, 
  CreateMentorProfileInput, 
  MentorFilter, 
  VerificationStatus,
  ExpertiseArea,
  VERIFICATION_REQUIREMENTS
} from '@cliniq/shared-types';
import { NotificationsService } from '../notifications/notifications.service';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class MentorsService {
  private readonly logger = new Logger(MentorsService.name);
  private prisma = new PrismaClient();

  constructor(
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
    @Inject(forwardRef(() => GamificationService))
    private readonly gamificationService: GamificationService,
  ) {}

  async getMentors(filters: MentorFilter) {
    const { page = 1, limit = 10, ...filterOptions } = filters;
    const skip = (page - 1) * limit;

    const where = {
      ...(filterOptions.expertiseAreas && {
        expertiseAreas: {
          hasSome: filterOptions.expertiseAreas
        }
      }),
      ...(filterOptions.institution && {
        institution: { contains: filterOptions.institution, mode: 'insensitive' }
      }),
      ...(filterOptions.verificationStatus && {
        verificationStatus: filterOptions.verificationStatus
      }),
      ...(filterOptions.minRating && {
        mentorRating: { gte: filterOptions.minRating }
      }),
      ...(filterOptions.availability && {
        availability: { contains: filterOptions.availability, mode: 'insensitive' }
      }),
      ...(filterOptions.languages && {
        languages: {
          hasSome: filterOptions.languages
        }
      }),
    };

    const [mentors, total] = await Promise.all([
      this.prisma.mentorProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              institution: true,
              program: true,
            }
          }
        },
        orderBy: [
          { verificationStatus: 'desc' }, // Verified mentors first
          { mentorRating: 'desc' },
          { mentorshipCount: 'desc' }
        ],
        skip,
        take: limit,
      }),
      this.prisma.mentorProfile.count({ where })
    ]);

    return {
      mentors: mentors.map(mentor => ({
        ...mentor,
        createdAt: mentor.createdAt.toISOString(),
        updatedAt: mentor.updatedAt.toISOString(),
        verifiedAt: mentor.verifiedAt?.toISOString() || null,
      })),
      total,
    };
  }

  async getMentorProfile(userId: string): Promise<MentorProfile | null> {
    const profile = await this.prisma.mentorProfile.findFirst({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
            program: true,
          }
        }
      }
    });

    if (!profile) return null;

    return {
      ...profile,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
      verifiedAt: profile.verifiedAt?.toISOString() || null,
    };
  }

  async createMentorProfile(userId: string, data: CreateMentorProfileInput): Promise<MentorProfile> {
    // Check if user already has a profile
    const existingProfile = await this.prisma.mentorProfile.findFirst({
      where: { userId }
    });

    if (existingProfile) {
      throw new Error('User already has a mentor profile');
    }

    // Check if user meets verification requirements
    const canAutoVerify = await this.checkVerificationEligibility(userId);

    const profile = await this.prisma.mentorProfile.create({
      data: {
        ...data,
        userId,
        verificationStatus: canAutoVerify ? VerificationStatus.VERIFIED : VerificationStatus.PENDING,
        verifiedAt: canAutoVerify ? new Date() : null,
        totalAnswers: 0,
        acceptedAnswers: 0,
        acceptanceRate: 0,
        averageResponseTime: 0,
        mentorRating: 0,
        mentorshipCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
            program: true,
          }
        }
      }
    });

    // If auto-verified, check for badges
    if (canAutoVerify) {
      await this.gamificationService.checkAndAwardBadges(userId);
    }

    this.logger.log(`Created mentor profile for user ${userId} with status ${profile.verificationStatus}`);

    return {
      ...profile,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
      verifiedAt: profile.verifiedAt?.toISOString() || null,
    };
  }

  async updateMentorProfile(userId: string, data: Partial<CreateMentorProfileInput>): Promise<MentorProfile> {
    const profile = await this.prisma.mentorProfile.update({
      where: { userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
            program: true,
          }
        }
      }
    });

    return {
      ...profile,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
      verifiedAt: profile.verifiedAt?.toISOString() || null,
    };
  }

  async getMentorById(mentorId: string) {
    const mentor = await this.prisma.mentorProfile.findFirst({
      where: { id: mentorId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
            program: true,
          }
        }
      }
    });

    if (!mentor) {
      throw new Error('Mentor not found');
    }

    return {
      ...mentor,
      createdAt: mentor.createdAt.toISOString(),
      updatedAt: mentor.updatedAt.toISOString(),
      verifiedAt: mentor.verifiedAt?.toISOString() || null,
    };
  }

  async verifyMentor(mentorId: string, adminId: string): Promise<MentorProfile> {
    const mentor = await this.prisma.mentorProfile.update({
      where: { id: mentorId },
      data: {
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
            program: true,
          }
        }
      }
    });

    // Send notification to mentor
    await this.notificationsService.createNotification(
      mentor.userId,
      'MENTOR_REQUEST' as any,
      'Mentor Profile Verified!',
      'Your mentor profile has been verified. You can now receive mentorship requests.',
      '/mentors/profile'
    );

    // Check for badges
    await this.gamificationService.checkAndAwardBadges(mentor.userId);

    this.logger.log(`Mentor ${mentorId} verified by admin ${adminId}`);

    return {
      ...mentor,
      createdAt: mentor.createdAt.toISOString(),
      updatedAt: mentor.updatedAt.toISOString(),
      verifiedAt: mentor.verifiedAt.toISOString(),
    };
  }

  async rejectMentor(mentorId: string, reason: string, adminId: string): Promise<MentorProfile> {
    const mentor = await this.prisma.mentorProfile.update({
      where: { id: mentorId },
      data: {
        verificationStatus: VerificationStatus.REJECTED,
        rejectionReason: reason,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
            program: true,
          }
        }
      }
    });

    // Send notification to mentor
    await this.notificationsService.createNotification(
      mentor.userId,
      'MENTOR_REQUEST' as any,
      'Mentor Profile Update Required',
      `Your mentor profile requires updates: ${reason}`,
      '/mentors/profile'
    );

    this.logger.log(`Mentor ${mentorId} rejected by admin ${adminId}: ${reason}`);

    return {
      ...mentor,
      createdAt: mentor.createdAt.toISOString(),
      updatedAt: mentor.updatedAt.toISOString(),
      verifiedAt: mentor.verifiedAt?.toISOString() || null,
    };
  }

  private async checkVerificationEligibility(userId: string): Promise<boolean> {
    // Get user's Q&A stats
    const [answerCount, acceptedCount, reputation] = await Promise.all([
      this.prisma.answer.count({ where: { userId } }),
      this.prisma.answer.count({ where: { userId, isAccepted: true } }),
      this.gamificationService.getUserProfile(userId).then(profile => profile.totalReputation).catch(() => 0)
    ]);

    const acceptanceRate = answerCount > 0 ? acceptedCount / answerCount : 0;

    return (
      answerCount >= VERIFICATION_REQUIREMENTS.MIN_ANSWERS &&
      acceptanceRate >= VERIFICATION_REQUIREMENTS.MIN_ACCEPTANCE_RATE &&
      reputation >= VERIFICATION_REQUIREMENTS.MIN_REPUTATION
    );
  }

  // Update mentor stats (called from Q&A services)
  async updateMentorStats(userId: string) {
    const mentor = await this.prisma.mentorProfile.findFirst({ where: { userId } });
    if (!mentor) return;

    const [totalAnswers, acceptedAnswers] = await Promise.all([
      this.prisma.answer.count({ where: { userId } }),
      this.prisma.answer.count({ where: { userId, isAccepted: true } })
    ]);

    const acceptanceRate = totalAnswers > 0 ? acceptedAnswers / totalAnswers : 0;

    await this.prisma.mentorProfile.update({
      where: { userId },
      data: {
        totalAnswers,
        acceptedAnswers,
        acceptanceRate,
        updatedAt: new Date(),
      }
    });
  }
}
