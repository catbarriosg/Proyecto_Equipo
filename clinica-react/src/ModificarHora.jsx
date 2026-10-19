import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { api, mensajeDeError } from './api/index.js'
import CalendarioHoras from './CalendarioHoras.jsx'
import { estadoLegible, formatearFecha } from './utils/formato.js'

const estiloAlerta = {
  customClass: { popup: 'clinica-swal-popup', confirmButton: 'clinica-swal-confirm' },
  buttonsStyling: false
}

function ModificarHora() {
  const [parametros] = useSearchParams()
  const [codigo, setCodigo] = useState(parametros.get('codigo') || '')
  const [reserva, setReserva] = useState(null)
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState(false)
  const [versionAgenda, setVersionAgenda] = useState(0)

  async function buscarReserva(evento) {
    evento.preventDefault()
    setError('')
    setReserva(null)
    setFecha('')
    setHora('')
    if (!codigo.trim()) {
      setError('Ingresa el código de tu reserva, por ejemplo AM-000001.')
      return
    }
    setProcesando(true)
    try {
      const encontrada = await api.citas.obtenerPorCodigo(codigo)
      if (!encontrada.gestionable) {
        setError(encontrada.estado === 'CONFIRMADA' || encontrada.estado === 'SOLICITADA'
          ? 'Esta reserva ya no se puede modificar en línea (faltan menos de 24 horas). Comunícate con la clínica.'
          : `Esta reserva está ${estadoLegible(encontrada.estado).toLowerCase()} y no se puede modificar.`)
        return
      }
      setReserva(encontrada)
    } catch (errorBusqueda) {
      setError(mensajeDeError(errorBusqueda))
    } finally {
      setProcesando(false)
    }
  }

  async function guardarCambios(evento) {
    evento.preventDefault()
    if (!fecha || !hora) {
      setError('Selecciona una fecha y una hora disponible en el calendario.')
      return
    }
    setProcesando(true)
    try {
      const actualizada = await api.citas.reprogramar(reserva.id, { fecha, hora })
      setReserva(actualizada)
      setFecha('')
      setHora('')
      setError('')
      setVersionAgenda((actual) => actual + 1)
      await Swal.fire({
        ...estiloAlerta,
        icon: 'success',
        title: 'Hora modificada',
        html: `<p>Tu hora con <strong>${actualizada.medicoNombre}</strong> quedó para el <strong>${formatearFecha(actualizada.fecha)}</strong> a las <strong>${actualizada.hora}</strong>.</p>`,
        confirmButtonText: 'Entendido'
      })
    } catch (errorGuardar) {
      if (errorGuardar.estado === 409) setVersionAgenda((actual) => actual + 1)
      setError(mensajeDeError(errorGuardar))
    } finally {
      setProcesando(false)
    }
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
              placeholder="Ej: AM-000001" autoComplete="off" required />
            <small className="registro-ayuda">Puedes encontrarlo en Mis horas médicas.</small>
          </div>
          {error && !reserva && <p className="login-mensaje login-error" role="alert">{error}</p>}
          <button className="login-enviar" type="submit" disabled={procesando}>Buscar reserva</button>
        </form>

        {reserva && (
          <section className="modificar-detalle">
            <h2>Reserva actual</h2>
            <p><strong>Código:</strong> {reserva.codigo}</p>
            <p><strong>Médico:</strong> {reserva.medicoNombre}</p>
            <p><strong>Especialidad:</strong> {reserva.especialidad}</p>
            <p><strong>Fecha y hora actual:</strong> {formatearFecha(reserva.fecha)} a las {reserva.hora}</p>
            <form onSubmit={guardarCambios}>
              <CalendarioHoras
                key={`${reserva.id}-${versionAgenda}`}
                medico={{ id: reserva.medicoId, nombre: reserva.medicoNombre, especialidad: reserva.especialidad }}
                excluirCitaId={reserva.id}
                alCambiarSeleccion={({ fecha: nuevaFecha, hora: nuevaHora }) => {
                  setFecha(nuevaFecha)
                  setHora(nuevaHora)
                  setError('')
                }}
              />
              {error && <p className="login-mensaje login-error" role="alert">{error}</p>}
              <button className="login-enviar" type="submit" disabled={procesando}>
                {procesando ? 'Guardando…' : 'Confirmar modificación'}
              </button>
            </form>
          </section>
        )}
        <p className="cancelar-volver"><Link to="/mis-horas">Volver a Mis horas médicas</Link></p>
      </section>
    </main>
  )
}

export default ModificarHora
