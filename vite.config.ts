import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // In dev, forward API calls to the local backend (npm run server).
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
