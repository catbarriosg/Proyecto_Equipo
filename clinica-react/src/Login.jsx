import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CLAVE_SESION, cerrarSesion, cifrarContrasena, obtenerUsuariosConCuentasDemo } from './auth.js'

const configuracionAcceso = {
  paciente: { titulo: 'Iniciar sesión', etiqueta: 'ACCESO DE PACIENTES', descripcion: 'Ingresa a tu cuenta para gestionar tus horas médicas.' },
  medico: { titulo: 'Acceso médico', etiqueta: 'PORTAL MÉDICO', descripcion: 'Ingresa para agendar horas para tus pacientes.' },
  administrador: { titulo: 'Acceso administrativo', etiqueta: 'PORTAL ADMINISTRATIVO', descripcion: 'Ingresa para gestionar la información de la clínica.' },
}

function Login({ rolRequerido = 'paciente' }) {
  const [parametros] = useSearchParams()
  const navegar = useNavigate()
  const [correo, setCorreo] = useState(parametros.get('correo') || '')
  const [contrasena, setContrasena] = useState('')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [recordar, setRecordar] = useState(false)
  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState(false)
  const config = configuracionAcceso[rolRequerido]
  const esPaciente = rolRequerido === 'paciente'

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
      const usuarios = await obtenerUsuariosConCuentasDemo()
      const usuario = usuarios.find((item) => item.correo === correoNormalizado)
      const hash = await cifrarContrasena(contrasena, correoNormalizado)
      const rolUsuario = usuario?.rol || 'paciente'
      if (!usuario || usuario.contrasena !== hash || rolUsuario !== rolRequerido) {
        setError(esPaciente
          ? 'Correo o contraseña incorrectos. Usa el acceso de personal si eres médico o administrador.'
          : 'Las credenciales no corresponden a este acceso.')
        setContrasena('')
        return
      }

      const sesion = { correo: usuario.correo, nombre: usuario.nombre, apellido: usuario.apellido, rol: rolUsuario, especialidad: usuario.especialidad || '' }
      cerrarSesion()
      const almacen = recordar ? localStorage : sessionStorage
      almacen.setItem(CLAVE_SESION, JSON.stringify(sesion))
      navegar(rolUsuario === 'administrador' ? '/panel-administracion' : rolUsuario === 'medico' ? '/agendar-hora' : '/perfil')
    } catch {
      setError('No se pudo completar el inicio de sesión. Revisa el almacenamiento de este navegador.')
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
        <p className="login-nota">Modo demostración: las cuentas se guardan solo en este navegador; no uses contraseñas reales.</p>
        {esPaciente ? (
          <>
            <p className="login-ayuda">¿No tienes una cuenta? <Link to="/registro-paciente">Crea una aquí</Link></p>
            <nav className="login-accesos-personal" aria-label="Accesos para personal">
              <span>Accesos para personal</span>
              <Link to="/acceso-medico">Acceso médico</Link>
              <Link to="/acceso-administracion">Acceso administrativo</Link>
            </nav>
          </>
        ) : (
          <p className="login-ayuda"><Link to="/login">Volver al acceso de pacientes</Link></p>
        )}
        <p className="login-ayuda">¿Necesitas ayuda? <Link to="/contacto">Contáctanos</Link></p>
      </section>
    </main>
  )
}

export default Login