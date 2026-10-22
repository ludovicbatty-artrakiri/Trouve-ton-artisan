/**
 * Image d'un artisan : sa photo/son logo s'il en a un en base,
 * sinon une illustration de sa catégorie.
 */
export default function ArtisanImage({ artisan, className = '' }) {
  const src = artisan.image || `/images/${artisan.categorie.slug}.svg`;
  return (
    <img
      src={src}
      alt={artisan.image ? `Photo de ${artisan.nom}` : ''} // illustration décorative : alt vide
      className={className}
      width="400"
      height="300"
      loading="lazy"
    />
  );
}
