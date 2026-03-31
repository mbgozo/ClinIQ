import { Module, forwardRef } from "@nestjs/common";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { EmailService } from "./email/email.service";
import { DigestModule } from "./digest.module";
import { QaModule } from "../qa/qa.module";

@Module({
  imports: [forwardRef(() => QaModule), DigestModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
