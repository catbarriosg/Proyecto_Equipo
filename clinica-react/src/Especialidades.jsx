import { Link } from 'react-router-dom'

const especialidades = [
  {
    nombre: 'Medicina General',
    icono: '🩺',
    slug: 'medicina-general',
    descripcion: 'Atención médica integral para la prevención, diagnóstico y tratamiento de distintas condiciones de salud.'
  },
  {
    nombre: 'Pediatría',
    icono: '👶',
    slug: 'pediatria',
    descripcion: 'Atención médica especializada para niños y adolescentes, acompañando su crecimiento y desarrollo.'
  },
  {
    nombre: 'Ginecología',
    icono: '🌸',
    slug: 'ginecologia',
    descripcion: 'Atención y cuidado integral de la salud de la mujer en las distintas etapas de su vida.'
  },
  {
    nombre: 'Cardiología',
    icono: '❤️',
    slug: 'cardiologia',
    descripcion: 'Prevención, diagnóstico y tratamiento de enfermedades relacionadas con el corazón y el sistema cardiovascular.'
  },
  {
    nombre: 'Traumatología',
    icono: '🦴',
    slug: 'traumatologia',
    descripcion: 'Atención de lesiones y enfermedades relacionadas con huesos, articulaciones y músculos.'
  },
  {
    nombre: 'Dermatología',
    icono: '🧴',
    slug: 'dermatologia',
    descripcion: 'Evaluación, diagnóstico y tratamiento de enfermedades de la piel, el cabello y las uñas.'
  }
]

function Especialidades() {
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

      <section className="especialidades-grid" aria-label="Especialidades disponibles">
        {especialidades.map((especialidad) => (
          <article className="especialidad-card-react" key={especialidad.slug}>
            <span className="especialidad-icono-react" aria-hidden="true">
              {especialidad.icono}
            </span>
            <h2>{especialidad.nombre}</h2>
            <p>{especialidad.descripcion}</p>
            <div className="especialidad-acciones-react">
              <Link
                className="especialidad-boton-profesionales"
                to="/medicos"
                aria-label={`Ver profesionales de ${especialidad.nombre}`}
              >
                Ver profesionales
              </Link>
              <Link
                className="especialidad-enlace-agenda"
                to={`/agendar-hora?especialidad=${encodeURIComponent(especialidad.nombre)}`}
                aria-label={`Agendar hora en ${especialidad.nombre}`}
              >
                Agendar hora <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

export default Especialidades