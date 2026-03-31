import { Module } from '@nestjs/common';
import { StudyGroupsController } from './study-groups.controller';
import { StudyGroupsService } from './study-groups.service';
import { GroupPostsService } from './group-posts.service';
import { GroupInvitesService } from './group-invites.service';

@Module({
  controllers: [StudyGroupsController],
  providers: [StudyGroupsService, GroupPostsService, GroupInvitesService],
  exports: [StudyGroupsService, GroupPostsService, GroupInvitesService],
})
export class StudyGroupsModule {}
