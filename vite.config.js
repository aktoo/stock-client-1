// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const vitePort = 3000;

export default defineConfig(() => ({
  // Build from the repo root (where index.html lives)
  root: path.resolve(process.cwd(), '.'),
  publicDir: path.resolve(process.cwd(), 'public'),

  plugins: [
    react(),
    {
      // Handle source-map requests with query strings in dev
      name: 'handle-source-map-requests',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url && req.url.endsWith('.map')) req.url = req.url.split('?')[0];
          next();
        });
      },
    },
    {
      // Add permissive CORS headers in dev
      name: 'add-cors-headers',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
          if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
          next();
        });
      },
    },
  ],

  // Use your real src folder
  resolve: {
    alias: { '@': path.resolve(process.cwd(), 'src') },
  },

  // Output for Vercel
  build: {
    outDir: path.resolve(process.cwd(), 'dist'),
    emptyOutDir: true,
    // Force the entry so nothing tries client/index.html
    rollupOptions: { input: path.resolve(process.cwd(), 'index.html') },
  },

  clearScreen: false,

  server: {
    hmr: { overlay: false },
    host: true,
    port: vitePort,
    allowedHosts: true,
    cors: true,
    proxy: { '/api/': { target: 'http://localhost:3001', changeOrigin: true } },
  },

  css: { devSourcemap: true },
  esbuild: { sourcemap: true },
}));
