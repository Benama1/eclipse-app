import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('outlook_config')
export class OutlookConfig {
  @PrimaryColumn({ default: 1 }) id: number;
  @Column({ default: false }) connected: boolean;
  @Column({ default: 'simulation' }) provider: string; // simulation | microsoft-graph (à implémenter)
  /** Jeton d'accès chiffré — jamais stocké en clair en production réelle. */
  @Column({ nullable: true, select: false }) encryptedAccessToken: string;
}
