import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Contacto from '../Contacto.jsx'

describe('Contacto', () => {
  // Prueba 5 — Estado del formulario: los campos y el contador cambian cuando el usuario escribe
  it('actualiza el estado del formulario y el contador de caracteres al escribir', async () => {
    render(<Contacto />)

    await userEvent.type(screen.getByLabelText('Nombre completo'), 'Ana Pérez')
    await userEvent.type(screen.getByLabelText('Mensaje'), 'Hola clínica')

    expect(screen.getByLabelText('Nombre completo')).toHaveValue('Ana Pérez')
    expect(screen.getByLabelText('Mensaje')).toHaveValue('Hola clínica')
    expect(screen.getByText('12 / 500 caracteres')).toBeInTheDocument()
  })

  // Prueba 6 — Validación: al enviar el formulario vacío se muestran los errores y no la confirmación
  it('muestra un mensaje de error por cada campo inválido al enviar vacío', async () => {
    render(<Contacto />)

    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByText('Escribe tu nombre completo (entre 3 y 60 caracteres).')).toBeInTheDocument()
    expect(screen.getByText('Ingresa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.')).toBeInTheDocument()
    expect(screen.getByText('Selecciona un asunto para tu consulta.')).toBeInTheDocument()
    expect(screen.getByText('Escribe al menos 10 caracteres más.')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre completo')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  // Prueba 7 — Evento de envío: con datos válidos se confirma el mensaje y el formulario queda limpio
  it('confirma el envío con datos válidos y limpia el formulario', async () => {
    render(<Contacto />)

    await userEvent.type(screen.getByLabelText('Nombre completo'), 'Ana Pérez')
    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'ana.perez@gmail.com')
    await userEvent.selectOptions(screen.getByLabelText('Asunto'), 'horas')
    await userEvent.type(screen.getByLabelText('Mensaje'), 'Quisiera saber si atienden los sábados.')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByRole('status')).toHaveTextContent('Tu mensaje quedó registrado')
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('')
    expect(screen.getByLabelText('Asunto')).toHaveValue('')
    expect(screen.getByText('0 / 500 caracteres')).toBeInTheDocument()
  })
})
