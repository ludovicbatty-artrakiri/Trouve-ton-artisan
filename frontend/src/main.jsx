import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// Police Inter hébergée localement (aucun appel à un service tiers → RGPD)
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import './styles/main.scss';
import App from './App';

// Le <title> statique d'index.html ne sert qu'avant le chargement de React :
// on le retire pour que chaque page n'ait qu'un seul titre (celui de <Seo />).
document.querySelector('head > title')?.remove();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
