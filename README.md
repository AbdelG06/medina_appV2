# Fes Medina Magic V2

Application web full-stack dediee a la medina de Fes: decouverte culturelle, promotion de l'artisanat local et portail professionnel de gestion.

## Vision du projet

Fes Medina Magic relie trois usages dans une seule plateforme:

- Un guide touristique/culturel pour visiteurs locaux et internationaux.
- Un e-shop artisanal pour valoriser les produits des artisans.
- Un espace metier securise pour les artisans et les administrateurs.

## Equipe

| Membre | GitHub | LinkedIn |
|---|---|---|
| Aya Ettoui | [ayouuya](https://github.com/ayouuya) | [aya-et_touil](https://www.linkedin.com/in/aya-et_touil) |
| Aya Idrissi | [aya18idrissi-spec](https://github.com/aya18idrissi-spec) | [aya-idrissi-el-bouzaidi](https://www.linkedin.com/in/aya-idrissi-el-bouzaidi) |
| Abdelkrim Garwaoui | [AbdelG06](https://github.com/AbdelG06) | [abdelkrim-garwaoui](https://www.linkedin.com/in/abdelkrim-garwaoui) |

## Table des matieres

- [Fonctionnalites](#fonctionnalites)
- [Architecture](#architecture)
- [Stack technique](#stack-technique)
- [Demarrage rapide](#demarrage-rapide)
- [Configuration environnement](#configuration-environnement)
- [Scripts npm](#scripts-npm)
- [Flux metier (roles)](#flux-metier-roles)
- [API (resume)](#api-resume)
- [Tests et qualite](#tests-et-qualite)
- [Deploiement](#deploiement)
- [Securite](#securite)
- [Depannage](#depannage)

## Fonctionnalites

### Experience publique

- Home immersive avec sections patrimoine, portes, circuits, city life.
- Pages monuments/detail, souvenirs, boutique, boutiques artisans.
- Catalogue produits publics avec pagination, details, notes et avis.
- Contact visiteur -> artisan depuis la fiche produit.
- Interface multilingue (`fr`, `en`, `ar`).

### Espace artisan

- Inscription artisan avec statut `pending`.
- Connexion via email, CIN ou code artisan.
- Gestion des produits: creation, edition, suppression.
- Upload image produit (max 4 images).
- Consultation des messages recus.
- Publication de souvenirs (avec moderation admin).

### Espace admin

- Dashboard: KPI, top produits, evolution artisans, vues monuments.
- Validation/suspension d'artisans.
- Validation/rejet de produits.
- Gestion du contenu editorial (eshop/restaurants/cafes/riads).
- CRUD monuments.
- Moderation souvenirs/commentaires.

## Architecture

```text
.
|-- src/                      # Frontend React
|   |-- pages/                # Pages publiques + portail
|   |-- components/           # Composants UI et sections
|   |-- contexts/             # Auth + settings
|   |-- lib/apiClient.ts      # Couche HTTP frontend
|   |-- locales/              # i18n
|   `-- data/                 # Donnees statiques (quiz, gates, etc.)
|-- server/                   # API Express
|   |-- routes/               # Endpoints REST
|   |-- models/               # Schemas Mongoose
|   |-- middleware/           # Auth, upload, erreurs
|   |-- config/               # Env, DB, cloudinary
|   |-- utils/                # JWT/password helpers
|   `-- index.js              # Bootstrap API
|-- uploads/                  # Fichiers uploades en local
|-- public/                   # Assets frontend
|-- DEPLOY.md                 # Guide deploiement rapide
`-- openai-proxy.js           # Proxy optionnel OpenAI
```

## Stack technique

### Frontend

- React 18 + TypeScript
- Vite 5
- Tailwind CSS + shadcn/ui + Radix UI
- React Router
- TanStack Query
- i18next

### Backend

- Node.js (ES Modules)
- Express 5
- MongoDB + Mongoose
- JWT + bcryptjs
- Helmet + CORS + rate limit
- Multer (+ Cloudinary optionnel)

## Demarrage rapide

### Prerequis

- Node.js 18+
- npm 9+
- MongoDB local ou MongoDB Atlas

### Installation locale

1. Installer les dependances:

```bash
npm install
```

2. Creer le fichier d'environnement:

```bash
cp .env.example .env
```

Sous PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Renseigner les variables critiques (`MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`).

4. Lancer l'API:

```bash
npm run api:dev
```

5. Lancer le frontend dans un 2eme terminal:

```bash
npm run dev
```

6. Ouvrir:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001`
- Healthcheck: `http://localhost:3001/api/health`

## Configuration environnement

Reference complete: `.env.example`

| Variable | Requise | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Non | URL API frontend en prod. |
| `API_PORT` | Non | Port local API (defaut 3001). |
| `PORT` | Non | Port cloud (Render, Railway, etc.). |
| `MONGODB_URI` | Oui | URI MongoDB principale. |
| `MONGODB_URI_DIRECT` | Non | URI fallback si `mongodb+srv` echoue localement. |
| `MONGODB_DB_NAME` | Non | Nom DB fallback si absent dans URI. |
| `JWT_SECRET` | Oui | Secret JWT long/aleatoire. |
| `JWT_EXPIRES_IN` | Non | Duree token (ex: `7d`). |
| `ADMIN_EMAIL` | Oui | Email admin seed. |
| `ADMIN_PASSWORD` | Oui | Mot de passe admin seed. |
| `ADMIN_NAME` | Non | Nom admin seed. |
| `CLOUDINARY_CLOUD_NAME` | Non | Stockage image cloud. |
| `CLOUDINARY_API_KEY` | Non | Cloudinary key. |
| `CLOUDINARY_API_SECRET` | Non | Cloudinary secret. |
| `OPENAI_API_KEY` | Non | Requis seulement pour `openai-proxy.js`. |

## Scripts npm

| Script | Utilite |
|---|---|
| `npm run dev` | Frontend en dev (Vite). |
| `npm run build` | Build frontend production (`dist/`). |
| `npm run preview` | Preview du build frontend. |
| `npm run lint` | Lint ESLint. |
| `npm run test` | Tests Vitest (run unique). |
| `npm run test:watch` | Tests Vitest en watch. |
| `npm run api` | API backend mode standard. |
| `npm run api:dev` | API backend avec watch/reload. |
| `npm run start` | Alias API (`server/index.js`). |

## Flux metier roles

### Roles applicatifs

- `visitor`/`user`: consultation publique + interactions ouvertes.
- `artisan`: gestion propre boutique/produits selon statut.
- `admin`: gestion complete du portail.

### Processus artisan

1. Creation compte artisan (`/api/auth/register-artisan`).
2. Statut initial `pending`.
3. Validation admin (`accepted`) ou rejet/suspension.

### Processus produit

1. Artisan cree/modifie produit -> statut `pending`.
2. Admin accepte/rejette.
3. Produit `accepted` visible en public.

## API resume

Base locale: `http://localhost:3001/api`

- `GET /health`
- `POST /auth/login`
- `POST /auth/register-artisan`
- `GET /auth/me`
- `GET /monuments` + CRUD monuments (routes protegees)
- `GET /products` (public)
- `GET /products/:id` (public, increment vues)
- `POST /products` / `PATCH /products/:id` / `DELETE /products/:id` (artisan/admin)
- `PATCH /products/:id/status` (admin)
- `GET /products/eshop`, `GET /products/shop/:artisanId`
- `POST /products/:id/contact`
- `GET/POST /products/:id/reviews`
- `GET /admin/dashboard`, `GET /admin/stats` + routes admin de gestion
- `GET /content` (contenu public parametrable)

## Tests et qualite

```bash
npm run lint
npm run test
```

Les tests frontend sont configures avec Vitest (`vitest.config.ts`).

## Deploiement

Voir [DEPLOY.md](./DEPLOY.md) pour le guide complet.

Strategie recommandee:

1. MongoDB Atlas pour la DB.
2. API sur Render (`npm run api`) avec variables backend.
3. Frontend sur Vercel (`npm run build`) avec `VITE_API_BASE_URL`.
4. Validation finale via `/api/health` et tests portail.

## Securite

Avant publication publique:

- Changer tous les secrets et mots de passe par defaut.
- Ne pas exposer `.env` ni les cles API.
- Restreindre CORS aux domaines autorises.
- Preferer stockage cloud pour les images en production.
- Mettre en place monitoring logs + erreurs.

## Depannage

### API KO au demarrage

- Verifier `.env` (`MONGODB_URI`, `JWT_SECRET`).
- Verifier l'accessibilite MongoDB.

### Echec DNS Atlas en `mongodb+srv`

- Utiliser `MONGODB_URI_DIRECT`.
- Corriger DNS local (1.1.1.1 / 8.8.8.8).

### Frontend ne joint pas l'API

- Verifier `VITE_API_BASE_URL`.
- Verifier que `npm run api:dev` tourne bien.
- Tester `GET /api/health`.

### Upload images indisponible

- Verifier les droits ecriture du dossier `uploads/`.
- En prod, configurer Cloudinary.

---

## Licence

A definir (`MIT`, proprietaire, etc.).
