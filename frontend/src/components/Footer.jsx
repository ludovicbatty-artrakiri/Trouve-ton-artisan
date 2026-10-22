import { Link } from 'react-router-dom';

/** Pages légales listées dans le footer (contenu fourni plus tard par un cabinet). */
export const LEGAL_PAGES = [
  { path: '/mentions-legales', label: 'Mentions légales' },
  { path: '/donnees-personnelles', label: 'Données personnelles' },
  { path: '/accessibilite', label: 'Accessibilité' },
  { path: '/cookies', label: 'Cookies' },
];

/** Pied de page commun : coordonnées de l'antenne de Lyon + liens légaux. */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row gy-4">
          <div className="col-12 col-md-6">
            <h2 className="site-footer__title">Antenne de Lyon</h2>
            {/* <address> : balise sémantique pour des coordonnées */}
            <address className="mb-0">
              Région Auvergne-Rhône-Alpes<br />
              101 cours Charlemagne<br />
              CS 20033<br />
              69269 LYON CEDEX 02<br />
              France<br />
              <a href="tel:+33426734000">+33 (0)4 26 73 40 00</a>
            </address>
          </div>
          <nav className="col-12 col-md-6" aria-label="Informations légales">
            <h2 className="site-footer__title">Informations légales</h2>
            <ul className="list-unstyled mb-0">
              {LEGAL_PAGES.map((page) => (
                <li key={page.path}>
                  <Link to={page.path}>{page.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="site-footer__copy">
          © {new Date().getFullYear()} Région Auvergne-Rhône-Alpes — Trouve ton artisan !
        </p>
      </div>
    </footer>
  );
}
