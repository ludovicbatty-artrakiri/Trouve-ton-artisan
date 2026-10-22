/**
 * Note sur 5 affichée en étoiles (pleines, demi, vides).
 * Accessibilité : les étoiles sont décoratives (aria-hidden) et la note est
 * annoncée en texte aux lecteurs d'écran (« Note : 4,5 sur 5 »).
 */
import { useId } from 'react';

function Star({ fill }) {
  // fill : 1 = pleine, 0.5 = demi, 0 = vide
  // Identifiant unique et stable pour le dégradé SVG (caractères spéciaux retirés pour url(#…))
  const id = `star${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <svg className="star" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="currentColor" />
          <stop offset={`${fill * 100}%`} stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5l2.9 6.2 6.6.7-5 4.5 1.4 6.6L12 17.2l-5.9 3.3 1.4-6.6-5-4.5 6.6-.7z"
        fill={`url(#${id})`}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function StarRating({ value }) {
  // Arrondi au demi-point le plus proche pour l'affichage
  const rounded = Math.round(value * 2) / 2;
  const label = value.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <p className="star-rating mb-0">
      <span className="visually-hidden">{`Note : ${label} sur 5`}</span>
      <span className="star-rating__stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => {
          let fill = 0;
          if (rounded >= i) fill = 1;
          else if (rounded >= i - 0.5) fill = 0.5;
          return <Star key={i} fill={fill} />;
        })}
      </span>
      <span className="star-rating__value" aria-hidden="true">{label}</span>
    </p>
  );
}
