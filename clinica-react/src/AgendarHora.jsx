import { useState } from 'react'
import { obtenerSesion } from './auth.js'

function AgendarHora({ agregarHora }) {
  const sesion = obtenerSesion()
  const esMedico = sesion?.rol === 'medico'
  const especialidades = [
    'Medicina General',
    'Pediatría',
    'Cardiología',
    'Dermatología',
    'Ginecología'
  ]
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [especialidad, setEspecialidad] = useState('')
  const [fecha, setFecha] = useState('')
  const [mensaje, setMensaje] = useState('')

  function manejarEnvio(event) {
    event.preventDefault()
    const id = Date.now()
    const codigo = `AM-${id}`
    const nuevaHora = {
      id,
      codigo,
      paciente: nombre,
      correo,
      medico: esMedico ? `${sesion.nombre} ${sesion.apellido}`.trim() : '',
      creadoPor: sesion?.correo || correo,
      rolCreador: sesion?.rol || 'paciente',
      especialidad,
      fecha,
      hora: '',
      estado: 'Solicitada'
    }
    agregarHora(nuevaHora)
    setMensaje(`¡Hora médica registrada correctamente! Tu código de reserva es ${codigo}.`)
    setNombre('')
    setCorreo('')
    setEspecialidad('')
    setFecha('')
  }

  return (
    <main>
      <h2>Agendar hora médica</h2>
      <p>{esMedico ? `Agenda una hora para un paciente. Médico: ${sesion.nombre} ${sesion.apellido}.` : 'Completa los datos para solicitar una hora médica.'}</p>
      <form className="formulario-agenda" onSubmit={manejarEnvio}>
        <label htmlFor="nombre">Nombre completo</label>
        <input id="nombre" type="text" value={nombre} onChange={(event) => setNombre(event.target.value)} placeholder="Ingresa tu nombre" required />
        <label htmlFor="correo">Correo electrónico</label>
        <input id="correo" type="email" value={correo} onChange={(event) => setCorreo(event.target.value)} placeholder="ejemplo@correo.cl" required />
        <label htmlFor="especialidad">Especialidad</label>
        <select id="especialidad" value={especialidad} onChange={(event) => setEspecialidad(event.target.value)} required>
          <option value="">Selecciona una especialidad</option>
          {especialidades.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
        </select>
        <label htmlFor="fecha">Fecha preferida</label>
        <input id="fecha" type="date" value={fecha} onChange={(event) => setFecha(event.target.value)} min={new Date().toISOString().split('T')[0]} required />
        <button type="submit">Solicitar hora</button>
      </form>
      {mensaje && <p className="mensaje-confirmacion" role="status">{mensaje}</p>}
    </main>
  )
}

export default AgendarHora