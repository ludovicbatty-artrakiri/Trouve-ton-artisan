/**
 * Gestion centralisée des erreurs.
 * En production, aucun détail technique (pile d'appels, message SQL…) n'est renvoyé
 * au client : ces informations aideraient un attaquant à cartographier le système.
 */
const { validationResult } = require('express-validator');
const config = require('../config/env');

/** Renvoie une 400 si les règles express-validator ont échoué. */
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Données invalides.',
      details: errors.array().map((e) => ({ champ: e.path, message: e.msg })),
    });
  }
  return next();
}

/** Route inconnue de l'API. */
function notFound(req, res) {
  res.status(404).json({ error: 'Ressource introuvable.' });
}

/** Erreur inattendue. */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);
  // Corps JSON mal formé ou trop volumineux
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON invalide.' });
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Requête trop volumineuse.' });

  return res.status(500).json({
    error: 'Une erreur interne est survenue.',
    ...(config.isProd ? {} : { debug: err.message }),
  });
}

module.exports = { handleValidation, notFound, errorHandler };
