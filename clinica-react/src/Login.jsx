import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { mensajeDeError } from './api/index.js'
import { USAR_API } from './api/config.js'
import { rutaInicial, useSesion } from './context/useSesion.js'

const configuracionAcceso = {
  PACIENTE: { titulo: 'Iniciar sesión', etiqueta: 'ACCESO DE PACIENTES', descripcion: 'Ingresa a tu cuenta para gestionar tus horas médicas.' },
  MEDICO: { titulo: 'Acceso médico', etiqueta: 'PORTAL MÉDICO', descripcion: 'Ingresa para revisar tu agenda y agendar horas para tus pacientes.' },
  ADMINISTRADOR: { titulo: 'Acceso administrativo', etiqueta: 'PORTAL ADMINISTRATIVO', descripcion: 'Ingresa para gestionar la información de la clínica.' },
}

// Solo se permite volver a rutas internas de la aplicación
function rutaSegura(valor) {
  return valor && valor.startsWith('/') && !valor.startsWith('//') ? valor : null
}

function Login({ rolRequerido = 'PACIENTE' }) {
  const [parametros] = useSearchParams()
  const navegar = useNavigate()
  const { usuario, iniciarSesion, sesionExpirada } = useSesion()
  const [correo, setCorreo] = useState(parametros.get('correo') || '')
  const [contrasena, setContrasena] = useState('')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [recordar, setRecordar] = useState(false)
  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState(false)
  const config = configuracionAcceso[rolRequerido]
  const esPaciente = rolRequerido === 'PACIENTE'
  const volver = rutaSegura(parametros.get('volver'))
  // Al cambiar de portal se conserva la página a la que se quería volver
  const sufijoVolver = volver ? `?volver=${encodeURIComponent(volver)}` : ''

  if (usuario && !procesando) {
    return <Navigate to={volver || rutaInicial(usuario)} replace />
  }

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setError('')
    const correoNormalizado = correo.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoNormalizado)) {
      setError('Ingresa un correo electrónico válido.')
      return
    }
    if (!contrasena) {
      setError('Ingresa tu contraseña.')
      return
    }

    setProcesando(true)
    try {
      const usuarioIngresado = await iniciarSesion({ correo: correoNormalizado, contrasena, rol: rolRequerido }, recordar)
      navegar(volver || rutaInicial(usuarioIngresado), { replace: true })
    } catch (errorLogin) {
      setError(mensajeDeError(errorLogin))
      setContrasena('')
    } finally {
      setProcesando(false)
    }
  }

  return (
    <main className="pagina-login">
      <section className="login-hero">
        <span className="etiqueta-seccion">{config.etiqueta}</span>
        <h1>{config.titulo}</h1>
        <p>{config.descripcion}</p>
      </section>
      <section className="login-card" aria-label={config.titulo}>
        {sesionExpirada && <p className="login-mensaje login-aviso" role="status">Tu sesión expiró. Vuelve a iniciar sesión.</p>}
        {volver && !sesionExpirada && <p className="login-mensaje login-aviso" role="status">Inicia sesión para continuar.</p>}
        <form onSubmit={enviarFormulario} noValidate>
          <div className="login-campo">
            <label htmlFor="login-correo">Correo electrónico</label>
            <input id="login-correo" type="email" name="correo" placeholder="tu@correo.cl"
              autoComplete="email" maxLength={80} value={correo}
              onChange={(evento) => setCorreo(evento.target.value)} required />
          </div>
          <div className="login-campo">
            <label htmlFor="login-contrasena">Contraseña</label>
            <div className="login-password-wrap">
              <input id="login-contrasena" type={mostrarContrasena ? 'text' : 'password'}
                name="contrasena" placeholder="Tu contraseña" autoComplete="current-password"
                maxLength={64} value={contrasena}
                onChange={(evento) => setContrasena(evento.target.value)} required />
              <button className="login-mostrar" type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                aria-controls="login-contrasena" aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                {mostrarContrasena ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
          <label className="login-recordar" htmlFor="login-recordar">
            <input id="login-recordar" type="checkbox" checked={recordar}
              onChange={(evento) => setRecordar(evento.target.checked)} />
            Mantener la sesión iniciada
          </label>
          {error && <p className="login-mensaje login-error" role="alert">{error}</p>}
          <button className="login-enviar" type="submit" disabled={procesando}>
            {procesando ? 'Ingresando…' : 'Iniciar sesión'}
          </button>
        </form>
        {!USAR_API && <p className="login-nota">Modo demostración sin servidor: las cuentas se guardan solo en este navegador.</p>}
        {esPaciente ? (
          <>
            <p className="login-ayuda">¿No tienes una cuenta? <Link to={`/registro-paciente${sufijoVolver}`}>Crea una aquí</Link></p>
            <nav className="login-accesos-personal" aria-label="Accesos para personal">
              <span>Accesos para personal</span>
              <Link to={`/acceso-medico${sufijoVolver}`}>Acceso médico</Link>
              <Link to={`/acceso-administracion${sufijoVolver}`}>Acceso administrativo</Link>
            </nav>
          </>
        ) : (
          <p className="login-ayuda"><Link to={`/login${sufijoVolver}`}>Volver al acceso de pacientes</Link></p>
        )}
        <p className="login-ayuda">¿Necesitas ayuda? <Link to="/contacto">Contáctanos</Link></p>
      </section>
    </main>
  )
}

export default Login
