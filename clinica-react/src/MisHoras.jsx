import { useState } from 'react'

function MisHoras({ horas, eliminarHora, actualizarHora }) {
  const [horaEditando, setHoraEditando] = useState(null)
  const [datosEditados, setDatosEditados] = useState({
    especialidad: '',
    fecha: '',
    estado: ''
  })

  const especialidades = [
    'Medicina General',
    'Pediatría',
    'Cardiología',
    'Dermatología',
    'Ginecología'
  ]

  function iniciarEdicion(hora) {
    setHoraEditando(hora.id)
    setDatosEditados({
      especialidad: hora.especialidad,
      fecha: hora.fecha,
      estado: hora.estado
    })
  }

  function guardarCambios(event, hora) {
    event.preventDefault()
    actualizarHora({ ...hora, ...datosEditados })
    setHoraEditando(null)
  }

  return (
    <main>
      <h2>Mis horas médicas</h2>
      <p>Listado de solicitudes de horas médicas.</p>

      {horas.length === 0 ? (
        <p>No hay horas médicas registradas.</p>
      ) : (
        <ul className="lista-horas">
          {horas.map((hora) => (
            <li key={hora.id} className="tarjeta-hora">
              {horaEditando === hora.id ? (
                <form
                  className="formulario-edicion-hora"
                  onSubmit={(event) => guardarCambios(event, hora)}
                >
                  <p><strong>Paciente:</strong> {hora.paciente}</p>

                  <label htmlFor={`especialidad-${hora.id}`}>Especialidad</label>
                  <select
                    id={`especialidad-${hora.id}`}
                    value={datosEditados.especialidad}
                    onChange={(event) =>
                      setDatosEditados({
                        ...datosEditados,
                        especialidad: event.target.value
                      })
                    }
                    required
                  >
                    {especialidades.map((especialidad) => (
                      <option key={especialidad} value={especialidad}>
                        {especialidad}
                      </option>
                    ))}
                  </select>

                  <label htmlFor={`fecha-${hora.id}`}>Fecha</label>
                  <input
                    id={`fecha-${hora.id}`}
                    type="date"
                    value={datosEditados.fecha}
                    onChange={(event) =>
                      setDatosEditados({
                        ...datosEditados,
                        fecha: event.target.value
                      })
                    }
                    required
                  />

                  <label htmlFor={`estado-${hora.id}`}>Estado</label>
                  <select
                    id={`estado-${hora.id}`}
                    value={datosEditados.estado}
                    onChange={(event) =>
                      setDatosEditados({
                        ...datosEditados,
                        estado: event.target.value
                      })
                    }
                    required
                  >
                    <option value="Solicitada">Solicitada</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>

                  <div className="acciones-hora">
                    <button type="submit">Guardar cambios</button>
                    <button type="button" onClick={() => setHoraEditando(null)}>
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="contenido-hora">
                  <div className="datos-hora">
                    <p><strong>Paciente:</strong> {hora.paciente}</p>
                    <p><strong>Especialidad:</strong> {hora.especialidad}</p>
                    <p><strong>Fecha:</strong> {hora.fecha}</p>
                    <p><strong>Estado:</strong> {hora.estado}</p>
                  </div>
                  <div className="acciones-hora">
                    <button type="button" onClick={() => iniciarEdicion(hora)}>
                      Editar
                    </button>
                    <button type="button" onClick={() => eliminarHora(hora.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default MisHoras