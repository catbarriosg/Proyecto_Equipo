import { Link } from 'react-router-dom'
import { api } from './api/index.js'
import EstadoCarga from './components/EstadoCarga.jsx'
import { useCarga } from './hooks/useCarga.js'

function Especialidades() {
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
