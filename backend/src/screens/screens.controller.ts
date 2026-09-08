import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/roles.guard';
import { Roles, WriteAccess } from '../common/roles.decorator';
import { ScreensService } from './screens.service';
import { CreateScreenDto, UpdateScreenDto } from './screens.dto';

@ApiTags('screens')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('screens')
export class ScreensController {
  constructor(private service: ScreensService) {}
  @Get() @Roles('admin') findAll() { return this.service.findAll(); }
  @Post() @Roles('admin') @WriteAccess() create(@Body() dto: CreateScreenDto) { return this.service.create(dto); }
  @Put(':id') @Roles('admin') @WriteAccess() update(@Param('id') id: string, @Body() dto: UpdateScreenDto) { return this.service.update(id, dto); }
  @Delete(':id') @Roles('admin') @WriteAccess() remove(@Param('id') id: string) { return this.service.remove(id); }
}

/**
 * Endpoint public (aucune garde JWT) : c'est l'application Android TV elle-même
 * qui l'appelle avec son propre jeton d'appairage, généré via QR code.
 */
@ApiTags('screens')
@Controller('screens-public')
export class ScreensPublicController {
  constructor(private service: ScreensService) {}

  @Post('pair/:token')
  pair(@Param('token') token: string) { return this.service.pair(token); }
}
