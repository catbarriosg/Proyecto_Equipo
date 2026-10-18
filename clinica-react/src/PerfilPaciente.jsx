import { Link } from 'react-router-dom'

function obtenerSesion() {
  try {
    const sesionTemporal = sessionStorage.getItem('clinica.sesion')
    const sesionRecordada = localStorage.getItem('clinica.sesion')
    return JSON.parse(sesionTemporal || sesionRecordada || 'null')
  } catch {
    return null
  }
}

function formatearFecha(fecha) {
  if (!fecha) return 'No registrada'
  const [anio, mes, dia] = fecha.split('-').map(Number)
  return new Date(anio, mes - 1, dia).toLocaleDateString('es-CL')
}

function PerfilPaciente() {
  const sesion = obtenerSesion()
  let usuario = sesion
  if (sesion) {
    try {
      const usuarios = JSON.parse(localStorage.getItem('clinica.usuarios') || '[]')
      usuario = usuarios.find((item) => item.correo === sesion.correo) || sesion
    } catch {
      usuario = sesion
    }
  }

  return (
    <main className="perfil-pagina-react">
      <section className="perfil-hero-react">
        <span className="etiqueta-seccion">MI CUENTA</span>
        <h1>Perfil del paciente</h1>
        <p>Consulta la información de tu perfil.</p>
      </section>

      {!usuario ? (
        <section className="perfil-sin-sesion" role="status">
          <h2>Inicia sesión para ver tu perfil</h2>
          <p>La información de tu cuenta aparece aquí después de iniciar sesión en este navegador.</p>
          <Link className="perfil-boton" to="/login">Iniciar sesión</Link>
        </section>
      ) : (
        <section className="perfil-tarjeta-react">
          <div className="perfil-datos-react">
            <h2>Mis datos</h2>
            <dl>
              <div><dt>Nombre</dt><dd>{[usuario.nombre, usuario.apellido].filter(Boolean).join(' ') || 'No registrado'}</dd></div>
              <div><dt>Correo</dt><dd>{usuario.correo || 'No registrado'}</dd></div>
              <div><dt>Fecha de nacimiento</dt><dd>{formatearFecha(usuario.fechaNacimiento)}</dd></div>
              <div><dt>Previsión</dt><dd>{usuario.prevision || 'No indicada'}</dd></div>
            </dl>
          </div>
          <div className="perfil-acciones-react">
            <Link className="perfil-boton" to="/mis-horas">Mis horas médicas</Link>
            <Link className="perfil-boton perfil-boton-secundario" to="/agendar-hora">Agendar una hora</Link>
          </div>
        </section>
      )}
    </main>
  )
}

export default PerfilPaciente