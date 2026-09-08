import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/roles.guard';
import { Roles, WriteAccess } from '../common/roles.decorator';
import { BankService } from './bank.service';

@ApiTags('bank')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('bank')
export class BankController {
  constructor(private service: BankService) {}

  @Get()
  @Roles('admin')
  get() { return this.service.get(); }

  @Post('configure')
  @Roles('admin')
  @WriteAccess()
  configure(@Body() body: { bankName: string; ibanLast4: string }) {
    return this.service.configure(body.bankName, body.ibanLast4);
  }

  @Post('connect')
  @Roles('admin')
  @WriteAccess()
  connect() { return this.service.startRealConnection(); }
}
