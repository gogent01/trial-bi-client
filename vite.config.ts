import { fileURLToPath, URL } from 'node:url';

// Vitest's defineConfig is Vite's, extended with the `test` section
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  test: {
    include: ['__tests__/**/*.spec.ts'],
    environment: 'node',
  },
});
