import Seo from '../components/Seo';

/**
 * Pages légales (mentions légales, données personnelles, accessibilité, cookies).
 * Leur contenu sera rédigé ultérieurement par un cabinet spécialisé.
 */
export default function LegalPage({ title }) {
  return (
    <div className="container page">
      <Seo title={title} description={`${title} du site Trouve ton artisan de la Région Auvergne-Rhône-Alpes.`} />
      <h1 className="page__title">{title}</h1>
      <div className="alert alert-info">
        <strong>Page en construction.</strong> Son contenu sera disponible prochainement.
      </div>
    </div>
  );
}
