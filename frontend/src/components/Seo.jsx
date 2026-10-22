/**
 * Titre et description de la page pour les moteurs de recherche.
 * React 19 place automatiquement <title> et <meta> dans le <head> du document.
 */
export default function Seo({ title, description }) {
  const fullTitle = `${title} | Trouve ton artisan !`;
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
    </>
  );
}
