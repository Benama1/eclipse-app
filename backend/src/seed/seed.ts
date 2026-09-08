import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { Meeting } from '../meetings/meeting.entity';
import { Offer } from '../offers/offer.entity';
import { Communication } from '../communications/communication.entity';
import { Screen } from '../screens/screen.entity';
import { Transaction } from '../payments/transaction.entity';
import { Contribution } from '../payments/contribution.entity';
import { SavingsConfig } from '../payments/savings.entity';
import { DocumentEntity } from '../documents/document.entity';
import { BankConfig } from '../bank/bank-config.entity';
import { OutlookConfig } from '../outlook/outlook-config.entity';

const DEMO_PASSWORD = 'eclipse2026';

function daysAgo(n: number) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); }
function daysFromNow(n: number) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }

async function run() {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'eclipse',
    password: process.env.POSTGRES_PASSWORD || 'eclipse',
    database: process.env.POSTGRES_DB || 'eclipse',
    entities: [User, Meeting, Offer, Communication, Screen, Transaction, Contribution, SavingsConfig, DocumentEntity, BankConfig, OutlookConfig],
    synchronize: true,
  });
  await ds.initialize();
  console.log('Connecté à PostgreSQL, insertion des données de démonstration...');

  const userRepo = ds.getRepository(User);
  const existing = await userRepo.count();
  if (existing === 0) {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
    const users = [
      { firstname: 'Camille', lastname: 'Dubois', email: 'camille.dubois@eclipse-ce.fr', role: 'admin', access: null },
      { firstname: 'Yanis', lastname: 'Haddad', email: 'yanis.haddad@eclipse-ce.fr', role: 'collab', access: 'both' },
      { firstname: 'Lina', lastname: 'Moreau', email: 'lina.moreau@eclipse-ce.fr', role: 'employee', access: null },
      { firstname: 'Thomas', lastname: 'Bernard', email: 'thomas.bernard@eclipse-ce.fr', role: 'employee', access: null },
      { firstname: 'Karim', lastname: 'Belaid', email: 'karim.belaid@eclipse-ce.fr', role: 'collab', access: 'payment' },
      { firstname: 'Julie', lastname: 'Laurent', email: 'julie.laurent@eclipse-ce.fr', role: 'collab', access: 'dashboard' },
    ];
    for (const u of users) await userRepo.save(userRepo.create({ ...u, passwordHash } as any));
    console.log(`${users.length} utilisateurs créés (mot de passe de démo pour tous : "${DEMO_PASSWORD}")`);
  }

  const savingsRepo = ds.getRepository(SavingsConfig);
  if (!(await savingsRepo.findOne({ where: { id: 1 } }))) {
    await savingsRepo.save(savingsRepo.create({ id: 1, objective: 50000, current: 31280 }));
  }

  const contribRepo = ds.getRepository(Contribution);
  if ((await contribRepo.count()) === 0) {
    const names = ['Camille Dubois', 'Yanis Haddad', 'Lina Moreau', 'Thomas Bernard', 'Karim Belaid', 'Julie Laurent'];
    for (let i = 0; i < 10; i++) {
      await contribRepo.save(contribRepo.create({ user: names[i % names.length], amount: 150 + i * 35, date: daysAgo(30 - i * 3) }));
    }
  }

  const txRepo = ds.getRepository(Transaction);
  if ((await txRepo.count()) === 0) {
    const types = ['Cotisation', 'Remboursement', 'Paiement offre', 'Épargne'];
    const methods = ['Carte', 'Prélèvement', 'Virement', 'Carte', 'Wero'];
    const statuses = ['paid', 'pending', 'paid', 'paid', 'failed'];
    const names = ['Camille Dubois', 'Yanis Haddad', 'Lina Moreau', 'Thomas Bernard', 'Karim Belaid', 'Julie Laurent'];
    for (let i = 0; i < 10; i++) {
      await txRepo.save(txRepo.create({
        user: names[i % names.length], type: types[i % types.length], amount: 20 + i * 12,
        method: methods[i % methods.length] as any, status: statuses[i % statuses.length],
        date: daysAgo(25 - i * 2), reference: `**** ${4000 + i * 137}`,
      }));
    }
  }

  const meetRepo = ds.getRepository(Meeting);
  if ((await meetRepo.count()) === 0) {
    await meetRepo.save([
      meetRepo.create({ title: 'Réunion trimestrielle CE', date: daysFromNow(4), time: '10:00', location: 'Salle A', participants: 8, description: 'Bilan du trimestre et budget épargne.', status: 'upcoming' }),
      meetRepo.create({ title: 'Négociation offres partenaires', date: daysFromNow(9), time: '14:30', location: 'Visioconférence', participants: 5, description: 'Discussion avec nouveaux partenaires CE.', status: 'upcoming' }),
      meetRepo.create({ title: 'Point mensuel Comité', date: daysAgo(12), time: '09:00', location: 'Salle B', participants: 10, description: 'Suivi mensuel des activités du CE.', status: 'done' }),
    ] as any);
  }

  const offerRepo = ds.getRepository(Offer);
  if ((await offerRepo.count()) === 0) {
    await offerRepo.save([
      offerRepo.create({ title: 'Places de cinéma à tarif réduit', description: 'Bénéficiez de -40% sur vos places de cinéma toute l\'année.', partner: 'CinéPlus', discount: '-40%', date: daysAgo(20), status: 'active' }),
      offerRepo.create({ title: 'Séjours vacances', description: 'Réductions exclusives sur une sélection de séjours.', partner: 'VacancesPro', discount: '-15%', date: daysAgo(10), status: 'active' }),
      offerRepo.create({ title: 'Abonnement salle de sport', description: 'Tarif CE négocié pour les salles partenaires.', partner: 'FitClub', discount: '-30%', date: daysAgo(5), status: 'active' }),
    ] as any);
  }

  const commRepo = ds.getRepository(Communication);
  if ((await commRepo.count()) === 0) {
    await commRepo.save([
      commRepo.create({ title: 'Nouvelle plateforme ECLIPSE', content: "L'application ECLIPSE est désormais disponible pour tous les salariés.", author: 'Camille Dubois', date: daysAgo(1), category: 'Communication', priority: 'important', status: 'published' }),
      commRepo.create({ title: 'Rappel cotisations', content: 'Merci de vérifier vos informations de paiement avant la fin du mois.', author: 'Camille Dubois', date: daysAgo(15), category: 'Note', priority: 'normal', status: 'published' }),
      commRepo.create({ title: 'Sondage satisfaction', content: 'Merci de répondre au sondage de satisfaction avant la fin du mois.', author: 'Julie Laurent', date: daysAgo(3), category: 'Information', priority: 'info', status: 'published' }),
    ] as any);
  }

  const screenRepo = ds.getRepository(Screen);
  if ((await screenRepo.count()) === 0) {
    await screenRepo.save([
      screenRepo.create({ name: 'Écran Accueil', location: 'Hall principal', status: 'active', content: 'Épargne + Communications', lastSeen: new Date(), pairingToken: 'demo-token-1' }),
      screenRepo.create({ name: 'Écran Cafétéria', location: 'Cafétéria', status: 'active', content: 'Offres + Réunions', lastSeen: new Date(), pairingToken: 'demo-token-2' }),
    ] as any);
  }

  console.log('Seed terminé.');
  await ds.destroy();
}

run().catch((e) => { console.error(e); process.exit(1); });
