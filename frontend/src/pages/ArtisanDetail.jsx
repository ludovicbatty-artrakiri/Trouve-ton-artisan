import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import StarRating from '../components/StarRating';
import ArtisanImage from '../components/ArtisanImage';
import ContactForm from '../components/ContactForm';
import { Loader, ErrorMessage } from '../components/Status';
import NotFound from './NotFound';
import { api } from '../api/client';
import useFetch from '../hooks/useFetch';

/** Autorise uniquement les liens http(s) — bloque par exemple « javascript: ». */
function safeUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
}

/** Fiche complète d'un artisan + formulaire de contact. */
export default function ArtisanDetail() {
  const { id } = useParams();
  const { data: artisan, loading, error } = useFetch(() => api.getArtisan(id), [id]);

  if (error && [400, 404].includes(error.status)) return <NotFound />;

  return (
    <div className="container page">
      {loading && <Loader />}
      {error && <ErrorMessage>{error.message}</ErrorMessage>}

      {artisan && (
        <>
          <Seo
            title={`${artisan.nom} — ${artisan.specialite} à ${artisan.ville}`}
            description={`${artisan.nom}, ${artisan.specialite.toLowerCase()} à ${artisan.ville}. Consultez sa fiche et contactez-le en ligne via Trouve ton artisan.`}
          />

          {/* Fil d'Ariane */}
          <nav aria-label="Fil d'Ariane">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
              <li className="breadcrumb-item">
                <Link to={`/categorie/${artisan.categorie.slug}`}>{artisan.categorie.nom}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">{artisan.nom}</li>
            </ol>
          </nav>

          <article className="artisan-detail row g-4 g-lg-5">
            <div className="col-12 col-lg-7">
              <div className="artisan-detail__header">
                <ArtisanImage artisan={artisan} className="artisan-detail__img" />
                <div>
                  <h1 className="page__title mb-2">{artisan.nom}</h1>
                  <StarRating value={artisan.note} />
                  <dl className="artisan-detail__meta">
                    <div><dt>Spécialité</dt><dd>{artisan.specialite}</dd></div>
                    <div><dt>Localisation</dt><dd>{artisan.ville}</dd></div>
                  </dl>
                </div>
              </div>

              <section aria-labelledby="about-title" className="artisan-detail__about">
                <h2 id="about-title" className="h3">À propos</h2>
                <p>{artisan.aPropos}</p>
                {safeUrl(artisan.siteWeb) && (
                  <p>
                    <a
                      href={safeUrl(artisan.siteWeb)}
                      className="btn btn-outline-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visiter le site web<span className="visually-hidden"> de {artisan.nom} (nouvel onglet)</span>
                    </a>
                  </p>
                )}
              </section>
            </div>

            <div className="col-12 col-lg-5">
              <div className="contact-card">
                <ContactForm artisanId={artisan.id} artisanName={artisan.nom} />
              </div>
            </div>
          </article>
        </>
      )}
    </div>
  );
}
