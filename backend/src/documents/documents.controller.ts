import {
  Controller, Delete, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors, Body, StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { RolesGuard } from '../common/roles.guard';
import { Roles, WriteAccess, Permission } from '../common/roles.decorator';
import { DocumentsService } from './documents.service';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Permission('dashboard')
@Controller('documents')
export class DocumentsController {
  constructor(private service: DocumentsService) {}

  @Get()
  @Roles('admin', 'collab', 'employee')
  findAll() { return this.service.findAll(); }

  @Post()
  @Roles('admin')
  @WriteAccess()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File, @Body('category') category: string) {
    return this.service.upload(file, category);
  }

  @Get(':id/download')
  @Roles('admin', 'collab', 'employee')
  async download(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const { doc, buffer } = await this.service.getFile(id);
    res.set({
      'Content-Type': doc.mimeType || 'application/octet-stream',
      'Content-Disposition': `inline; filename="${encodeURIComponent(doc.name)}"`,
    });
    return new StreamableFile(buffer);
  }

  @Delete(':id')
  @Roles('admin')
  @WriteAccess()
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
