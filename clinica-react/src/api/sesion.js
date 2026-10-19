// Sesión guardada en el navegador: { token, usuario }.
// "Mantener la sesión iniciada" usa localStorage; si no, sessionStorage (se borra al cerrar la pestaña).
const CLAVE_SESION = 'clinica.sesion'

export const EVENTO_SESION_EXPIRADA = 'clinica:sesion-expirada'

export function obtenerSesion() {
  try {
    const guardada = sessionStorage.getItem(CLAVE_SESION) || localStorage.getItem(CLAVE_SESION)
    const sesion = guardada ? JSON.parse(guardada) : null
    return sesion?.token && sesion?.usuario ? sesion : null
  } catch {
    return null
  }
}

export function guardarSesion(sesion, recordar = false) {
  cerrarSesion()
  try {
    const almacen = recordar ? localStorage : sessionStorage
    almacen.setItem(CLAVE_SESION, JSON.stringify({ token: sesion.token, usuario: sesion.usuario }))
  } catch {
    // Si el navegador bloquea el almacenamiento, la sesión dura solo mientras la página esté abierta
  }
}

export function cerrarSesion() {
  try {
    sessionStorage.removeItem(CLAVE_SESION)
    localStorage.removeItem(CLAVE_SESION)
  } catch {
    // El almacenamiento puede estar deshabilitado por el navegador
  }
}
