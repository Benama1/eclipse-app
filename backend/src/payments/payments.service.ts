import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Contribution } from './contribution.entity';
import { SavingsConfig } from './savings.entity';
import { CreatePaymentDto, CreateContributionDto, TransactionFilterDto } from './payments.dto';
import { PAYMENT_PROVIDER, PaymentProvider } from './payment-provider.interface';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
    @InjectRepository(Contribution) private contribRepo: Repository<Contribution>,
    @InjectRepository(SavingsConfig) private savingsRepo: Repository<SavingsConfig>,
    @Inject(PAYMENT_PROVIDER) private provider: PaymentProvider,
  ) {}

  // ---------- Épargne ----------
  async getSavings() {
    let s = await this.savingsRepo.findOne({ where: { id: 1 } });
    if (!s) s = await this.savingsRepo.save(this.savingsRepo.create({ id: 1, objective: 50000, current: 0 }));
    return s;
  }

  async updateSavingsObjective(objective: number, current: number) {
    const s = await this.getSavings();
    s.objective = objective;
    s.current = current;
    return this.savingsRepo.save(s);
  }

  async listContributions() {
    return this.contribRepo.find({ order: { date: 'ASC' } });
  }

  async addContribution(dto: CreateContributionDto) {
    const contribution = await this.contribRepo.save(
      this.contribRepo.create({ ...dto, date: new Date().toISOString().slice(0, 10) }),
    );
    const s = await this.getSavings();
    s.current = Number(s.current) + Number(dto.amount);
    await this.savingsRepo.save(s);
    await this.txRepo.save(
      this.txRepo.create({
        user: dto.user, type: 'Épargne', amount: dto.amount, method: 'Carte', status: 'paid',
        date: new Date().toISOString().slice(0, 10), reference: '**** ' + Math.floor(1000 + Math.random() * 9000),
      }),
    );
    return contribution;
  }

  // ---------- Paiements / Transactions ----------
  async listTransactions(filter: TransactionFilterDto) {
    const qb = this.txRepo.createQueryBuilder('t').orderBy('t.date', 'DESC');
    if (filter.status) qb.andWhere('t.status = :status', { status: filter.status });
    if (filter.type) qb.andWhere('t.type = :type', { type: filter.type });
    if (filter.method) qb.andWhere('t.method = :method', { method: filter.method });
    if (filter.q) qb.andWhere('(LOWER(t.user) LIKE :q OR LOWER(t.type) LIKE :q)', { q: `%${filter.q.toLowerCase()}%` });
    return qb.getMany();
  }

  async createPayment(dto: CreatePaymentDto) {
    // Passe par l'abstraction PaymentProvider : en mode simulation aujourd'hui,
    // en mode Stripe/GoCardless dès que les clés réelles seront configurées (voir .env).
    const result = await this.provider.charge({ user: dto.user, amount: dto.amount, method: dto.method });
    return this.txRepo.save(
      this.txRepo.create({
        user: dto.user, type: 'Paiement ' + dto.method, amount: dto.amount, method: dto.method as any,
        status: result.status, date: new Date().toISOString().slice(0, 10), reference: result.reference,
      }),
    );
  }
}
