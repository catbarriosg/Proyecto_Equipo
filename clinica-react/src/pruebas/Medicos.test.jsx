import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import Medicos from '../Medicos.jsx'

// Mock del módulo de la API: la página recibe estos datos sin backend ni localStorage
vi.mock('../api/index.js', () => ({
  api: {
    medicos: {
      listar: vi.fn().mockResolvedValue([
        { id: 1, nombre: 'Dr. Juan González', especialidad: 'Medicina General', especialidadSlug: 'medicina-general', descripcion: 'Atención integral.' },
        { id: 2, nombre: 'Dra. María Soto', especialidad: 'Pediatría', especialidadSlug: 'pediatria', descripcion: 'Atención de niños.' },
      ]),
    },
    especialidades: {
      listar: vi.fn().mockResolvedValue([
        { id: 1, nombre: 'Medicina General', slug: 'medicina-general' },
        { id: 2, nombre: 'Pediatría', slug: 'pediatria' },
      ]),
    },
  },
  mensajeDeError: (error) => error.message,
}))

describe('Medicos', () => {
  // Prueba 10 — Mock de la API, renderizado y filtro: muestra los médicos recibidos y los filtra por nombre
  it('muestra los médicos que entrega la API y los filtra por nombre', async () => {
    render(
      <MemoryRouter>
        <Medicos />
      </MemoryRouter>
    )

    expect(screen.getByRole('status')).toHaveTextContent('Cargando información…')
    expect(await screen.findByRole('heading', { name: 'Dr. Juan González' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dra. María Soto' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Agendar hora con Dra. María Soto' })).toHaveAttribute('href', '/agendar-hora?medico=2')

    await userEvent.type(screen.getByLabelText('Buscar por nombre'), 'soto')

    expect(screen.queryByRole('heading', { name: 'Dr. Juan González' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dra. María Soto' })).toBeInTheDocument()
  })
})
