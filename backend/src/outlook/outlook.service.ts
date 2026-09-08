import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutlookConfig } from './outlook-config.entity';

@Injectable()
export class OutlookService {
  constructor(@InjectRepository(OutlookConfig) private repo: Repository<OutlookConfig>) {}

  async get() {
    let cfg = await this.repo.findOne({ where: { id: 1 } });
    if (!cfg) cfg = await this.repo.save(this.repo.create({ id: 1, connected: false, provider: 'simulation' }));
    return cfg;
  }

  async toggleSimulation() {
    const cfg = await this.get();
    cfg.connected = !cfg.connected;
    return this.repo.save(cfg);
  }

  /**
   * URL de démarrage du VRAI flux OAuth Microsoft (authorization code grant).
   * Ne fonctionne que si MS_TENANT_ID / MS_CLIENT_ID / MS_REDIRECT_URI sont renseignés.
   * Sans ces variables, l'application reste en mode simulation (comme le prototype V1).
   */
  getRealAuthUrl(): { ready: boolean; url?: string; message?: string } {
    const { MS_TENANT_ID, MS_CLIENT_ID, MS_REDIRECT_URI } = process.env;
    if (!MS_TENANT_ID || !MS_CLIENT_ID || !MS_REDIRECT_URI) {
      return {
        ready: false,
        message:
          "Application Microsoft non enregistrée. Renseignez MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET " +
          "et MS_REDIRECT_URI dans le .env (portail Azure AD > Inscriptions d'applications) pour activer la connexion réelle.",
      };
    }
    const scope = encodeURIComponent('offline_access Calendars.ReadWrite User.Read');
    const url =
      `https://login.microsoftonline.com/${MS_TENANT_ID}/oauth2/v2.0/authorize` +
      `?client_id=${MS_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(MS_REDIRECT_URI)}` +
      `&response_mode=query&scope=${scope}`;
    return { ready: true, url };
  }

  /** Callback OAuth — échange le code contre un jeton (à implémenter avec MS_CLIENT_SECRET). */
  async handleCallback(code: string) {
    // TODO: POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token avec MS_CLIENT_SECRET
    // puis chiffrer et stocker le token, marquer connected = true.
    return { received: !!code, message: "Échange de code non implémenté dans ce squelette — à compléter côté serveur sécurisé." };
  }
}
