// mf-analytics/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mfAnalytics',
      filename: 'remoteEntry.js',
      exposes: {
        // O shell importa via: import('mfAnalytics/Analytics')
        './Analytics': './src/index.tsx',
      },
      // Bibliotecas singleton — mesma instância do shell
      shared: ['react', 'react-dom', 'zustand'],
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
  },
  server: {
  port: 3001,
  cors: true,
  headers: {
    'X-Frame-Options': 'ALLOWALL',
    'Content-Security-Policy': "frame-ancestors *",
  },
},
preview: {
  port: 3001,
  cors: true,
  headers: {
    'X-Frame-Options': 'ALLOWALL',
    'Content-Security-Policy': "frame-ancestors *",
  },
},
});
