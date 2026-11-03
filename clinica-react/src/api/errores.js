// Manejo de errores compartido por la API real (HTTP) y la simulada (localStorage).

// Error común de la API. El backend responde { status, error, mensaje, errores } y la base local imita ese formato.
//   estado  → código HTTP (400, 401, 404...; 0 si no hubo conexión)
//   codigo  → identificador corto del error enviado por el backend
//   errores → detalle por campo cuando falla una validación de formulario
export class ErrorApi extends Error {
  constructor(estado, codigo, mensaje, errores = null) {
    super(mensaje)
    this.name = 'ErrorApi'
    this.estado = estado
    this.codigo = codigo
    this.errores = errores
  }
}

// Mensajes de respaldo cuando el backend no envía un texto propio
const MENSAJES_POR_ESTADO = {
  400: 'Revisa los datos ingresados.',
  401: 'Debes iniciar sesión para continuar.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'No encontramos lo que buscabas.',
  409: 'La información entró en conflicto con otro registro.',
  503: 'Un servicio de la clínica no está disponible. Intenta nuevamente en unos minutos.',
}

// Devuelve el mensaje amigable asociado a un código HTTP (o uno genérico si no está en la tabla)
export function mensajePorEstado(estado) {
  return MENSAJES_POR_ESTADO[estado] || 'Ocurrió un error inesperado. Intenta nuevamente.'
}

// Texto para mostrar al usuario a partir de cualquier error
export function mensajeDeError(error) {
  return error?.message || 'Ocurrió un error inesperado. Intenta nuevamente.'
}
