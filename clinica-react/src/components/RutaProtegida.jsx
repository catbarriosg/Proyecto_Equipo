import { Link, Navigate, useLocation } from 'react-router-dom'
import { useSesion } from '../context/useSesion.js'

const LOGIN_POR_ROL = {
  PACIENTE: '/login',
  MEDICO: '/acceso-medico',
  ADMINISTRADOR: '/acceso-administracion',
}

/**
 * Muestra la página solo si hay sesión con alguno de los roles indicados.
 * Sin sesión, envía al inicio de sesión y luego vuelve a la página pedida.
 */
function RutaProtegida({ roles, children }) {
  const { usuario } = useSesion()
  const ubicacion = useLocation()

  if (!usuario) {
    const login = roles.length === 1 ? LOGIN_POR_ROL[roles[0]] : '/login'
    const volver = encodeURIComponent(ubicacion.pathname + ubicacion.search)
    return <Navigate to={`${login}?volver=${volver}`} replace />
  }

  if (!roles.includes(usuario.rol)) {
    return (
      <main className="panel-admin-denegado">
        <section className="perfil-sin-sesion" role="status">
          <h1>Acceso restringido</h1>
          <p>Esta sección no está disponible para tu tipo de cuenta.</p>
          <Link className="perfil-boton" to="/">Volver al inicio</Link>
        </section>
      </main>
    )
  }

  return children
}

export default RutaProtegida
