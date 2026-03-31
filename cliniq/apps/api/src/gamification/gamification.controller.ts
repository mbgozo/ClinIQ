import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GamificationService } from './gamification.service';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('profile')
  async getUserGamificationProfile(@Request() req) {
    const userId = req.user.sub;
    const profile = await this.gamificationService.getUserProfile(userId);
    return { data: profile };
  }

  @Get('badges')
  async getUserBadges(@Request() req) {
    const userId = req.user.sub;
    const badges = await this.gamificationService.getUserBadges(userId);
    return { data: badges };
  }

  @Get('leaderboard')
  async getLeaderboard() {
    const leaderboard = await this.gamificationService.getLeaderboard();
    return { data: leaderboard };
  }

  @Get('badge-definitions')
  async getBadgeDefinitions() {
    const definitions = await this.gamificationService.getBadgeDefinitions();
    return { data: definitions };
  }
}
