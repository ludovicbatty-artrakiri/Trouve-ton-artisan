import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuration de Vite (serveur de développement + build de production)
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5.3 utilise encore @import : on masque les avertissements
        // de dépréciation provenant des dépendances (pas de notre code).
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
      },
    },
  },
  build: {
    sourcemap: false, // pas de code source lisible exposé en production
  },
});
