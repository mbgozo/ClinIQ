import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { QaModule } from "./qa/qa.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { GamificationModule } from "./gamification/gamification.module";
import { MentorsModule } from "./mentors/mentors.module";
import { ResourcesModule } from "./resources/resources.module";
import { StudyGroupsModule } from "./study-groups/study-groups.module";

@Module({
  imports: [
    AuthModule,
    QaModule,
    NotificationsModule,
    GamificationModule,
    MentorsModule,
    ResourcesModule,
    StudyGroupsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
