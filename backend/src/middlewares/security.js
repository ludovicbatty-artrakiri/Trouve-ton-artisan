/**
 * Middlewares de sécurité de l'API.
 */
const crypto = require('crypto');
const { rateLimit } = require('express-rate-limit');
const config = require('../config/env');

/**
 * Vérifie la présence de la clé d'API dans l'en-tête « x-api-key ».
 * Objectif du brief : « L'accès à l'API devra être limité à l'application ».
 * La comparaison se fait en temps constant (timingSafeEqual) pour ne pas
 * permettre de deviner la clé caractère par caractère (attaque temporelle).
 */
function requireApiKey(req, res, next) {
  const received = req.get('x-api-key') || '';
  const expected = config.apiKey;

  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!valid) {
    return res.status(401).json({ error: 'Accès non autorisé.' });
  }
  return next();
}

/** Limite globale : 300 requêtes / 15 min / IP (anti-scraping, anti-DoS basique). */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Trop de requêtes, veuillez réessayer plus tard.' },
});

/** Limite stricte pour le formulaire de contact : 5 envois / heure / IP (anti-spam). */
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Vous avez envoyé trop de messages. Réessayez dans une heure.' },
});

module.exports = { requireApiKey, globalLimiter, contactLimiter };
