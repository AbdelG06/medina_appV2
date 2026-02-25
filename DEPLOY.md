# Deploy rapide (Front + API + Mongo)

## 1) MongoDB Atlas
1. Créer un cluster gratuit Atlas.
2. Créer un user DB + mot de passe.
3. Autoriser IP `0.0.0.0/0` (pour test) ou IP fixe.
4. Copier l'URI:
   `mongodb+srv://USER:PASS@cluster.../fes_medina_magic?retryWrites=true&w=majority`

## 2) Backend API (Render recommandé)
1. Push du projet sur GitHub.
2. Render > New Web Service > connecter le repo.
3. Root directory: `/`
4. Build command: `npm install`
5. Start command: `npm run api`
6. Variables Render:
   - `NODE_ENV=production`
   - `PORT=10000` (Render injecte souvent automatiquement)
   - `MONGODB_URI=...` (Atlas)
   - `JWT_SECRET=...` (long secret)
   - `JWT_EXPIRES_IN=7d`
   - `ADMIN_EMAIL=admin@medina-fes.ma`
   - `ADMIN_PASSWORD=ChangeMoiFort`
   - `ADMIN_NAME=Super Admin`
   - Optionnel Cloudinary:
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`

7. Tester:
   `https://TON-API.onrender.com/api/health`

## 3) Frontend (Vercel recommandé)
1. Vercel > New Project > même repo.
2. Build command: `npm run build`
3. Output dir: `dist`
4. Env Vercel:
   - `VITE_API_BASE_URL=https://TON-API.onrender.com`

## 4) Vérification finale
- Ouvrir URL Vercel.
- Tester `/portail`:
  - login admin avec `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
- Tester avis monument et souvenirs.

## 5) Partage avec amis
- Envoie URL Vercel.
- L'API reste côté Render + DB Atlas.

## 6) Sécurité minimale avant partage
- Changer `ADMIN_PASSWORD`.
- Utiliser un `JWT_SECRET` long et aléatoire.
- Regénérer toute clé API exposée (ex: OpenAI).
