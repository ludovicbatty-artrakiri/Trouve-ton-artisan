import { useEffect, useState } from 'react';

/**
 * Hook générique de chargement de données.
 * @param {() => Promise<any>} fetcher fonction qui appelle l'API
 * @param {Array} deps dépendances : on recharge quand elles changent
 * @returns {{ data: any, loading: boolean, error: Error|null }}
 */
export default function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false; // évite de mettre à jour un composant démonté
    setState((s) => ({ ...s, loading: true, error: null }));

    fetcher()
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((error) => !cancelled && setState({ data: null, loading: false, error }));

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
