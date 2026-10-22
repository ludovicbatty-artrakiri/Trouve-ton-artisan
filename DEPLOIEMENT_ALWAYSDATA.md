# Mise en ligne sur alwaysdata — pas à pas

Résultat : le site **et** l'API tournent sur une seule adresse, `https://COMPTE.alwaysdata.net`
(le serveur Node.js sert le site React compilé et répond aux appels `/api`).

> Dans tout ce guide, remplace **`COMPTE`** par le nom de ton compte alwaysdata.

Durée : 30 à 45 minutes.

---

## Étape 0 — Avant de commencer

- Ton code est sur GitHub (dépôt **public**, ou privé avec un jeton d'accès).
- Génère ta clé d'API sur ton PC et garde-la de côté :
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

## Étape 1 — Créer le compte

1. Va sur **alwaysdata.com** → *Inscription* → choisis l'offre **gratuite**.
2. Choisis le nom du compte : il donnera l'adresse du site `COMPTE.alwaysdata.net`
   (ex. `trouvetonartisan-ludo` → `https://trouvetonartisan-ludo.alwaysdata.net`).

## Étape 2 — Choisir la version de Node.js

Panneau d'administration → **Environnement** → **Node.js** → choisis **22** (ou la plus récente
version LTS ≥ 20 proposée) → *Enregistrer*.

## Étape 3 — Créer la base de données et l'utilisateur en lecture seule

Panneau → **Bases de données** → **MySQL**.

1. Onglet **Bases de données** → *Ajouter une base de données* → nom : `COMPTE_tta`
   (alwaysdata impose le préfixe `COMPTE_`).
2. Onglet **Utilisateurs** → *Ajouter un utilisateur* :
   - nom : `COMPTE_api`, un mot de passe solide (note-le) ;
   - permissions sur `COMPTE_tta` : **lecture seule** (« READONLY »).

   👉 C'est le **principe du moindre privilège** décrit dans le dossier : l'API ne peut que lire.
3. Vérifie que l'utilisateur principal `COMPTE` a **tous les droits** sur `COMPTE_tta`
   (il servira uniquement à importer les tables).

## Étape 4 — Importer les tables et les données

1. Toujours dans **Bases de données > MySQL**, clique sur le lien **phpMyAdmin**.
2. Connecte-toi avec l'utilisateur principal **`COMPTE`**.
3. À gauche, clique sur la base **`COMPTE_tta`** → onglet **Importer** :
   - importe `database/hebergement/01_create_tables.sql` → *Exécuter* ;
   - puis `database/hebergement/02_seed_data.sql` → *Exécuter*.
4. Tu dois voir 4 tables ; `artisan` contient **17** lignes.

> Pourquoi pas `01_create_database.sql` ? Sur un hébergement mutualisé, on n'a pas le droit
> de faire `CREATE DATABASE` ni `CREATE USER` : ces deux étapes se font dans le panneau (étape 3).
> Les fichiers du dossier `hebergement/` contiennent uniquement les tables et les données.

## Étape 5 — Se connecter en SSH

1. Panneau → **Accès distant** → **SSH** → modifie l'utilisateur `COMPTE` →
   coche **« Activer la connexion par mot de passe »** → enregistre.
2. Sur ton PC (Terminal sur Mac/Linux, PowerShell sur Windows) :
   ```bash
   ssh COMPTE@ssh-COMPTE.alwaysdata.net
   ```

## Étape 6 — Récupérer le code et installer l'API

Dans la session SSH :

```bash
cd ~
git clone https://github.com/TON-PSEUDO/trouve-ton-artisan.git
cd ~/trouve-ton-artisan/backend
npm ci --omit=dev
cp .env.alwaysdata.example .env
nano .env
```

Dans `nano`, remplace **chaque `COMPTE`**, le mot de passe de `COMPTE_api` et la clé d'API,
puis enregistre avec **Ctrl+O**, **Entrée**, et quitte avec **Ctrl+X**.

## Étape 7 — Compiler le site React

```bash
cd ~/trouve-ton-artisan/frontend
npm ci
printf "VITE_API_URL=/api\nVITE_API_KEY=COLLE_LA_MEME_CLE_QUE_DANS_LE_BACKEND\n" > .env
nano .env        # vérifie la clé
npm run build
ls dist          # doit afficher index.html, assets, images…
```

> **Si `npm run build` s'arrête avec « Killed »** (mémoire de l'offre gratuite insuffisante) :
> fais le build sur ton PC (`npm run build` dans `frontend/` avec le même `.env`), puis envoie
> le dossier `dist` avec **FileZilla** : hôte `sftp://ssh-COMPTE.alwaysdata.net`, utilisateur
> `COMPTE`, port 22 → dépose-le dans `/home/COMPTE/trouve-ton-artisan/frontend/`.

## Étape 8 — Déclarer le site Node.js

Panneau → **Web** → **Sites**. Un site existe déjà pour `COMPTE.alwaysdata.net` :
clique sur l'icône **Modifier** (sinon, *Ajouter un site*).

| Champ | Valeur |
|---|---|
| Adresses | `COMPTE.alwaysdata.net` |
| Type | **Node.js** |
| Commande | `node /home/COMPTE/trouve-ton-artisan/backend/src/server.js` |
| Répertoire de travail | `/home/COMPTE/trouve-ton-artisan/backend` |
| SSL | coche **Forcer le HTTPS** (si l'option est présente) |

Le **répertoire de travail** est important : c'est là que l'API lit son fichier `.env`.
L'IP et le port sont fournis automatiquement par alwaysdata (variables `IP` et `PORT`),
le code les utilise déjà.

*Enregistrer*, puis attendre une minute.

## Étape 9 — Vérifier

- `https://COMPTE.alwaysdata.net` → page d'accueil avec les 3 artisans du mois ;
- menu **Bâtiment** → 4 artisans ;
- recherche « dumont » → Boucherie Dumont ;
- `https://COMPTE.alwaysdata.net/nimporte-quoi` → page 404 ;
- `https://COMPTE.alwaysdata.net/api/categories` → `{"error":"Accès non autorisé."}`
  (normal : la clé d'API est exigée 👍) ;
- formulaire de contact → « Message envoyé ».

C'est ce lien que tu colles dans le dossier PDF (champ « Site en ligne »).

## En cas de problème

| Symptôme | Cause probable / solution |
|---|---|
| Erreur 502 / 503 | L'API ne démarre pas : panneau → **Logs** (ou `ls ~/admin/logs/sites/`). Vérifie la *Commande* et le *Répertoire de travail*. |
| « Variables d'environnement manquantes » dans les logs | Le `.env` n'est pas lu : vérifie le **Répertoire de travail** = dossier `backend`. |
| « Impossible de se connecter à la base » | `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` dans `backend/.env`. |
| Page blanche / « Cannot GET / » | `FRONTEND_DIST` incorrect ou `npm run build` non fait. |
| Les artisans ne s'affichent pas | La clé `VITE_API_KEY` du frontend ≠ `API_KEY` du backend → corrige puis refais `npm run build`. |

## Mettre à jour le site après une modification

```bash
ssh COMPTE@ssh-COMPTE.alwaysdata.net
cd ~/trouve-ton-artisan && git pull
cd backend && npm ci --omit=dev
cd ../frontend && npm ci && npm run build
```
Puis panneau → **Web > Sites** → **Redémarrer** le site.

## (Facultatif) Envoyer de vrais e-mails

Par défaut, les messages du formulaire sont écrits dans les logs, ce qui suffit pour la démonstration.
Pour de vrais e-mails :

1. ⚠️ Les adresses du jeu d'essai sont inventées mais **pourraient appartenir à de vraies personnes**.
   Avant tout, remplace-les par la tienne (phpMyAdmin, utilisateur `COMPTE`) :
   ```sql
   UPDATE artisan SET email = CONCAT('ton.adresse+', id_artisan, '@gmail.com');
   ```
2. Panneau → **Emails** → **Adresses** → crée `no-reply@COMPTE.alwaysdata.net`.
3. Dans `backend/.env` : `SMTP_HOST=smtp-COMPTE.alwaysdata.net`, `SMTP_PORT=465`,
   `SMTP_SECURE=true`, `SMTP_USER=no-reply@COMPTE.alwaysdata.net`, `SMTP_PASSWORD=…`
4. Redémarre le site.
