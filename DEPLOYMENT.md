# 📦 Guide de Déploiement - FRONTS ETF

## 📋 Table des matières

1. [Configuration Supabase](#1-configuration-supabase)
2. [Déploiement sur Vercel](#2-déploiement-sur-vercel)
3. [Déploiement sur Netlify](#3-déploiement-sur-netlify)
4. [Tests et Vérification](#4-tests-avant-production)

---

## 1️⃣ Configuration Supabase

### Étape 1: Créer un compte Supabase

- Aller à https://supabase.com
- Cliquer sur "Sign Up"
- S'inscrire avec email/GitHub/Google
- Créer une nouvelle organisation

### Étape 2: Créer un nouveau projet

- Cliquer sur "New Project"
- Entrer les détails:
  - **Name**: `fronts-etf`
  - **Database Password**: générer un mot de passe fort
  - **Region**: `Europe (Dublin)` pour performances optimales
- Attendre l'initialisation (5-10 minutes)

### Étape 3: Récupérer les clés API

- Dans le dashboard Supabase
- Aller à **Settings > API**
- Copier:
  - **Project URL** → `VITE_SUPABASE_URL`
  - **anon public key** → `VITE_SUPABASE_ANON_KEY`
- Sauvegarder ces clés quelque part de sûr

### Étape 4: Créer les tables

Dans Supabase, aller à **SQL Editor** et exécuter ce script complet:

```sql
-- ===== TABLE FRONTS =====
CREATE TABLE fronts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  comments TEXT,
  cover_image VARCHAR(500),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- ===== TABLE CONTACTS =====
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  front_id UUID REFERENCES fronts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  function VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  photo VARCHAR(500),
  created_at TIMESTAMP DEFAULT now()
);

-- ===== TABLE ACCESS (Accès Chantier) =====
CREATE TABLE access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  front_id UUID REFERENCES fronts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT,
  maps_link VARCHAR(500),
  photo VARCHAR(500),
  created_at TIMESTAMP DEFAULT now()
);

-- ===== TABLE PHOTOS =====
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  front_id UUID REFERENCES fronts(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  caption TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- ===== TABLE DOCUMENTS =====
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  front_id UUID REFERENCES fronts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- ===== ROW LEVEL SECURITY =====
ALTER TABLE fronts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE access ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- ===== POLICIES: Lecture Publique =====
CREATE POLICY "fronts_public_read" ON fronts
  FOR SELECT USING (true);

CREATE POLICY "contacts_public_read" ON contacts
  FOR SELECT USING (true);

CREATE POLICY "access_public_read" ON access
  FOR SELECT USING (true);

CREATE POLICY "photos_public_read" ON photos
  FOR SELECT USING (true);

CREATE POLICY "documents_public_read" ON documents
  FOR SELECT USING (true);
```

### Étape 5: Créer l'utilisateur Admin

- Aller à **Authentication > Users**
- Cliquer sur **"Invite"**
- Entrer:
  - Email: `admin@etf.fr` (ou votre email)
  - Password: Générer un mot de passe fort
- Cliquer **"Invite"**
- Vérifier votre email et confirmer l'invitation

### Étape 6: Configurer Storage

- Aller à **Storage > Buckets**
- Créer un bucket `photos` (Public)
- Créer un bucket `documents` (Public)

✅ **Supabase est prêt!**

---

## 2️⃣ Déploiement sur Vercel

### Étape 1: Préparer le repository GitHub

```bash
cd fronts-etf
git add .
git commit -m "Initial commit: FRONTS ETF PWA"
git push origin main
```

### Étape 2: Connecter Vercel

- Aller à https://vercel.com
- Cliquer **"New Project"**
- Cliquer **"Import Git Repository"**
- Chercher `fronts-etf`
- Sélectionner le repository

### Étape 3: Configurer les variables d'environnement

- Dans la page d'import, aller à **"Environment Variables"**
- Ajouter ces variables:
  ```
  VITE_SUPABASE_URL = https://xxxxx.supabase.co
  VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  VITE_ADMIN_EMAIL = admin@etf.fr
  ```

### Étape 4: Déployer

- Cliquer **"Deploy"**
- Attendre la fin du déploiement (~2-3 minutes)
- Vous recevrez une URL de type: `https://fronts-etf.vercel.app`

✅ **Vercel est en ligne!**

---

## 3️⃣ Déploiement sur Netlify

### Étape 1: Préparer le repository

(Même que Vercel)

### Étape 2: Connecter Netlify

- Aller à https://netlify.com
- Cliquer **"Add new site" > "Import an existing project"**
- Cliquer **"GitHub"**
- Sélectionner `fronts-etf`

### Étape 3: Configurer le build

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- Cliquer **"Deploy"**

### Étape 4: Ajouter les variables d'environnement

- Aller à **Site settings > Build & deploy > Environment**
- Cliquer **"Edit variables"**
- Ajouter:
  ```
  VITE_SUPABASE_URL = https://xxxxx.supabase.co
  VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  VITE_ADMIN_EMAIL = admin@etf.fr
  ```
- Cliquer **"Trigger deploy"**
- Attendre la fin (~3-5 minutes)

✅ **Netlify est en ligne!**

---

## 4️⃣ Tests Avant Production

### Test Local

```bash
npm run dev
# Ouvrir http://localhost:3000
```

### Test PWA

- Ouvrir DevTools (F12)
- Aller à **Application > Manifest**
- Vérifier que le manifest est chargé
- Tester l'installation sur mobile:
  - **Chrome/Edge**: Cliquer sur l'icône "Installer" (URL bar)
  - **Safari (iOS)**: Partage > Sur l'écran d'accueil
  - **Android**: Menu > Installer l'app

### Test Admin

- Aller à `/admin/login`
- Se connecter avec votre email/mot de passe admin
- Créer un front test
- Vérifier que les données s'affichent immédiatement

### Test Performance

- DevTools > **Lighthouse**
- Score attendu: **80-100**

---

## 📱 Installation PWA - Guide Utilisateur

### Chrome / Edge (Desktop & Android)
1. Cliquer sur l'icône "Installer" dans la barre d'adresse
2. Confirmer

### Safari (iOS)
1. Cliquer sur **Partage**
2. Sélectionner **"Sur l'écran d'accueil"**
3. Ajouter

### Android natif
1. Menu ⋮
2. "Installer l'app"
3. Confirmer

---

## 🔄 Mises à jour en Production

1. Faire les modifications localement
2. Tester: `npm run dev`
3. Commit & push sur main
4. Vercel/Netlify déploie automatiquement
5. App à jour en quelques minutes

---

## 🆘 Troubleshooting

### Erreur: "Supabase URL not found"
- Vérifier que `.env.local` contient les bonnes valeurs
- Vérifier les variables d'environnement en production

### Photos/documents ne s'affichent pas
- Vérifier que les buckets Storage existent dans Supabase
- Vérifier que les URLs sont valides et accessibles

### Authentification admin ne fonctionne pas
- Vérifier que l'utilisateur est créé dans **Supabase Auth**
- Vérifier que vous avez confirmé l'email d'invitation
- Vérifier email/mot de passe

### PWA ne s'installe pas
- Vérifier que `manifest.json` est valide
- Vérifier que l'app est en HTTPS en production
- Forcer le refresh du cache: **Ctrl+Shift+Delete**

### Erreur CORS
- Aller dans **Supabase > Settings > API > CORS Allowed Origins**
- Ajouter votre URL Vercel/Netlify

---

## ✅ Checklist Final

- [ ] Supabase créé et configuré
- [ ] Tables créées et RLS activée
- [ ] Utilisateur admin créé
- [ ] Repository poussé sur GitHub
- [ ] Vercel/Netlify connecté
- [ ] Variables d'environnement ajoutées
- [ ] Site déployé et en ligne
- [ ] Tests PWA validés
- [ ] Admin login fonctionnel
- [ ] Recherche en temps réel fonctionnelle

---

## 📞 Support Technique

Pour plus d'aide:
- **Supabase**: https://supabase.com/docs
- **Vercel**: https://vercel.com/docs
- **Netlify**: https://docs.netlify.com

✅ **Déploiement réussi! Votre application est prête pour la production.**
