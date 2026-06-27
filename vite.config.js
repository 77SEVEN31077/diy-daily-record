import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'about.html',
        terms: 'terms.html',
        privacy: 'privacy.html',
      },
    },
  },
  server: {
    port: 3000,
    open: true
  }
});
