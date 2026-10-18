import { Link } from 'react-router-dom'

const valores = [
  {
    icono: '❤️',
    titulo: 'Compromiso',
    descripcion: 'Nos preocupamos por entregar una atención responsable y centrada en cada paciente.'
  },
  {
    icono: '🤝',
    titulo: 'Confianza',
    descripcion: 'Construimos relaciones basadas en el respeto, la comunicación y el trato cercano.'
  },
  {
    icono: '🏥',
    titulo: 'Calidad',
    descripcion: 'Buscamos entregar una experiencia de atención profesional, clara y oportuna.'
  }
]

function QuienesSomos() {
  return (
    <main className="quienes-somos-react">
      <section className="qs-hero">
        <div className="qs-hero-texto">
          <span className="qs-etiqueta">CLÍNICA AGENDA MÉDICA</span>
          <h1>Quiénes somos</h1>
          <p>
            Trabajamos cada día para entregar una atención médica cercana,
            profesional y de calidad, poniendo a nuestros pacientes en el centro
            de cada experiencia.
          </p>
          <Link className="qs-boton" to="/agendar-hora">Agenda tu hora</Link>
        </div>
        <img src="/box-clinica.png" alt="Espacio de atención en Clínica Agenda Médica" />
      </section>

      <section className="qs-clinica">
        <div>
          <span className="qs-etiqueta">SOBRE NOSOTROS</span>
          <h2>Nuestra clínica</h2>
          <p>
            En Clínica Agenda Médica contamos con profesionales de distintas
            especialidades, comprometidos con entregar una atención oportuna y
            personalizada.
          </p>
          <p>
            Nuestro sistema de agenda médica busca facilitar el acceso a la
            atención, permitiendo encontrar profesionales, revisar horas
            disponibles y gestionar reservas de manera sencilla.
          </p>
        </div>
        <img src="/recepcion-clinica.png" alt="Recepción de Clínica Agenda Médica" loading="lazy" />
      </section>

      <section className="qs-proposito">
        <div className="qs-seccion-titulo">
          <span className="qs-etiqueta">NUESTRO PROPÓSITO</span>
          <h2>Misión y visión</h2>
        </div>
        <div className="qs-proposito-grid">
          <article className="qs-tarjeta-institucional">
            <span aria-hidden="true">🎯</span>
            <h3>Nuestra misión</h3>
            <p>
              Entregar atención médica cercana, oportuna y de calidad,
              facilitando el acceso de nuestros pacientes a profesionales de
              distintas especialidades.
            </p>
          </article>
          <article className="qs-tarjeta-institucional">
            <span aria-hidden="true">🌟</span>
            <h3>Nuestra visión</h3>
            <p>
              Ser una clínica reconocida por la calidad de su atención, el
              compromiso de sus profesionales y el uso de herramientas digitales
              que mejoren la experiencia de nuestros pacientes.
            </p>
          </article>
        </div>
      </section>

      <section className="qs-valores">
        <div className="qs-seccion-titulo">
          <span className="qs-etiqueta">LO QUE NOS REPRESENTA</span>
          <h2>Nuestros valores</h2>
        </div>
        <div className="qs-valores-grid">
          {valores.map((valor) => (
            <article className="qs-valor-card" key={valor.titulo}>
              <span aria-hidden="true">{valor.icono}</span>
              <h3>{valor.titulo}</h3>
              <p>{valor.descripcion}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="qs-video">
        <div className="qs-seccion-titulo">
          <span className="qs-etiqueta">CONÓCENOS EN VIDEO</span>
          <h2>Nuestro compromiso con tu salud</h2>
          <p>Conoce más sobre la importancia del cuidado de la salud y la prevención.</p>
        </div>
        <figure className="qs-video-marco">
          <iframe
            src="https://www.youtube.com/embed/D365wNJCdes"
            title="Un Chile más Sano - Ministerio de Salud de Chile"
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          <figcaption>
            Video “Un Chile más Sano” del Ministerio de Salud de Chile.{' '}
            <a href="https://www.youtube.com/watch?v=D365wNJCdes" target="_blank" rel="noreferrer">
              Ver en YouTube
            </a>
          </figcaption>
        </figure>
      </section>

      <section className="qs-equipo">
        <span className="qs-etiqueta">NUESTRO EQUIPO</span>
        <h2>Desarrolladores del proyecto</h2>
        <p>
          Este proyecto fue desarrollado por un equipo de estudiantes de
          Ingeniería en Informática, aplicando conocimientos de HTML, CSS,
          JavaScript y React para crear una solución web de gestión de agenda médica.
        </p>
      </section>
    </main>
  )
}

export default QuienesSomos