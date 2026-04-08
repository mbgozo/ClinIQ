import { Controller, Get, Post, Put, UseGuards, Request, Query, Body, Param } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { MentorsService } from "./mentors.service";
import { MentorshipService } from "./mentorship.service";
import {
  CreateMentorProfileSchema,
  MentorFilterSchema,
  CreateMentorshipRequestSchema,
} from "@cliniq/shared-types";

@Controller("mentors")
@UseGuards(JwtAuthGuard)
export class MentorsController {
  constructor(
    private readonly mentorsService: MentorsService,
    private readonly mentorshipService: MentorshipService,
  ) {}

  @Get()
  async getMentors(@Query() filters: any) {
    const validatedFilters = MentorFilterSchema.parse(filters);
    const result = await this.mentorsService.getMentors(validatedFilters);
    return { data: result.mentors, meta: { total: result.total } };
  }

  @Get("profile")
  async getMyMentorProfile(@Request() req: any) {
    const userId = req.user.sub;
    const profile = await this.mentorsService.getMentorProfile(userId);
    return { data: profile };
  }

  @Post("profile")
  async createMentorProfile(@Request() req: any, @Body() data: any) {
    const userId = req.user.sub;
    const validatedData = CreateMentorProfileSchema.parse(data);
    const profile = await this.mentorsService.createMentorProfile(userId, validatedData);
    return { data: profile };
  }

  @Put("profile")
  async updateMentorProfile(@Request() req: any, @Body() data: any) {
    const userId = req.user.sub;
    const profile = await this.mentorsService.updateMentorProfile(userId, data);
    return { data: profile };
  }

  @Get(":id")
  async getMentor(@Param("id") id: string) {
    const mentor = await this.mentorsService.getMentorById(id);
    return { data: mentor };
  }

  @Post(":id/verify")
  async verifyMentor(@Param("id") id: string, @Request() req: any) {
    // Only admins can verify mentors
    const userId = req.user.sub;
    const mentor = await this.mentorsService.verifyMentor(id, userId);
    return { data: mentor };
  }

  @Post(":id/reject")
  async rejectMentor(@Param("id") id: string, @Body() body: { reason: string }, @Request() req: any) {
    const userId = req.user.sub;
    const mentor = await this.mentorsService.rejectMentor(id, body.reason, userId);
    return { data: mentor };
  }

  // Mentorship endpoints
  @Get("requests/sent")
  async getSentRequests(@Request() req: any, @Query() filters: any) {
    const userId = req.user.sub;
    const requests = await this.mentorshipService.getSentRequests(userId, filters);
    return { data: requests };
  }

  @Get("requests/received")
  async getReceivedRequests(@Request() req: any, @Query() filters: any) {
    const userId = req.user.sub;
    const requests = await this.mentorshipService.getReceivedRequests(userId, filters);
    return { data: requests };
  }

  @Post("requests")
  async createMentorshipRequest(@Request() req: any, @Body() data: any) {
    const userId = req.user.sub;
    const validatedData = CreateMentorshipRequestSchema.parse(data);
    const request = await this.mentorshipService.createMentorshipRequest(userId, validatedData);
    return { data: request };
  }

  @Put("requests/:id/accept")
  async acceptMentorshipRequest(@Param("id") id: string, @Request() req: any) {
    const userId = req.user.sub;
    const request = await this.mentorshipService.acceptMentorshipRequest(id, userId);
    return { data: request };
  }

  @Put("requests/:id/reject")
  async rejectMentorshipRequest(
    @Param("id") id: string,
    @Body() body: { reason: string },
    @Request() req: any,
  ) {
    const userId = req.user.sub;
    const request = await this.mentorshipService.rejectMentorshipRequest(id, body.reason, userId);
    return { data: request };
  }

  @Put("requests/:id/complete")
  async completeMentorshipRequest(@Param("id") id: string, @Request() req: any) {
    const userId = req.user.sub;
    const request = await this.mentorshipService.completeMentorshipRequest(id, userId);
    return { data: request };
  }
}
