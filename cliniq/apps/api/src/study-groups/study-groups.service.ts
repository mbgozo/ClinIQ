import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Group, CreateGroupInput, GroupFilter, MemberRole, GroupPrivacy, generateInviteCode } from '@cliniq/shared-types';

@Injectable()
export class StudyGroupsService {
  private readonly logger = new Logger(StudyGroupsService.name);
  private prisma = new PrismaClient();

  async getGroups(filters: GroupFilter) {
    const { page = 1, limit = 10, ...filterOptions } = filters;
    const skip = (page - 1) * limit;

    const where = {
      ...(filterOptions.categoryId && { categoryId: filterOptions.categoryId }),
      ...(filterOptions.institution && { institution: { contains: filterOptions.institution, mode: 'insensitive' } }),
      ...(filterOptions.privacy && { privacy: filterOptions.privacy }),
      ...(filterOptions.cadence && { cadence: filterOptions.cadence }),
      ...(filterOptions.search && {
        OR: [
          { name: { contains: filterOptions.search, mode: 'insensitive' } },
          { description: { contains: filterOptions.search, mode: 'insensitive' } }
        ]
      }),
      ...(filterOptions.hasSpace && {
        members: {
          some: {
            group: {
              maxMembers: { gt: this.prisma.group.members.count() }
            }
          }
        }
      })
    };

    const [groups, total] = await Promise.all([
      this.prisma.group.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              institution: true,
            }
          },
          members: {
            select: {
              id: true,
              userId: true,
              role: true,
              joinedAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                }
              }
            }
          },
          posts: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
              color: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.group.count({ where })
    ]);

    return {
      groups: groups.map(group => ({
        ...group,
        memberCount: group.members.length,
        postCount: group.posts.length,
        lastActivity: group.posts.length > 0 
          ? group.posts.reduce((latest, post) => 
              new Date(post.updatedAt) > new Date(latest.updatedAt) ? post : latest
            ).updatedAt
          : group.createdAt,
        createdAt: group.createdAt.toISOString(),
        updatedAt: group.updatedAt.toISOString(),
      })),
      total,
    };
  }

  async getGroupById(id: string) {
    const group = await this.prisma.group.findFirst({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
          }
        },
        members: {
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
          orderBy: { joinedAt: 'asc' }
        },
        posts: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              }
            }
          },
          orderBy: [
            { pinned: 'desc' },
            { createdAt: 'desc' }
          ]
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          }
        }
      }
    });

    if (!group) {
      throw new Error('Group not found');
    }

    return {
      ...group,
      memberCount: group.members.length,
      postCount: group.posts.length,
      lastActivity: group.posts.length > 0 
        ? group.posts.reduce((latest, post) => 
            new Date(post.updatedAt) > new Date(latest.updatedAt) ? post : latest
          ).updatedAt
        : group.createdAt,
      createdAt: group.createdAt.toISOString(),
      updatedAt: group.updatedAt.toISOString(),
    };
  }

  async createGroup(userId: string, data: CreateGroupInput) {
    const inviteCode = generateInviteCode();

    const group = await this.prisma.group.create({
      data: {
        ...data,
        ownerId: userId,
        inviteCode,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              }
            }
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          }
        }
      }
    });

    // Add owner as member
    await this.prisma.groupMember.create({
      data: {
        groupId: group.id,
        userId,
        role: MemberRole.OWNER,
        joinedAt: new Date(),
      }
    });

    this.logger.log(`Group created: ${group.id} by user ${userId}`);

    return {
      ...group,
      memberCount: 1,
      postCount: 0,
      lastActivity: group.createdAt.toISOString(),
      createdAt: group.createdAt.toISOString(),
      updatedAt: group.updatedAt.toISOString(),
    };
  }

  async updateGroup(id: string, userId: string, data: Partial<CreateGroupInput>) {
    // Check if user can edit group
    const member = await this.prisma.groupMember.findFirst({
      where: { groupId: id, userId },
      include: { group: true }
    });

    if (!member) {
      throw new Error('Not a member of this group');
    }

    const canEdit = member.role === MemberRole.OWNER || member.role === MemberRole.ADMIN;
    if (!canEdit) {
      throw new Error('Insufficient permissions to edit group');
    }

    const group = await this.prisma.group.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              }
            }
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          }
        }
      }
    });

    this.logger.log(`Group updated: ${group.id} by user ${userId}`);

    return {
      ...group,
      memberCount: group.members.length,
      postCount: 0, // Would need to calculate this
      lastActivity: group.updatedAt.toISOString(),
      createdAt: group.createdAt.toISOString(),
      updatedAt: group.updatedAt.toISOString(),
    };
  }

  async deleteGroup(id: string, userId: string) {
    // Check if user is owner
    const group = await this.prisma.group.findFirst({
      where: { id, ownerId: userId }
    });

    if (!group) {
      throw new Error('Only group owner can delete group');
    }

    await this.prisma.group.delete({
      where: { id }
    });

    this.logger.log(`Group deleted: ${id} by owner ${userId}`);
  }

  async joinGroup(groupId: string, userId: string, inviteCode?: string) {
    const group = await this.prisma.group.findFirst({
      where: { id: groupId },
      include: { members: true }
    });

    if (!group) {
      throw new Error('Group not found');
    }

    // Check if already a member
    const existingMember = group.members.find(m => m.userId === userId);
    if (existingMember) {
      throw new Error('Already a member of this group');
    }

    // Check if group is full
    if (group.members.length >= group.maxMembers) {
      throw new Error('Group is full');
    }

    // Check privacy and invite code
    if (group.privacy === GroupPrivacy.PRIVATE && group.inviteCode !== inviteCode) {
      throw new Error('Invalid invite code');
    }

    if (group.privacy === GroupPrivacy.INVITE_ONLY) {
      throw new Error('This group is invite only');
    }

    // Add member
    const member = await this.prisma.groupMember.create({
      data: {
        groupId,
        userId,
        role: MemberRole.MEMBER,
        joinedAt: new Date(),
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

    this.logger.log(`User ${userId} joined group ${groupId}`);

    return {
      ...member,
      joinedAt: member.joinedAt.toISOString(),
    };
  }

  async leaveGroup(groupId: string, userId: string) {
    const member = await this.prisma.groupMember.findFirst({
      where: { groupId, userId },
      include: { group: true }
    });

    if (!member) {
      throw new Error('Not a member of this group');
    }

    // Owner cannot leave group (must transfer ownership first)
    if (member.group.ownerId === userId) {
      throw new Error('Group owner cannot leave group');
    }

    await this.prisma.groupMember.delete({
      where: { id: member.id }
    });

    this.logger.log(`User ${userId} left group ${groupId}`);
  }

  async getUserGroups(userId: string) {
    const memberships = await this.prisma.groupMember.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              }
            },
            members: {
              select: {
                id: true,
                userId: true,
              }
            },
            posts: {
              select: {
                id: true,
                createdAt: true,
                updatedAt: true,
              }
            },
            category: {
              select: {
                id: true,
                name: true,
                icon: true,
                color: true,
              }
            }
          }
        }
      },
      orderBy: { joinedAt: 'desc' }
    });

    return memberships.map(membership => ({
      ...membership.group,
      memberCount: membership.group.members.length,
      postCount: membership.group.posts.length,
      lastActivity: membership.group.posts.length > 0 
        ? membership.group.posts.reduce((latest, post) => 
            new Date(post.updatedAt) > new Date(latest.updatedAt) ? post : latest
          ).updatedAt
        : membership.group.createdAt,
      userRole: membership.role,
      joinedAt: membership.joinedAt.toISOString(),
      createdAt: membership.group.createdAt.toISOString(),
      updatedAt: membership.group.updatedAt.toISOString(),
    }));
  }

  async getGroupMembers(groupId: string) {
    const members = await this.prisma.groupMember.findMany({
      where: { groupId },
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
      orderBy: { joinedAt: 'asc' }
    });

    return members.map(member => ({
      ...member,
      joinedAt: member.joinedAt.toISOString(),
    }));
  }

  async updateMemberRole(groupId: string, memberId: string, newRole: string, adminId: string) {
    // Check if admin has permission
    const admin = await this.prisma.groupMember.findFirst({
      where: { groupId, userId: adminId }
    });

    if (!admin || (admin.role !== MemberRole.OWNER && admin.role !== MemberRole.ADMIN)) {
      throw new Error('Insufficient permissions');
    }

    // Update member role
    const member = await this.prisma.groupMember.update({
      where: { id: memberId },
      data: { role: newRole as MemberRole },
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

    this.logger.log(`Role updated for member ${memberId} in group ${groupId} to ${newRole}`);

    return {
      ...member,
      joinedAt: member.joinedAt.toISOString(),
    };
  }

  async removeMember(groupId: string, memberId: string, adminId: string) {
    // Check if admin has permission
    const admin = await this.prisma.groupMember.findFirst({
      where: { groupId, userId: adminId }
    });

    if (!admin || (admin.role !== MemberRole.OWNER && admin.role !== MemberRole.ADMIN)) {
      throw new Error('Insufficient permissions');
    }

    // Cannot remove owner
    const memberToRemove = await this.prisma.groupMember.findFirst({
      where: { id: memberId },
      include: { group: true }
    });

    if (!memberToRemove) {
      throw new Error('Member not found');
    }

    if (memberToRemove.group.ownerId === memberToRemove.userId) {
      throw new Error('Cannot remove group owner');
    }

    await this.prisma.groupMember.delete({
      where: { id: memberId }
    });

    this.logger.log(`Member ${memberId} removed from group ${groupId} by admin ${adminId}`);
  }
}
