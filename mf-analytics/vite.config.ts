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
        './Analytics': './src/index.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
        'recharts': { singleton: true, requiredVersion: false },
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
  server: { 
    port: 3001, 
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
  preview: { 
    port: 3001, 
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
});
