import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaClient, Role, User } from "@prisma/client";
import type { RegisterInput } from "@cliniq/shared-types";

@Injectable()
export class AuthService {
  private prisma = new PrismaClient();

  constructor(private readonly jwtService: JwtService) {}

  private buildTokenPayload(user: User) {
    return {
      sub: user.id,
      role: user.role as Role,
      email: user.email ?? undefined,
      phone: user.phone ?? undefined
    };
  }

  async validateUser(emailOrPhone: string, password: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrPhone }, { phone: emailOrPhone }]
      }
    });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    // Password hashing will be implemented in a later step.
    if (user.passwordHash !== password) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return user;
  }

  async register(input: RegisterInput) {
    const user = await this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        passwordHash: input.password, // bcrypt will replace this in a later step.
        institution: input.institution,
        year: input.year,
        program: input.program as any
      }
    });
    const token = await this.jwtService.signAsync(this.buildTokenPayload(user));
    return { user, token };
  }

  async login(user: User) {
    const payload = this.buildTokenPayload(user);
    const token = await this.jwtService.signAsync(payload);
    return { user, token };
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async updateProfile(userId: string, data: Partial<RegisterInput>) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        institution: data.institution,
        year: data.year,
        program: data.program as any
      }
    });
    return user;
  }
}

