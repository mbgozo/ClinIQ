import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { CreateResourceInput, ResourceFilter } from '@cliniq/shared-types';

@Injectable()
export class ResourcesService {
  private readonly logger = new Logger(ResourcesService.name);
  private prisma = new PrismaClient();

  async getResources(filters: ResourceFilter) {
    const { page = 1, limit = 10, ...filterOptions } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ResourceWhereInput = {
      ...(filterOptions.categoryId && { categoryId: filterOptions.categoryId }),
      ...(filterOptions.course && { course: { contains: filterOptions.course, mode: Prisma.QueryMode.insensitive } }),
      ...(filterOptions.year && { year: filterOptions.year }),
      ...(filterOptions.userId && { userId: filterOptions.userId }),
      ...(filterOptions.tags && filterOptions.tags.length > 0 && {
        tags: {
          hasSome: filterOptions.tags
        }
      }),
      ...(filterOptions.search && {
        OR: [
          { title: { contains: filterOptions.search, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: filterOptions.search, mode: Prisma.QueryMode.insensitive } },
          { tags: { hasSome: [filterOptions.search] } }
        ]
      })
    };

    const [resources, total] = await Promise.all([
      this.prisma.resource.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              institution: true,
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
              color: true,
            }
          },
          flags: {
            select: {
              id: true,
              status: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.resource.count({ where })
    ]);

    return {
      resources: resources.map((resource: any) => ({
        ...resource,
        createdAt: resource.createdAt.toISOString(),
        updatedAt: resource.updatedAt.toISOString(),
        isFlagged: resource.flags?.some((flag: any) => flag.status === 'PENDING') || false,
      })),
      total,
    };
  }

  async getResourceById(id: string) {
    const resource = await this.prisma.resource.findFirst({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
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

    if (!resource) {
      throw new Error('Resource not found');
    }

    const resourceAny = resource as any;
    return {
      ...resourceAny,
      createdAt: resourceAny.createdAt.toISOString(),
      updatedAt: resourceAny.updatedAt.toISOString(),
      isFlagged: resourceAny.flags?.some((flag: any) => flag.status === 'PENDING') || false,
    };
  }

  async createResource(userId: string, data: CreateResourceInput & { fileRef?: string; fileType?: string }) {
    const { tags, ...rest } = data;
    const resource = await this.prisma.resource.create({
      data: {
        ...rest,
        tags: tags || [],
        userId,
        downloads: 0,
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

    this.logger.log(`Resource created: ${resource.id} by user ${userId}`);

    return {
      ...resource,
      createdAt: resource.createdAt.toISOString(),
      updatedAt: resource.updatedAt.toISOString(),
    };
  }

  async updateResource(id: string, userId: string, data: Partial<CreateResourceInput & { fileRef?: string; fileType?: string }>) {
    // Check if user owns the resource
    const existingResource = await this.prisma.resource.findFirst({
      where: { id, userId }
    });

    if (!existingResource) {
      throw new Error('Resource not found or unauthorized');
    }

    const resource = await this.prisma.resource.update({
      where: { id },
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

    this.logger.log(`Resource updated: ${resource.id} by user ${userId}`);

    return {
      ...resource,
      createdAt: resource.createdAt.toISOString(),
      updatedAt: resource.updatedAt.toISOString(),
    };
  }

  async deleteResource(id: string, userId: string) {
    // Check if user owns the resource
    const existingResource = await this.prisma.resource.findFirst({
      where: { id, userId }
    });

    if (!existingResource) {
      throw new Error('Resource not found or unauthorized');
    }

    // Delete the resource
    await this.prisma.resource.delete({
      where: { id }
    });

    this.logger.log(`Resource deleted: ${id} by user ${userId}`);
  }

  async incrementDownload(id: string, userId: string) {
    const resource = await this.prisma.resource.findFirst({
      where: { id }
    });

    if (!resource) {
      throw new Error('Resource not found');
    }

    // Increment download count
    await this.prisma.resource.update({
      where: { id },
      data: {
        downloads: { increment: 1 }
      }
    });

    // Generate download URL (in production, this would be a signed URL)
    const downloadUrl = resource.fileRef ? `/uploads/${resource.fileRef}` : resource.url || '';

    this.logger.log(`Resource downloaded: ${id} by user ${userId}`);

    return { downloadUrl };
  }

  async getCategories() {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    return categories;
  }

  async getPopularTags(limit = 20) {
    const resources = await this.prisma.resource.findMany({
      select: { tags: true }
    });

    const tagCounts: Record<string, number> = {};
    
    resources.forEach(resource => {
      resource.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const popularTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }));

    return popularTags;
  }

  async getRecentResources(limit = 10) {
    const resources = await this.prisma.resource.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
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
      take: limit,
    });

    return resources.map(resource => ({
      ...resource,
      createdAt: resource.createdAt.toISOString(),
      updatedAt: resource.updatedAt.toISOString(),
    }));
  }

  async getTopDownloads(limit = 10) {
    const resources = await this.prisma.resource.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
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
      orderBy: { downloads: 'desc' },
      take: limit,
    });

    return resources.map(resource => ({
      ...resource,
      createdAt: resource.createdAt.toISOString(),
      updatedAt: resource.updatedAt.toISOString(),
    }));
  }

  async getResourcesByUser(userId: string, limit = 10) {
    const resources = await this.prisma.resource.findMany({
      where: { userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          }
        },
        flags: {
          select: {
            id: true,
            status: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return resources.map((resource: any) => ({
      ...resource,
      createdAt: resource.createdAt.toISOString(),
      updatedAt: resource.updatedAt.toISOString(),
      isFlagged: resource.flags?.some((flag: any) => flag.status === 'PENDING') || false,
    }));
  }
}
