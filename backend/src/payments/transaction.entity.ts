import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export type PaymentMethod = 'Carte' | 'Prélèvement' | 'Virement' | 'Wero';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() user: string;
  @Column() type: string; // Cotisation | Remboursement | Paiement offre | Épargne | Paiement <méthode>
  @Column('numeric', { precision: 12, scale: 2 }) amount: number;
  @Column({ default: 'Carte' }) method: PaymentMethod;
  @Column({ default: 'paid' }) status: string; // paid | pending | failed
  @Column({ type: 'date' }) date: string;
  @Column() reference: string;
  @CreateDateColumn() createdAt: Date;
}
