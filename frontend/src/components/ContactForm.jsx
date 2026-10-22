import { useState } from 'react';
import { api } from '../api/client';

const INITIAL = { nom: '', email: '', objet: '', message: '', website: '' };

/**
 * Validation côté navigateur : confort pour l'utilisateur (retour immédiat).
 * Elle ne remplace PAS la validation de l'API, qui reste la seule à faire foi.
 */
function validate(values) {
  const errors = {};
  if (values.nom.trim().length < 2) errors.nom = 'Veuillez indiquer votre nom (2 caractères minimum).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = 'Veuillez indiquer une adresse e-mail valide, par exemple : nom@exemple.fr';
  if (values.objet.trim().length < 3) errors.objet = "Veuillez indiquer l'objet de votre demande (3 caractères minimum).";
  if (values.message.trim().length < 10) errors.message = 'Votre message doit contenir au moins 10 caractères.';
  return errors;
}

/** Formulaire de contact d'un artisan (nom, e-mail, objet, message). */
export default function ContactForm({ artisanId, artisanName }) {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Place le focus sur le premier champ en erreur (WCAG 3.3.1)
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setStatus({ type: 'sending', message: '' });
    try {
      const res = await api.contactArtisan(artisanId, values);
      setValues(INITIAL);
      setStatus({ type: 'success', message: res.message });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  /** Génère les propriétés communes d'un champ (liaison label / erreur accessible). */
  const field = (name) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    className: `form-control ${errors[name] ? 'is-invalid' : ''}`,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `contact-${name}-error` : undefined,
    required: true,
  });

  const errorText = (name) => errors[name] && (
    <div id={`contact-${name}-error`} className="invalid-feedback">{errors[name]}</div>
  );

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate aria-labelledby="contact-title">
      <h2 id="contact-title" className="h3">Contacter {artisanName}</h2>
      <p className="text-body-secondary">Tous les champs sont obligatoires. Réponse sous 48 h.</p>

      <div className="mb-3">
        <label htmlFor="contact-nom" className="form-label">Nom</label>
        <input type="text" autoComplete="name" maxLength={100} {...field('nom')} />
        {errorText('nom')}
      </div>
      <div className="mb-3">
        <label htmlFor="contact-email" className="form-label">E-mail</label>
        <input type="email" autoComplete="email" maxLength={255} {...field('email')} />
        {errorText('email')}
      </div>
      <div className="mb-3">
        <label htmlFor="contact-objet" className="form-label">Objet</label>
        <input type="text" maxLength={150} {...field('objet')} />
        {errorText('objet')}
      </div>
      <div className="mb-3">
        <label htmlFor="contact-message" className="form-label">Message</label>
        <textarea rows={6} maxLength={3000} {...field('message')} />
        {errorText('message')}
      </div>

      {/* Pot de miel anti-robot : caché aux humains et aux lecteurs d'écran */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="contact-website">Ne pas remplir ce champ</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={handleChange} />
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={status.type === 'sending'}>
        {status.type === 'sending' ? 'Envoi en cours…' : 'Envoyer ma demande'}
      </button>

      {/* Zone annoncée automatiquement par les lecteurs d'écran */}
      <div aria-live="polite" className="mt-3">
        {status.type === 'success' && <div className="alert alert-success mb-0">{status.message}</div>}
        {status.type === 'error' && <div className="alert alert-danger mb-0">{status.message}</div>}
      </div>
    </form>
  );
}
