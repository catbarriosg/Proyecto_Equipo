import { Link } from 'react-router-dom'
import { api } from '../api/index.js'
import EstadoCarga from '../components/EstadoCarga.jsx'
import { useCarga } from '../hooks/useCarga.js'

// Página de especialidades: lista las especialidades activas obtenidas desde la API
function Especialidades() {
  // useCarga entrega el estado de la consulta: datos, si está cargando, el error y la función para reintentar
  const { datos: especialidades, cargando, error, recargar } = useCarga(() => api.especialidades.listar(), 'especialidades')

  return (
    <main className="pagina-especialidades">
      <section className="especialidades-hero-react">
        <span className="especialidades-etiqueta">ATENCIÓN MÉDICA</span>
        <h1>Especialidades médicas</h1>
        <p>
          Encuentra la atención que necesitas y conoce las especialidades
          disponibles en Clínica Agenda Médica.
        </p>
      </section>

      <EstadoCarga cargando={cargando} error={error} alReintentar={recargar} />

      {especialidades && (
        <section className="row g-4" aria-label="Especialidades disponibles">
          {especialidades.map((especialidad) => (
            <div className="col-12 col-sm-6 col-lg-4" key={especialidad.slug}>
              <article className="especialidad-card-react h-100">
                <span className="especialidad-icono-react" aria-hidden="true">
                  {especialidad.icono}
                </span>
                <h2>{especialidad.nombre}</h2>
                <p>{especialidad.descripcion}</p>
                {/* Cada tarjeta enlaza a los médicos filtrados por especialidad y a la agenda con la especialidad preseleccionada */}
                <div className="especialidad-acciones-react">
                  <Link
                    className="especialidad-boton-profesionales"
                    to={`/medicos?especialidad=${especialidad.slug}`}
                    aria-label={`Ver profesionales de ${especialidad.nombre}`}
                  >
                    Ver profesionales
                  </Link>
                  <Link
                    className="especialidad-enlace-agenda"
                    to={`/agendar-hora?especialidad=${especialidad.slug}`}
                    aria-label={`Agendar hora en ${especialidad.nombre}`}
                  >
                    Agendar hora <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </section>
      )}
    </main>
  )
}

export default Especialidades
