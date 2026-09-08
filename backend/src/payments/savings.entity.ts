import { Column, Entity, PrimaryColumn } from 'typeorm';

/** Table à une seule ligne (id fixe = 1) — objectif global d'épargne du CE. */
@Entity('savings_config')
export class SavingsConfig {
  @PrimaryColumn({ default: 1 }) id: number;
  @Column('numeric', { precision: 12, scale: 2, default: 50000 }) objective: number;
  @Column('numeric', { precision: 12, scale: 2, default: 0 }) current: number;
}
