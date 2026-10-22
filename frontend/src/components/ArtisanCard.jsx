import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import ArtisanImage from './ArtisanImage';

/**
 * Carte d'un artisan : nom, note, spécialité, localisation.
 * Toute la carte est cliquable grâce au lien « étiré » (stretched-link de Bootstrap)
 * tout en gardant un seul lien pour les lecteurs d'écran et la navigation clavier.
 */
export default function ArtisanCard({ artisan, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  return (
    <article className="card artisan-card h-100">
      <ArtisanImage artisan={artisan} className="card-img-top artisan-card__img" />
      <div className="card-body d-flex flex-column gap-2">
        <Heading className="artisan-card__name h5 mb-0">
          <Link to={`/artisan/${artisan.id}`} className="stretched-link">
            {artisan.nom}
          </Link>
        </Heading>
        <StarRating value={artisan.note} />
        <dl className="artisan-card__meta mb-0">
          <div>
            <dt>Spécialité</dt>
            <dd>{artisan.specialite}</dd>
          </div>
          <div>
            <dt>Localisation</dt>
            <dd>{artisan.ville}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
