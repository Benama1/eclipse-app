import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/roles.guard';
import { Roles, WriteAccess, Permission } from '../common/roles.decorator';
import { CurrentUser } from '../common/current-user.decorator';
import { CommunicationsService } from './communications.service';
import { CreateCommunicationDto, UpdateCommunicationDto } from './communications.dto';

@ApiTags('communications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Permission('dashboard')
@Controller('communications')
export class CommunicationsController {
  constructor(private service: CommunicationsService) {}

  @Get()
  @Roles('admin', 'collab', 'employee')
  findAll() { return this.service.findAll(); }

  @Post()
  @Roles('admin')
  @WriteAccess()
  create(@Body() dto: CreateCommunicationDto, @CurrentUser() user: any) {
    return this.service.create(dto, `${user.firstname} ${user.lastname}`);
  }

  @Put(':id')
  @Roles('admin')
  @WriteAccess()
  update(@Param('id') id: string, @Body() dto: UpdateCommunicationDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @Roles('admin')
  @WriteAccess()
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
