/**
 * Envoi des e-mails du formulaire de contact (Nodemailer).
 * - Production : serveur SMTP défini dans .env (connexion chiffrée TLS).
 * - Développement : si aucun SMTP n'est configuré, le message est affiché dans la console.
 */
const nodemailer = require('nodemailer');
const config = require('../config/env');

const transporter = config.smtp.host
  ? nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: { user: config.smtp.user, pass: config.smtp.password },
    requireTLS: !config.smtp.secure, // impose STARTTLS si on n'est pas déjà en TLS
  })
  : nodemailer.createTransport({ jsonTransport: true });

/**
 * Envoie la demande d'un particulier à un artisan.
 * Le message est envoyé en TEXTE BRUT (pas de HTML) : aucun code ne peut être
 * injecté dans la boîte mail de l'artisan. L'adresse du particulier est placée
 * en « Reply-To » : l'artisan répond directement, sans que le site ne stocke rien.
 */
async function sendContactEmail({ to, artisanName, name, email, subject, message }) {
  const info = await transporter.sendMail({
    from: config.smtp.from,
    to,
    replyTo: { name, address: email },
    subject: `[Trouve ton artisan] ${subject}`,
    text: [
      `Bonjour ${artisanName},`,
      '',
      'Vous avez reçu une nouvelle demande via la plateforme « Trouve ton artisan ! » :',
      '',
      `Nom : ${name}`,
      `E-mail : ${email}`,
      `Objet : ${subject}`,
      '',
      'Message :',
      message,
      '',
      '—',
      'Merci de répondre à cette personne sous 48 h.',
      'Région Auvergne-Rhône-Alpes',
    ].join('\n'),
  });

  if (!config.smtp.host) console.log('[mail de développement]', info.message);
  return info;
}

module.exports = { sendContactEmail };
