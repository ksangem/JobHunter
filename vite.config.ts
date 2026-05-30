import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [react(), tailwindcss()],
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
})
