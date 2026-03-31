import { Body, Controller, Get, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RegisterDto, RegisterDtoSchema } from "./dto/register.dto";
import { LoginDto, LoginDtoSchema } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() body: RegisterDto) {
    const parsed = RegisterDtoSchema.parse(body);
    const result = await this.authService.register(parsed);
    return { data: result };
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Body() body: LoginDto, @Request() req: any) {
    // Validate body shape for consistency, even though LocalStrategy also reads from it.
    LoginDtoSchema.parse(body);
    return { data: await this.authService.login(req.user) };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async me(@Request() req: any) {
    const user = await this.authService.getCurrentUser(req.user.sub);
    return { data: user };
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me")
  async updateProfile(@Request() req: any, @Body() body: Partial<RegisterDto>) {
    const updated = await this.authService.updateProfile(req.user.sub, body);
    return { data: updated };
  }

  @UseGuards(JwtAuthGuard)
  @Post("me/avatar")
  async uploadAvatar() {
    // Placeholder — will be replaced with R2 upload flow.
    return { data: { avatarUrl: null } };
  }

  @Post("verify-otp")
  async verifyOtp() {
    // Placeholder — OTP implementation will be added later.
    return { data: { verified: true } };
  }

  @Post("request-otp")
  async requestOtp() {
    return { data: { sent: true } };
  }

  @Post("forgot-password")
  async forgotPassword() {
    return { data: { sent: true } };
  }

  @Post("reset-password")
  async resetPassword() {
    return { data: { reset: true } };
  }
}

