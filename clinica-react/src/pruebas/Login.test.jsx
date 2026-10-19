import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { SesionContext } from '../context/SesionContext.js'
import Login from '../Login.jsx'

// En vez del SesionProvider real (que llama al backend) se entrega un contexto simulado con iniciarSesion como mock
function renderizarLogin(iniciarSesion) {
  const sesion = { usuario: null, sesionExpirada: false, iniciarSesion, registrarPaciente: vi.fn(), cerrarSesion: vi.fn() }
  return render(
    <SesionContext.Provider value={sesion}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login rolRequerido="PACIENTE" />} />
          <Route path="/perfil" element={<p>Página de perfil</p>} />
        </Routes>
      </MemoryRouter>
    </SesionContext.Provider>
  )
}

describe('Login', () => {
  // Prueba 8 — Validación con mock: un correo inválido muestra el error y no llega a llamar al servicio
  it('rechaza un correo inválido sin llamar a iniciarSesion', async () => {
    const iniciarSesion = vi.fn()
    renderizarLogin(iniciarSesion)

    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'ana.perez')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'Paciente123!')
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Ingresa un correo electrónico válido.')
    expect(iniciarSesion).not.toHaveBeenCalled()
  })

  // Prueba 9 — Eventos y navegación con mock: con datos válidos se inicia sesión y se redirige al perfil
  it('inicia sesión con el correo normalizado y redirige al perfil del paciente', async () => {
    const iniciarSesion = vi.fn().mockResolvedValue({ id: 1, nombre: 'Ana Pérez', rol: 'PACIENTE' })
    renderizarLogin(iniciarSesion)

    await userEvent.type(screen.getByLabelText('Correo electrónico'), '  Ana.Perez@Gmail.com ')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'Paciente123!')
    await userEvent.click(screen.getByLabelText('Mantener la sesión iniciada'))
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(iniciarSesion).toHaveBeenCalledWith(
      { correo: 'ana.perez@gmail.com', contrasena: 'Paciente123!', rol: 'PACIENTE' },
      true
    )
    expect(await screen.findByText('Página de perfil')).toBeInTheDocument()
  })
})
