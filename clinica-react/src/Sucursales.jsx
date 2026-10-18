import { Link } from 'react-router-dom'
import sucursales from './sucursales.js'

function Sucursales() {
  return (
    <main className="pagina-sucursales">
      <section className="sucursales-hero">
        <span className="etiqueta-seccion">DÓNDE ENCONTRARNOS</span>
        <h1>Sucursales</h1>
        <p>Conoce las sucursales disponibles de Clínica Agenda Médica y elige la más cercana a ti.</p>
      </section>

      <section className="sucursales-lista" aria-label="Sucursales disponibles">
        {sucursales.map((sucursal) => (
          <article className="sucursal-card-react" key={sucursal.id}>
            <figure>
              <img src={sucursal.imagen} alt={sucursal.descripcionImagen} />
            </figure>
            <section className="sucursal-info-react">
              <h2>{sucursal.nombre}</h2>
              <address>📍 {sucursal.direccion}</address>
              <p>📞 <a href={`tel:${sucursal.telefonoEnlace}`}>{sucursal.telefono}</a></p>
              <p className="sucursal-horario-react">🕒 {sucursal.horario.map((linea, indice) => ( <span key={linea}>{linea}{indice < sucursal.horario.length - 1 && <br />}</span> ))}</p>
              <Link to="/agendar-hora" className="boton-sucursal">Agendar hora</Link>
            </section>
          </article>
        ))}
      </section>

      <section className="sucursal-mapa-react">
        <h2>Cómo llegar a nuestra casa matriz</h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d53269.523811932006!2d-70.6372672!3d-33.44031089999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sAv.%20Salud%201234%2C%20Santiago%2C%20Chile!5e0!3m2!1ses-419!2scl!4v1792284113788!5m2!1ses-419!2scl"
          title="Mapa de la sucursal Santiago Centro"
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <p>
          <a href="https://www.google.com/maps/search/?api=1&query=Santiago+Centro,+Chile" target="_blank" rel="noopener noreferrer">
            Ver mapa más grande
          </a>
        </p>
        <p>¿Necesitas más información? <Link to="/contacto">Contáctanos</Link></p>
      </section>
    </main>
  )
}

export default Sucursales