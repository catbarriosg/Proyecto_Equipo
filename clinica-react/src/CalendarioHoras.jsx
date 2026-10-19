import { useState } from 'react'
import { api } from './api/index.js'
import EstadoCarga from './components/EstadoCarga.jsx'
import { useCarga } from './hooks/useCarga.js'
import { DIAS_ANTICIPACION, fechaLocal, sumarDias } from './utils/agenda.js'
import { formatearFechaLarga } from './utils/formato.js'

const NOMBRES_DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

/**
 * Calendario semanal con las horas libres del médico, consultadas a /api/citas/disponibilidad.
 * "version" permite recargar la disponibilidad desde el padre (por ejemplo, si alguien tomó la hora antes).
 */
function CalendarioHoras({ medico, sucursalNombre, excluirCitaId, alCambiarSeleccion, version = 0 }) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const limite = sumarDias(hoy, DIAS_ANTICIPACION)
  const [inicioSemana, setInicioSemana] = useState(hoy)
  const [fechaSeleccionada, setFechaSeleccionada] = useState('')
  const [horaSeleccionada, setHoraSeleccionada] = useState('')

  const diasSemana = Array.from({ length: 7 }, (_, indice) => sumarDias(inicioSemana, indice))
  const desde = fechaLocal(inicioSemana)
  const hasta = fechaLocal(diasSemana[6])
  const { datos: disponibilidad, cargando, error, recargar } = useCarga(
    () => api.citas.disponibilidad({ medicoId: medico.id, desde, hasta, excluirCitaId }),
    `${medico.id}|${desde}|${excluirCitaId || ''}|${version}`,
  )
  const horasPorDia = Object.fromEntries((disponibilidad || []).map((dia) => [dia.fecha, dia.horas]))
  const horariosDisponibles = horasPorDia[fechaSeleccionada] || []
  const textoRango = `${inicioSemana.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })} al ${diasSemana[6].toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}`

  function elegirFecha(fecha) {
    setFechaSeleccionada(fecha)
    setHoraSeleccionada('')
    alCambiarSeleccion({ fecha, hora: '' })
  }

  function elegirHora(hora) {
    setHoraSeleccionada(hora)
    alCambiarSeleccion({ fecha: fechaSeleccionada, hora })
  }

  function cambiarSemana(cantidad) {
    const nuevaSemana = sumarDias(inicioSemana, cantidad * 7)
    if (nuevaSemana < hoy || nuevaSemana > limite) return
    setInicioSemana(nuevaSemana)
    setFechaSeleccionada('')
    setHoraSeleccionada('')
    alCambiarSeleccion({ fecha: '', hora: '' })
  }

  return (
    <section className="calendario-react" aria-labelledby="calendario-titulo">
      <h2 id="calendario-titulo">Elige el día y la hora</h2>
      <header className="calendario-react-header">
        <button type="button" onClick={() => cambiarSemana(-1)} disabled={inicioSemana <= hoy} aria-label="Semana anterior">
          ❮
        </button>
        <p aria-live="polite"><span>Semana del</span><strong>{textoRango}</strong></p>
        <button type="button" onClick={() => cambiarSemana(1)} disabled={sumarDias(inicioSemana, 7) > limite} aria-label="Semana siguiente">
          ❯
        </button>
      </header>

      <EstadoCarga cargando={cargando} error={error} alReintentar={recargar} texto="Consultando horas disponibles…" />

      <div className="calendario-react-dias" role="group" aria-label="Días disponibles">
        {diasSemana.map((dia) => {
          const valor = fechaLocal(dia)
          const disponible = (horasPorDia[valor] || []).length > 0
          return (
            <button
              className={`calendario-react-dia${valor === fechaSeleccionada ? ' activo' : ''}`}
              type="button"
              key={valor}
              onClick={() => elegirFecha(valor)}
              disabled={!disponible}
              aria-pressed={valor === fechaSeleccionada}
              aria-label={`${formatearFechaLarga(valor)}${disponible ? '' : ', sin horas disponibles'}`}
            >
              <span>{NOMBRES_DIAS[dia.getDay()]}</span>
              <strong>{dia.getDate()}</strong>
            </button>
          )
        })}
      </div>

      <h3 className="calendario-react-fecha" aria-live="polite">
        {fechaSeleccionada ? formatearFechaLarga(fechaSeleccionada) : 'Selecciona un día'}
      </h3>

      <article className="calendario-react-medico">
        <div className="calendario-react-clinica">
          <span aria-hidden="true">🏥</span>
          <div><strong>Clínica Agenda Médica</strong><small>{sucursalNombre ? `Sucursal ${sucursalNombre}` : 'Región Metropolitana'}</small></div>
        </div>
        <div className="calendario-react-info-medico">
          <span aria-hidden="true">👨‍⚕️</span>
          <div><strong>{medico.nombre}</strong><small>{medico.especialidad}</small></div>
          <span className="calendario-react-modalidad">Presencial</span>
        </div>
        <p>Selecciona un horario disponible:</p>
        {fechaSeleccionada ? (
          horariosDisponibles.length > 0 ? (
            <div className="calendario-react-horas" role="group" aria-label="Horarios disponibles">
              {horariosDisponibles.map((hora) => (
                <button
                  className={hora === horaSeleccionada ? 'seleccionada' : ''}
                  type="button"
                  key={hora}
                  onClick={() => elegirHora(hora)}
                  aria-pressed={hora === horaSeleccionada}
                >
                  {hora}
                </button>
              ))}
            </div>
          ) : (
            <p className="calendario-react-sin-horas" role="status">No quedan horas disponibles para este día. Elige otra fecha.</p>
          )
        ) : (
          <p className="calendario-react-sin-horas">Primero elige un día en el calendario.</p>
        )}
      </article>
    </section>
  )
}

export default CalendarioHoras
