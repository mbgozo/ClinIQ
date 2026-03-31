import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { QaModule } from "./qa/qa.module";
import { NotificationsModule } from "./notifications/notifications.module";

@Module({
  imports: [AuthModule, QaModule, NotificationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
