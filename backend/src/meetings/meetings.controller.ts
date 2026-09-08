import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/roles.guard';
import { Roles, WriteAccess, Permission } from '../common/roles.decorator';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto, UpdateMeetingDto } from './meetings.dto';

@ApiTags('meetings')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Permission('dashboard')
@Controller('meetings')
export class MeetingsController {
  constructor(private service: MeetingsService) {}

  @Get()
  @Roles('admin', 'collab', 'employee')
  findAll() { return this.service.findAll(); }

  @Post()
  @Roles('admin')
  @WriteAccess()
  create(@Body() dto: CreateMeetingDto) { return this.service.create(dto); }

  @Put(':id')
  @Roles('admin')
  @WriteAccess()
  update(@Param('id') id: string, @Body() dto: UpdateMeetingDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @Roles('admin')
  @WriteAccess()
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
