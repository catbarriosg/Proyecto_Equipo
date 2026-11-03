import * as iniciales from './datosIniciales.js'

// Base de datos simulada: cada tabla es un arreglo guardado en localStorage.
// Si el navegador bloquea el almacenamiento, los datos viven en memoria mientras la página esté abierta.
const PREFIJO = 'clinica.db.'
// Al cambiar la versión se vuelven a cargar los datos de ejemplo (sirve cuando cambia la estructura de las tablas)
const VERSION = '2'
const memoria = new Map()

// Devuelve todas las filas de una tabla (ej. leer('citas')). Primero intenta localStorage y si no, la copia en memoria.
export function leer(tabla) {
  try {
    const guardado = localStorage.getItem(PREFIJO + tabla)
    if (guardado) return JSON.parse(guardado)
  } catch {
    // Se usa la copia en memoria
  }
  return structuredClone(memoria.get(tabla) || [])
}

// Reemplaza el contenido completo de una tabla, tanto en memoria como en localStorage
export function escribir(tabla, filas) {
  memoria.set(tabla, structuredClone(filas))
  try {
    localStorage.setItem(PREFIJO + tabla, JSON.stringify(filas))
  } catch {
    // Se mantiene la copia en memoria
  }
}

// Simula un ID autoincremental: el mayor ID existente + 1
export function siguienteId(filas) {
  return filas.reduce((mayor, fila) => Math.max(mayor, fila.id), 0) + 1
}

/** Mismo cifrado de demostración que usaba la versión anterior (SHA-256 de correo:contraseña). */
export async function cifrarContrasena(contrasena, correo) {
  const texto = `${correo.trim().toLowerCase()}:${contrasena}`
  const resumen = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto))
  // Convierte los bytes del resumen a texto hexadecimal
  return Array.from(new Uint8Array(resumen), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

// Promesa compartida: evita que la carga inicial se ejecute más de una vez si varias operaciones llegan juntas
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
      // Si la base ya está cargada y en la versión actual, no se toca
      if (version === VERSION && leer('usuarios').length > 0) return

      // Las contraseñas de las cuentas de ejemplo se guardan cifradas, nunca en texto plano
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
