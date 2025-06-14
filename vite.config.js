import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Esta regla atrapará CUALQUIER petición que empiece con /api
      // y la redirigirá a tu backend, quitándole el /api.
      '/api': {
        target: 'http://localhost:5000', // La dirección de tu backend de Flask
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  }
})