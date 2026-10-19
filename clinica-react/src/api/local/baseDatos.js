import * as iniciales from './datosIniciales.js'

// Base de datos simulada: cada tabla es un arreglo guardado en localStorage.
// Si el navegador bloquea el almacenamiento, los datos viven en memoria mientras la página esté abierta.
const PREFIJO = 'clinica.db.'
const VERSION = '2'
const memoria = new Map()

export function leer(tabla) {
  try {
    const guardado = localStorage.getItem(PREFIJO + tabla)
    if (guardado) return JSON.parse(guardado)
  } catch {
    // Se usa la copia en memoria
  }
  return structuredClone(memoria.get(tabla) || [])
}

export function escribir(tabla, filas) {
  memoria.set(tabla, structuredClone(filas))
  try {
    localStorage.setItem(PREFIJO + tabla, JSON.stringify(filas))
  } catch {
    // Se mantiene la copia en memoria
  }
}

export function siguienteId(filas) {
  return filas.reduce((mayor, fila) => Math.max(mayor, fila.id), 0) + 1
}

/** Mismo cifrado de demostración que usaba la versión anterior (SHA-256 de correo:contraseña). */
export async function cifrarContrasena(contrasena, correo) {
  const texto = `${correo.trim().toLowerCase()}:${contrasena}`
  const resumen = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto))
  return Array.from(new Uint8Array(resumen), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

let carga = null

/** Carga los datos de ejemplo la primera vez (o cuando cambia la versión de la base). */
export function asegurarDatos() {
  if (!carga) {
    carga = (async () => {
      let version
      try {
        version = localStorage.getItem(PREFIJO + 'version')
      } catch {
        version = null
      }
      if (version === VERSION && leer('usuarios').length > 0) return

      const usuarios = await Promise.all(iniciales.cuentas.map(async ({ contrasena, ...cuenta }) => ({
        ...cuenta, contrasenaHash: await cifrarContrasena(contrasena, cuenta.correo), activo: true,
      })))
      escribir('usuarios', usuarios)
      escribir('especialidades', iniciales.especialidades)
      escribir('sucursales', iniciales.sucursales)
      escribir('personal', iniciales.personal)
      escribir('pacientes', iniciales.pacientes)
      escribir('citas', iniciales.crearCitasIniciales())
      escribir('historial', iniciales.crearHistorialInicial())
      try {
        localStorage.setItem(PREFIJO + 'version', VERSION)
      } catch {
        // Sin almacenamiento persistente
      }
    })()
  }
  return carga
}
