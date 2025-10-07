import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const vitePort = 3000;

export default defineConfig(({ mode }) => ({
  // ✨ Use repo root (where index.html lives), NOT client/
  root: '.',
  publicDir: 'public',

  plugins: [
    react(),

    // Handle source map requests that include query strings
    {
      name: 'handle-source-map-requests',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url && req.url.endsWith('.map')) {
            req.url = req.url.split('?')[0];
          }
          next();
        });
      },
    },

    // Add permissive CORS headers during local dev
    {
      name: 'add-cors-headers',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader(
            'Access-Control-Allow-Methods',
            'GET, POST, PUT, DELETE, PATCH, OPTIONS'
          );
          res.setHeader(
            'Access-Control-Allow-Headers',
            'Content-Type, Authorization, X-Requested-With'
          );
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            return res.end();
          }
          next();
        });
      },
    },
  ],

  // ✅ Alias to your real src folder (not client/src)
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Force Rollup/Vite to use root index.html
    rollupOptions: { input: 'index.html' },
  },

  clearScreen: false,

  server: {
    hmr: { overlay: false },
    host: true,
    port: vitePort,
    allowedHosts: true,
    cors: true,
    proxy: {
      '/api/': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },

  // Dev-only source maps
  css: { devSourcemap: true },
  esbuild: { sourcemap: true },
}));

