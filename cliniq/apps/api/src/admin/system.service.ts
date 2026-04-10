import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { 
  SystemAlert, 
  CreateSystemAlertInput,
  SystemAlertType
} from '@cliniq/shared-types';

@Injectable()
export class SystemService {
  private readonly logger = new Logger(SystemService.name);
  private prisma = new PrismaClient();
  
  // In-memory storage for system alerts (would use database in real implementation)
  private systemAlerts: Map<string, SystemAlert> = new Map();
  private systemSettings: Record<string, any> = {
    siteName: 'ClinIQ',
    siteDescription: 'Clinical Intelligence Platform for Nursing Education',
    maintenanceMode: false,
    allowRegistrations: true,
    emailNotificationsEnabled: true,
    maxFileSize: 10485760, // 10MB
    allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png', 'gif'],
    defaultUserRole: 'USER',
    sessionTimeout: 3600, // 1 hour
    passwordMinLength: 8,
    requireEmailVerification: false,
    enableChat: true,
    enableStudyGroups: true,
    enableMentorship: true,
    enableResources: true,
  };

  async getSystemAlerts(requestingAdminId: string) {
    // Check permissions
    const admin = await this.prisma.user.findFirst({
      where: { id: requestingAdminId, verified: true }
    });

    if (!admin) {
      throw new Error('Insufficient permissions');
    }

    const alerts = Array.from(this.systemAlerts.values());
    const now = new Date();

    // Filter alerts that should be visible
    const visibleAlerts = alerts.filter(alert => {
      if (!alert.isActive) return false;
      
      const startsAt = new Date(alert.startsAt);
      const endsAt = alert.endsAt ? new Date(alert.endsAt) : null;
      
      if (now < startsAt) return false;
      if (endsAt && now > endsAt) return false;
      
      return true;
    });

    return visibleAlerts;
  }

  async createSystemAlert(requestingAdminId: string, data: CreateSystemAlertInput) {
    // Check permissions
    const admin = await this.prisma.user.findFirst({
      where: { id: requestingAdminId, verified: true }
    });

    if (!admin) {
      throw new Error('Insufficient permissions');
    }

    const alert: SystemAlert = {
      id: `alert_${Date.now()}`,
      type: data.type,
      title: data.title,
      message: data.message,
      isActive: true,
      targetAudience: data.targetAudience,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      createdBy: requestingAdminId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dismissCount: 0,
    };

    this.systemAlerts.set(alert.id, alert);

    this.logger.log(`System alert created: ${alert.id} by ${requestingAdminId}`);

    return alert;
  }

  async updateSystemAlert(requestingAdminId: string, alertId: string, data: any) {
    // Check permissions
    const admin = await this.prisma.user.findFirst({
      where: { id: requestingAdminId, verified: true }
    });

    if (!admin) {
      throw new Error('Insufficient permissions');
    }

    const alert = this.systemAlerts.get(alertId);
    if (!alert) {
      throw new Error('Alert not found');
    }

    const updatedAlert = {
      ...alert,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.systemAlerts.set(alertId, updatedAlert);

    this.logger.log(`System alert updated: ${alertId} by ${requestingAdminId}`);

    return updatedAlert;
  }

  async deleteSystemAlert(requestingAdminId: string, alertId: string) {
    // Check permissions
    const admin = await this.prisma.user.findFirst({
      where: { id: requestingAdminId, verified: true }
    });

    if (!admin) {
      throw new Error('Insufficient permissions');
    }

    const deleted = this.systemAlerts.delete(alertId);
    if (!deleted) {
      throw new Error('Alert not found');
    }

    this.logger.log(`System alert deleted: ${alertId} by ${requestingAdminId}`);
  }

  async getSystemSettings(requestingAdminId: string) {
    // Check permissions
    const admin = await this.prisma.user.findFirst({
      where: { id: requestingAdminId, verified: true }
    });

    if (!admin) {
      throw new Error('Insufficient permissions');
    }

    return this.systemSettings;
  }

  async updateSystemSettings(requestingAdminId: string, settings: any) {
    // Check permissions
    const admin = await this.prisma.user.findFirst({
      where: { id: requestingAdminId, verified: true }
    });

    if (!admin) {
      throw new Error('Insufficient permissions');
    }

    // Update settings
    this.systemSettings = {
      ...this.systemSettings,
      ...settings,
    };

    this.logger.log(`System settings updated by ${requestingAdminId}`);

    return this.systemSettings;
  }

  async getAdminLogs(requestingAdminId: string, query: { page?: number; limit?: number; adminId?: string; action?: string }) {
    // Check permissions
    const admin = await this.prisma.user.findFirst({
      where: { id: requestingAdminId, verified: true }
    });

    if (!admin) {
      throw new Error('Insufficient permissions');
    }

    // In a real implementation, this would query an AdminLog table
    // For now, return mock data
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const mockLogs = [
      {
        id: 'log_1',
        adminId: requestingAdminId,
        action: 'CREATE_ADMIN_USER',
        entityType: 'AdminUser',
        entityId: 'admin_123',
        details: { targetUserId: 'user_456', role: 'ADMIN' },
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        createdAt: new Date().toISOString(),
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email || '',
        }
      },
      {
        id: 'log_2',
        adminId: requestingAdminId,
        action: 'DELETE_QUESTION',
        entityType: 'Question',
        entityId: 'question_789',
        details: { reason: 'Inappropriate content' },
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email || '',
        }
      }
    ];

    return {
      logs: mockLogs.slice(skip, skip + limit),
      total: mockLogs.length,
      page,
      limit,
    };
  }

  async getSystemHealth(requestingAdminId: string) {
    // Check permissions
    const admin = await this.prisma.user.findFirst({
      where: { id: requestingAdminId, verified: true }
    });

    if (!admin) {
      throw new Error('Insufficient permissions');
    }

    // Check various system health indicators
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: this.checkDatabaseHealth(),
        api: this.checkApiHealth(),
        storage: this.checkStorageHealth(),
        email: this.checkEmailHealth(),
      },
      metrics: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        activeConnections: 0, // Would track WebSocket connections
      },
      lastChecks: {
        database: new Date().toISOString(),
        api: new Date().toISOString(),
        storage: new Date().toISOString(),
        email: new Date().toISOString(),
      }
    };

    return health;
  }

  async dismissAlert(alertId: string, userId: string) {
    const alert = this.systemAlerts.get(alertId);
    if (!alert) {
      throw new Error('Alert not found');
    }

    // Increment dismiss count
    const updatedAlert = {
      ...alert,
      dismissCount: alert.dismissCount + 1,
    };

    this.systemAlerts.set(alertId, updatedAlert);

    this.logger.log(`Alert dismissed: ${alertId} by user ${userId}`);

    return updatedAlert;
  }

  // Health check methods
  private checkDatabaseHealth() {
    return {
      status: 'healthy',
      responseTime: Math.random() * 100 + 10, // Mock response time in ms
      connections: Math.floor(Math.random() * 10) + 1,
      lastCheck: new Date().toISOString(),
    };
  }

  private checkApiHealth() {
    return {
      status: 'healthy',
      responseTime: Math.random() * 50 + 5, // Mock response time in ms
      endpoints: Math.floor(Math.random() * 50) + 20,
      errorRate: Math.random() * 2, // Mock error rate percentage
      lastCheck: new Date().toISOString(),
    };
  }

  private checkStorageHealth() {
    return {
      status: 'healthy',
      usedSpace: Math.random() * 1024 * 1024 * 1024, // Mock used space in bytes
      totalSpace: 10 * 1024 * 1024 * 1024, // 10GB total space
      availableSpace: 9 * 1024 * 1024 * 1024, // 9GB available
      lastCheck: new Date().toISOString(),
    };
  }

  private checkEmailHealth() {
    return {
      status: 'healthy',
      responseTime: Math.random() * 200 + 50, // Mock response time in ms
      sentToday: Math.floor(Math.random() * 1000) + 100,
      failedToday: Math.floor(Math.random() * 10),
      lastCheck: new Date().toISOString(),
    };
  }

  // System maintenance methods
  async enableMaintenanceMode(requestingAdminId: string, reason?: string) {
    // Check permissions
    const admin = await this.prisma.user.findFirst({
      where: { id: requestingAdminId, verified: true }
    });

    if (!admin) {
      throw new Error('Insufficient permissions');
    }

    this.systemSettings.maintenanceMode = true;
    this.systemSettings.maintenanceReason = reason || 'System maintenance';

    // Create a system alert
    await this.createSystemAlert(requestingAdminId, {
      type: SystemAlertType.MAINTENANCE,
      title: 'System Maintenance',
      message: reason || 'The system is currently under maintenance. Please try again later.',
      targetAudience: ['ALL'],
      startsAt: new Date().toISOString(),
    });

    this.logger.log(`Maintenance mode enabled by ${requestingAdminId}: ${reason}`);
  }

  async disableMaintenanceMode(requestingAdminId: string) {
    // Check permissions
    const admin = await this.prisma.user.findFirst({
      where: { id: requestingAdminId, verified: true }
    });

    if (!admin) {
      throw new Error('Insufficient permissions');
    }

    this.systemSettings.maintenanceMode = false;
    delete this.systemSettings.maintenanceReason;

    // Remove maintenance alerts
    const maintenanceAlerts = Array.from(this.systemAlerts.values())
      .filter(alert => alert.type === SystemAlertType.MAINTENANCE);
    
    maintenanceAlerts.forEach(alert => {
      this.systemAlerts.delete(alert.id);
    });

    this.logger.log(`Maintenance mode disabled by ${requestingAdminId}`);
  }

  // Backup and restore methods
  async createBackup(requestingAdminId: string, type: 'full' | 'incremental' = 'full') {
    // Check permissions
    const admin = await this.prisma.user.findFirst({
      where: { id: requestingAdminId, verified: true }
    });

    if (!admin) {
      throw new Error('Insufficient permissions');
    }

    const backupId = `backup_${Date.now()}`;
    const timestamp = new Date().toISOString();

    // In a real implementation, this would:
    // 1. Create database backup
    // 2. Backup file storage
    // 3. Create backup metadata
    // 4. Store backup in secure location

    this.logger.log(`Backup created: ${backupId} (${type}) by ${requestingAdminId}`);

    return {
      backupId,
      type,
      timestamp,
      size: Math.floor(Math.random() * 1024 * 1024 * 100) + 1024 * 1024, // Mock size
      status: 'completed',
      downloadUrl: `/api/admin/backups/${backupId}/download`,
    };
  }

  async getBackups(requestingAdminId: string) {
    // Check permissions
    const admin = await this.prisma.user.findFirst({
      where: { id: requestingAdminId, verified: true }
    });

    if (!admin) {
      throw new Error('Insufficient permissions');
    }

    // Mock backup data
    return [
      {
        backupId: 'backup_001',
        type: 'full',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        size: 1024 * 1024 * 50, // 50MB
        status: 'completed',
        downloadUrl: '/api/admin/backups/backup_001/download',
      },
      {
        backupId: 'backup_002',
        type: 'incremental',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        size: 1024 * 1024 * 10, // 10MB
        status: 'completed',
        downloadUrl: '/api/admin/backups/backup_002/download',
      }
    ];
  }

  async restoreBackup(requestingAdminId: string, backupId: string) {
    // Check permissions
    const admin = await this.prisma.user.findFirst({
      where: { id: requestingAdminId, verified: true }
    });

    if (!admin) {
      throw new Error('Insufficient permissions');
    }

    // In a real implementation, this would:
    // 1. Validate backup integrity
    // 2. Put system in maintenance mode
    // 3. Restore database
    // 4. Restore files
    // 5. Verify restoration
    // 6. Disable maintenance mode

    this.logger.log(`Backup restore initiated: ${backupId} by ${requestingAdminId}`);

    return {
      backupId,
      status: 'initiated',
      estimatedTime: 300, // 5 minutes
      startedAt: new Date().toISOString(),
    };
  }
}
