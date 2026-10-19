import { URL_API } from '../config.js'
import { ErrorApi, mensajePorEstado } from '../errores.js'
import { cerrarSesion, EVENTO_SESION_EXPIRADA, obtenerSesion } from '../sesion.js'

function leerJson(texto) {
  try {
    return JSON.parse(texto)
  } catch {
    return null
  }
}

/**
 * Llama a la API del gateway agregando el token de la sesión.
 * Devuelve el JSON de la respuesta o lanza un ErrorApi con el mensaje que envía el backend.
 */
export async function solicitar(ruta, { metodo = 'GET', cuerpo, parametros } = {}) {
  const url = new URL(`${URL_API}${ruta}`, window.location.origin)
  Object.entries(parametros || {}).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') url.searchParams.set(clave, valor)
  })

  const sesion = obtenerSesion()
  const cabeceras = { Accept: 'application/json' }
  if (cuerpo !== undefined) cabeceras['Content-Type'] = 'application/json'
  if (sesion?.token) cabeceras.Authorization = `Bearer ${sesion.token}`

  let respuesta
  try {
    respuesta = await fetch(url, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    })
  } catch {
    throw new ErrorApi(0, 'SIN_CONEXION', 'No pudimos conectarnos con la clínica. Revisa tu conexión o intenta más tarde.')
  }

  const texto = await respuesta.text()
  const datos = texto ? leerJson(texto) : null

  if (!respuesta.ok) {
    // Token vencido o inválido: se cierra la sesión y la aplicación vuelve a pedir el inicio de sesión
    if (respuesta.status === 401 && sesion?.token) {
      cerrarSesion()
      window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA))
    }
    throw new ErrorApi(respuesta.status, datos?.error, datos?.mensaje || mensajePorEstado(respuesta.status), datos?.errores)
  }
  return datos
}
