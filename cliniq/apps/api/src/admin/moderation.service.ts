import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { 
  ModerationAction, 
  ContentType, 
  ReportReason,
  hasPermission,
  Permission
} from '@cliniq/shared-types';

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);
  private prisma = new PrismaClient();

  async getModerationQueue(requestingAdminId: string, query: { page?: number; limit?: number; status?: string }) {
    // Check if requesting admin has permission to view flags
    const requestingAdmin = await this.prisma.adminUser.findFirst({
      where: { userId: requestingAdminId }
    });

    if (!requestingAdmin || !hasPermission(requestingAdmin.permissions as Permission[], Permission.VIEW_FLAGS)) {
      throw new Error('Insufficient permissions to view moderation queue');
    }

    const { page = 1, limit = 20, status } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status: status as any })
    };

    const [queue, total] = await Promise.all([
      this.prisma.flag.findMany({
        where,
        include: {
          reporter: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            }
          },
          moderator: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.flag.count({ where })
    ]);

    // Transform to ModerationQueue format
    const moderationQueue = queue.map(flag => ({
      id: flag.id,
      contentType: this.getContentTypeFromFlag(flag),
      contentId: flag.entityId,
      reason: flag.reason as ReportReason,
      description: flag.description,
      reporterId: flag.reporterId,
      moderatorId: flag.moderatorId,
      status: flag.status as any,
      action: flag.action as ModerationAction | undefined,
      actionReason: flag.actionReason,
      createdAt: flag.createdAt.toISOString(),
      updatedAt: flag.updatedAt.toISOString(),
      resolvedAt: flag.resolvedAt?.toISOString() || null,
      content: null, // Would be populated based on entity type
      reporter: flag.reporter,
      moderator: flag.moderator || null,
    }));

    return {
      queue: moderationQueue,
      total,
      page,
      limit,
    };
  }

  async resolveModerationItem(requestingAdminId: string, flagId: string, action: string, reason?: string) {
    // Check if requesting admin has permission to manage flags
    const requestingAdmin = await this.prisma.adminUser.findFirst({
      where: { userId: requestingAdminId }
    });

    if (!requestingAdmin || !hasPermission(requestingAdmin.permissions as Permission[], Permission.MANAGE_FLAGS)) {
      throw new Error('Insufficient permissions to resolve moderation items');
    }

    const flag = await this.prisma.flag.findFirst({
      where: { id: flagId },
      include: {
        moderator: true
      }
    });

    if (!flag) {
      throw new Error('Flag not found');
    }

    if (flag.status !== 'PENDING') {
      throw new Error('Flag is already resolved');
    }

    const moderationAction = action as ModerationAction;
    const now = new Date();

    // Update the flag
    const updatedFlag = await this.prisma.flag.update({
      where: { id: flagId },
      data: {
        status: 'RESOLVED',
        action: moderationAction,
        actionReason: reason,
        moderatorId: requestingAdmin.id,
        resolvedAt: now,
        updatedAt: now,
      },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        },
        moderator: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        }
      }
    });

    // Execute the moderation action
    await this.executeModerationAction(flag.entityType, flag.entityId, moderationAction, reason);

    // Log the action
    await this.logModerationAction(requestingAdminId, flagId, moderationAction, reason);

    this.logger.log(`Moderation item resolved: ${flagId} with action ${action} by ${requestingAdminId}`);

    return {
      id: updatedFlag.id,
      contentType: this.getContentTypeFromFlag(updatedFlag),
      contentId: updatedFlag.entityId,
      reason: updatedFlag.reason as ReportReason,
      description: updatedFlag.description,
      reporterId: updatedFlag.reporterId,
      moderatorId: updatedFlag.moderatorId,
      status: updatedFlag.status as any,
      action: updatedFlag.action as ModerationAction,
      actionReason: updatedFlag.actionReason,
      createdAt: updatedFlag.createdAt.toISOString(),
      updatedAt: updatedFlag.updatedAt.toISOString(),
      resolvedAt: updatedFlag.resolvedAt?.toISOString() || null,
      content: null,
      reporter: updatedFlag.reporter,
      moderator: updatedFlag.moderator,
    };
  }

  async dismissModerationItem(requestingAdminId: string, flagId: string) {
    // Check if requesting admin has permission to manage flags
    const requestingAdmin = await this.prisma.adminUser.findFirst({
      where: { userId: requestingAdminId }
    });

    if (!requestingAdmin || !hasPermission(requestingAdmin.permissions as Permission[], Permission.MANAGE_FLAGS)) {
      throw new Error('Insufficient permissions to dismiss moderation items');
    }

    const flag = await this.prisma.flag.findFirst({
      where: { id: flagId }
    });

    if (!flag) {
      throw new Error('Flag not found');
    }

    if (flag.status !== 'PENDING') {
      throw new Error('Flag is already resolved');
    }

    await this.prisma.flag.update({
      where: { id: flagId },
      data: {
        status: 'DISMISSED',
        moderatorId: requestingAdmin.id,
        resolvedAt: new Date(),
        updatedAt: new Date(),
      }
    });

    // Log the action
    await this.logModerationAction(requestingAdminId, flagId, ModerationAction.REJECT, 'Flag dismissed');

    this.logger.log(`Moderation item dismissed: ${flagId} by ${requestingAdminId}`);
  }

  private async executeModerationAction(entityType: string, entityId: string, action: ModerationAction, reason?: string) {
    switch (action) {
      case ModerationAction.DELETE:
        await this.deleteContent(entityType, entityId);
        break;
      
      case ModerationAction.BAN:
        await this.banContentCreator(entityType, entityId, reason);
        break;
      
      case ModerationAction.WARNING:
        await this.warnContentCreator(entityType, entityId, reason);
        break;
      
      case ModerationAction.SILENCE:
        await this.silenceContentCreator(entityType, entityId, reason);
        break;
      
      case ModerationAction.APPROVE:
        await this.approveContent(entityType, entityId);
        break;
      
      case ModerationAction.REJECT:
        // Already handled by updating flag status
        break;
    }
  }

  private async deleteContent(entityType: string, entityId: string) {
    switch (entityType) {
      case 'Question':
        await this.prisma.question.delete({ where: { id: entityId } });
        break;
      case 'Answer':
        await this.prisma.answer.delete({ where: { id: entityId } });
        break;
      case 'Resource':
        await this.prisma.resource.delete({ where: { id: entityId } });
        break;
      case 'GroupPost':
        await this.prisma.groupPost.delete({ where: { id: entityId } });
        break;
      case 'ChatMessage':
        await this.prisma.message.delete({ where: { id: entityId } });
        break;
    }
  }

  private async banContentCreator(entityType: string, entityId: string, reason?: string) {
    let userId: string;

    switch (entityType) {
      case 'Question':
        const question = await this.prisma.question.findFirst({ where: { id: entityId } });
        userId = question?.userId || '';
        break;
      case 'Answer':
        const answer = await this.prisma.answer.findFirst({ where: { id: entityId } });
        userId = answer?.userId || '';
        break;
      case 'Resource':
        const resource = await this.prisma.resource.findFirst({ where: { id: entityId } });
        userId = resource?.userId || '';
        break;
      case 'GroupPost':
        const post = await this.prisma.groupPost.findFirst({ where: { id: entityId } });
        userId = post?.userId || '';
        break;
      case 'ChatMessage':
        const message = await this.prisma.message.findFirst({ where: { id: entityId } });
        userId = message?.senderId || '';
        break;
      default:
        return;
    }

    if (userId) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          isBanned: true,
          bannedAt: new Date(),
          bannedReason: reason || 'Banned due to content violation',
        }
      });
    }
  }

  private async warnContentCreator(entityType: string, entityId: string, reason?: string) {
    // This would send a warning notification to the user
    // Implementation would depend on the notification system
    this.logger.log(`Warning sent for ${entityType}:${entityId} - ${reason}`);
  }

  private async silenceContentCreator(entityType: string, entityId: string, reason?: string) {
    // This would temporarily silence the user (e.g., prevent posting for a period)
    // Implementation would depend on the specific requirements
    this.logger.log(`User silenced for ${entityType}:${entityId} - ${reason}`);
  }

  private async approveContent(entityType: string, entityId: string) {
    // This would approve pending content (if applicable)
    // Implementation would depend on the content type
    this.logger.log(`Content approved: ${entityType}:${entityId}`);
  }

  private getContentTypeFromFlag(flag: any): ContentType {
    // Map flag entity type to ContentType enum
    const typeMap: Record<string, ContentType> = {
      'Question': ContentType.QUESTION,
      'Answer': ContentType.ANSWER,
      'Resource': ContentType.RESOURCE,
      'GroupPost': ContentType.GROUP_POST,
      'ChatMessage': ContentType.CHAT_MESSAGE,
      'User': ContentType.USER_PROFILE,
    };

    return typeMap[flag.entityType] || ContentType.QUESTION;
  }

  private async logModerationAction(adminId: string, flagId: string, action: ModerationAction, reason?: string) {
    const admin = await this.prisma.adminUser.findFirst({
      where: { userId: adminId }
    });

    if (!admin) return;

    await this.prisma.adminLog.create({
      data: {
        adminId: admin.id,
        action: `MODERATION_${action}`,
        entityType: 'Flag',
        entityId: flagId,
        details: { action, reason },
        createdAt: new Date(),
      }
    });
  }

  async getModerationStats(requestingAdminId: string) {
    // Check permissions
    const requestingAdmin = await this.prisma.adminUser.findFirst({
      where: { userId: requestingAdminId }
    });

    if (!requestingAdmin || !hasPermission(requestingAdmin.permissions as Permission[], Permission.VIEW_ANALYTICS)) {
      throw new Error('Insufficient permissions');
    }

    const [
      totalFlags,
      pendingFlags,
      resolvedToday,
      averageResolutionTime
    ] = await Promise.all([
      this.prisma.flag.count(),
      this.prisma.flag.count({ where: { status: 'PENDING' } }),
      this.prisma.flag.count({
        where: {
          status: 'RESOLVED',
          resolvedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      this.calculateAverageResolutionTime()
    ]);

    return {
      totalFlags,
      pendingFlags,
      resolvedToday,
      averageResolutionTime,
    };
  }

  private async calculateAverageResolutionTime(): Promise<number> {
    const resolvedFlags = await this.prisma.flag.findMany({
      where: {
        status: 'RESOLVED',
        resolvedAt: { not: null }
      },
      select: { createdAt: true, resolvedAt: true }
    });

    if (resolvedFlags.length === 0) return 0;

    const totalTime = resolvedFlags.reduce((sum, flag) => {
      const resolutionTime = flag.resolvedAt!.getTime() - flag.createdAt.getTime();
      return sum + resolutionTime;
    }, 0);

    return totalTime / resolvedFlags.length / (1000 * 60); // Convert to minutes
  }
}
