import { useState } from 'react'
import { Link } from 'react-router-dom'
import preguntasFrecuentes from './preguntasFrecuentes.js'

function PreguntasFrecuentes() {
  const [busqueda, setBusqueda] = useState('')
  const termino = busqueda.trim().toLocaleLowerCase('es')
  const gruposVisibles = preguntasFrecuentes
    .map((grupo) => ({
      ...grupo,
      preguntas: grupo.preguntas.filter(({ pregunta, respuesta }) =>
        `${pregunta} ${respuesta} ${grupo.categoria}`.toLocaleLowerCase('es').includes(termino)
      ),
    }))
    .filter((grupo) => grupo.preguntas.length > 0)

  return (
    <main className="pagina-faq">
      <section className="faq-hero-react">
        <span className="etiqueta-seccion">RESOLVEMOS TUS DUDAS</span>
        <h1>Preguntas frecuentes</h1>
        <p>Encuentra respuestas a las consultas más comunes sobre horas médicas, atención y servicios de la clínica.</p>
        <div className="faq-buscador-react">
          <label htmlFor="buscador-faq">Buscar una pregunta</label>
          <input
            id="buscador-faq"
            type="search"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            placeholder="Ej: cancelar, pago, exámenes..."
          />
        </div>
      </section>

      {gruposVisibles.length > 0 ? (
        gruposVisibles.map((grupo) => (
          <section className="faq-grupo-react" key={grupo.id} aria-label={grupo.categoria}>
            <h2>{grupo.categoria}</h2>
            {grupo.preguntas.map((item) => (
              <details className="faq-item-react" key={item.pregunta}>
                <summary>{item.pregunta}</summary>
                <p>
                  {item.respuesta}
                  {item.enlace && <> <Link to={item.enlace.ruta}>{item.enlace.texto}</Link></>}
                </p>
              </details>
            ))}
          </section>
        ))
      ) : (
        <p className="faq-sin-resultados" role="status">No encontramos preguntas que coincidan con “{busqueda}”.</p>
      )}

      <section className="faq-ayuda-react">
        <h2>¿No encontraste lo que buscabas?</h2>
        <p>Escríbenos y te responderemos a la brevedad.</p>
        <Link to="/contacto" className="boton-faq">Ir a Contacto</Link>
      </section>
    </main>
  )
}

export default PreguntasFrecuentes