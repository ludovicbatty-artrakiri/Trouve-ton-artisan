import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * Barre de recherche (header) : recherche des artisans par leur nom.
 * Redirige vers /recherche?q=… ; la page de liste interroge ensuite l'API.
 */
export default function SearchBar({ id = 'search', onSearch }) {
  const [params] = useSearchParams();
  const [term, setTerm] = useState(params.get('q') || '');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = term.trim();
    if (!value) return;
    navigate(`/recherche?q=${encodeURIComponent(value)}`);
    if (onSearch) onSearch();
  };

  return (
    <form className="search-bar" role="search" onSubmit={handleSubmit}>
      {/* Libellé invisible mais lu par les lecteurs d'écran */}
      <label htmlFor={id} className="visually-hidden">Rechercher un artisan par son nom</label>
      <div className="input-group">
        <input
          id={id}
          type="search"
          className="form-control"
          placeholder="Rechercher un artisan…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          maxLength={100}
          autoComplete="off"
        />
        <button type="submit" className="btn btn-primary">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
            <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span className="visually-hidden">Lancer la recherche</span>
        </button>
      </div>
    </form>
  );
}
