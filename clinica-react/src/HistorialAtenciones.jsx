import { Link } from 'react-router-dom'
import { api } from './api/index.js'
import EstadoCarga from './components/EstadoCarga.jsx'
import { useSesion } from './context/useSesion.js'
import { useCarga } from './hooks/useCarga.js'
import { formatearFecha } from './utils/formato.js'

function HistorialAtenciones() {
  const { usuario } = useSesion()
  const { datos: atenciones, cargando, error, recargar } = useCarga(
    () => api.historial.porPaciente(usuario.pacienteId), usuario.pacienteId)

  return (
    <main className="historial-pagina-react">
      <section className="historial-hero-react">
        <span className="etiqueta-seccion">MI CUENTA</span>
        <h1>Historial de atenciones</h1>
        <p>Consulta el historial de atenciones médicas realizadas en la clínica.</p>
      </section>

      <EstadoCarga cargando={cargando} error={error} alReintentar={recargar} />

      {atenciones && atenciones.length === 0 && (
        <section className="historial-sin-sesion" role="status">
          <h2>Aún no tienes atenciones registradas</h2>
          <p>Cuando un médico registre una atención, aparecerá en esta sección.</p>
          <Link className="perfil-boton" to="/agendar-hora">Agendar una hora</Link>
        </section>
      )}

      {atenciones && atenciones.length > 0 && (
        <div className="historial-lista-react">
          {atenciones.map((atencion) => (
            <article className="historial-card-react" key={atencion.id}>
              <h2>Atención médica</h2>
              <dl>
                <div><dt>Fecha</dt><dd>{formatearFecha(atencion.fecha)}</dd></div>
                <div><dt>Especialidad</dt><dd>{atencion.especialidad || 'No informada'}</dd></div>
                <div><dt>Médico</dt><dd>{atencion.medicoNombre || 'No informado'}</dd></div>
                <div><dt>Motivo de consulta</dt><dd>{atencion.motivo || 'No informado'}</dd></div>
                <div><dt>Diagnóstico</dt><dd>{atencion.diagnostico}</dd></div>
                <div><dt>Indicaciones</dt><dd>{atencion.tratamiento || 'Sin indicaciones'}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default HistorialAtenciones
