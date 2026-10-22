import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';
import { api } from '../api/client';
import useFetch from '../hooks/useFetch';

/**
 * En-tête commun à toutes les pages : logo, menu des catégories, recherche.
 * Les libellés du menu proviennent de la base de données (via l'API).
 */
export default function Header() {
  const { data: categories } = useFetch(api.getCategories, []);
  const [open, setOpen] = useState(false); // menu mobile ouvert / fermé
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      {/* Lien d'évitement : permet aux utilisateurs clavier d'aller directement au contenu */}
      <a href="#main" className="skip-link">Aller au contenu principal</a>

      <nav className="navbar navbar-expand-lg" aria-label="Navigation principale">
        <div className="container">
          <Link to="/" className="navbar-brand" onClick={close}>
            <img
              src="/images/logo-sm.png"
              alt="Trouve ton artisan ! Avec la région Auvergne-Rhône-Alpes — retour à l'accueil"
              width="240"
              height="54"
              className="site-header__logo"
            />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            aria-controls="main-menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span className="navbar-toggler-icon" aria-hidden="true" />
            <span className="visually-hidden">{open ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
          </button>

          <div id="main-menu" className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
            <ul className="navbar-nav mx-lg-auto">
              {categories?.map((cat) => (
                <li className="nav-item" key={cat.id}>
                  <NavLink to={`/categorie/${cat.slug}`} className="nav-link" onClick={close}>
                    {cat.nom}
                  </NavLink>
                </li>
              ))}
            </ul>
            <SearchBar id="header-search" onSearch={close} />
          </div>
        </div>
      </nav>
    </header>
  );
}
