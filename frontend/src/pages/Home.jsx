import Seo from '../components/Seo';
import ArtisanCard from '../components/ArtisanCard';
import { Loader, ErrorMessage } from '../components/Status';
import { api } from '../api/client';
import useFetch from '../hooks/useFetch';

/** Les 4 étapes imposées par le brief (numéro + texte obligatoires). */
const STEPS = [
  'Choisir la catégorie d’artisanat dans le menu.',
  'Choisir un artisan.',
  'Le contacter via le formulaire de contact.',
  'Une réponse sera apportée sous 48h.',
];

export default function Home() {
  const { data: top, loading, error } = useFetch(api.getTopArtisans, []);

  return (
    <>
      <Seo
        title="Accueil"
        description="Trouvez un artisan près de chez vous en Auvergne-Rhône-Alpes et contactez-le en ligne : bâtiment, services, fabrication, alimentation."
      />

      <section className="hero">
        <div className="container">
          <h1 className="hero__title">Trouvez l’artisan qu’il vous faut, près de chez vous</h1>
          <p className="hero__lead">
            Plus de 221 000 entreprises artisanales font vivre la région Auvergne-Rhône-Alpes.
            Choisissez un professionnel et contactez-le en quelques clics.
          </p>
        </div>
      </section>

      <section className="steps container" aria-labelledby="steps-title">
        <h2 id="steps-title" className="section-title">Comment trouver mon artisan ?</h2>
        {/* Liste ordonnée : l'ordre des étapes a un sens */}
        <ol className="steps__list row g-3 list-unstyled">
          {STEPS.map((text, index) => (
            <li key={text} className="col-12 col-md-6 col-xl-3">
              <div className="step">
                <span className="step__number" aria-hidden="true">{index + 1}</span>
                <p className="step__text mb-0">
                  <span className="visually-hidden">{`Étape ${index + 1} : `}</span>
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="top-artisans" aria-labelledby="top-title">
        <div className="container">
          <h2 id="top-title" className="section-title">Les artisans du mois</h2>
          {loading && <Loader />}
          {error && <ErrorMessage>Impossible de charger les artisans du mois.</ErrorMessage>}
          {top && (
            <ul className="row g-4 list-unstyled">
              {top.map((artisan) => (
                <li key={artisan.id} className="col-12 col-md-6 col-lg-4">
                  <ArtisanCard artisan={artisan} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
