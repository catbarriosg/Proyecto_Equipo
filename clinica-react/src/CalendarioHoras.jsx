import { useState } from 'react'

const DIAS_ANTICIPACION = 90
const NOMBRES_DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function fechaLocal(fecha) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

function sumarDias(fecha, cantidad) {
  const resultado = new Date(fecha)
  resultado.setDate(resultado.getDate() + cantidad)
  return resultado
}

function obtenerHorarios(fecha) {
  if (fecha.getDay() === 0) return []

  const inicio = fecha.getDay() === 6 ? 9 * 60 : 8 * 60
  const fin = fecha.getDay() === 6 ? 13 * 60 + 30 : 19 * 60 + 30
  const ahora = new Date()
  const esHoy = fechaLocal(fecha) === fechaLocal(ahora)
  const horarios = []

  for (let minutos = inicio; minutos <= fin; minutos += 30) {
    if (esHoy && minutos <= ahora.getHours() * 60 + ahora.getMinutes()) continue
    const hora = String(Math.floor(minutos / 60)).padStart(2, '0')
    const minuto = String(minutos % 60).padStart(2, '0')
    horarios.push(`${hora}:${minuto}`)
  }

  return horarios
}

function fechaLarga(fecha) {
  return fecha.toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function horaOcupada(horas, medico, fecha, hora, idReservaIgnorada) {
  return horas.some((reserva) => {
    if (reserva.id === idReservaIgnorada) return false
    const mismoMedico = reserva.medicoId
      ? reserva.medicoId === medico.id
      : reserva.medico === medico.nombre || (!reserva.medico && reserva.especialidad === medico.especialidad)
    return mismoMedico && reserva.fecha === fecha && reserva.hora === hora && reserva.estado !== 'Cancelada'
  })
}

function CalendarioHoras({ medico, especialidad, horasReservadas, alCambiarSeleccion, idReservaIgnorada }) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const limite = sumarDias(hoy, DIAS_ANTICIPACION)
  const [inicioSemana, setInicioSemana] = useState(hoy)
  const [fechaSeleccionada, setFechaSeleccionada] = useState('')
  const [horaSeleccionada, setHoraSeleccionada] = useState('')

  const diasSemana = Array.from({ length: 7 }, (_, indice) => sumarDias(inicioSemana, indice))
  const fechaFinSemana = diasSemana[diasSemana.length - 1]
  const textoRango = `${inicioSemana.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })} al ${fechaFinSemana.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}`
  const fechaElegida = fechaSeleccionada
    ? new Date(`${fechaSeleccionada}T12:00:00`)
    : null
  const horariosDia = fechaElegida ? obtenerHorarios(fechaElegida) : []
  const horariosDisponibles = horariosDia.filter(
    (hora) => !horaOcupada(horasReservadas, medico, fechaSeleccionada, hora, idReservaIgnorada)
  )

  function diaTieneHoras(fecha) {
    if (fecha > limite) return false
    const valor = fechaLocal(fecha)
    return obtenerHorarios(fecha).some(
      (hora) => !horaOcupada(horasReservadas, medico, valor, hora, idReservaIgnorada)
    )
  }

  function elegirFecha(fecha) {
    const valor = fechaLocal(fecha)
    setFechaSeleccionada(valor)
    setHoraSeleccionada('')
    alCambiarSeleccion({ fecha: valor, hora: '' })
  }

  function elegirHora(hora) {
    setHoraSeleccionada(hora)
    alCambiarSeleccion({ fecha: fechaSeleccionada, hora })
  }

  function cambiarSemana(cantidad) {
    const nuevaSemana = sumarDias(inicioSemana, cantidad * 7)
    if (nuevaSemana < hoy || nuevaSemana > limite) return
    setInicioSemana(nuevaSemana)
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

      <div className="calendario-react-dias" role="group" aria-label="Días disponibles">
        {diasSemana.map((dia) => {
          const valor = fechaLocal(dia)
          const disponible = diaTieneHoras(dia)
          return (
            <button
              className={`calendario-react-dia${valor === fechaSeleccionada ? ' activo' : ''}`}
              type="button"
              key={valor}
              onClick={() => elegirFecha(dia)}
              disabled={!disponible}
              aria-pressed={valor === fechaSeleccionada}
              aria-label={`${fechaLarga(dia)}${disponible ? '' : ', sin horas disponibles'}`}
            >
              <span>{NOMBRES_DIAS[dia.getDay()]}</span>
              <strong>{dia.getDate()}</strong>
            </button>
          )
        })}
      </div>

      <h3 className="calendario-react-fecha" aria-live="polite">
        {fechaElegida
          ? fechaLarga(fechaElegida).replace(/^./, (letra) => letra.toUpperCase())
          : 'Selecciona un día'}
      </h3>

      <article className="calendario-react-medico">
        <div className="calendario-react-clinica">
          <span aria-hidden="true">🏥</span>
          <div><strong>Clínica Agenda Médica</strong><small>Sede Principal - Región Metropolitana</small></div>
        </div>
        <div className="calendario-react-info-medico">
          <span aria-hidden="true">👨‍⚕️</span>
          <div><strong>{medico.nombre}</strong><small>{especialidad}</small></div>
          <span className="calendario-react-modalidad">Presencial</span>
        </div>
        <p>Selecciona un horario disponible:</p>
        {fechaElegida ? (
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
