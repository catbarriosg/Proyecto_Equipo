import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const especialidadesDisponibles = ['Medicina General', 'Pediatría', 'Cardiología', 'Dermatología', 'Ginecología']

function codigoReserva(hora) {
  return hora.codigo || `AM-${hora.id}`
}

function ModificarHora({ horas, actualizarHora }) {
  const [parametros] = useSearchParams()
  const [codigo, setCodigo] = useState(parametros.get('codigo') || '')
  const [reserva, setReserva] = useState(null)
  const [fecha, setFecha] = useState('')
  const [especialidad, setEspecialidad] = useState('')
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const hoy = new Date().toISOString().split('T')[0]

  function buscarReserva(evento) {
    evento.preventDefault()
    setError('')
    setMensaje('')
    const buscada = codigo.trim().toUpperCase()
    const encontrada = horas.find((hora) => codigoReserva(hora).toUpperCase() === buscada)
    if (!buscada || !encontrada) {
      setReserva(null)
      setError('No encontramos una reserva con ese código. Revisa Mis horas médicas.')
      return
    }
    if (encontrada.estado === 'Cancelada') {
      setReserva(null)
      setError('Esta reserva está cancelada y no se puede modificar.')
      return
    }
    setReserva(encontrada)
    setFecha(encontrada.fecha || '')
    setEspecialidad(encontrada.especialidad || '')
  }

  function guardarCambios(evento) {
    evento.preventDefault()
    if (!fecha || fecha < hoy) {
      setError('Selecciona una fecha de hoy o posterior.')
      return
    }
    actualizarHora({ ...reserva, fecha, especialidad })
    setReserva({ ...reserva, fecha, especialidad })
    setError('')
    setMensaje('La hora médica se modificó correctamente.')
  }

  return (
    <main className="pagina-modificar">
      <section className="modificar-hero">
        <span className="etiqueta-seccion">GESTIONA TU RESERVA</span>
        <h1>Modificar hora médica</h1>
        <p>Ingresa tu código de reserva para actualizar tu hora médica.</p>
      </section>

      <section className="modificar-card">
        <form onSubmit={buscarReserva} noValidate>
          <div className="login-campo">
            <label htmlFor="codigo-modificar">Código de reserva</label>
            <input id="codigo-modificar" type="text" value={codigo}
              onChange={(evento) => { setCodigo(evento.target.value); setError(''); setMensaje('') }}
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
            <p><strong>Fecha actual:</strong> {reserva.fecha}</p>
            <p><strong>Especialidad:</strong> {reserva.especialidad}</p>
            <form onSubmit={guardarCambios}>
              <div className="login-campo">
                <label htmlFor="nueva-fecha">Nueva fecha</label>
                <input id="nueva-fecha" type="date" min={hoy} value={fecha}
                  onChange={(evento) => setFecha(evento.target.value)} required />
              </div>
              <div className="login-campo">
                <label htmlFor="nueva-especialidad">Especialidad</label>
                <select id="nueva-especialidad" value={especialidad}
                  onChange={(evento) => setEspecialidad(evento.target.value)} required>
                  {especialidadesDisponibles.map((opcion) => <option key={opcion}>{opcion}</option>)}
                </select>
              </div>
              <button className="login-enviar" type="submit">Confirmar modificación</button>
            </form>
          </section>
        )}
        {mensaje && <p className="login-mensaje login-aviso" role="status">{mensaje}</p>}
        <p className="cancelar-volver"><Link to="/mis-horas">Volver a Mis horas médicas</Link></p>
      </section>
    </main>
  )
}

export default ModificarHora