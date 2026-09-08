import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type UserRole = 'admin' | 'collab' | 'employee';
export type UserAccess = 'payment' | 'dashboard' | 'both' | null;

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() firstname: string;
  @Column() lastname: string;

  @Column({ unique: true }) email: string;

  /** Hash bcrypt — jamais le mot de passe en clair. */
  @Column({ select: false }) passwordHash: string;

  @Column({ type: 'varchar', default: 'employee' }) role: UserRole;

  /** Utilisé uniquement pour role = collab : 'payment' | 'dashboard' | 'both' */
  @Column({ type: 'varchar', nullable: true }) access: UserAccess;

  @Column({ default: 'fr' }) lang: string;
  @Column({ default: 'EUR' }) currency: string;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
