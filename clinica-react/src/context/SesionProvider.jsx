import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../api/index.js'
import { cerrarSesion, EVENTO_SESION_EXPIRADA, guardarSesion, obtenerSesion } from '../api/sesion.js'
import { SesionContext } from './SesionContext.js'

function SesionProvider({ children }) {
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

  const iniciarSesion = useCallback(async (credenciales, recordar) => {
    const nueva = await api.auth.login(credenciales)
    guardarSesion(nueva, recordar)
    setSesion(nueva)
    setSesionExpirada(false)
    return nueva.usuario
  }, [])

  const registrarPaciente = useCallback(async (datos) => {
    const nueva = await api.auth.registrar(datos)
    guardarSesion(nueva, false)
    setSesion(nueva)
    setSesionExpirada(false)
    return nueva.usuario
  }, [])

  const salir = useCallback(() => {
    cerrarSesion()
    setSesion(null)
  }, [])

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
