import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DigestService } from './digest.service';

@Controller('digest')
@UseGuards(JwtAuthGuard)
export class DigestController {
  constructor(private readonly digestService: DigestService) {}

  @Post('daily')
  async triggerDailyDigest() {
    await this.digestService.sendDailyDigest();
    return { message: 'Daily digest triggered successfully' };
  }

  @Post('weekly')
  async triggerWeeklyDigest() {
    await this.digestService.sendWeeklyDigest();
    return { message: 'Weekly digest triggered successfully' };
  }
}
