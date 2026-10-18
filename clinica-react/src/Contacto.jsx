import { useState } from 'react'

const formularioVacio = {
  nombre: '',
  correo: '',
  asunto: '',
  mensaje: '',
}

function Contacto() {
  const [formulario, setFormulario] = useState(formularioVacio)
  const [errores, setErrores] = useState({})
  const [confirmacion, setConfirmacion] = useState('')

  function validarCampo(campo, valor) {
    const valorLimpio = valor.trim()

    if (campo === 'nombre' && (valorLimpio.length < 3 || valorLimpio.length > 60)) {
      return 'Escribe tu nombre completo (entre 3 y 60 caracteres).'
    }

    if (campo === 'correo') {
      const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valorLimpio)
      const dominioValido = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(valorLimpio)
      if (!correoValido || !dominioValido) {
        return 'Ingresa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.'
      }
    }

    if (campo === 'asunto' && !valor) return 'Selecciona un asunto para tu consulta.'
    if (campo === 'mensaje' && valorLimpio.length < 10) {
      return `Escribe al menos ${10 - valorLimpio.length} caracteres más.`
    }
    return ''
  }

  function cambiarCampo(evento) {
    const { name, value } = evento.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
    setConfirmacion('')
    if (errores[name]) {
      setErrores((actuales) => ({ ...actuales, [name]: validarCampo(name, value) }))
    }
  }

  function enviarFormulario(evento) {
    evento.preventDefault()
    const nuevosErrores = Object.fromEntries(
      Object.entries(formulario).map(([campo, valor]) => [campo, validarCampo(campo, valor)])
    )
    setErrores(nuevosErrores)

    if (Object.values(nuevosErrores).some(Boolean)) {
      const primerCampoConError = Object.keys(nuevosErrores).find((campo) => nuevosErrores[campo])
      document.getElementById(`contacto-${primerCampoConError}`)?.focus()
      return
    }

    setConfirmacion('Tu mensaje quedó registrado en esta demostración. No se envió un correo.')
    setFormulario(formularioVacio)
    setErrores({})
  }

  return (
    <main className="pagina-contacto">
      <section className="contacto-hero">
        <span className="etiqueta-seccion">ESTAMOS PARA AYUDARTE</span>
        <h1>Contacto</h1>
        <p>Si necesitas información o tienes alguna consulta, completa el formulario y te responderemos a la brevedad.</p>
      </section>

      <section className="contacto-contenido">
        <form className="formulario-agenda formulario-contacto-react" onSubmit={enviarFormulario} noValidate>
          <h2>Escríbenos</h2>
          <label htmlFor="contacto-nombre">Nombre completo</label>
          <input id="contacto-nombre" name="nombre" value={formulario.nombre} onChange={cambiarCampo} onBlur={(evento) => setErrores((actuales) => ({ ...actuales, nombre: validarCampo('nombre', evento.target.value) }))} placeholder="Ej: Ana Pérez" autoComplete="name" aria-invalid={Boolean(errores.nombre)} aria-describedby={errores.nombre ? 'error-contacto-nombre' : undefined} />
          {errores.nombre && <small className="contacto-error" id="error-contacto-nombre">{errores.nombre}</small>}

          <label htmlFor="contacto-correo">Correo electrónico</label>
          <input id="contacto-correo" name="correo" type="email" value={formulario.correo} onChange={cambiarCampo} onBlur={(evento) => setErrores((actuales) => ({ ...actuales, correo: validarCampo('correo', evento.target.value) }))} placeholder="Ej: ana.perez@gmail.com" autoComplete="email" aria-invalid={Boolean(errores.correo)} aria-describedby={errores.correo ? 'error-contacto-correo' : 'ayuda-contacto-correo'} />
          <small className="contacto-ayuda" id="ayuda-contacto-correo">Se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.</small>
          {errores.correo && <small className="contacto-error" id="error-contacto-correo">{errores.correo}</small>}

          <label htmlFor="contacto-asunto">Asunto</label>
          <select id="contacto-asunto" name="asunto" value={formulario.asunto} onChange={cambiarCampo} onBlur={(evento) => setErrores((actuales) => ({ ...actuales, asunto: validarCampo('asunto', evento.target.value) }))} aria-invalid={Boolean(errores.asunto)}>
            <option value="">Selecciona un asunto</option>
            <option value="horas">Consulta sobre horas médicas</option>
            <option value="examenes">Resultados de exámenes</option>
            <option value="convenios">Convenios y aranceles</option>
            <option value="reclamo">Reclamo o sugerencia</option>
            <option value="otro">Otro</option>
          </select>
          {errores.asunto && <small className="contacto-error">{errores.asunto}</small>}

          <label htmlFor="contacto-mensaje">Mensaje</label>
          <textarea id="contacto-mensaje" name="mensaje" rows="5" maxLength="500" value={formulario.mensaje} onChange={cambiarCampo} onBlur={(evento) => setErrores((actuales) => ({ ...actuales, mensaje: validarCampo('mensaje', evento.target.value) }))} placeholder="Cuéntanos en qué podemos ayudarte (mínimo 10 caracteres)" aria-invalid={Boolean(errores.mensaje)} />
          <small className="contacto-ayuda">{formulario.mensaje.length} / 500 caracteres</small>
          {errores.mensaje && <small className="contacto-error">{errores.mensaje}</small>}

          <button type="submit">Enviar mensaje</button>
          {confirmacion && <p className="contacto-confirmacion" role="status">{confirmacion}</p>}
        </form>

        <section className="datos-contacto-react" aria-labelledby="titulo-datos-contacto">
          <h2 id="titulo-datos-contacto">Otras formas de contacto</h2>
          <article className="tarjeta-contacto-react"><span aria-hidden="true">📍</span><h3>Dirección</h3><address>Av. Salud 1234, Santiago</address></article>
          <article className="tarjeta-contacto-react"><span aria-hidden="true">📞</span><h3>Teléfono</h3><a href="tel:+56223456789">+56 2 2345 6789</a></article>
          <article className="tarjeta-contacto-react"><span aria-hidden="true">✉️</span><h3>Correo</h3><a href="mailto:contacto@clinicaagendamedica.cl">contacto@clinicaagendamedica.cl</a></article>
          <article className="tarjeta-contacto-react"><span aria-hidden="true">🕒</span><h3>Horario de atención</h3><p>Lunes a viernes: 08:00 a 20:00<br />Sábados: 09:00 a 14:00</p></article>
        </section>
      </section>
    </main>
  )
}

export default Contacto
