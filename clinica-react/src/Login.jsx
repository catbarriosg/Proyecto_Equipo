import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

async function cifrarContrasena(contrasena, correo) {
  const texto = `${correo.trim().toLowerCase()}:${contrasena}`
  const bytes = new TextEncoder().encode(texto)
  const resumen = await window.crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(resumen), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function Login() {
  const [parametros] = useSearchParams()
  const [correo, setCorreo] = useState(parametros.get('correo') || '')
  const [contrasena, setContrasena] = useState('')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [recordar, setRecordar] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setMensaje('')
    setError('')

    const correoNormalizado = correo.trim().toLowerCase()
    if (!/^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(correoNormalizado)) {
      setError('Ingresa un correo válido @duoc.cl, @profesor.duoc.cl o @gmail.com.')
      return
    }
    if (!contrasena) {
      setError('Ingresa tu contraseña.')
      return
    }

    try {
      const usuarios = JSON.parse(localStorage.getItem('clinica.usuarios') || '[]')
      const usuario = usuarios.find((item) => item.correo === correoNormalizado)
      const hash = await cifrarContrasena(contrasena, correoNormalizado)
      if (!usuario || usuario.contrasena !== hash) {
        setError('Correo o contraseña incorrectos.')
        setContrasena('')
        return
      }

      const sesion = { correo: usuario.correo, nombre: usuario.nombre, apellido: usuario.apellido }
      const almacen = recordar ? localStorage : sessionStorage
      almacen.setItem('clinica.sesion', JSON.stringify(sesion))
      setMensaje(`¡Bienvenido, ${usuario.nombre}! Has iniciado sesión en este navegador.`)
      setContrasena('')
    } catch {
      setError('No se pudo acceder al almacenamiento del navegador. Revisa la configuración de privacidad.')
    }
  }

  return (
    <main className="pagina-login">
      <section className="login-hero">
        <span className="etiqueta-seccion">BIENVENIDO DE NUEVO</span>
        <h1>Iniciar sesión</h1>
        <p>Ingresa a tu cuenta para gestionar tus horas médicas.</p>
      </section>

      <section className="login-card" aria-label="Formulario de inicio de sesión">
        <form onSubmit={enviarFormulario} noValidate>
          <div className="login-campo">
            <label htmlFor="login-correo">Correo electrónico</label>
            <input
              id="login-correo" type="email" name="correo" placeholder="Ej: ana.perez@gmail.com"
              autoComplete="email" maxLength={80} value={correo}
              onChange={(evento) => setCorreo(evento.target.value)} required
            />
          </div>

          <div className="login-campo">
            <label htmlFor="login-contrasena">Contraseña</label>
            <div className="login-password-wrap">
              <input
                id="login-contrasena" type={mostrarContrasena ? 'text' : 'password'}
                name="contrasena" placeholder="Tu contraseña" autoComplete="current-password"
                maxLength={64} value={contrasena}
                onChange={(evento) => setContrasena(evento.target.value)} required
              />
              <button className="login-mostrar" type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                aria-controls="login-contrasena"
                aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
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
          {mensaje && <p className="login-mensaje login-aviso" role="status">{mensaje}</p>}
          <button className="login-enviar" type="submit">Iniciar sesión</button>
        </form>

        <p className="login-nota">Modo demostración: la cuenta se guarda solo en este navegador. No uses una contraseña real.</p>
        <p className="login-ayuda">¿No tienes una cuenta? <Link to="/registro-paciente">Crea una aquí</Link></p>
        <p className="login-ayuda">¿Necesitas ayuda? <Link to="/contacto">Contáctanos</Link></p>
      </section>
    </main>
  )
}

export default Login