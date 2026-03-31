import { Injectable, Logger } from "@nestjs/common";
import { DigestService } from "./digest.service";

@Injectable()
export class DigestScheduler {
  private readonly logger = new Logger(DigestScheduler.name);

  constructor(private readonly digestService: DigestService) {}

  // Manual trigger methods for now - cron jobs will be added when @nestjs/schedule is installed
  async handleDailyDigest() {
    this.logger.log("Running daily digest job");
    try {
      await this.digestService.sendDailyDigest();
      this.logger.log("Daily digest job completed successfully");
    } catch (error) {
      this.logger.error("Daily digest job failed:", error);
    }
  }

  async handleWeeklyDigest() {
    this.logger.log("Running weekly digest job");
    try {
      await this.digestService.sendWeeklyDigest();
      this.logger.log("Weekly digest job completed successfully");
    } catch (error) {
      this.logger.error("Weekly digest job failed:", error);
    }
  }

  // Helper method to check if it's time to run daily digest (8am Ghana time)
  shouldRunDailyDigest(): boolean {
    const now = new Date();
    const ghanaTime = new Date(now.getTime() + 0 * 60 * 60 * 1000); // GMT+0
    return ghanaTime.getHours() === 8 && ghanaTime.getMinutes() < 5; // Within first 5 minutes of 8am
  }

  // Helper method to check if it's Monday (day 1) and 8am Ghana time
  shouldRunWeeklyDigest(): boolean {
    const now = new Date();
    const ghanaTime = new Date(now.getTime() + 0 * 60 * 60 * 1000); // GMT+0
    return ghanaTime.getDay() === 1 && ghanaTime.getHours() === 8 && ghanaTime.getMinutes() < 5;
  }
}
