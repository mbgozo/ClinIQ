import { Module } from '@nestjs/common';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { FileUploadService } from './file-upload.service';
import { FlagsService } from './flags.service';

@Module({
  controllers: [ResourcesController],
  providers: [ResourcesService, FileUploadService, FlagsService],
  exports: [ResourcesService, FlagsService],
})
export class ResourcesModule {}
