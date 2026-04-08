import { Controller, Get, Post, Put, Delete, UseGuards, Request, Query, Body, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResourcesService } from './resources.service';
import { FileUploadService } from './file-upload.service';
import { FlagsService } from './flags.service';
import { CreateResourceSchema, ResourceFilterSchema, CreateFlagSchema } from '@cliniq/shared-types';

@Controller('resources')
@UseGuards(JwtAuthGuard)
export class ResourcesController {
  constructor(
    private readonly resourcesService: ResourcesService,
    private readonly fileUploadService: FileUploadService,
    private readonly flagsService: FlagsService
  ) {}

  @Get()
  async getResources(@Query() filters: any) {
    const validatedFilters = ResourceFilterSchema.parse(filters);
    const result = await this.resourcesService.getResources(validatedFilters);
    return { data: result.resources, meta: { total: result.total } };
  }

  @Get('categories')
  async getCategories() {
    const categories = await this.resourcesService.getCategories();
    return { data: categories };
  }

  @Get(':id')
  async getResource(@Param('id') id: string) {
    const resource = await this.resourcesService.getResourceById(id);
    return { data: resource };
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createResource(
    @Request() req: any,
    @Body() data: any,
    @UploadedFile() file?: any
  ) {
    const userId = req.user.sub;
    const validatedData = CreateResourceSchema.parse(data);

    let fileRef: string | undefined;
    let fileType: string | undefined;

    if (file) {
      const uploadResult = await this.fileUploadService.uploadFile(file);
      fileRef = uploadResult.fileRef;
      fileType = uploadResult.fileType;
    }

    const resource = await this.resourcesService.createResource(userId, {
      ...validatedData,
      fileRef,
      fileType,
    });

    return { data: resource };
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateResource(
    @Param('id') id: string,
    @Request() req: any,
    @Body() data: any,
    @UploadedFile() file?: any
  ) {
    const userId = req.user.sub;

    let fileRef: string | undefined;
    let fileType: string | undefined;

    if (file) {
      const uploadResult = await this.fileUploadService.uploadFile(file);
      fileRef = uploadResult.fileRef;
      fileType = uploadResult.fileType;
    }

    const resource = await this.resourcesService.updateResource(id, userId, {
      ...data,
      fileRef,
      fileType,
    });

    return { data: resource };
  }

  @Delete(':id')
  async deleteResource(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.sub;
    await this.resourcesService.deleteResource(id, userId);
    return { message: 'Resource deleted successfully' };
  }

  @Post(':id/download')
  async downloadResource(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.sub;
    const downloadUrl = await this.resourcesService.incrementDownload(id, userId);
    return { data: { downloadUrl } };
  }

  // Flag endpoints
  @Post(':id/flag')
  async flagResource(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    const userId = req.user.sub;
    const validatedData = CreateFlagSchema.parse({
      entityType: 'RESOURCE',
      entityId: id,
      reason: data.reason
    });
    
    const flag = await this.flagsService.createFlag(userId, validatedData);
    return { data: flag };
  }

  @Get('flags/pending')
  async getPendingFlags() {
    const flags = await this.flagsService.getPendingFlags();
    return { data: flags };
  }

  @Put('flags/:id/resolve')
  async resolveFlag(@Param('id') id: string, @Body() body: { notes?: string }, @Request() req: any) {
    const adminId = req.user.sub;
    const flag = await this.flagsService.resolveFlag(id, adminId, body.notes);
    return { data: flag };
  }

  @Put('flags/:id/dismiss')
  async dismissFlag(@Param('id') id: string, @Body() body: { notes?: string }, @Request() req: any) {
    const adminId = req.user.sub;
    const flag = await this.flagsService.dismissFlag(id, adminId, body.notes);
    return { data: flag };
  }
}
