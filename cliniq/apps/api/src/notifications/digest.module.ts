import { Module } from "@nestjs/common";
import { DigestController } from "./digest.controller";
import { DigestService } from "./digest.service";
import { DigestScheduler } from "./digest.scheduler";
import { EmailService } from "./email/email.service";

@Module({
  controllers: [DigestController],
  providers: [DigestService, DigestScheduler, EmailService],
})
export class DigestModule {}
