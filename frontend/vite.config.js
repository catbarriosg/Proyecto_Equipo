import process from 'node:process'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
// Configuración de Vite: plugin de React, proxy hacia el backend y configuración de las pruebas con Vitest
export default defineConfig(({ mode }) => {
  // Lee las variables de los archivos .env para poder cambiar la dirección del gateway (VITE_PROXY_API)
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
      setupFiles: './src/test/setup.js',
      // Reporte de cobertura (npm run coverage): en consola y en HTML, excluyendo las pruebas y el punto de entrada
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/**/*.{js,jsx}'],
        exclude: ['src/**/*.test.{js,jsx}', 'src/test/**', 'src/main.jsx'],
      },
    },
  }
})
