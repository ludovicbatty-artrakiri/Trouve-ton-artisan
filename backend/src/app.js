/**
 * Configuration de l'application Express.
 * L'ordre des middlewares compte : sécurité d'abord, routes ensuite, erreurs à la fin.
 */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/env');
const routes = require('./routes');
const { requireApiKey, globalLimiter } = require('./middlewares/security');
const { notFound, errorHandler } = require('./middlewares/errors');

const app = express();

// Derrière un hébergeur / reverse proxy, on fait confiance au 1er proxy
// pour obtenir la vraie IP du client (nécessaire au rate limiting).
app.set('trust proxy', 1);

// Masque « X-Powered-By: Express » (helmet le fait aussi) : ne pas révéler la technologie.
app.disable('x-powered-by');

// En-têtes HTTP de sécurité (CSP, HSTS, X-Content-Type-Options, frameguard…)
app.use(helmet());

// CORS : seules les origines déclarées (le site Trouve ton artisan) peuvent appeler l'API
app.use(cors({
  origin(origin, callback) {
    // Les requêtes sans origine (curl, serveur à serveur) restent soumises à la clé d'API
    if (!origin || config.corsOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
}));

// Journal des requêtes (format court, sans corps de requête ni données personnelles)
app.use(morgan(config.isProd ? 'combined' : 'dev'));

// Corps JSON limité à 10 ko : bloque les envois massifs
app.use(express.json({ limit: '10kb' }));

// Point de santé public pour l'hébergeur (ne divulgue rien)
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Toutes les routes métier : limitées en débit et protégées par la clé d'API
app.use('/api', globalLimiter, requireApiKey, routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
