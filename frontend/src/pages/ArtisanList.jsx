import { useParams, useSearchParams } from 'react-router-dom';
import Seo from '../components/Seo';
import ArtisanCard from '../components/ArtisanCard';
import { Loader, ErrorMessage } from '../components/Status';
import NotFound from './NotFound';
import { api } from '../api/client';
import useFetch from '../hooks/useFetch';

/**
 * Liste des artisans, utilisée pour deux routes :
 *  - /categorie/:slug  → artisans d'une catégorie
 *  - /recherche?q=…    → résultats de la recherche par nom
 */
export default function ArtisanList({ mode }) {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const query = (params.get('q') || '').trim();

  const isSearch = mode === 'search';
  const { data, loading, error } = useFetch(
    () => (isSearch
      ? (query ? api.getArtisans({ recherche: query }) : Promise.resolve([]))
      : api.getArtisans({ categorie: slug })),
    [mode, slug, query],
  );
  const { data: categories } = useFetch(api.getCategories, []);

  // Catégorie inexistante → page 404
  if (error?.status === 404 || (!isSearch && error?.status === 400)) return <NotFound />;

  // Nom de la catégorie tel qu'enregistré en base (avec ses accents : « Bâtiment »)
  const categoryName = categories?.find((c) => c.slug === slug)?.nom || '';

  const title = isSearch ? `Résultats pour « ${query} »` : categoryName;
  const description = isSearch
    ? `Artisans d'Auvergne-Rhône-Alpes dont le nom correspond à « ${query} ».`
    : `Découvrez les artisans de la catégorie ${categoryName} en Auvergne-Rhône-Alpes et contactez-les en ligne.`;

  return (
    <div className="container page">
      <Seo title={title || 'Artisans'} description={description} />
      <h1 className="page__title">{isSearch ? title : `Artisans : ${categoryName}`}</h1>

      {loading && <Loader />}
      {error && <ErrorMessage>{error.message}</ErrorMessage>}

      {data && (
        <>
          {/* Nombre de résultats annoncé aux lecteurs d'écran */}
          <p className="text-body-secondary" role="status">
            {data.length === 0
              ? 'Aucun artisan ne correspond à votre recherche.'
              : `${data.length} artisan${data.length > 1 ? 's' : ''} trouvé${data.length > 1 ? 's' : ''}`}
          </p>
          <ul className="row g-4 list-unstyled">
            {data.map((artisan) => (
              <li key={artisan.id} className="col-12 col-sm-6 col-lg-4">
                <ArtisanCard artisan={artisan} headingLevel={2} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
