// mf-users/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mfUsers',
      filename: 'remoteEntry.js',
      exposes: {
        './Users': './src/components/Users.tsx', // Ajuste o caminho correto
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
        '@emotion/react': { singleton: true, requiredVersion: false },
        '@emotion/styled': { singleton: true, requiredVersion: false },
        '@mui/material': { singleton: true, requiredVersion: false },
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
    port: 3002, 
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
  preview: { 
    port: 3002, 
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
});