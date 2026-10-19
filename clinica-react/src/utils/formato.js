import { aFecha } from './agenda.js'
import { formatearRut } from './rut.js'

/** "2026-11-05" -> "05-11-2026" */
export function formatearFecha(valor) {
  if (!valor) return 'No registrada'
  return aFecha(valor.slice(0, 10)).toLocaleDateString('es-CL')
}

/** "2026-11-05" -> "jueves, 5 de noviembre de 2026" */
export function formatearFechaLarga(valor) {
  if (!valor) return ''
  const texto = aFecha(valor.slice(0, 10)).toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

const ESTADOS_CITA = {
  SOLICITADA: 'Solicitada',
  CONFIRMADA: 'Confirmada',
  CANCELADA: 'Cancelada',
  ATENDIDA: 'Atendida',
}

export function estadoLegible(estado) {
  return ESTADOS_CITA[estado] || estado
}

/** "+56223456789" -> "+56 2 2345 6789"; "+56912345678" -> "+56 9 1234 5678" */
export function formatearTelefono(telefono) {
  const digitos = (telefono || '').replace(/\D/g, '')
  if (digitos.length === 11 && digitos.startsWith('56')) {
    return `+56 ${digitos[2]} ${digitos.slice(3, 7)} ${digitos.slice(7)}`
  }
  return telefono || ''
}

export function mostrarRut(rut) {
  return rut ? formatearRut(rut) : 'No registrado'
}

const ROLES = {
  PACIENTE: 'Paciente',
  MEDICO: 'Médico',
  ADMINISTRADOR: 'Administración',
}

export function rolLegible(rol) {
  return ROLES[rol] || rol
}
