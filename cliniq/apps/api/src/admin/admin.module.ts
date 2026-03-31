import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ModerationService } from './moderation.service';
import { AnalyticsService } from './analytics.service';
import { SystemService } from './system.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, ModerationService, AnalyticsService, SystemService],
  exports: [AdminService, ModerationService, AnalyticsService, SystemService],
})
export class AdminModule {}
