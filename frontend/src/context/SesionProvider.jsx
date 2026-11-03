import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../api/index.js'
import { cerrarSesion, EVENTO_SESION_EXPIRADA, guardarSesion, obtenerSesion } from '../api/sesion.js'
import { SesionContext } from './SesionContext.js'

// Proveedor de la sesión: guarda el usuario conectado en el estado de React y lo comparte con toda la aplicación.
// Cualquier componente lo lee con useSesion() sin tener que pasar props de padre a hijo.
function SesionProvider({ children }) {
  // Al abrir la página se recupera la sesión guardada en el navegador (si existe)
  const [sesion, setSesion] = useState(() => obtenerSesion())
  const [sesionExpirada, setSesionExpirada] = useState(false)

  // El cliente HTTP avisa cuando el backend rechaza el token (sesión vencida)
  useEffect(() => {
    function alExpirar() {
      setSesion(null)
      setSesionExpirada(true)
    }
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar)
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar)
  }, [])

  // Inicia sesión contra la API, guarda el token y actualiza el estado. Devuelve el usuario para redirigir según su rol.
  const iniciarSesion = useCallback(async (credenciales, recordar) => {
    const nueva = await api.auth.login(credenciales)
    guardarSesion(nueva, recordar)
    setSesion(nueva)
    setSesionExpirada(false)
    return nueva.usuario
  }, [])

  // Registra un paciente nuevo y deja la sesión iniciada inmediatamente
  const registrarPaciente = useCallback(async (datos) => {
    const nueva = await api.auth.registrar(datos)
    guardarSesion(nueva, false)
    setSesion(nueva)
    setSesionExpirada(false)
    return nueva.usuario
  }, [])

  // Cierra la sesión: borra el token del navegador y limpia el estado
  const salir = useCallback(() => {
    cerrarSesion()
    setSesion(null)
  }, [])

  // Valor compartido por el contexto. useMemo evita que los consumidores se rendericen de nuevo sin necesidad.
  const valor = useMemo(() => ({
    usuario: sesion?.usuario || null,
    sesionExpirada,
    iniciarSesion,
    registrarPaciente,
    cerrarSesion: salir,
  }), [sesion, sesionExpirada, iniciarSesion, registrarPaciente, salir])

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}

export default SesionProvider
