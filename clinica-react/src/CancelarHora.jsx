import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'

function obtenerCodigo(hora) {
  return hora.codigo || `AM-${String(hora.id).padStart(4, '0')}`
}

const estiloAlerta = {
  customClass: {
    popup: 'clinica-swal-popup',
    confirmButton: 'clinica-swal-confirm',
    cancelButton: 'clinica-swal-cancel'
  },
  buttonsStyling: false
}

function CancelarHora({ horas, actualizarHora }) {
  const [parametros] = useSearchParams()
  const [codigo, setCodigo] = useState(parametros.get('codigo') || '')
  const [reserva, setReserva] = useState(null)
  const [error, setError] = useState('')

  function buscarReserva(evento) {
    evento.preventDefault()
    setError('')
    const buscada = codigo.trim().toUpperCase()
    const encontrada = horas.find((hora) => {
      const codigoAnterior = !hora.codigo ? `AM-${hora.id}`.toUpperCase() : ''
      return obtenerCodigo(hora).toUpperCase() === buscada || codigoAnterior === buscada
    })
    if (!buscada || !encontrada) {
      setReserva(null)
      setError('No encontramos una reserva con ese código. Revisa el comprobante o el código en Mis horas médicas.')
      return
    }
    setReserva(encontrada)
  }

  async function cancelarReserva() {
    const resultado = await Swal.fire({
      ...estiloAlerta,
      icon: 'warning',
      title: '¿Confirmas la cancelación?',
      text: 'Esta acción cambiará el estado de la hora a cancelada.',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar hora',
      cancelButtonText: 'Mantener hora',
      reverseButtons: true
    })
    if (!resultado.isConfirmed) return

    const reservaCancelada = { ...reserva, estado: 'Cancelada' }
    actualizarHora(reservaCancelada)
    setReserva(reservaCancelada)
    await Swal.fire({
      ...estiloAlerta,
      icon: 'success',
      title: 'Hora cancelada',
      text: 'La hora médica ha sido cancelada correctamente.',
      confirmButtonText: 'Entendido'
    })
  }

  return (
    <main className="pagina-cancelar">
      <section className="cancelar-hero">
        <span className="etiqueta-seccion">GESTIONA TU RESERVA</span>
        <h1>Cancelar hora médica</h1>
        <p>Ingresa el código de tu reserva para buscarla y cancelarla.</p>
      </section>
      <section className="cancelar-card">
        <form onSubmit={buscarReserva} noValidate>
          <div className="login-campo">
            <label htmlFor="codigo-reserva">Código de reserva</label>
            <input id="codigo-reserva" type="text" value={codigo}
              onChange={(evento) => { setCodigo(evento.target.value); setError('') }}
              placeholder="Ej: AM-1695420000" autoComplete="off" required />
            <small className="registro-ayuda">Puedes encontrarlo en Mis horas médicas.</small>
          </div>
          {error && <p className="login-mensaje login-error" role="alert">{error}</p>}
          <button className="login-enviar" type="submit">Buscar reserva</button>
        </form>

        {reserva && (
          <section className="cancelar-resultado" aria-live="polite">
            <h2>Detalles de la cita</h2>
            <dl>
              <div><dt>Código</dt><dd>{obtenerCodigo(reserva)}</dd></div>
              <div><dt>Especialidad</dt><dd>{reserva.especialidad}</dd></div>
              <div><dt>Médico</dt><dd>{reserva.medico || 'Por asignar'}</dd></div>
              <div><dt>Fecha</dt><dd>{reserva.fecha}</dd></div>
              <div><dt>Hora</dt><dd>{reserva.hora || 'Por confirmar'}</dd></div>
              <div><dt>Estado</dt><dd>{reserva.estado}</dd></div>
            </dl>
            {reserva.estado === 'Cancelada' ? (
              <p className="login-mensaje login-aviso">Esta reserva ya está cancelada.</p>
            ) : (
              <button className="cancelar-boton-rojo" type="button" onClick={cancelarReserva}>Cancelar esta hora</button>
            )}
          </section>
        )}
        <p className="cancelar-volver"><Link to="/mis-horas">Volver a Mis horas médicas</Link></p>
      </section>
    </main>
  )
}

export default CancelarHora
