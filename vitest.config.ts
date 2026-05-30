import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@auth': path.resolve(__dirname, './src/modules/auth'),
      '@candidate': path.resolve(__dirname, './src/modules/candidate'),
      '@recruiter': path.resolve(__dirname, './src/modules/recruiter'),
      '@portal': path.resolve(__dirname, './src/modules/portal'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
