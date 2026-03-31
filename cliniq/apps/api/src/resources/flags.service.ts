import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Flag, CreateFlagInput, FlagStatus, FlagEntityType } from '@cliniq/shared-types';

@Injectable()
export class FlagsService {
  private readonly logger = new Logger(FlagsService.name);
  private prisma = new PrismaClient();

  async createFlag(reporterId: string, data: CreateFlagInput): Promise<Flag> {
    // Check if user already flagged this entity
    const existingFlag = await this.prisma.flag.findFirst({
      where: {
        reporterId,
        entityType: data.entityType,
        entityId: data.entityId,
        status: FlagStatus.PENDING
      }
    });

    if (existingFlag) {
      throw new Error('You have already flagged this content');
    }

    const flag = await this.prisma.flag.create({
      data: {
        ...data,
        reporterId,
        status: FlagStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    this.logger.log(`Flag created: ${flag.id} for ${data.entityType}:${data.entityId} by ${reporterId}`);

    return {
      ...flag,
      createdAt: flag.createdAt.toISOString(),
      updatedAt: flag.updatedAt.toISOString(),
      resolvedAt: flag.resolvedAt?.toISOString() || null,
    };
  }

  async getPendingFlags() {
    const flags = await this.prisma.flag.findMany({
      where: { status: FlagStatus.PENDING },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return flags.map(flag => ({
      ...flag,
      createdAt: flag.createdAt.toISOString(),
      updatedAt: flag.updatedAt.toISOString(),
      resolvedAt: flag.resolvedAt?.toISOString() || null,
    }));
  }

  async resolveFlag(flagId: string, adminId: string, notes?: string): Promise<Flag> {
    const flag = await this.prisma.flag.update({
      where: { id: flagId },
      data: {
        status: FlagStatus.RESOLVED,
        resolvedBy: adminId,
        resolvedAt: new Date(),
        notes,
        updatedAt: new Date(),
      },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        }
      }
    });

    // Take action based on entity type and resolution
    await this.handleFlagResolution(flag);

    this.logger.log(`Flag resolved: ${flagId} by admin ${adminId}`);

    return {
      ...flag,
      createdAt: flag.createdAt.toISOString(),
      updatedAt: flag.updatedAt.toISOString(),
      resolvedAt: flag.resolvedAt.toISOString(),
    };
  }

  async dismissFlag(flagId: string, adminId: string, notes?: string): Promise<Flag> {
    const flag = await this.prisma.flag.update({
      where: { id: flagId },
      data: {
        status: FlagStatus.DISMISSED,
        resolvedBy: adminId,
        resolvedAt: new Date(),
        notes,
        updatedAt: new Date(),
      },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        }
      }
    });

    this.logger.log(`Flag dismissed: ${flagId} by admin ${adminId}`);

    return {
      ...flag,
      createdAt: flag.createdAt.toISOString(),
      updatedAt: flag.updatedAt.toISOString(),
      resolvedAt: flag.resolvedAt.toISOString(),
    };
  }

  async getFlagsByEntity(entityType: FlagEntityType, entityId: string) {
    const flags = await this.prisma.flag.findMany({
      where: {
        entityType,
        entityId,
      },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return flags.map(flag => ({
      ...flag,
      createdAt: flag.createdAt.toISOString(),
      updatedAt: flag.updatedAt.toISOString(),
      resolvedAt: flag.resolvedAt?.toISOString() || null,
    }));
  }

  async getFlagStats() {
    const [total, pending, resolved, dismissed] = await Promise.all([
      this.prisma.flag.count(),
      this.prisma.flag.count({ where: { status: FlagStatus.PENDING } }),
      this.prisma.flag.count({ where: { status: FlagStatus.RESOLVED } }),
      this.prisma.flag.count({ where: { status: FlagStatus.DISMISSED } })
    ]);

    return {
      total,
      pending,
      resolved,
      dismissed,
      resolutionRate: total > 0 ? (resolved + dismissed) / total : 0,
    };
  }

  async getFlagsByType() {
    const flags = await this.prisma.flag.groupBy({
      by: ['entityType'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });

    return flags.map(group => ({
      entityType: group.entityType,
      count: group._count.id
    }));
  }

  async getRecentFlags(limit = 10) {
    const flags = await this.prisma.flag.findMany({
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return flags.map(flag => ({
      ...flag,
      createdAt: flag.createdAt.toISOString(),
      updatedAt: flag.updatedAt.toISOString(),
      resolvedAt: flag.resolvedAt?.toISOString() || null,
    }));
  }

  private async handleFlagResolution(flag: any): Promise<void> {
    // Handle different entity types based on resolution
    switch (flag.entityType) {
      case FlagEntityType.RESOURCE:
        // For resolved flags, you might want to hide or remove the resource
        // This is a placeholder for actual moderation logic
        if (flag.status === FlagStatus.RESOLVED) {
          this.logger.log(`Resource ${flag.entityId} flagged for moderation`);
          // In production, you might:
          // - Hide the resource temporarily
          // - Send notification to resource owner
          // - Add to moderation queue
        }
        break;
      
      case FlagEntityType.QUESTION:
      case FlagEntityType.ANSWER:
        // Handle Q&A content flags
        if (flag.status === FlagStatus.RESOLVED) {
          this.logger.log(`${flag.entityType} ${flag.entityId} flagged for moderation`);
        }
        break;
      
      case FlagEntityType.GROUP_POST:
        // Handle group post flags
        if (flag.status === FlagStatus.RESOLVED) {
          this.logger.log(`Group post ${flag.entityId} flagged for moderation`);
        }
        break;
    }
  }

  async checkUserFlagPermissions(userId: string, entityType: FlagEntityType, entityId: string): Promise<boolean> {
    // Check if user can flag this entity
    // For example, users can't flag their own content
    switch (entityType) {
      case FlagEntityType.RESOURCE:
        const resource = await this.prisma.resource.findFirst({
          where: { id: entityId, userId }
        });
        return !resource; // Can't flag own resource
      
      case FlagEntityType.QUESTION:
        const question = await this.prisma.question.findFirst({
          where: { id: entityId, userId }
        });
        return !question; // Can't flag own question
      
      case FlagEntityType.ANSWER:
        const answer = await this.prisma.answer.findFirst({
          where: { id: entityId, userId }
        });
        return !answer; // Can't flag own answer
      
      case FlagEntityType.GROUP_POST:
        const post = await this.prisma.groupPost.findFirst({
          where: { id: entityId, userId }
        });
        return !post; // Can't flag own post
      
      default:
        return true;
    }
  }
}
