/**
 * Client HTTP centralisé : toutes les requêtes vers l'API passent par ici.
 * La clé d'API est ajoutée automatiquement dans l'en-tête « x-api-key ».
 */
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

/** Erreur enrichie du code HTTP (utile pour afficher la page 404). */
export class ApiError extends Error {
  constructor(message, status, details = []) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data.error || 'Erreur de communication avec le serveur.', response.status, data.details);
  }
  return data;
}

export const api = {
  getCategories: () => request('/categories'),
  getTopArtisans: () => request('/artisans/top'),
  // URLSearchParams encode correctement les caractères spéciaux saisis
  getArtisans: ({ categorie, recherche } = {}) => {
    const params = new URLSearchParams();
    if (categorie) params.set('categorie', categorie);
    if (recherche) params.set('recherche', recherche);
    return request(`/artisans?${params}`);
  },
  getArtisan: (id) => request(`/artisans/${encodeURIComponent(id)}`),
  contactArtisan: (id, payload) => request(`/artisans/${encodeURIComponent(id)}/contact`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
};
