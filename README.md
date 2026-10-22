# Trouve ton artisan !

Plateforme de la **Région Auvergne-Rhône-Alpes** permettant aux particuliers de trouver un artisan de la région et de le contacter via un formulaire.

- **Frontend** : React 19, React Router, Bootstrap 5, Sass (Vite)
- **API** : Node.js, Express 5, Sequelize 6
- **Base de données** : MySQL 8 / MariaDB 10.6+

---

## Sommaire

1. [Prérequis](#prérequis)
2. [Structure du projet](#structure-du-projet)
3. [Installation](#installation)
4. [Lancement](#lancement)
5. [Routes de l'API](#routes-de-lapi)
6. [Sécurité](#sécurité)
7. [Déploiement](#déploiement)

---

## Prérequis

| Outil | Version minimale | Vérifier |
|---|---|---|
| Node.js | 20 LTS (testé avec 22) | `node -v` |
| npm | 10 | `npm -v` |
| MySQL **ou** MariaDB | MySQL 8.0 / MariaDB 10.6 | `mysql --version` |
| Git | 2.x | `git --version` |

## Structure du projet

```
trouve-ton-artisan/
├── database/
│   ├── 01_create_database.sql   # création de la base, des tables et du compte en lecture seule
│   └── 02_seed_database.sql     # alimentation avec le jeu d'essai fourni (17 artisans)
├── backend/                     # API REST (Express + Sequelize)
│   ├── .env.example
│   └── src/
│       ├── config/              # variables d'environnement, connexion BDD
│       ├── controllers/         # logique métier
│       ├── middlewares/         # clé d'API, rate limiting, erreurs
│       ├── models/              # modèles Sequelize (reflet du MLD)
│       ├── routes/              # routes + validation des entrées
│       ├── services/            # envoi des e-mails
│       ├── app.js               # configuration Express
│       └── server.js            # point d'entrée
└── frontend/                    # application React
    ├── .env.example
    ├── public/                  # logo, favicon, illustrations, robots.txt
    └── src/
        ├── api/                 # client HTTP
        ├── components/          # Header, Footer, cartes, étoiles, formulaire…
        ├── hooks/               # useFetch
        ├── pages/               # Accueil, Liste, Fiche, Pages légales, 404
        └── styles/              # Sass (variables de la charte + styles)
```

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/<votre-compte>/trouve-ton-artisan.git
cd trouve-ton-artisan
```

### 2. Créer et alimenter la base de données

```bash
mysql -u root -p < database/01_create_database.sql
mysql -u root -p < database/02_seed_database.sql
```

Le premier script crée la base `trouve_ton_artisan`, ses 4 tables et un utilisateur **`tta_api` qui n'a que le droit `SELECT`** (principe du moindre privilège).

### 3. Configurer et installer l'API

```bash
cd backend
cp .env.example .env
npm install
```

Éditez `backend/.env` :

- `DB_PASSWORD` : le mot de passe choisi pour `tta_api` ;
- `API_KEY` : une clé aléatoire d'au moins 32 caractères. Pour en générer une :
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `CORS_ORIGIN` : l'URL du frontend (`http://localhost:5173` en local) ;
- `SMTP_*` : facultatif en local. **Sans SMTP, les e-mails du formulaire sont affichés dans la console de l'API.**

### 4. Configurer et installer le frontend

```bash
cd ../frontend
cp .env.example .env
npm install
```

Éditez `frontend/.env` : `VITE_API_KEY` doit être **identique** à `API_KEY` du backend.

## Lancement

Dans deux terminaux :

```bash
# Terminal 1 — API (http://localhost:3001)
cd backend
npm run dev        # redémarre automatiquement à chaque modification
# ou : npm start

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

Ouvrez **http://localhost:5173**.

Build de production du frontend :

```bash
cd frontend
npm run build      # génère frontend/dist/
npm run preview    # prévisualise le build
```

## Routes de l'API

Toutes les routes `/api/*` exigent l'en-tête `x-api-key`.

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/categories` | Catégories (menu du header) |
| GET | `/api/artisans/top` | Les 3 artisans du mois |
| GET | `/api/artisans?categorie=<slug>` | Artisans d'une catégorie |
| GET | `/api/artisans?recherche=<texte>` | Recherche par nom |
| GET | `/api/artisans/:id` | Fiche d'un artisan |
| POST | `/api/artisans/:id/contact` | Envoie un e-mail à l'artisan (`nom`, `email`, `objet`, `message`) |
| GET | `/health` | État du serveur (sans clé) |

Exemple :

```bash
curl -H "x-api-key: VOTRE_CLE" http://localhost:3001/api/artisans/top
```

## Sécurité

Résumé des mesures (détaillées dans le dossier PDF) :

- Requêtes préparées via Sequelize + compte MySQL en lecture seule → injections SQL ;
- Validation et nettoyage de toutes les entrées (express-validator) ;
- Clé d'API (comparaison en temps constant) + CORS restreint au domaine du site ;
- En-têtes HTTP de sécurité (Helmet) ;
- Limitation du débit (300 req./15 min, 5 messages de contact/h) ;
- Adresses e-mail des artisans jamais exposées au navigateur ;
- Pot de miel anti-robot sur le formulaire ;
- Secrets dans `.env`, exclus de Git ;
- Dépendances auditées : `npm audit` → **0 vulnérabilité**.

## Déploiement

Exemple avec un hébergeur proposant Node.js + MySQL (alwaysdata, o2switch…) :

1. Créer la base MySQL et exécuter les deux scripts SQL ;
2. Déployer `backend/` comme application Node.js (`npm install --omit=dev`, commande `npm start`), et renseigner les variables d'environnement (`NODE_ENV=production`, `CORS_ORIGIN=https://votre-domaine`) ;
3. Construire le frontend avec les bonnes variables (`VITE_API_URL=https://api.votre-domaine/api`) puis déposer le contenu de `frontend/dist/` sur l'hébergement statique. Le fichier `.htaccess` (Apache) ou `_redirects` (Netlify) renvoie toutes les URL vers `index.html` afin que React Router gère les pages et la 404 ;
4. Activer HTTPS (Let's Encrypt).

---

Projet réalisé dans le cadre d'une formation — Région Auvergne-Rhône-Alpes (cas d'étude).
