# 🌑 ECLIPSE — Application de gestion CE/CSE

Version : **V2.0.0** (architecture réelle : React + NestJS + PostgreSQL + MongoDB)
Fait suite au prototype HTML single-file **V1.0.1**, conservé comme référence fonctionnelle
et comme secours (voir `prototype-html/index.html` si vous l'avez conservé de votre côté).

---

## 1. Ce que contient ce projet

```text
eclipse/
├── backend/          API NestJS (PostgreSQL + MongoDB)
├── frontend/         Application React (Vite + TypeScript)
├── docker-compose.yml
└── README.md
```

| Module                | État                                                                 |
|------------------------|----------------------------------------------------------------------|
| Authentification       | ✅ Réelle (JWT + bcrypt)                                              |
| Rôles & permissions    | ✅ Réelle (Admin = tous droits, Collaborateur/Salarié = lecture seule, Chat = tous en écriture) |
| Épargne / Contributions| ✅ Réelle (PostgreSQL)                                                |
| Paiements / Transactions| ✅ Réelle (simulation du prestataire — voir §5)                      |
| Réunions / Offres / Communications | ✅ Réelle (PostgreSQL)                                    |
| Documents               | ✅ Réelle (upload réel, stockage disque, prêt pour S3)                |
| Écrans TV                | ✅ Réelle (CRUD + jeton d'appairage QR)                              |
| Chat CE                  | ✅ Réelle (WebSocket Socket.io + MongoDB)                            |
| Compte bancaire CE        | 🟡 Préparé, non connecté (voir §5)                                  |
| Outlook / Microsoft 365   | 🟡 Préparé, non connecté (voir §5)                                  |

---

## 2. Prérequis

- Docker + Docker Compose (méthode recommandée), **ou**
- Node.js ≥ 20, PostgreSQL ≥ 14, MongoDB ≥ 6 installés localement

---

## 3. Lancement rapide avec Docker (recommandé)

```bash
cd eclipse
docker compose up --build
```

Cela démarre :
- PostgreSQL sur `localhost:5432`
- MongoDB sur `localhost:27017`
- Backend NestJS sur `http://localhost:3000` (docs Swagger : `http://localhost:3000/api/docs`)
- Frontend React sur `http://localhost:5173`

**Première fois seulement** — insérer les données de démonstration :

```bash
docker compose exec backend npm run seed
```

Ouvrez ensuite `http://localhost:5173` et connectez-vous avec un des comptes de démo (§6).

---

## 4. Lancement manuel (sans Docker)

### 4.1 Bases de données
Installez et démarrez PostgreSQL et MongoDB localement, puis créez la base :
```sql
CREATE DATABASE eclipse;
CREATE USER eclipse WITH PASSWORD 'eclipse';
GRANT ALL PRIVILEGES ON DATABASE eclipse TO eclipse;
```

### 4.2 Backend
```bash
cd backend
cp .env.example .env      # ajustez si besoin
npm install
npm run seed               # données de démonstration (une seule fois)
npm run start:dev          # http://localhost:3000
```

### 4.3 Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

---

## 5. Connecter vos VRAIES intégrations (paiement, banque, Outlook)

Ces trois modules sont **fonctionnels en simulation** (comme le prototype V1) et **architecturés
pour être branchés sur de vrais fournisseurs**, sans réécrire le reste de l'application.
Tout se passe dans `backend/.env` :

### Paiement (Stripe, GoCardless…)
```env
PAYMENT_PROVIDER=stripe
STRIPE_SECRET_KEY=sk_live_...
```
Puis implémentez `backend/src/payments/stripe.provider.ts` en respectant l'interface
`PaymentProvider` (`backend/src/payments/payment-provider.interface.ts`), et branchez-le
dans `payments.module.ts` à la place de `SimulationPaymentProvider`.

### Compte bancaire du CE (Open Banking / PSD2)
```env
BANK_PROVIDER=openbanking
BANK_CLIENT_ID=...
BANK_CLIENT_SECRET=...
BANK_REDIRECT_URI=...
```
Complétez `backend/src/bank/bank.service.ts` → `startRealConnection()`.

### Outlook / Microsoft 365
1. Enregistrez une application dans le [portail Azure AD](https://portal.azure.com) de votre organisation.
2. Renseignez dans `.env` :
   ```env
   MS_TENANT_ID=...
   MS_CLIENT_ID=...
   MS_CLIENT_SECRET=...
   MS_REDIRECT_URI=http://localhost:3000/api/outlook-callback
   ```
3. Complétez l'échange de code contre jeton dans `backend/src/outlook/outlook.service.ts` → `handleCallback()`.

**Important — sécurité :** aucune clé, secret, IBAN complet ou identifiant bancaire réel n'est
codé en dur nulle part dans ce projet. Toutes les valeurs sensibles passent exclusivement par
des variables d'environnement (`.env`, jamais committé), conformément au cahier des charges.

---

## 6. Comptes de démonstration (après `npm run seed`)

Mot de passe identique pour tous : **`eclipse2026`**

| Email                              | Rôle                          |
|-------------------------------------|--------------------------------|
| camille.dubois@eclipse-ce.fr        | Admin CE                       |
| yanis.haddad@eclipse-ce.fr          | Collaborateur CE (Paiement + Dashboard) |
| karim.belaid@eclipse-ce.fr          | Collaborateur CE (Paiement uniquement)  |
| julie.laurent@eclipse-ce.fr         | Collaborateur CE (Dashboard uniquement) |
| lina.moreau@eclipse-ce.fr           | Salarié                        |
| thomas.bernard@eclipse-ce.fr        | Salarié                        |

---

## 7. Règles de rôles & permissions (rappel)

- **Admin CE** : lecture + écriture complète sur tous les modules.
- **Collaborateur CE / Salarié** : lecture seule partout.
- **Exception : Chat CE** — tous les rôles (y compris Salarié) peuvent lire **et écrire**.
- Le Collaborateur CE ne voit les modules **Paiements/Transactions** que si son `access`
  vaut `payment` ou `both`, et les modules **Réunions/Offres/Communications/Documents**
  que si son `access` vaut `dashboard` ou `both`. Ce filtrage est appliqué **côté backend**
  (`RolesGuard` + décorateur `@Permission(...)`), pas seulement dans l'interface.

---

## 8. Documentation API

Une fois le backend démarré : `http://localhost:3000/api/docs` (Swagger, avec authentification Bearer JWT).

---

## 9. Limitations connues de cette version (V2.0.0)

- `synchronize: true` sur TypeORM (pratique en développement) — à remplacer par de vraies
  migrations avant toute mise en production.
- Le stockage des documents est local au conteneur backend (`DOCUMENTS_LOCAL_PATH`) ; un
  driver S3 est prévu dans l'architecture (`DocumentsStorage`) mais reste à implémenter.
- Paiement, compte bancaire CE et Outlook restent en simulation tant que leurs variables
  d'environnement respectives ne sont pas renseignées (voir §5).
- Pas encore de page de changement de mot de passe côté profil utilisateur (à ajouter).
