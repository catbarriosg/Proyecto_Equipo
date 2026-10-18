import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import CalendarioHoras from './CalendarioHoras.jsx'
import medicos from './medicos.js'

function codigoReserva(hora) {
  return hora.codigo || `AM-${String(hora.id).padStart(4, '0')}`
}

const estiloAlerta = {
  customClass: { popup: 'clinica-swal-popup', confirmButton: 'clinica-swal-confirm' },
  buttonsStyling: false
}

function ModificarHora({ horas, actualizarHora }) {
  const [parametros] = useSearchParams()
  const [codigo, setCodigo] = useState(parametros.get('codigo') || '')
  const [reserva, setReserva] = useState(null)
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [error, setError] = useState('')

  const medicoElegido = reserva && (
    medicos.find((medico) => medico.id === reserva.medicoId) ||
    medicos.find((medico) => medico.nombre === reserva.medico) ||
    medicos.find((medico) => medico.especialidad === reserva.especialidad)
  )

  function buscarReserva(evento) {
    evento.preventDefault()
    setError('')
    const buscada = codigo.trim().toUpperCase()
    const encontrada = horas.find((registro) => {
      const codigoAnterior = !registro.codigo ? `AM-${registro.id}`.toUpperCase() : ''
      return codigoReserva(registro).toUpperCase() === buscada || codigoAnterior === buscada
    })
    if (!buscada || !encontrada) {
      setReserva(null)
      setFecha('')
      setHora('')
      setError('No encontramos una reserva con ese código. Revisa Mis horas médicas.')
      return
    }
    if (encontrada.estado === 'Cancelada') {
      setReserva(null)
      setFecha('')
      setHora('')
      setError('Esta reserva está cancelada y no se puede modificar.')
      return
    }
    setReserva(encontrada)
    setFecha('')
    setHora('')
  }

  async function guardarCambios(evento) {
    evento.preventDefault()
    if (!reserva || !medicoElegido) {
      setError('No pudimos identificar al médico de esta reserva. Contacta a la clínica para modificarla.')
      return
    }
    if (!fecha || !hora) {
      setError('Selecciona una fecha y una hora disponible en el calendario.')
      return
    }
    if (fecha === reserva.fecha && hora === reserva.hora) {
      setError('Elegiste la misma fecha y hora de tu reserva actual.')
      return
    }
    const conflicto = horas.some((otra) => {
      if (otra.id === reserva.id || otra.estado === 'Cancelada') return false
      const mismoMedico = otra.medicoId
        ? otra.medicoId === medicoElegido.id
        : otra.medico === medicoElegido.nombre || (!otra.medico && otra.especialidad === medicoElegido.especialidad)
      return mismoMedico && otra.fecha === fecha && otra.hora === hora
    })
    if (conflicto) {
      setError('Ese horario ya fue reservado. Elige otro horario disponible.')
      return
    }

    const reservaActualizada = {
      ...reserva,
      medico: reserva.medico || medicoElegido.nombre,
      medicoId: reserva.medicoId || medicoElegido.id,
      especialidad: reserva.especialidad || medicoElegido.especialidad,
      fecha,
      hora
    }
    actualizarHora(reservaActualizada)
    setReserva(reservaActualizada)
    setError('')
    await Swal.fire({
      ...estiloAlerta,
      icon: 'success',
      title: 'Hora modificada',
      html: `<p>Tu hora con <strong>${medicoElegido.nombre}</strong> quedó para el <strong>${fecha}</strong> a las <strong>${hora}</strong>.</p>`,
      confirmButtonText: 'Entendido'
    })
  }

  return (
    <main className="pagina-modificar">
      <section className="modificar-hero">
        <span className="etiqueta-seccion">GESTIONA TU RESERVA</span>
        <h1>Modificar hora médica</h1>
        <p>Ingresa tu código de reserva para elegir una nueva fecha y hora.</p>
      </section>

      <section className="modificar-card">
        <form onSubmit={buscarReserva} noValidate>
          <div className="login-campo">
            <label htmlFor="codigo-modificar">Código de reserva</label>
            <input id="codigo-modificar" type="text" value={codigo}
              onChange={(evento) => { setCodigo(evento.target.value); setError(''); setReserva(null) }}
              placeholder="Ej: AM-1695420000" autoComplete="off" required />
            <small className="registro-ayuda">Puedes encontrarlo en Mis horas médicas.</small>
          </div>
          {error && <p className="login-mensaje login-error" role="alert">{error}</p>}
          <button className="login-enviar" type="submit">Buscar reserva</button>
        </form>

        {reserva && (
          <section className="modificar-detalle">
            <h2>Reserva actual</h2>
            <p><strong>Código:</strong> {codigoReserva(reserva)}</p>
            <p><strong>Médico:</strong> {medicoElegido?.nombre || reserva.medico || 'No informado'}</p>
            <p><strong>Especialidad:</strong> {reserva.especialidad || medicoElegido?.especialidad || 'No informada'}</p>
            <p><strong>Fecha y hora actual:</strong> {reserva.fecha || 'No informada'}{reserva.hora ? ` a las ${reserva.hora}` : ''}</p>
            {medicoElegido ? (
              <form onSubmit={guardarCambios}>
                <CalendarioHoras
                  key={reserva.id}
                  medico={medicoElegido}
                  especialidad={reserva.especialidad || medicoElegido.especialidad}
                  horasReservadas={horas}
                  idReservaIgnorada={reserva.id}
                  alCambiarSeleccion={({ fecha: nuevaFecha, hora: nuevaHora }) => {
                    setFecha(nuevaFecha)
                    setHora(nuevaHora)
                    setError('')
                  }}
                />
                {error && <p className="login-mensaje login-error" role="alert">{error}</p>}
                <button className="login-enviar" type="submit">Confirmar modificación</button>
              </form>
            ) : (
              <p className="login-mensaje login-error" role="alert">No pudimos identificar al médico de esta reserva.</p>
            )}
          </section>
        )}
        <p className="cancelar-volver"><Link to="/mis-horas">Volver a Mis horas médicas</Link></p>
      </section>
    </main>
  )
}

export default ModificarHora
