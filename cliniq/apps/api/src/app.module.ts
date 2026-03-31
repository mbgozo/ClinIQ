import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { QaModule } from "./qa/qa.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { GamificationModule } from "./gamification/gamification.module";

@Module({
  imports: [AuthModule, QaModule, NotificationsModule, GamificationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
