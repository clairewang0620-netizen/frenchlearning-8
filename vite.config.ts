import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Fix: Use path.resolve('src') to resolve alias without relying on __dirname
      "@": path.resolve('src'),
    },
  },
})