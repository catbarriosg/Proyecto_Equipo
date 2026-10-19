import process from 'node:process'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const entorno = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      // En desarrollo, las llamadas a /api se reenvían al gateway del backend (docker compose up)
      proxy: {
        '/api': {
          target: entorno.VITE_PROXY_API || 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
    // Pruebas unitarias (npm test): DOM simulado con jsdom y matchers de jest-dom
    test: {
      environment: 'jsdom',
      setupFiles: './src/pruebas/configuracion.js',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/**/*.{js,jsx}'],
        exclude: ['src/**/*.test.{js,jsx}', 'src/pruebas/**', 'src/main.jsx'],
      },
    },
  }
})
