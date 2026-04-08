import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SystemStats } from '@cliniq/shared-types';

@Injectable()
export class AnalyticsService {

  private prisma = new PrismaClient();

  async getSystemStats(requestingAdminId: string) {
    // Check permissions
    const admin = await this.prisma.user.findFirst({
      where: { id: requestingAdminId, verified: true }
    });

    if (!admin) {
      throw new Error('Insufficient permissions');
    }

    // Get all statistics in parallel for better performance
    const [
      totalUsers,
      activeUsers,
      newUsers,
      verifiedUsers,
      totalQuestions,
      totalAnswers,
      totalResources,
      totalStudyGroups,
      totalInteractions,
      pendingFlags
    ] = await Promise.all([
      this.prisma.user.count(),
      this.getActiveUsersCount(),
      this.getNewUsersCount(),
      this.prisma.user.count({ where: { verified: true } }),
      this.prisma.question.count(),
      this.prisma.answer.count(),
      this.prisma.resource.count(),
      this.prisma.studyGroup.count(),
      this.getTotalInteractions(),
      this.getPendingFlagsCount()
    ]);

    const stats: SystemStats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        new: newUsers,
        banned: 0, // Default value
        verified: verifiedUsers,
      },
      content: {
        questions: totalQuestions,
        answers: totalAnswers,
        resources: totalResources,
        studyGroups: totalStudyGroups,
      },
      engagement: {
        totalInteractions,
        dailyActive: activeUsers,
        weeklyActive: activeUsers,
        monthlyActive: activeUsers,
      },
      moderation: {
        pendingFlags,
        resolvedToday: 0, // Default value
        averageResolutionTime: 0, // Default value
      },
      system: {
        uptime: 99.9, // Mock value
        errorRate: 0.1, // Mock value
        responseTime: 150, // Mock value in ms
        storageUsed: 1024 * 1024 * 500, // 500MB mock value
      },
      updatedAt: new Date().toISOString(),
    };

    return stats;
  }

  async getUserAnalytics(requestingAdminId: string, query: { period?: string; metric?: string }) {
    // Check permissions
    const admin = await this.prisma.user.findFirst({
      where: { id: requestingAdminId, verified: true }
    });

    if (!admin) {
      throw new Error('Insufficient permissions');
    }

    const { period = '7d', metric = 'all' } = query;

    // Get user growth data
    const userGrowth = await this.getUserGrowthData(period);
    const userActivity = await this.getUserActivityData(period);
    const userDemographics = await this.getUserDemographics();

    return {
      growth: userGrowth,
      activity: userActivity,
      demographics: userDemographics,
      period,
      metric,
    };
  }

  async getContentAnalytics(requestingAdminId: string, query: { period?: string; type?: string }) {
    // Check permissions
    const admin = await (this.prisma.user as any).findFirst({
      where: { id: requestingAdminId, verified: true }
    });

    if (!admin) {
      throw new Error('Insufficient permissions');
    }

    const { period = '7d', type = 'all' } = query;

    const contentStats = await this.getContentStats(period, type);
    const contentTrends = await this.getContentTrends(period);
    const topCategories = await this.getTopCategories();

    return {
      stats: contentStats,
      trends: contentTrends,
      categories: topCategories,
      period,
      type,
    };
  }

  async getEngagementAnalytics(requestingAdminId: string, query: { period?: string }) {
    // Check permissions
    const admin = await this.prisma.user.findFirst({
      where: { id: requestingAdminId, verified: true }
    });

    if (!admin) {
      throw new Error('Insufficient permissions');
    }

    const { period = '7d' } = query;

    const engagementMetrics = await this.getEngagementMetrics(period);
    const activityHeatmap = await this.getActivityHeatmap(period);
    const popularContent = await this.getPopularContent(period);

    return {
      metrics: engagementMetrics,
      heatmap: activityHeatmap,
      popularContent,
      period,
    };
  }

  async exportData(_requestingAdminId: string, type: string, filters?: any, format: string = 'json') {
    // Check permissions
    const admin = await this.prisma.user.findFirst({
      where: { id: requestingAdminId, verified: true }
    });

    if (!admin) {
      throw new Error('Insufficient permissions');
    }

    let data: any = [];

    switch (type) {
      case 'users':
        data = await this.exportUsers(filters);
        break;
      case 'questions':
        data = await this.exportQuestions(filters);
        break;
      case 'answers':
        data = await this.exportAnswers(filters);
        break;
      case 'resources':
        data = await this.exportResources(filters);
        break;
      case 'study_groups':
        data = await this.exportStudyGroups(filters);
        break;
      default:
        throw new Error('Invalid export type');
    }

    // Generate export URL or return data
    const exportId = `export_${Date.now()}`;
    const filename = `${type}_export_${new Date().toISOString().split('T')[0]}.${format}`;

    // In a real implementation, this would save to storage and return a download URL
    return {
      exportId,
      filename,
      format,
      recordCount: Array.isArray(data) ? data.length : 0,
      downloadUrl: `/api/admin/exports/${exportId}`,
      generatedAt: new Date().toISOString(),
    };
  }

  // Helper methods
  private async getActiveUsersCount(): Promise<number> {
    // Users who have logged in in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // This would use actual lastLoginAt field in real implementation
    // For now, return a mock value
    return Math.floor(Math.random() * 100) + 50;
  }

  private async getNewUsersCount(): Promise<number> {
    // Users who joined in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });
  }

  private async getTotalInteractions(): Promise<number> {
    // Sum of all user interactions (questions, answers, upvotes, etc.)
    const [questions, answers] = await Promise.all([
      this.prisma.question.count(),
      this.prisma.answer.count()
    ]);

    return questions + answers;
  }

  private async getPendingFlagsCount(): Promise<number> {
    // For now, return a mock value as Flag model access might need refinement
    return Math.floor(Math.random() * 10);
  }

  private async getUserGrowthData(period: string) {
    const days = this.getPeriodDays(period);
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      data.push({
        date: dateStr,
        newUsers: Math.floor(Math.random() * 10) + 1,
        totalUsers: Math.floor(Math.random() * 1000) + 500,
      });
    }

    return data;
  }

  private async getUserActivityData(period: string) {
    const days = this.getPeriodDays(period);
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      data.push({
        date: dateStr,
        activeUsers: Math.floor(Math.random() * 100) + 20,
        pageViews: Math.floor(Math.random() * 1000) + 200,
        avgSessionDuration: Math.floor(Math.random() * 300) + 60, // seconds
      });
    }

    return data;
  }

  private async getUserDemographics() {
    const [byYear, byProgram, byInstitution] = await Promise.all([
      this.getUsersByYear(),
      this.getUsersByProgram(),
      this.getUsersByInstitution()
    ]);

    return {
      byYear,
      byProgram,
      byInstitution,
    };
  }

  private async getUsersByYear() {
    const years = [1, 2, 3, 4, 5, 6];
    const data = [];

    for (const year of years) {
      const count = await this.prisma.user.count({
        where: { year }
      });
      data.push({ year, count });
    }

    return data;
  }

  private async getUsersByProgram() {
    const programs = ['NURSING', 'MIDWIFERY', 'COMMUNITY_HEALTH'];
    const data = [];

    for (const program of programs) {
      const count = await this.prisma.user.count({
        where: { program: program as any }
      });
      data.push({ program, count });
    }

    return data;
  }

  private async getUsersByInstitution() {
    // This would group by institution in real implementation
    return [
      { institution: 'University of Ghana', count: 150 },
      { institution: 'KNUST', count: 120 },
      { institution: 'University of Cape Coast', count: 80 },
      { institution: 'Other', count: 50 }
    ];
  }

  private async getContentStats(period: string, type: string) {
    const days = this.getPeriodDays(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [questions, answers, resources, studyGroups] = await Promise.all([
      this.prisma.question.count({
        where: {
          ...(type !== 'all' && type !== 'questions' ? { id: 'nonexistent' } : {}),
          createdAt: { gte: startDate }
        }
      }),
      this.prisma.answer.count({
        where: {
          ...(type !== 'all' && type !== 'answers' ? { id: 'nonexistent' } : {}),
          createdAt: { gte: startDate }
        }
      }),
      this.prisma.resource.count({
        where: {
          ...(type !== 'all' && type !== 'resources' ? { id: 'nonexistent' } : {}),
          createdAt: { gte: startDate }
        }
      }),
      this.prisma.studyGroup.count({
        where: {
          ...(type !== 'all' && type !== 'study_groups' ? { id: 'nonexistent' } : {}),
          createdAt: { gte: startDate }
        }
      })
    ]);

    return {
      questions,
      answers,
      resources,
      studyGroups,
      total: questions + answers + resources + studyGroups,
    };
  }

  private async getContentTrends(period: string) {
    const days = this.getPeriodDays(period);
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      data.push({
        date: dateStr,
        questions: Math.floor(Math.random() * 20) + 5,
        answers: Math.floor(Math.random() * 50) + 10,
        resources: Math.floor(Math.random() * 10) + 2,
        studyGroups: Math.floor(Math.random() * 5) + 1,
      });
    }

    return data;
  }

  private async getTopCategories() {
    // This would use actual categories in real implementation
    return [
      { category: 'Medical-Surgical', count: 150 },
      { category: 'Pharmacology', count: 120 },
      { category: 'Pediatrics', count: 90 },
      { category: 'Mental Health', count: 80 },
      { category: 'Community Health', count: 70 }
    ];
  }

  private async getEngagementMetrics(period: string) {
    return {
      avgSessionDuration: Math.floor(Math.random() * 300) + 120, // seconds
      bounceRate: Math.random() * 30 + 20, // percentage
      pageViewsPerSession: Math.random() * 5 + 2,
      newVsReturning: {
        new: Math.random() * 40 + 30, // percentage
        returning: Math.random() * 40 + 30, // percentage
      },
      topActions: [
        { action: 'View Question', count: Math.floor(Math.random() * 1000) + 500 },
        { action: 'Post Answer', count: Math.floor(Math.random() * 500) + 200 },
        { action: 'Upload Resource', count: Math.floor(Math.random() * 100) + 50 },
      ]
    };
  }

  private async getActivityHeatmap(_period: string) {
    const days = this.getPeriodDays(_period);
    const heatmap = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      for (let hour = 0; hour < 24; hour++) {
        heatmap.push({
          date: date.toISOString().split('T')[0],
          hour,
          activity: Math.floor(Math.random() * 100),
        });
      }
    }

    return heatmap;
  }

  private async getPopularContent(period: string) {
    const days = this.getPeriodDays(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [topQuestions, topAnswers, topResources] = await Promise.all([
      this.prisma.question.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { views: 'desc' },
        take: 5,
        select: { id: true, title: true, views: true, createdAt: true }
      }),
      this.prisma.answer.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { upvotes: 'desc' },
        take: 5,
        select: { id: true, body: true, upvotes: true, createdAt: true }
      }),
      this.prisma.resource.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { downloads: 'desc' },
        take: 5,
        select: { id: true, title: true, downloads: true, createdAt: true }
      })
    ]);

    return {
      questions: topQuestions.map(q => ({
        ...q,
        createdAt: q.createdAt.toISOString()
      })),
      answers: topAnswers.map(a => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
        content: a.body.substring(0, 100) + '...'
      })),
      resources: topResources.map(r => ({
        ...r,
        createdAt: r.createdAt.toISOString()
      })),
    };
  }

  // Export methods
  private async exportUsers(filters?: any) {
    const users = await this.prisma.user.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        email: true,
        institution: true,
        program: true,
        year: true,
        verified: true,
        createdAt: true,
      }
    });

    return users.map(user => ({
      ...user,
      createdAt: user.createdAt.toISOString()
    }));
  }

  private async exportQuestions(filters?: any) {
    const questions = await this.prisma.question.findMany({
      where: filters,
      include: {
        user: {
          select: { name: true, email: true }
        },
        category: {
          select: { name: true }
        }
      }
    });

    return questions.map((q: any) => ({
      ...q,
      createdAt: q.createdAt.toISOString(),
      updatedAt: q.updatedAt.toISOString(),
      userName: q.user.name,
      userEmail: q.user.email,
      categoryName: q.category?.name || 'Unknown',
    }));
  }

  private async exportAnswers(filters?: any) {
    const answers = await this.prisma.answer.findMany({
      where: filters,
      include: {
        user: {
          select: { name: true, email: true }
        },
        question: {
          select: { title: true }
        }
      }
    });

    return answers.map((a: any) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
      userName: a.user.name,
      userEmail: a.user.email,
      questionTitle: a.question.title,
    }));
  }

  private async exportResources(filters?: any) {
    const resources = await this.prisma.resource.findMany({
      where: filters,
      include: {
        user: {
          select: { name: true, email: true }
        },
        category: {
          select: { name: true }
        }
      }
    });

    return resources.map((r: any) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      userName: r.user.name,
      userEmail: r.user.email,
      categoryName: r.category?.name || 'Unknown',
    }));
  }

  private async exportStudyGroups(filters?: any) {
    const studyGroups = await this.prisma.studyGroup.findMany({
      where: filters,
      include: {
        owner: {
          select: { name: true, email: true }
        }
      }
    });

    return studyGroups.map((sg: any) => ({
      ...sg,
      createdAt: sg.createdAt.toISOString(),
      updatedAt: sg.updatedAt.toISOString(),
      ownerName: sg.owner.name,
      ownerEmail: sg.owner.email,
    }));
  }

  private getPeriodDays(period: string): number {
    const periodMap: Record<string, number> = {
      '1d': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
    };

    return periodMap[period] || 7;
  }
}
