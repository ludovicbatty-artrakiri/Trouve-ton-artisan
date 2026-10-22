/**
 * Contrôleurs : logique métier de l'API.
 * Express 5 transmet automatiquement les erreurs des fonctions async au gestionnaire d'erreurs.
 */
const { Op } = require('sequelize');
const { matchedData } = require('express-validator');
const { Categorie, Specialite, Ville, Artisan } = require('../models');
const { sendContactEmail } = require('../services/mailer');

/**
 * Champs publics d'un artisan. L'E-MAIL N'EST JAMAIS RENVOYÉ au navigateur :
 * il reste côté serveur et n'est utilisé que pour l'envoi du formulaire de contact
 * (protection contre la collecte d'adresses par des robots spammeurs — RGPD).
 */
const PUBLIC_ATTRIBUTES = ['id_artisan', 'nom', 'note', 'a_propos', 'site_web', 'image', 'top'];

/**
 * Jointures utilisées partout : spécialité → catégorie, et ville.
 * Fonction (et non constante) pour obtenir un objet neuf à chaque requête.
 */
function includes(categorieId) {
  return [
    {
      model: Specialite,
      attributes: ['id_specialite', 'nom'],
      required: true,
      ...(categorieId ? { where: { id_categorie: categorieId } } : {}),
      include: [{ model: Categorie, attributes: ['id_categorie', 'nom', 'slug'] }],
    },
    { model: Ville, attributes: ['id_ville', 'nom'] },
  ];
}

/** Met en forme un artisan pour le frontend (objet plat, facile à afficher). */
function format(artisan) {
  return {
    id: artisan.id_artisan,
    nom: artisan.nom,
    note: artisan.note,
    aPropos: artisan.a_propos,
    siteWeb: artisan.site_web,
    image: artisan.image,
    top: artisan.top,
    specialite: artisan.specialite.nom,
    categorie: {
      nom: artisan.specialite.categorie.nom,
      slug: artisan.specialite.categorie.slug,
    },
    ville: artisan.ville.nom,
  };
}

/** Échappe les jokers SQL « % » et « _ » pour qu'ils soient cherchés littéralement. */
function escapeLike(value) {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/** GET /api/categories — alimente le menu du header. */
async function listCategories(req, res) {
  const categories = await Categorie.findAll({
    attributes: ['id_categorie', 'nom', 'slug'],
    order: [['id_categorie', 'ASC']],
  });
  res.json(categories.map((c) => ({ id: c.id_categorie, nom: c.nom, slug: c.slug })));
}

/** GET /api/artisans/top — les 3 artisans du mois (page d'accueil). */
async function listTopArtisans(req, res) {
  const artisans = await Artisan.findAll({
    attributes: PUBLIC_ATTRIBUTES,
    where: { top: true },
    include: includes(),
    order: [['note', 'DESC']],
    limit: 3,
  });
  res.json(artisans.map(format));
}

/**
 * GET /api/artisans?categorie=slug&recherche=texte
 * Liste filtrée par catégorie et/ou recherche sur le nom.
 */
async function listArtisans(req, res) {
  // matchedData() renvoie uniquement les paramètres validés ET nettoyés (trim…)
  const { categorie, recherche } = matchedData(req, { locations: ['query'] });
  const where = {};
  let categorieId = null;

  if (recherche) {
    // Requête préparée : la valeur est transmise séparément du SQL
    where.nom = { [Op.like]: `%${escapeLike(recherche)}%` };
  }

  if (categorie) {
    const cat = await Categorie.findOne({ where: { slug: categorie } });
    if (!cat) return res.status(404).json({ error: 'Catégorie introuvable.' });
    categorieId = cat.id_categorie;
  }

  const artisans = await Artisan.findAll({
    attributes: PUBLIC_ATTRIBUTES,
    where,
    include: includes(categorieId),
    order: [['nom', 'ASC']],
  });
  return res.json(artisans.map(format));
}

/** GET /api/artisans/:id — fiche complète. */
async function getArtisan(req, res) {
  const artisan = await Artisan.findByPk(req.params.id, {
    attributes: PUBLIC_ATTRIBUTES,
    include: includes(),
  });
  if (!artisan) return res.status(404).json({ error: 'Artisan introuvable.' });
  return res.json(format(artisan));
}

/** POST /api/artisans/:id/contact — envoie le formulaire à l'artisan par e-mail. */
async function contactArtisan(req, res) {
  // Champ « piège » invisible pour les humains : s'il est rempli, c'est un robot.
  // On répond « OK » sans rien envoyer pour ne pas lui donner d'indice.
  if (req.body.website) return res.status(202).json({ message: 'Message envoyé.' });

  const artisan = await Artisan.findByPk(req.params.id, { attributes: ['nom', 'email'] });
  if (!artisan) return res.status(404).json({ error: 'Artisan introuvable.' });

  const {
    nom, email, objet, message,
  } = matchedData(req, { locations: ['body'] });

  await sendContactEmail({
    to: artisan.email,
    artisanName: artisan.nom,
    name: nom,
    email,
    subject: objet,
    message,
  });

  return res.status(202).json({ message: 'Message envoyé. L\'artisan vous répondra sous 48 h.' });
}

module.exports = {
  listCategories, listTopArtisans, listArtisans, getArtisan, contactArtisan,
};
