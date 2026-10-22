/** Indicateur de chargement annoncé aux lecteurs d'écran (role="status"). */
export function Loader({ label = 'Chargement en cours…' }) {
  return (
    <div className="d-flex justify-content-center py-5" role="status">
      <div className="spinner-border text-primary" aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}

/** Message d'erreur annoncé immédiatement (role="alert"). */
export function ErrorMessage({ children }) {
  return (
    <div className="alert alert-danger" role="alert">
      {children || 'Une erreur est survenue. Veuillez réessayer plus tard.'}
    </div>
  );
}
