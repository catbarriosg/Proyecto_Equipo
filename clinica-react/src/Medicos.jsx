import { Link } from 'react-router-dom'
import medicos from './medicos.js'

function Medicos() {
  return (
    <main className="pagina-medicos">
      <section className="medicos-hero">
        <span className="etiqueta-seccion">CONOCE A NUESTRO EQUIPO</span>
        <h1>Nuestros médicos</h1>
        <p>
          Profesionales comprometidos con entregar una atención cercana,
          profesional y de calidad.
        </p>
      </section>

      <section className="medicos-lista" aria-label="Equipo médico">
        <ul className="lista-medicos">
          {medicos.map((medico) => (
            <li key={medico.id}>
              <article className="medico-card">
                <div className="foto-medico">
                  <img src={medico.imagen} alt={`Ilustración de ${medico.nombre}`} />
                </div>
                <h2>{medico.nombre}</h2>
                <h3>{medico.especialidad}</h3>
                <p>{medico.descripcion}</p>
                <Link className="enlace-especialidad" to="/especialidades">
                  Ver especialidades
                </Link>
                <Link
                  className="boton-medico"
                  to="/agendar-hora"
                  aria-label={`Agendar hora con ${medico.nombre}`}
                >
                  Agendar hora
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default Medicos