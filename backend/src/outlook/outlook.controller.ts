import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/roles.guard';
import { Roles, WriteAccess } from '../common/roles.decorator';
import { OutlookService } from './outlook.service';

@ApiTags('outlook')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('outlook')
export class OutlookController {
  constructor(private service: OutlookService) {}

  @Get()
  @Roles('admin')
  get() { return this.service.get(); }

  @Post('toggle-simulation')
  @Roles('admin')
  @WriteAccess()
  toggleSimulation() { return this.service.toggleSimulation(); }

  @Get('connect')
  @Roles('admin')
  connect() { return this.service.getRealAuthUrl(); }
}

/** Callback OAuth public : c'est Microsoft qui redirige ici avec ?code=..., sans jeton applicatif. */
@ApiTags('outlook')
@Controller('outlook-callback')
export class OutlookCallbackController {
  constructor(private service: OutlookService) {}

  @Get()
  callback(@Query('code') code: string) { return this.service.handleCallback(code); }
}
