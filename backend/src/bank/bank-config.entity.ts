import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Configuration (non sensible) du compte bancaire du CE.
 * Aucune donnée bancaire réelle n'est stockée ici (pas d'IBAN complet, pas de mot de passe).
 * La véritable connexion (Open Banking / PSD2) déposera son jeton d'accès chiffré
 * dans un coffre-fort dédié (ex : vault / KMS), jamais dans cette table en clair.
 */
@Entity('bank_config')
export class BankConfig {
  @PrimaryColumn({ default: 1 }) id: number;
  @Column({ nullable: true }) bankName: string;
  @Column({ nullable: true, length: 4 }) ibanLast4: string;
  @Column({ default: false }) connected: boolean;
  @Column({ default: 'simulation' }) provider: string; // simulation | openbanking (à implémenter)
}
