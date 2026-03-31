import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateGroupInviteInput, generateInviteCode } from '@cliniq/shared-types';

@Injectable()
export class GroupInvitesService {
  private readonly logger = new Logger(GroupInvitesService.name);
  private prisma = new PrismaClient();

  async createInvite(groupId: string, inviterId: string, data: CreateGroupInviteInput) {
    // Check if inviter can invite members
    const inviter = await this.prisma.groupMember.findFirst({
      where: { groupId, userId: inviterId }
    });

    if (!inviter) {
      throw new Error('Not a member of this group');
    }

    const canInvite = inviter.role === 'OWNER' || 
                     inviter.role === 'ADMIN' || 
                     inviter.role === 'MODERATOR';

    if (!canInvite) {
      throw new Error('Insufficient permissions to invite members');
    }

    // Check if invite already exists
    const existingInvite = await this.prisma.groupInvite.findFirst({
      where: {
        groupId,
        inviteeEmail: data.inviteeEmail,
        status: 'PENDING'
      }
    });

    if (existingInvite) {
      throw new Error('Invite already sent to this email');
    }

    // Check if user is already a member
    const existingMember = await this.prisma.user.findFirst({
      where: { email: data.inviteeEmail },
      include: {
        groupMemberships: {
          where: { groupId }
        }
      }
    });

    if (existingMember && existingMember.groupMemberships.length > 0) {
      throw new Error('User is already a member of this group');
    }

    // Create invite
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const invite = await this.prisma.groupInvite.create({
      data: {
        groupId,
        inviterId,
        inviteeEmail: data.inviteeEmail,
        message: data.message,
        status: 'PENDING',
        expiresAt,
        createdAt: new Date(),
      },
      include: {
        inviter: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
          }
        },
        group: {
          select: {
            id: true,
            name: true,
            description: true,
            privacy: true,
          }
        }
      }
    });

    // In production, send email notification here
    this.logger.log(`Invite created: ${invite.id} for ${data.inviteeEmail} to group ${groupId}`);

    return {
      ...invite,
      createdAt: invite.createdAt.toISOString(),
      expiresAt: invite.expiresAt.toISOString(),
      respondedAt: invite.respondedAt?.toISOString() || null,
    };
  }

  async getSentInvites(userId: string) {
    const invites = await this.prisma.groupInvite.findMany({
      where: { inviterId: userId },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            description: true,
          }
        },
        invitee: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return invites.map(invite => ({
      ...invite,
      createdAt: invite.createdAt.toISOString(),
      expiresAt: invite.expiresAt.toISOString(),
      respondedAt: invite.respondedAt?.toISOString() || null,
    }));
  }

  async getReceivedInvites(userId: string) {
    const invites = await this.prisma.groupInvite.findMany({
      where: { inviteeId: userId },
      include: {
        inviter: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
          }
        },
        group: {
          select: {
            id: true,
            name: true,
            description: true,
            privacy: true,
            memberCount: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return invites.map(invite => ({
      ...invite,
      createdAt: invite.createdAt.toISOString(),
      expiresAt: invite.expiresAt.toISOString(),
      respondedAt: invite.respondedAt?.toISOString() || null,
    }));
  }

  async acceptInvite(inviteId: string, userId: string) {
    const invite = await this.prisma.groupInvite.findFirst({
      where: { id: inviteId },
      include: { group: true }
    });

    if (!invite) {
      throw new Error('Invite not found');
    }

    if (invite.inviteeId !== userId) {
      throw new Error('This invite is not for you');
    }

    if (invite.status !== 'PENDING') {
      throw new Error('Invite has already been responded to');
    }

    if (new Date() > new Date(invite.expiresAt)) {
      throw new Error('Invite has expired');
    }

    // Check if user is already a member
    const existingMember = await this.prisma.groupMember.findFirst({
      where: { groupId: invite.groupId, userId }
    });

    if (existingMember) {
      throw new Error('Already a member of this group');
    }

    // Check if group is full
    const memberCount = await this.prisma.groupMember.count({
      where: { groupId: invite.groupId }
    });

    if (memberCount >= invite.group.maxMembers) {
      throw new Error('Group is full');
    }

    // Add user to group
    await this.prisma.groupMember.create({
      data: {
        groupId: invite.groupId,
        userId,
        role: 'MEMBER',
        joinedAt: new Date(),
      }
    });

    // Update invite status
    const updatedInvite = await this.prisma.groupInvite.update({
      where: { id: inviteId },
      data: {
        status: 'ACCEPTED',
        respondedAt: new Date(),
      },
      include: {
        inviter: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
          }
        },
        group: {
          select: {
            id: true,
            name: true,
            description: true,
          }
        }
      }
    });

    this.logger.log(`Invite accepted: ${inviteId} by user ${userId}`);

    return {
      ...updatedInvite,
      createdAt: updatedInvite.createdAt.toISOString(),
      expiresAt: updatedInvite.expiresAt.toISOString(),
      respondedAt: updatedInvite.respondedAt.toISOString(),
    };
  }

  async rejectInvite(inviteId: string, userId: string) {
    const invite = await this.prisma.groupInvite.findFirst({
      where: { id: inviteId }
    });

    if (!invite) {
      throw new Error('Invite not found');
    }

    if (invite.inviteeId !== userId) {
      throw new Error('This invite is not for you');
    }

    if (invite.status !== 'PENDING') {
      throw new Error('Invite has already been responded to');
    }

    const updatedInvite = await this.prisma.groupInvite.update({
      where: { id: inviteId },
      data: {
        status: 'REJECTED',
        respondedAt: new Date(),
      },
      include: {
        inviter: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
          }
        },
        group: {
          select: {
            id: true,
            name: true,
            description: true,
          }
        }
      }
    });

    this.logger.log(`Invite rejected: ${inviteId} by user ${userId}`);

    return {
      ...updatedInvite,
      createdAt: updatedInvite.createdAt.toISOString(),
      expiresAt: updatedInvite.expiresAt.toISOString(),
      respondedAt: updatedInvite.respondedAt.toISOString(),
    };
  }

  async getInviteByCode(inviteCode: string) {
    const invite = await this.prisma.groupInvite.findFirst({
      where: { 
        inviteCode,
        status: 'PENDING',
        expiresAt: { gt: new Date() }
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            description: true,
            privacy: true,
            maxMembers: true,
            memberCount: true,
          }
        },
        inviter: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
          }
        }
      }
    });

    if (!invite) {
      throw new Error('Invalid or expired invite code');
    }

    return {
      ...invite,
      createdAt: invite.createdAt.toISOString(),
      expiresAt: invite.expiresAt.toISOString(),
      respondedAt: invite.respondedAt?.toISOString() || null,
    };
  }

  async cancelInvite(inviteId: string, userId: string) {
    const invite = await this.prisma.groupInvite.findFirst({
      where: { id: inviteId },
      include: { group: true }
    });

    if (!invite) {
      throw new Error('Invite not found');
    }

    // Check if user can cancel invite (inviter or group admin)
    const member = await this.prisma.groupMember.findFirst({
      where: { groupId: invite.groupId, userId }
    });

    const canCancel = invite.inviterId === userId || 
                     (member && (member.role === 'OWNER' || member.role === 'ADMIN'));

    if (!canCancel) {
      throw new Error('Insufficient permissions to cancel invite');
    }

    await this.prisma.groupInvite.update({
      where: { id: inviteId },
      data: { status: 'EXPIRED' }
    });

    this.logger.log(`Invite cancelled: ${inviteId} by user ${userId}`);
  }

  async getGroupInvites(groupId: string) {
    const invites = await this.prisma.groupInvite.findMany({
      where: { groupId },
      include: {
        inviter: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
          }
        },
        invitee: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return invites.map(invite => ({
      ...invite,
      createdAt: invite.createdAt.toISOString(),
      expiresAt: invite.expiresAt.toISOString(),
      respondedAt: invite.respondedAt?.toISOString() || null,
    }));
  }

  async cleanupExpiredInvites() {
    const expiredInvites = await this.prisma.groupInvite.updateMany({
      where: {
        status: 'PENDING',
        expiresAt: { lt: new Date() }
      },
      data: { status: 'EXPIRED' }
    });

    this.logger.log(`Cleaned up ${expiredInvites.count} expired invites`);
    return expiredInvites.count;
  }
}
