import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankConfig } from './bank-config.entity';

@Injectable()
export class BankService {
  constructor(@InjectRepository(BankConfig) private repo: Repository<BankConfig>) {}

  async get() {
    let cfg = await this.repo.findOne({ where: { id: 1 } });
    if (!cfg) cfg = await this.repo.save(this.repo.create({ id: 1, connected: false, provider: 'simulation' }));
    return cfg;
  }

  async configure(bankName: string, ibanLast4: string) {
    const cfg = await this.get();
    cfg.bankName = bankName;
    cfg.ibanLast4 = ibanLast4.slice(0, 4);
    cfg.connected = !!(bankName && ibanLast4);
    return this.repo.save(cfg);
  }

  /**
   * Point d'entrée pour la véritable connexion Open Banking / PSD2 (à implémenter) :
   * process.env.BANK_PROVIDER, BANK_CLIENT_ID, BANK_CLIENT_SECRET, BANK_REDIRECT_URI
   * Tant que BANK_PROVIDER === 'simulation', cette méthode reste non fonctionnelle et
   * renvoie une erreur explicite plutôt que de faire semblant de se connecter.
   */
  async startRealConnection() {
    const provider = process.env.BANK_PROVIDER || 'simulation';
    if (provider === 'simulation') {
      return {
        ready: false,
        message:
          "Aucun fournisseur bancaire réel n'est configuré. Renseignez BANK_PROVIDER, BANK_CLIENT_ID, " +
          'BANK_CLIENT_SECRET et BANK_REDIRECT_URI dans le fichier .env pour activer la connexion réelle.',
      };
    }
    // TODO: implémenter le flux OAuth du fournisseur Open Banking choisi.
    return { ready: false, message: `Fournisseur '${provider}' non encore implémenté.` };
  }
}
