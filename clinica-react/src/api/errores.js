// Error común de la API. El backend responde { status, error, mensaje, errores } y la base local imita ese formato.
export class ErrorApi extends Error {
  constructor(estado, codigo, mensaje, errores = null) {
    super(mensaje)
    this.name = 'ErrorApi'
    this.estado = estado
    this.codigo = codigo
    this.errores = errores
  }
}

const MENSAJES_POR_ESTADO = {
  400: 'Revisa los datos ingresados.',
  401: 'Debes iniciar sesión para continuar.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'No encontramos lo que buscabas.',
  409: 'La información entró en conflicto con otro registro.',
  503: 'Un servicio de la clínica no está disponible. Intenta nuevamente en unos minutos.',
}

export function mensajePorEstado(estado) {
  return MENSAJES_POR_ESTADO[estado] || 'Ocurrió un error inesperado. Intenta nuevamente.'
}

// Texto para mostrar al usuario a partir de cualquier error
export function mensajeDeError(error) {
  return error?.message || 'Ocurrió un error inesperado. Intenta nuevamente.'
}
