import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import EstadoCarga from '../components/EstadoCarga.jsx'

describe('EstadoCarga', () => {
  // Prueba 1 — Renderizado condicional y props: el texto llega por props y solo se muestra mientras carga
  it('muestra el indicador con el texto recibido mientras carga y no muestra nada al terminar', () => {
    const { rerender, container } = render(<EstadoCarga cargando texto="Buscando médicos…" />)

    expect(screen.getByRole('status')).toHaveTextContent('Buscando médicos…')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    rerender(<EstadoCarga cargando={false} error={null} />)

    expect(container).toBeEmptyDOMElement()
  })

  // Prueba 2 — Eventos con mock: el botón Reintentar ejecuta la función recibida por props
  it('muestra el error y ejecuta alReintentar al hacer clic en Reintentar', async () => {
    const alReintentar = vi.fn()
    render(<EstadoCarga error={new Error('Un servicio de la clínica no está disponible.')} alReintentar={alReintentar} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Un servicio de la clínica no está disponible.')

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(alReintentar).toHaveBeenCalledTimes(1)
  })
})
