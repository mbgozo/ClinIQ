import { Controller, Get, Post, Put, Delete, UseGuards, Request, Query, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StudyGroupsService } from './study-groups.service';
import { GroupPostsService } from './group-posts.service';
import { GroupInvitesService } from './group-invites.service';
import { CreateGroupPostInput, CreateGroupInviteInput, CreateGroupSchema, GroupFilterSchema } from '@cliniq/shared-types';

@Controller('study-groups')
@UseGuards(JwtAuthGuard)
export class StudyGroupsController {
  constructor(
    private readonly studyGroupsService: StudyGroupsService,
    private readonly groupPostsService: GroupPostsService,
    private readonly groupInvitesService: GroupInvitesService
  ) {}

  @Get()
  async getGroups(@Query() filters: any) {
    const validatedFilters = GroupFilterSchema.parse(filters);
    const result = await this.studyGroupsService.getGroups(validatedFilters);
    return { data: result.groups, meta: { total: result.total } };
  }

  @Get('my-groups')
  async getMyGroups(@Request() req: any) {
    const userId = req.user.sub;
    const groups = await this.studyGroupsService.getUserGroups(userId);
    return { data: groups };
  }

  @Get(':id')
  async getGroup(@Param('id') id: string) {
    const group = await this.studyGroupsService.getGroupById(id);
    return { data: group };
  }

  @Post()
  async createGroup(@Request() req: any, @Body() data: any) {
    const userId = req.user.sub;
    const validatedData = CreateGroupSchema.parse(data);
    const group = await this.studyGroupsService.createGroup(userId, validatedData);
    return { data: group };
  }

  @Put(':id')
  async updateGroup(@Param('id') id: string, @Request() req: any, @Body() data: any) {
    const userId = req.user.sub;
    const group = await this.studyGroupsService.updateGroup(id, userId, data);
    return { data: group };
  }

  @Delete(':id')
  async deleteGroup(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.sub;
    await this.studyGroupsService.deleteGroup(id, userId);
    return { message: 'Group deleted successfully' };
  }

  @Post(':id/join')
  async joinGroup(@Param('id') id: string, @Body() body: { inviteCode?: string }, @Request() req: any) {
    const userId = req.user.sub;
    const member = await this.studyGroupsService.joinGroup(id, userId, body.inviteCode);
    return { data: member };
  }

  @Post(':id/leave')
  async leaveGroup(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.sub;
    await this.studyGroupsService.leaveGroup(id, userId);
    return { message: 'Left group successfully' };
  }

  // Member management
  @Get(':id/members')
  async getGroupMembers(@Param('id') id: string) {
    const members = await this.studyGroupsService.getGroupMembers(id);
    return { data: members };
  }

  @Post(':id/members')
  async inviteMember(@Param('id') id: string, @Body() data: CreateGroupInviteInput, @Request() req: any) {
    const inviterId = req.user.sub;
    const invite = await this.groupInvitesService.createInvite(id, inviterId, data);
    return { data: invite };
  }

  @Put(':id/members/:memberId/role')
  async updateMemberRole(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() body: { role: string },
    @Request() req: any
  ) {
    const adminId = req.user.sub;
    const member = await this.studyGroupsService.updateMemberRole(id, memberId, body.role, adminId);
    return { data: member };
  }

  @Delete(':id/members/:memberId')
  async removeMember(@Param('id') id: string, @Param('memberId') memberId: string, @Request() req: any) {
    const adminId = req.user.sub;
    await this.studyGroupsService.removeMember(id, memberId, adminId);
    return { message: 'Member removed successfully' };
  }

  // Group posts
  @Get(':id/posts')
  async getGroupPosts(@Param('id') id: string, @Query() query: { page?: number; limit?: number }) {
    const posts = await this.groupPostsService.getGroupPosts(id, query);
    return { data: posts };
  }

  @Post(':id/posts')
  async createGroupPost(@Param('id') id: string, @Body() data: CreateGroupPostInput, @Request() req: any) {
    const userId = req.user.sub;
    const post = await this.groupPostsService.createPost(id, userId, data);
    return { data: post };
  }

  @Put('posts/:postId')
  async updateGroupPost(@Param('postId') postId: string, @Body() data: Partial<CreateGroupPostInput>, @Request() req: any) {
    const userId = req.user.sub;
    const post = await this.groupPostsService.updatePost(postId, userId, data);
    return { data: post };
  }

  @Delete('posts/:postId')
  async deleteGroupPost(@Param('postId') postId: string, @Request() req: any) {
    const userId = req.user.sub;
    await this.groupPostsService.deletePost(postId, userId);
    return { message: 'Post deleted successfully' };
  }

  @Put('posts/:postId/pin')
  async pinGroupPost(@Param('postId') postId: string, @Request() req: any) {
    const userId = req.user.sub;
    const post = await this.groupPostsService.pinPost(postId, userId);
    return { data: post };
  }

  @Put('posts/:postId/unpin')
  async unpinGroupPost(@Param('postId') postId: string, @Request() req: any) {
    const userId = req.user.sub;
    const post = await this.groupPostsService.unpinPost(postId, userId);
    return { data: post };
  }

  // Group invites
  @Get('invites/sent')
  async getSentInvites(@Request() req: any) {
    const userId = req.user.sub;
    const invites = await this.groupInvitesService.getSentInvites(userId);
    return { data: invites };
  }

  @Get('invites/received')
  async getReceivedInvites(@Request() req: any) {
    const userId = req.user.sub;
    const invites = await this.groupInvitesService.getReceivedInvites(userId);
    return { data: invites };
  }

  @Post('invites/:inviteId/accept')
  async acceptInvite(@Param('inviteId') inviteId: string, @Request() req: any) {
    const userId = req.user.sub;
    const invite = await this.groupInvitesService.acceptInvite(inviteId, userId);
    return { data: invite };
  }

  @Post('invites/:inviteId/reject')
  async rejectInvite(@Param('inviteId') inviteId: string, @Request() req: any) {
    const userId = req.user.sub;
    const invite = await this.groupInvitesService.rejectInvite(inviteId, userId);
    return { data: invite };
  }
}
