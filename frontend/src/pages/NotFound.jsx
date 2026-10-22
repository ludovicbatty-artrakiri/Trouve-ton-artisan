import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

/** Page 404 : affichée pour toute URL inconnue (route « * » du router). */
export default function NotFound() {
  return (
    <div className="container page not-found text-center">
      <Seo title="Page non trouvée" description="La page que vous avez demandée n'existe pas ou a été déplacée." />
      <img src="/images/404.svg" alt="" width="320" height="220" className="not-found__img" />
      <h1 className="page__title">Page non trouvée</h1>
      <p className="lead">La page que vous avez demandée n’existe pas ou a été déplacée.</p>
      <Link to="/" className="btn btn-primary btn-lg">Retour à l’accueil</Link>
    </div>
  );
}
