import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/roles.guard';
import { Roles, WriteAccess, Permission } from '../common/roles.decorator';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, CreateContributionDto, TransactionFilterDto } from './payments.dto';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller()
export class PaymentsController {
  constructor(private service: PaymentsService) {}

  // --- Épargne ---
  @Get('savings')
  @Roles('admin', 'collab', 'employee')
  getSavings() { return this.service.getSavings(); }

  @Put('savings')
  @Roles('admin')
  @WriteAccess()
  updateSavings(@Body() body: { objective: number; current: number }) {
    return this.service.updateSavingsObjective(body.objective, body.current);
  }

  @Get('contributions')
  @Roles('admin', 'collab', 'employee')
  listContributions() { return this.service.listContributions(); }

  @Post('contributions')
  @Roles('admin')
  @WriteAccess()
  addContribution(@Body() dto: CreateContributionDto) { return this.service.addContribution(dto); }

  // --- Paiements / Transactions ---
  @Get('transactions')
  @Roles('admin', 'collab', 'employee')
  @Permission('payment')
  listTransactions(@Query() filter: TransactionFilterDto) { return this.service.listTransactions(filter); }

  @Post('payments')
  @Roles('admin')
  @WriteAccess()
  createPayment(@Body() dto: CreatePaymentDto) { return this.service.createPayment(dto); }
}
