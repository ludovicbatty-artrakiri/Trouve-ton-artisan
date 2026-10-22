import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

/**
 * Gabarit commun : header + contenu de la page + footer.
 * À chaque changement de page, on remonte en haut et on place le focus sur
 * le contenu principal (sinon un lecteur d'écran ne « voit » pas le changement).
 */
export default function Layout() {
  const { pathname, search } = useLocation();
  const mainRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.focus();
  }, [pathname, search]);

  return (
    <>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1} className="site-main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
