import { Module, forwardRef } from '@nestjs/common';
import { MentorsController } from './mentors.controller';
import { MentorsService } from './mentors.service';
import { MentorshipService } from './mentorship.service';
import { QaModule } from '../qa/qa.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [forwardRef(() => QaModule), forwardRef(() => NotificationsModule), forwardRef(() => GamificationModule)],
  controllers: [MentorsController],
  providers: [MentorsService, MentorshipService],
  exports: [MentorsService, MentorshipService],
})
export class MentorsModule {}
