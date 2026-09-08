import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('screens')
export class Screen {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column() location: string;
  @Column({ default: 'active' }) status: string; // active | offline | maintenance
  @Column({ default: 'Dashboard' }) content: string;
  @Column({ type: 'timestamptz', nullable: true }) lastSeen: Date;
  /** Jeton de connexion — sert à générer le QR code d'appairage de l'écran Android TV. */
  @Column({ nullable: true }) pairingToken: string;
  @CreateDateColumn() createdAt: Date;
}
