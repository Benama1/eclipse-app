import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/roles.guard';
import { Roles, WriteAccess } from '../common/roles.decorator';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get()
  @Roles('admin')
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @Roles('admin')
  @WriteAccess()
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles('admin')
  @WriteAccess()
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @WriteAccess()
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
