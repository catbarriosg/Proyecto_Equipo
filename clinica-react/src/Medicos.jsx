import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from './api/index.js'
import EstadoCarga from './components/EstadoCarga.jsx'
import { useCarga } from './hooks/useCarga.js'

function cargarDatos() {
  return Promise.all([api.medicos.listar(), api.especialidades.listar()])
    .then(([medicos, especialidades]) => ({ medicos, especialidades }))
}

function Medicos() {
  const [parametros, setParametros] = useSearchParams()
  const [busqueda, setBusqueda] = useState('')
  const { datos, cargando, error, recargar } = useCarga(cargarDatos, 'medicos')
  // La especialidad elegida queda en la URL (/medicos?especialidad=pediatria) para poder compartir el enlace
  const especialidadFiltro = parametros.get('especialidad') || ''

  const termino = busqueda.trim().toLowerCase()
  const medicos = (datos?.medicos || [])
    .filter((medico) => !especialidadFiltro || medico.especialidadSlug === especialidadFiltro)
    .filter((medico) => !termino || medico.nombre.toLowerCase().includes(termino))

  function cambiarEspecialidad(evento) {
    const valor = evento.target.value
    setParametros(valor ? { especialidad: valor } : {}, { replace: true })
  }

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

      <EstadoCarga cargando={cargando} error={error} alReintentar={recargar} />

      {datos && (
        <section className="medicos-lista" aria-label="Equipo médico">
          <form className="filtros-lista" role="search" onSubmit={(evento) => evento.preventDefault()}>
            <div className="login-campo">
              <label htmlFor="buscar-medico">Buscar por nombre</label>
              <input id="buscar-medico" type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Ej: González" />
            </div>
            <div className="login-campo">
              <label htmlFor="filtro-especialidad">Especialidad</label>
              <select id="filtro-especialidad" value={especialidadFiltro} onChange={cambiarEspecialidad}>
                <option value="">Todas las especialidades</option>
                {datos.especialidades.map((especialidad) => (
                  <option key={especialidad.id} value={especialidad.slug}>{especialidad.nombre}</option>
                ))}
              </select>
            </div>
          </form>

          {medicos.length === 0 ? (
            <p className="estado-vacio">No encontramos médicos con esos filtros.</p>
          ) : (
            <ul className="lista-medicos">
              {medicos.map((medico) => (
                <li key={medico.id}>
                  <article className="medico-card">
                    <div className="foto-medico">
                      <img src={medico.imagenUrl || '/logo.png'} alt={`Ilustración de ${medico.nombre}`} />
                    </div>
                    <h2>{medico.nombre}</h2>
                    <h3>{medico.especialidad}</h3>
                    <p>{medico.descripcion}</p>
                    <Link className="enlace-especialidad" to="/especialidades">
                      Ver especialidades
                    </Link>
                    <Link
                      className="boton-medico"
                      to={`/agendar-hora?medico=${medico.id}`}
                      aria-label={`Agendar hora con ${medico.nombre}`}
                    >
                      Agendar hora
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  )
}

export default Medicos
