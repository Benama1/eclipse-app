/**
 * Abstraction du prestataire de paiement.
 * Implémentation active choisie via la variable d'env PAYMENT_PROVIDER.
 *  - 'simulation' (par défaut) : aucun appel réseau réel, statut toujours 'paid'.
 *  - 'stripe' : à implémenter dans stripe.provider.ts en utilisant STRIPE_SECRET_KEY.
 *  - 'gocardless' : à implémenter dans gocardless.provider.ts.
 * Le reste de l'application ne dépend jamais du prestataire concret.
 */
export interface PaymentResult {
  status: 'paid' | 'pending' | 'failed';
  reference: string;
  providerRef?: string;
}

export interface PaymentProvider {
  charge(input: { user: string; amount: number; method: string }): Promise<PaymentResult>;
}

export const PAYMENT_PROVIDER = 'PAYMENT_PROVIDER';
