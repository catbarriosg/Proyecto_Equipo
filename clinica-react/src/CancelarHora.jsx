import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { api, mensajeDeError } from './api/index.js'
import { estadoLegible, formatearFecha } from './utils/formato.js'

const estiloAlerta = {
  customClass: {
    popup: 'clinica-swal-popup',
    confirmButton: 'clinica-swal-confirm',
    cancelButton: 'clinica-swal-cancel'
  },
  buttonsStyling: false
}

function CancelarHora() {
  const [parametros] = useSearchParams()
  const [codigo, setCodigo] = useState(parametros.get('codigo') || '')
  const [reserva, setReserva] = useState(null)
  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState(false)

  async function buscarReserva(evento) {
    evento.preventDefault()
    setError('')
    setReserva(null)
    if (!codigo.trim()) {
      setError('Ingresa el código de tu reserva, por ejemplo AM-000001.')
      return
    }
    setProcesando(true)
    try {
      setReserva(await api.citas.obtenerPorCodigo(codigo))
    } catch (errorBusqueda) {
      setError(mensajeDeError(errorBusqueda))
    } finally {
      setProcesando(false)
    }
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

    setProcesando(true)
    try {
      setReserva(await api.citas.cancelar(reserva.id))
      await Swal.fire({
        ...estiloAlerta,
        icon: 'success',
        title: 'Hora cancelada',
        text: 'La hora médica ha sido cancelada correctamente.',
        confirmButtonText: 'Entendido'
      })
    } catch (errorCancelar) {
      await Swal.fire({ ...estiloAlerta, icon: 'error', title: 'No se pudo cancelar', text: mensajeDeError(errorCancelar), confirmButtonText: 'Entendido' })
    } finally {
      setProcesando(false)
    }
  }

  const activa = reserva && (reserva.estado === 'CONFIRMADA' || reserva.estado === 'SOLICITADA')

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
              placeholder="Ej: AM-000001" autoComplete="off" required />
            <small className="registro-ayuda">Puedes encontrarlo en Mis horas médicas.</small>
          </div>
          {error && <p className="login-mensaje login-error" role="alert">{error}</p>}
          <button className="login-enviar" type="submit" disabled={procesando}>Buscar reserva</button>
        </form>

        {reserva && (
          <section className="cancelar-resultado" aria-live="polite">
            <h2>Detalles de la cita</h2>
            <dl>
              <div><dt>Código</dt><dd>{reserva.codigo}</dd></div>
              <div><dt>Especialidad</dt><dd>{reserva.especialidad}</dd></div>
              <div><dt>Médico</dt><dd>{reserva.medicoNombre}</dd></div>
              <div><dt>Fecha</dt><dd>{formatearFecha(reserva.fecha)}</dd></div>
              <div><dt>Hora</dt><dd>{reserva.hora}</dd></div>
              <div><dt>Estado</dt><dd>{estadoLegible(reserva.estado)}</dd></div>
            </dl>
            {!activa ? (
              <p className="login-mensaje login-aviso">Esta reserva está {estadoLegible(reserva.estado).toLowerCase()}.</p>
            ) : reserva.gestionable ? (
              <button className="cancelar-boton-rojo" type="button" onClick={cancelarReserva} disabled={procesando}>Cancelar esta hora</button>
            ) : (
              <p className="login-mensaje login-aviso">Faltan menos de 24 horas para la atención: para cancelarla, comunícate con la clínica.</p>
            )}
          </section>
        )}
        <p className="cancelar-volver"><Link to="/mis-horas">Volver a Mis horas médicas</Link></p>
      </section>
    </main>
  )
}

export default CancelarHora
