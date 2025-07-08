import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api/v1': 'https://book-website-f9e4.onrender.com'
    }
  },
  plugins: [react()],
})
