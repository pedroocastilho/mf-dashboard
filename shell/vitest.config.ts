// shell/vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'mfAnalytics/Analytics': fileURLToPath(new URL('./tests/mocks/mfAnalytics-Analytics.tsx', import.meta.url)),
      'mfUsers/Users': fileURLToPath(new URL('./tests/mocks/mfUsers-Users.tsx', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
