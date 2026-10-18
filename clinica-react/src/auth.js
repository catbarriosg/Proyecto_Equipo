export const CLAVE_USUARIOS = 'clinica.usuarios'
export const CLAVE_SESION = 'clinica.sesion'

export async function cifrarContrasena(contrasena, correo) {
  const texto = `${correo.trim().toLowerCase()}:${contrasena}`
  const bytes = new TextEncoder().encode(texto)
  const resumen = await window.crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(resumen), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function obtenerUsuariosConCuentasDemo() {
  const usuarios = JSON.parse(localStorage.getItem(CLAVE_USUARIOS) || '[]')
  const cuentasDemo = [
    { correo: 'admin@clinica.cl', nombre: 'Administración', apellido: 'Clínica', rol: 'administrador', contrasenaTemporal: 'Admin123!' },
    { correo: 'dr.juan@clinica.cl', nombre: 'Juan', apellido: 'Pérez', especialidad: 'Medicina General', rol: 'medico', contrasenaTemporal: 'Medico123!' },
  ]

  for (const cuenta of cuentasDemo) {
    if (!usuarios.some((usuario) => usuario.correo === cuenta.correo)) {
      const { contrasenaTemporal, ...datosUsuario } = cuenta
      usuarios.push({ ...datosUsuario, contrasena: await cifrarContrasena(contrasenaTemporal, cuenta.correo) })
    }
  }
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios))
  return usuarios
}

export function obtenerSesion() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_SESION) || localStorage.getItem(CLAVE_SESION) || 'null')
  } catch {
    return null
  }
}

export function cerrarSesion() {
  try {
    sessionStorage.removeItem(CLAVE_SESION)
    localStorage.removeItem(CLAVE_SESION)
  } catch {
    // El almacenamiento puede estar deshabilitado por el navegador.
  }
}