/**
 * Chargement et vérification des variables d'environnement.
 * Les secrets (mot de passe BDD, clé API, SMTP) ne sont jamais écrits dans le code :
 * ils proviennent du fichier .env (non versionné) ou de l'hébergeur.
 */
require('dotenv').config();

const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'API_KEY', 'CORS_ORIGIN'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  // On refuse de démarrer plutôt que de tourner avec une configuration incomplète
  console.error(`Variables d'environnement manquantes : ${missing.join(', ')}`);
  process.exit(1);
}

if (process.env.API_KEY.length < 32) {
  console.error('API_KEY doit contenir au moins 32 caractères.');
  process.exit(1);
}

module.exports = {
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT) || 3001,
  // Adresse d'écoute : alwaysdata impose l'IP fournie dans la variable IP
  host: process.env.IP || undefined,
  // Dossier du frontend compilé à servir (optionnel, hébergement tout-en-un)
  frontendDist: process.env.FRONTEND_DIST
    ? require('path').resolve(process.env.FRONTEND_DIST)
    : null,
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  apiKey: process.env.API_KEY,
  corsOrigins: process.env.CORS_ORIGIN.split(',').map((o) => o.trim()),
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.MAIL_FROM || 'Trouve ton artisan <no-reply@trouve-ton-artisan.fr>',
  },
};
