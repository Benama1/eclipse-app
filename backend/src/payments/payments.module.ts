import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Contribution } from './contribution.entity';
import { SavingsConfig } from './savings.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PAYMENT_PROVIDER } from './payment-provider.interface';
import { SimulationPaymentProvider } from './simulation-payment.provider';

/**
 * Le provider réel (Stripe, GoCardless...) se branche ici :
 * remplacer SimulationPaymentProvider par la classe correspondante
 * dès que PAYMENT_PROVIDER != 'simulation' dans le .env, sans toucher
 * au reste de l'application (PaymentsService ne connaît que l'interface).
 */
@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Contribution, SavingsConfig])],
  providers: [
    PaymentsService,
    { provide: PAYMENT_PROVIDER, useClass: SimulationPaymentProvider },
  ],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
