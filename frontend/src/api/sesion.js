// Sesión guardada en el navegador: { token, usuario }.
// "Mantener la sesión iniciada" usa localStorage; si no, sessionStorage (se borra al cerrar la pestaña).
const CLAVE_SESION = 'clinica.sesion'

// Evento que se dispara cuando el backend rechaza el token (401) para que la aplicación cierre la sesión
export const EVENTO_SESION_EXPIRADA = 'clinica:sesion-expirada'

// Lee la sesión guardada. Devuelve null si no existe, está incompleta o el JSON está dañado.
export function obtenerSesion() {
  try {
    const guardada = sessionStorage.getItem(CLAVE_SESION) || localStorage.getItem(CLAVE_SESION)
    const sesion = guardada ? JSON.parse(guardada) : null
    return sesion?.token && sesion?.usuario ? sesion : null
  } catch {
    return null
  }
}

// Guarda la sesión tras iniciar sesión. Con "recordar" persiste en localStorage; si no, en sessionStorage.
// Antes borra cualquier sesión anterior para no dejar dos guardadas a la vez.
export function guardarSesion(sesion, recordar = false) {
  cerrarSesion()
  try {
    const almacen = recordar ? localStorage : sessionStorage
    almacen.setItem(CLAVE_SESION, JSON.stringify({ token: sesion.token, usuario: sesion.usuario }))
  } catch {
    // Si el navegador bloquea el almacenamiento, la sesión dura solo mientras la página esté abierta
  }
}

// Elimina la sesión de ambos almacenamientos (cerrar sesión o token vencido)
export function cerrarSesion() {
  try {
    sessionStorage.removeItem(CLAVE_SESION)
    localStorage.removeItem(CLAVE_SESION)
  } catch {
    // El almacenamiento puede estar deshabilitado por el navegador
  }
}
