// Se ejecuta antes de cada archivo de pruebas (ver "test.setupFiles" en vite.config.js)
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Desmonta lo renderizado para que cada prueba parta con el DOM vacío
afterEach(() => {
  cleanup()
})
