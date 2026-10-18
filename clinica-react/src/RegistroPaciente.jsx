import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cifrarContrasena } from './auth.js'

function RegistroPaciente() {
  const navegar = useNavigate()
  const [datos, setDatos] = useState({
    nombre: '', apellido: '', correo: '', fechaNacimiento: '', prevision: '', contrasena: '', repetirContrasena: '',
  })
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [mostrarRepetida, setMostrarRepetida] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const hoy = new Date().toISOString().slice(0, 10)
  const fechaMinima = `${new Date().getFullYear() - 120}${hoy.slice(4)}`

  function cambiar(campo, valor) {
    setDatos((actuales) => ({ ...actuales, [campo]: valor }))
    setError('')
    setExito('')
  }

  async function crearCuenta(evento) {
    evento.preventDefault()
    setError('')
    setExito('')

    const nombre = datos.nombre.trim()
    const apellido = datos.apellido.trim()
    const correo = datos.correo.trim().toLowerCase()
    const nombreValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]{2,30}$/
    if (!nombreValido.test(nombre)) {
      setError('El nombre debe tener entre 2 y 30 letras, sin espacios ni números.')
      return
    }
    if (!nombreValido.test(apellido)) {
      setError('El apellido debe tener entre 2 y 30 letras, sin espacios ni números.')
      return
    }
    if (!/^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(correo)) {
      setError('Usa un correo válido @duoc.cl, @profesor.duoc.cl o @gmail.com.')
      return
    }
    if (!datos.fechaNacimiento || datos.fechaNacimiento > hoy || datos.fechaNacimiento < fechaMinima) {
      setError('Ingresa una fecha de nacimiento válida, entre hoy y hace 120 años.')
      return
    }
    if (datos.contrasena.length < 8 || datos.contrasena.length > 64) {
      setError('La contraseña debe tener entre 8 y 64 caracteres.')
      return
    }
    if (datos.contrasena !== datos.repetirContrasena) {
      setError('Las contraseñas no coinciden.')
      return
    }

    try {
      const usuarios = JSON.parse(localStorage.getItem('clinica.usuarios') || '[]')
      if (usuarios.some((usuario) => usuario.correo === correo)) {
        setError('Este correo ya está registrado. Inicia sesión o usa otro correo.')
        return
      }
      const usuario = {
        nombre, apellido, correo, rol: 'paciente', fechaNacimiento: datos.fechaNacimiento,
        prevision: datos.prevision,
        contrasena: await cifrarContrasena(datos.contrasena, correo),
        fechaRegistro: new Date().toISOString(),
      }
      localStorage.setItem('clinica.usuarios', JSON.stringify([...usuarios, usuario]))
      setExito(`¡Cuenta creada, ${nombre}! Puedes iniciar sesión.`)
      setTimeout(() => navegar(`/login?correo=${encodeURIComponent(correo)}`), 1200)
    } catch {
      setError('No se pudo guardar la cuenta. Revisa la configuración de privacidad del navegador.')
    }
  }

  return (
    <main className="pagina-login">
      <section className="login-hero">
        <span className="etiqueta-seccion">NUEVO PACIENTE</span>
        <h1>Crear cuenta</h1>
        <p>Regístrate para agendar y gestionar tus horas médicas.</p>
      </section>

      <section className="login-card registro-card" aria-label="Formulario de registro de paciente">
        <form onSubmit={crearCuenta} noValidate>
          <p className="registro-nota"><span aria-hidden="true">*</span> Campos obligatorios</p>
          <div className="registro-grid">
            <div className="login-campo">
              <label htmlFor="registro-nombre">Nombre <span aria-hidden="true">*</span></label>
              <input id="registro-nombre" autoComplete="given-name" maxLength={30}
                value={datos.nombre} onChange={(e) => cambiar('nombre', e.target.value)} required />
            </div>
            <div className="login-campo">
              <label htmlFor="registro-apellido">Apellido <span aria-hidden="true">*</span></label>
              <input id="registro-apellido" autoComplete="family-name" maxLength={30}
                value={datos.apellido} onChange={(e) => cambiar('apellido', e.target.value)} required />
            </div>
          </div>

          <div className="login-campo">
            <label htmlFor="registro-correo">Correo electrónico <span aria-hidden="true">*</span></label>
            <input id="registro-correo" type="email" autoComplete="email" maxLength={80}
              placeholder="Ej: ana.perez@gmail.com" value={datos.correo}
              onChange={(e) => cambiar('correo', e.target.value)} required />
            <small className="registro-ayuda">Se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.</small>
          </div>

          <div className="registro-grid">
            <div className="login-campo">
              <label htmlFor="registro-fecha">Fecha de nacimiento <span aria-hidden="true">*</span></label>
              <input id="registro-fecha" type="date" autoComplete="bday" min={fechaMinima} max={hoy}
                value={datos.fechaNacimiento} onChange={(e) => cambiar('fechaNacimiento', e.target.value)} required />
            </div>
            <div className="login-campo">
              <label htmlFor="registro-prevision">Previsión médica <span className="registro-opcional">(opcional)</span></label>
              <select id="registro-prevision" value={datos.prevision}
                onChange={(e) => cambiar('prevision', e.target.value)}>
                <option value="">Prefiero no indicarla</option>
                <option>Fonasa</option>
                <option>Isapre Banmédica</option>
                <option>Isapre Colmena</option>
                <option>Isapre Consalud</option>
                <option>Isapre Cruz Blanca</option>
                <option>Isapre Nueva Masvida</option>
                <option>Isapre Vida Tres</option>
                <option>Particular</option>
              </select>
            </div>
          </div>

          <div className="login-campo">
            <label htmlFor="registro-contrasena">Contraseña <span aria-hidden="true">*</span></label>
            <div className="login-password-wrap">
              <input id="registro-contrasena" type={mostrarContrasena ? 'text' : 'password'}
                autoComplete="new-password" minLength={8} maxLength={64} placeholder="Mínimo 8 caracteres"
                value={datos.contrasena} onChange={(e) => cambiar('contrasena', e.target.value)} required />
              <button className="login-mostrar" type="button" onClick={() => setMostrarContrasena(!mostrarContrasena)}
                aria-controls="registro-contrasena">{mostrarContrasena ? 'Ocultar' : 'Mostrar'}</button>
            </div>
          </div>

          <div className="login-campo">
            <label htmlFor="registro-repetir">Repetir contraseña <span aria-hidden="true">*</span></label>
            <div className="login-password-wrap">
              <input id="registro-repetir" type={mostrarRepetida ? 'text' : 'password'}
                autoComplete="new-password" maxLength={64} placeholder="Escribe la misma contraseña"
                value={datos.repetirContrasena} onChange={(e) => cambiar('repetirContrasena', e.target.value)} required />
              <button className="login-mostrar" type="button" onClick={() => setMostrarRepetida(!mostrarRepetida)}
                aria-controls="registro-repetir">{mostrarRepetida ? 'Ocultar' : 'Mostrar'}</button>
            </div>
          </div>

          {error && <p className="login-mensaje login-error" role="alert">{error}</p>}
          {exito && <p className="login-mensaje login-aviso" role="status">{exito}</p>}
          <button className="login-enviar" type="submit">Crear cuenta</button>
        </form>
        <p className="login-nota">Modo demostración: la cuenta se guarda solo en este navegador. No uses una contraseña real.</p>
        <p className="login-ayuda">¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link></p>
      </section>
    </main>
  )
}

export default RegistroPaciente