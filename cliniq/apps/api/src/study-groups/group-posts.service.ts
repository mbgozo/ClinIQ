import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateGroupPostInput } from '@cliniq/shared-types';

@Injectable()
export class GroupPostsService {
  private readonly logger = new Logger(GroupPostsService.name);
  private prisma = new PrismaClient();

  async getGroupPosts(groupId: string, query: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const posts = await this.prisma.groupPost.findMany({
      where: { groupId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
          }
        },
        flags: {
          select: {
            id: true,
            status: true,
          }
        }
      },
      orderBy: [
        { pinned: 'desc' },
        { createdAt: 'desc' }
      ],
      skip,
      take: limit,
    });

    return posts.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      isFlagged: post.flags.some(flag => flag.status === 'PENDING'),
    }));
  }

  async createPost(groupId: string, userId: string, data: CreateGroupPostInput) {
    // Check if user is a member of the group
    const member = await this.prisma.groupMember.findFirst({
      where: { groupId, userId }
    });

    if (!member) {
      throw new Error('Not a member of this group');
    }

    const post = await this.prisma.groupPost.create({
      data: {
        ...data,
        groupId,
        userId,
        pinned: false,
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
          }
        }
      }
    });

    this.logger.log(`Post created: ${post.id} in group ${groupId} by user ${userId}`);

    return {
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }

  async updatePost(postId: string, userId: string, data: Partial<CreateGroupPostInput>) {
    const post = await this.prisma.groupPost.findFirst({
      where: { id: postId },
      include: { group: true }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // Check if user can edit this post
    const member = await this.prisma.groupMember.findFirst({
      where: { groupId: post.groupId, userId }
    });

    if (!member) {
      throw new Error('Not a member of this group');
    }

    const canEdit = post.userId === userId || 
                   member.role === 'OWNER' || 
                   member.role === 'ADMIN' || 
                   member.role === 'MODERATOR';

    if (!canEdit) {
      throw new Error('Insufficient permissions to edit post');
    }

    const updatedPost = await this.prisma.groupPost.update({
      where: { id: postId },
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
          }
        }
      }
    });

    this.logger.log(`Post updated: ${postId} by user ${userId}`);

    return {
      ...updatedPost,
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString(),
    };
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.prisma.groupPost.findFirst({
      where: { id: postId },
      include: { group: true }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // Check if user can delete this post
    const member = await this.prisma.groupMember.findFirst({
      where: { groupId: post.groupId, userId }
    });

    if (!member) {
      throw new Error('Not a member of this group');
    }

    const canDelete = post.userId === userId || 
                     member.role === 'OWNER' || 
                     member.role === 'ADMIN' || 
                     member.role === 'MODERATOR';

    if (!canDelete) {
      throw new Error('Insufficient permissions to delete post');
    }

    await this.prisma.groupPost.delete({
      where: { id: postId }
    });

    this.logger.log(`Post deleted: ${postId} by user ${userId}`);
  }

  async pinPost(postId: string, userId: string) {
    const post = await this.prisma.groupPost.findFirst({
      where: { id: postId },
      include: { group: true }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // Check if user can pin posts
    const member = await this.prisma.groupMember.findFirst({
      where: { groupId: post.groupId, userId }
    });

    if (!member) {
      throw new Error('Not a member of this group');
    }

    const canPin = member.role === 'OWNER' || 
                  member.role === 'ADMIN' || 
                  member.role === 'MODERATOR';

    if (!canPin) {
      throw new Error('Insufficient permissions to pin posts');
    }

    const updatedPost = await this.prisma.groupPost.update({
      where: { id: postId },
      data: { pinned: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
          }
        }
      }
    });

    this.logger.log(`Post pinned: ${postId} by user ${userId}`);

    return {
      ...updatedPost,
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString(),
    };
  }

  async unpinPost(postId: string, userId: string) {
    const post = await this.prisma.groupPost.findFirst({
      where: { id: postId },
      include: { group: true }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // Check if user can unpin posts
    const member = await this.prisma.groupMember.findFirst({
      where: { groupId: post.groupId, userId }
    });

    if (!member) {
      throw new Error('Not a member of this group');
    }

    const canUnpin = member.role === 'OWNER' || 
                     member.role === 'ADMIN' || 
                     member.role === 'MODERATOR';

    if (!canUnpin) {
      throw new Error('Insufficient permissions to unpin posts');
    }

    const updatedPost = await this.prisma.groupPost.update({
      where: { id: postId },
      data: { pinned: false },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
          }
        }
      }
    });

    this.logger.log(`Post unpinned: ${postId} by user ${userId}`);

    return {
      ...updatedPost,
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString(),
    };
  }

  async getPostById(postId: string) {
    const post = await this.prisma.groupPost.findFirst({
      where: { id: postId },
      include: {
        user: {
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
          }
        },
        flags: {
          select: {
            id: true,
            status: true,
          }
        }
      }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return {
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      isFlagged: post.flags.some(flag => flag.status === 'PENDING'),
    };
  }

  async getGroupPostStats(groupId: string) {
    const [totalPosts, pinnedPosts, recentPosts] = await Promise.all([
      this.prisma.groupPost.count({ where: { groupId } }),
      this.prisma.groupPost.count({ where: { groupId, pinned: true } }),
      this.prisma.groupPost.count({
        where: {
          groupId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      })
    ]);

    return {
      totalPosts,
      pinnedPosts,
      recentPosts,
    };
  }

  async searchPosts(groupId: string, query: string, limit = 10) {
    const posts = await this.prisma.groupPost.findMany({
      where: {
        groupId,
        body: {
          contains: query,
          mode: 'insensitive'
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return posts.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));
  }
}
