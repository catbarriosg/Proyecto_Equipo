import { Link } from 'react-router-dom'

const atenciones = [
  {
    id: 'control-general',
    fecha: '15/08/2026',
    especialidad: 'Medicina General',
    medico: 'Dr. González',
    motivo: 'Control médico general',
    diagnostico: 'Estado de salud general estable',
    indicaciones: 'Mantener controles médicos periódicos.',
  },
  {
    id: 'control-cardio',
    fecha: '20/06/2026',
    especialidad: 'Cardiología',
    medico: 'Dr. Rojas',
    motivo: 'Control cardiovascular',
    diagnostico: 'Control sin observaciones relevantes',
    indicaciones: 'Continuar controles según indicación médica.',
  },
]

function tieneSesion() {
  try {
    return Boolean(sessionStorage.getItem('clinica.sesion') || localStorage.getItem('clinica.sesion'))
  } catch {
    return false
  }
}

function HistorialAtenciones() {
  const sesionActiva = tieneSesion()

  return (
    <main className="historial-pagina-react">
      <section className="historial-hero-react">
        <span className="etiqueta-seccion">MI CUENTA</span>
        <h1>Historial de atenciones</h1>
        <p>Consulta el historial de atenciones médicas realizadas en la clínica.</p>
      </section>

      {!sesionActiva ? (
        <section className="historial-sin-sesion" role="status">
          <h2>Inicia sesión para consultar tu historial</h2>
          <p>El historial está disponible para pacientes con sesión iniciada en este navegador.</p>
          <Link className="perfil-boton" to="/login">Iniciar sesión</Link>
        </section>
      ) : (
        <>
          <p className="historial-aviso">Información ficticia de ejemplo para esta demostración.</p>
          <div className="historial-lista-react">
            {atenciones.map((atencion) => (
              <article className="historial-card-react" key={atencion.id}>
                <h2>Atención médica</h2>
                <dl>
                  <div><dt>Fecha</dt><dd>{atencion.fecha}</dd></div>
                  <div><dt>Especialidad</dt><dd>{atencion.especialidad}</dd></div>
                  <div><dt>Médico</dt><dd>{atencion.medico}</dd></div>
                  <div><dt>Motivo de consulta</dt><dd>{atencion.motivo}</dd></div>
                  <div><dt>Diagnóstico</dt><dd>{atencion.diagnostico}</dd></div>
                  <div><dt>Indicaciones</dt><dd>{atencion.indicaciones}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  )
}

export default HistorialAtenciones