import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/roles.guard';
import { Roles, WriteAccess, Permission } from '../common/roles.decorator';
import { OffersService } from './offers.service';
import { CreateOfferDto, UpdateOfferDto } from './offers.dto';

@ApiTags('offers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Permission('dashboard')
@Controller('offers')
export class OffersController {
  constructor(private service: OffersService) {}
  @Get() @Roles('admin', 'collab', 'employee') findAll() { return this.service.findAll(); }
  @Post() @Roles('admin') @WriteAccess() create(@Body() dto: CreateOfferDto) { return this.service.create(dto); }
  @Put(':id') @Roles('admin') @WriteAccess() update(@Param('id') id: string, @Body() dto: UpdateOfferDto) { return this.service.update(id, dto); }
  @Delete(':id') @Roles('admin') @WriteAccess() remove(@Param('id') id: string) { return this.service.remove(id); }
}
