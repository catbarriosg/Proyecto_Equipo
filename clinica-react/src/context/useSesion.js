import { useContext } from 'react'
import { SesionContext } from './SesionContext.js'

// Hook personalizado para leer la sesión: const { usuario, iniciarSesion, cerrarSesion } = useSesion()
// Lanza un error si se usa fuera del SesionProvider, para detectar el problema de inmediato.
export function useSesion() {
  const contexto = useContext(SesionContext)
  if (!contexto) throw new Error('useSesion debe usarse dentro de <SesionProvider>')
  return contexto
}

// Página de inicio de cada tipo de cuenta después de iniciar sesión
export function rutaInicial(usuario) {
  if (usuario?.rol === 'ADMINISTRADOR') return '/panel-administracion'
  if (usuario?.rol === 'MEDICO') return '/mis-horas'
  return '/perfil'
}
