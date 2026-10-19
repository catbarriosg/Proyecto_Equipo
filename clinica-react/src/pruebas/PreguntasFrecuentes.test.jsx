import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import PreguntasFrecuentes from '../PreguntasFrecuentes.jsx'
import preguntasFrecuentes from '../preguntasFrecuentes.js'

function renderizarPagina() {
  return render(
    <MemoryRouter>
      <PreguntasFrecuentes />
    </MemoryRouter>
  )
}

describe('PreguntasFrecuentes', () => {
  // Prueba 3 — Renderizado de lista: se dibujan todas las categorías y preguntas del archivo de datos
  it('renderiza todas las categorías y preguntas del conjunto de datos', () => {
    renderizarPagina()

    for (const grupo of preguntasFrecuentes) {
      expect(screen.getByRole('heading', { level: 2, name: grupo.categoria })).toBeInTheDocument()
      for (const { pregunta } of grupo.preguntas) {
        expect(screen.getByText(pregunta)).toBeInTheDocument()
      }
    }
  })

  // Prueba 4 — Estado y renderizado condicional: el buscador filtra la lista y avisa cuando no hay resultados
  it('filtra las preguntas al escribir en el buscador y avisa si no hay coincidencias', async () => {
    renderizarPagina()
    const buscador = screen.getByLabelText('Buscar una pregunta')

    await userEvent.type(buscador, 'fonasa')

    expect(screen.getByText('¿Trabajan con Fonasa e Isapres?')).toBeInTheDocument()
    expect(screen.queryByText('¿Cómo puedo agendar una hora?')).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    await userEvent.clear(buscador)
    await userEvent.type(buscador, 'telemedicina')

    expect(screen.getByRole('status')).toHaveTextContent('No encontramos preguntas que coincidan con “telemedicina”.')
  })
})
