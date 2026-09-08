import { Injectable } from '@nestjs/common';
import { PaymentProvider, PaymentResult } from './payment-provider.interface';

@Injectable()
export class SimulationPaymentProvider implements PaymentProvider {
  async charge(input: { user: string; amount: number; method: string }): Promise<PaymentResult> {
    // Aucune donnée bancaire réelle : simulation immédiate, toujours acceptée.
    return {
      status: 'paid',
      reference: '**** ' + Math.floor(1000 + Math.random() * 9000),
    };
  }
}
