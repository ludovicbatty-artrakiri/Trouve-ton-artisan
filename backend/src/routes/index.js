/**
 * Définition des routes de l'API + règles de validation des entrées.
 * Principe : on ne fait JAMAIS confiance aux données envoyées par le client.
 */
const { Router } = require('express');
const { param, query, body } = require('express-validator');
const ctrl = require('../controllers/artisanController');
const { handleValidation } = require('../middlewares/errors');
const { contactLimiter } = require('../middlewares/security');

const router = Router();

/** Interdit les retours à la ligne (évite l'injection d'en-têtes dans les e-mails). */
const noLineBreak = (value) => !/[\r\n]/.test(value);

const idRule = param('id').isInt({ min: 1 }).withMessage('Identifiant invalide.').toInt();

router.get('/categories', ctrl.listCategories);

router.get('/artisans/top', ctrl.listTopArtisans);

router.get(
  '/artisans',
  query('categorie').optional().isSlug().withMessage('Catégorie invalide.').isLength({ max: 60 }),
  query('recherche').optional().isString().trim().isLength({ min: 1, max: 100 })
    .withMessage('La recherche doit contenir entre 1 et 100 caractères.'),
  handleValidation,
  ctrl.listArtisans,
);

router.get('/artisans/:id', idRule, handleValidation, ctrl.getArtisan);

router.post(
  '/artisans/:id/contact',
  contactLimiter,
  idRule,
  body('nom').isString().trim().isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères.')
    .custom(noLineBreak)
    .withMessage('Le nom ne doit pas contenir de retour à la ligne.'),
  body('email').isString().trim().isEmail()
    .withMessage('Adresse e-mail invalide.')
    .isLength({ max: 255 }),
  body('objet').isString().trim().isLength({ min: 3, max: 150 })
    .withMessage("L'objet doit contenir entre 3 et 150 caractères.")
    .custom(noLineBreak)
    .withMessage("L'objet ne doit pas contenir de retour à la ligne."),
  body('message').isString().trim().isLength({ min: 10, max: 3000 })
    .withMessage('Le message doit contenir entre 10 et 3000 caractères.'),
  body('website').optional().isString().isLength({ max: 200 }), // pot de miel anti-robot
  handleValidation,
  ctrl.contactArtisan,
);

module.exports = router;
