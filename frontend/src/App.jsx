import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { LEGAL_PAGES } from './components/Footer';
import Home from './pages/Home';
import ArtisanList from './pages/ArtisanList';
import ArtisanDetail from './pages/ArtisanDetail';
import LegalPage from './pages/LegalPage';
import NotFound from './pages/NotFound';

/** Table de routage de l'application. */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="categorie/:slug" element={<ArtisanList mode="category" />} />
        <Route path="recherche" element={<ArtisanList mode="search" />} />
        <Route path="artisan/:id" element={<ArtisanDetail />} />
        {LEGAL_PAGES.map((page) => (
          <Route key={page.path} path={page.path} element={<LegalPage title={page.label} />} />
        ))}
        {/* Toute autre URL → 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
