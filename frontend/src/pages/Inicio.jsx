import { Link } from 'react-router-dom'

// Tarjetas de la sección "Nuestros servicios"
const servicios = [
  {
    icono: '🩺',
    titulo: 'Atención médica',
    descripcion: 'Atención profesional y cercana para cuidar tu salud y bienestar.'
  },
  {
    icono: '📅',
    titulo: 'Agenda de horas',
    descripcion: 'Solicita y gestiona tus horas médicas de manera sencilla.'
  },
  {
    icono: '👩‍⚕️',
    titulo: 'Profesionales especializados',
    descripcion: 'Conoce a nuestro equipo médico y encuentra la atención que necesitas.'
  }
]

// Imágenes del carrusel "Conoce nuestra clínica"
const imagenesClinica = [
  { src: '/fachada-clinica.png', alt: 'Fachada de Clínica Agenda Médica' },
  { src: '/recepcion-clinica.png', alt: 'Recepción de la clínica' },
  { src: '/sala-espera.png', alt: 'Sala de espera de la clínica' },
  { src: '/box-clinica.png', alt: 'Box de atención médica' }
]

// Página de inicio: presentación de la clínica, servicios, galería de fotos y opiniones de pacientes
function Inicio() {
  return (
    <main className="inicio-react">
      {/* Portada con los botones principales; la grilla de Bootstrap pone texto e imagen lado a lado en pantallas medianas */}
      <section className="inicio-hero">
        <div className="row g-5 align-items-center">
          <div className="col-12 col-md-6 inicio-hero-texto">
            <span className="inicio-etiqueta">CLÍNICA AGENDA MÉDICA</span>
            <h1>Tu salud, nuestra prioridad</h1>
            <p>
              En Clínica Agenda Médica nos preocupamos por entregarte una atención
              cercana, profesional y de calidad.
            </p>
            <div className="inicio-acciones">
              <Link className="inicio-boton inicio-boton-principal" to="/agendar-hora">
                Agendar hora médica
              </Link>
              <Link className="inicio-boton inicio-boton-secundario" to="/especialidades">
                Conocer especialidades
              </Link>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <img
              className="inicio-hero-imagen"
              src="/fachada-clinica.png"
              alt="Fachada de Clínica Agenda Médica"
            />
          </div>
        </div>
      </section>

      {/* Servicios generados recorriendo el arreglo "servicios" con map() */}
      <section className="inicio-seccion" aria-labelledby="inicio-servicios-titulo">
        <div className="inicio-titulo-seccion">
          <span className="inicio-etiqueta">CUIDAMOS DE TI</span>
          <h2 id="inicio-servicios-titulo">Nuestros servicios</h2>
          <p>Te acompañamos para que acceder a tu atención médica sea más simple.</p>
        </div>
        <div className="row g-4">
          {servicios.map((servicio) => (
            <div className="col-12 col-md-4" key={servicio.titulo}>
              <article className="inicio-servicio-card h-100">
                <span className="inicio-servicio-icono" aria-hidden="true">{servicio.icono}</span>
                <h3>{servicio.titulo}</h3>
                <p>{servicio.descripcion}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* Carrusel de Bootstrap: avanza solo cada 5 segundos (data-bs-ride / data-bs-interval) */}
      <section className="inicio-seccion inicio-galeria" aria-labelledby="inicio-galeria-titulo">
        <div className="inicio-titulo-seccion">
          <span className="inicio-etiqueta">UN ESPACIO PARA TU SALUD</span>
          <h2 id="inicio-galeria-titulo">Conoce nuestra clínica</h2>
        </div>
        <div id="carruselClinicaReact" className="carousel slide inicio-carrusel" data-bs-ride="carousel" data-bs-interval="5000">
          <div className="carousel-indicators">
            {imagenesClinica.map((imagen, indice) => (
              <button
                key={imagen.src}
                type="button"
                data-bs-target="#carruselClinicaReact"
                data-bs-slide-to={indice}
                className={indice === 0 ? 'active' : ''}
                aria-current={indice === 0 ? 'true' : undefined}
                aria-label={`Imagen ${indice + 1}: ${imagen.alt}`}
              />
            ))}
          </div>
          <div className="carousel-inner">
            {imagenesClinica.map((imagen, indice) => (
              <div className={`carousel-item${indice === 0 ? ' active' : ''}`} key={imagen.src}>
                <img src={imagen.src} className="d-block w-100" alt={imagen.alt} />
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carruselClinicaReact" data-bs-slide="prev" aria-label="Imagen anterior">
            <span className="carousel-control-prev-icon" aria-hidden="true" />
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carruselClinicaReact" data-bs-slide="next" aria-label="Imagen siguiente">
            <span className="carousel-control-next-icon" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* Testimonios de pacientes */}
      <section className="inicio-opiniones" aria-labelledby="inicio-opiniones-titulo">
        <div className="inicio-titulo-seccion">
          <span className="inicio-etiqueta">EXPERIENCIAS</span>
          <h2 id="inicio-opiniones-titulo">Opiniones de nuestros pacientes</h2>
        </div>
        <div className="row g-4">
          <div className="col-12 col-sm-6">
            <article className="inicio-opinion-card h-100">
              <h3>Excelente atención</h3>
              <p>“La atención fue muy buena y el proceso para agendar mi hora fue rápido y sencillo.”</p>
              <p className="inicio-estrellas" aria-label="Calificación: 5 de 5">★★★★★</p>
              <strong>Paciente de Clínica Agenda Médica</strong>
            </article>
          </div>
          <div className="col-12 col-sm-6">
            <article className="inicio-opinion-card h-100">
              <h3>Muy buenos profesionales</h3>
              <p>“El médico explicó todo con claridad y recibí una atención muy cercana y profesional.”</p>
              <p className="inicio-estrellas" aria-label="Calificación: 5 de 5">★★★★★</p>
              <strong>Paciente de Clínica Agenda Médica</strong>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Inicio