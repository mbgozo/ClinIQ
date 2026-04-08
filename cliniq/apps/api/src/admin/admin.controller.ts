import { Controller, Get, Post, Put, Delete, UseGuards, Request, Query, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';
import { ModerationService } from './moderation.service';
import { AnalyticsService } from './analytics.service';
import { SystemService } from './system.service';
import { 
  CreateAdminUserSchema, 
  UpdateAdminUserSchema, 
  CreateSystemAlertSchema,
  AdminRole,
  Permission
} from '@cliniq/shared-types';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly moderationService: ModerationService,
    private readonly analyticsService: AnalyticsService,
    private readonly systemService: SystemService
  ) {}

  // Admin User Management
  @Get('users')
  async getAdminUsers(@Request() req: any) {
    const adminId = req.user.sub;
    const users = await this.adminService.getAdminUsers(adminId);
    return { data: users };
  }

  @Post('users')
  async createAdminUser(@Request() req: any, @Body() data: any) {
    const adminId = req.user.sub;
    const validatedData = CreateAdminUserSchema.parse(data);
    const user = await this.adminService.createAdminUser(adminId, validatedData);
    return { data: user };
  }

  @Put('users/:id')
  async updateAdminUser(@Param('id') id: string, @Request() req: any, @Body() data: any) {
    const adminId = req.user.sub;
    const validatedData = UpdateAdminUserSchema.parse(data);
    const user = await this.adminService.updateAdminUser(adminId, id, validatedData);
    return { data: user };
  }

  @Delete('users/:id')
  async deleteAdminUser(@Param('id') id: string, @Request() req: any) {
    const adminId = req.user.sub;
    await this.adminService.deleteAdminUser(adminId, id);
    return { message: 'Admin user deleted successfully' };
  }

  // Regular User Management
  @Get('regular-users')
  async getRegularUsers(@Request() req: any, @Query() query: { page?: number; limit?: number; search?: string; status?: string }) {
    const adminId = req.user.sub;
    const users = await this.adminService.getRegularUsers(adminId, query);
    return { data: users };
  }

  @Put('regular-users/:id/ban')
  async banUser(@Param('id') id: string, @Request() req: any, @Body() body: { reason: string; duration?: number }) {
    const adminId = req.user.sub;
    await this.adminService.banUser(adminId, id, body.reason, body.duration);
    return { message: 'User banned successfully' };
  }

  @Put('regular-users/:id/unban')
  async unbanUser(@Param('id') id: string, @Request() req: any) {
    const adminId = req.user.sub;
    await this.adminService.unbanUser(adminId, id);
    return { message: 'User unbanned successfully' };
  }

  @Delete('regular-users/:id')
  async deleteUser(@Param('id') id: string, @Request() req: any) {
    const adminId = req.user.sub;
    await this.adminService.deleteUser(adminId, id);
    return { message: 'User deleted successfully' };
  }

  // Moderation
  @Get('moderation/queue')
  async getModerationQueue(@Request() req: any, @Query() query: { page?: number; limit?: number; status?: string }) {
    const adminId = req.user.sub;
    const queue = await this.moderationService.getModerationQueue(adminId, query);
    return { data: queue };
  }

  @Put('moderation/queue/:id/resolve')
  async resolveModerationItem(
    @Param('id') id: string, 
    @Request() req: any, 
    @Body() body: { action: string; reason?: string }
  ) {
    const adminId = req.user.sub;
    const result = await this.moderationService.resolveModerationItem(adminId, id, body.action, body.reason);
    return { data: result };
  }

  @Put('moderation/queue/:id/dismiss')
  async dismissModerationItem(@Param('id') id: string, @Request() req: any) {
    const adminId = req.user.sub;
    await this.moderationService.dismissModerationItem(adminId, id);
    return { message: 'Moderation item dismissed' };
  }

  // Analytics
  @Get('analytics/stats')
  async getSystemStats(@Request() req: any) {
    const adminId = req.user.sub;
    const stats = await this.analyticsService.getSystemStats(adminId);
    return { data: stats };
  }

  @Get('analytics/users')
  async getUserAnalytics(@Request() req: any, @Query() query: { period?: string; metric?: string }) {
    const adminId = req.user.sub;
    const analytics = await this.analyticsService.getUserAnalytics(adminId, query);
    return { data: analytics };
  }

  @Get('analytics/content')
  async getContentAnalytics(@Request() req: any, @Query() query: { period?: string; type?: string }) {
    const adminId = req.user.sub;
    const analytics = await this.analyticsService.getContentAnalytics(adminId, query);
    return { data: analytics };
  }

  @Get('analytics/engagement')
  async getEngagementAnalytics(@Request() req: any, @Query() query: { period?: string }) {
    const adminId = req.user.sub;
    const analytics = await this.analyticsService.getEngagementAnalytics(adminId, query);
    return { data: analytics };
  }

  @Post('analytics/export')
  async exportData(@Request() req: any, @Body() body: { type: string; filters?: any; format?: string }) {
    const adminId = req.user.sub;
    const result = await this.analyticsService.exportData(adminId, body.type, body.filters, body.format);
    return { data: result };
  }

  // System Management
  @Get('system/alerts')
  async getSystemAlerts(@Request() req: any) {
    const adminId = req.user.sub;
    const alerts = await this.systemService.getSystemAlerts(adminId);
    return { data: alerts };
  }

  @Post('system/alerts')
  async createSystemAlert(@Request() req: any, @Body() data: any) {
    const adminId = req.user.sub;
    const validatedData = CreateSystemAlertSchema.parse(data);
    const alert = await this.systemService.createSystemAlert(adminId, validatedData);
    return { data: alert };
  }

  @Put('system/alerts/:id')
  async updateSystemAlert(@Param('id') id: string, @Request() req: any, @Body() data: any) {
    const adminId = req.user.sub;
    const alert = await this.systemService.updateSystemAlert(adminId, id, data);
    return { data: alert };
  }

  @Delete('system/alerts/:id')
  async deleteSystemAlert(@Param('id') id: string, @Request() req: any) {
    const adminId = req.user.sub;
    await this.systemService.deleteSystemAlert(adminId, id);
    return { message: 'System alert deleted successfully' };
  }

  @Get('system/settings')
  async getSystemSettings(@Request() req: any) {
    const adminId = req.user.sub;
    const settings = await this.systemService.getSystemSettings(adminId);
    return { data: settings };
  }

  @Put('system/settings')
  async updateSystemSettings(@Request() req: any, @Body() data: any) {
    const adminId = req.user.sub;
    const settings = await this.systemService.updateSystemSettings(adminId, data);
    return { data: settings };
  }

  @Get('system/logs')
  async getAdminLogs(@Request() req: any, @Query() query: { page?: number; limit?: number; adminId?: string; action?: string }) {
    const adminId = req.user.sub;
    const logs = await this.systemService.getAdminLogs(adminId, query);
    return { data: logs };
  }

  @Get('system/health')
  async getSystemHealth(@Request() req: any) {
    const adminId = req.user.sub;
    const health = await this.systemService.getSystemHealth(adminId);
    return { data: health };
  }

  // Content Management
  @Get('content/questions')
  async getQuestions(@Request() req: any, @Query() query: { page?: number; limit?: number; status?: string; flagged?: boolean }) {
    const adminId = req.user.sub;
    const questions = await this.adminService.getQuestions(adminId, query);
    return { data: questions };
  }

  @Delete('content/questions/:id')
  async deleteQuestion(@Param('id') id: string, @Request() req: any) {
    const adminId = req.user.sub;
    await this.adminService.deleteQuestion(adminId, id);
    return { message: 'Question deleted successfully' };
  }

  @Get('content/answers')
  async getAnswers(@Request() req: any, @Query() query: { page?: number; limit?: number; status?: string; flagged?: boolean }) {
    const adminId = req.user.sub;
    const answers = await this.adminService.getAnswers(adminId, query);
    return { data: answers };
  }

  @Delete('content/answers/:id')
  async deleteAnswer(@Param('id') id: string, @Request() req: any) {
    const adminId = req.user.sub;
    await this.adminService.deleteAnswer(adminId, id);
    return { message: 'Answer deleted successfully' };
  }

  @Get('content/resources')
  async getResources(@Request() req: any, @Query() query: { page?: number; limit?: number; status?: string; flagged?: boolean }) {
    const adminId = req.user.sub;
    const resources = await this.adminService.getResources(adminId, query);
    return { data: resources };
  }

  @Put('content/resources/:id/approve')
  async approveResource(@Param('id') id: string, @Request() req: any) {
    const adminId = req.user.sub;
    await this.adminService.approveResource(adminId, id);
    return { message: 'Resource approved successfully' };
  }

  @Delete('content/resources/:id')
  async deleteResource(@Param('id') id: string, @Request() req: any) {
    const adminId = req.user.sub;
    await this.adminService.deleteResource(adminId, id);
    return { message: 'Resource deleted successfully' };
  }

  // Study Groups Management
  @Get('study-groups')
  async getStudyGroups(@Request() req: any, @Query() query: { page?: number; limit?: number; status?: string }) {
    const adminId = req.user.sub;
    const groups = await this.adminService.getStudyGroups(adminId, query);
    return { data: groups };
  }

  @Delete('study-groups/:id')
  async deleteStudyGroup(@Param('id') id: string, @Request() req: any) {
    const adminId = req.user.sub;
    await this.adminService.deleteStudyGroup(adminId, id);
    return { message: 'Study group deleted successfully' };
  }

  // Chat Management
  @Get('chat/logs')
  async getChatLogs(@Request() req: any, @Query() query: { page?: number; limit?: number; conversationId?: string; userId?: string }) {
    const adminId = req.user.sub;
    const logs = await this.adminService.getChatLogs(adminId, query);
    return { data: logs };
  }

  @Delete('chat/messages/:id')
  async deleteChatMessage(@Param('id') id: string, @Request() req: any) {
    const adminId = req.user.sub;
    await this.adminService.deleteChatMessage(adminId, id);
    return { message: 'Chat message deleted successfully' };
  }

  // Permissions Check
  @Get('permissions')
  async getMyPermissions(@Request() req: any) {
    const adminId = req.user.sub;
    const permissions = await this.adminService.getAdminPermissions(adminId);
    return { data: permissions };
  }
}
