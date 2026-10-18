import { useState } from 'react'

function AgendarHora({ agregarHora }) {
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

    const nuevaHora = {
      id: Date.now(),
      paciente: nombre,
      correo: correo,
      especialidad: especialidad,
      fecha: fecha,
      estado: 'Solicitada'
    }

    agregarHora(nuevaHora)
    setMensaje('¡Hora médica registrada correctamente! Puedes verla en Mis horas médicas.')
    setNombre('')
    setCorreo('')
    setEspecialidad('')
    setFecha('')
  }

  return (
    <main>
      <h2>Agendar hora médica</h2>
      <p>Completa los datos para solicitar una hora médica.</p>

      <form className="formulario-agenda" onSubmit={manejarEnvio}>
        <label htmlFor="nombre">Nombre completo</label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
          placeholder="Ingresa tu nombre"
          required
        />

        <label htmlFor="correo">Correo electrónico</label>
        <input
          id="correo"
          type="email"
          value={correo}
          onChange={(event) => setCorreo(event.target.value)}
          placeholder="ejemplo@correo.cl"
          required
        />

        <label htmlFor="especialidad">Especialidad</label>
        <select
          id="especialidad"
          value={especialidad}
          onChange={(event) => setEspecialidad(event.target.value)}
          required
        >
          <option value="">Selecciona una especialidad</option>
          {especialidades.map((especialidad) => (
            <option key={especialidad} value={especialidad}>
              {especialidad}
            </option>
          ))}
        </select>

        <label htmlFor="fecha">Fecha preferida</label>
        <input
          id="fecha"
          type="date"
          value={fecha}
          onChange={(event) => setFecha(event.target.value)}
          min={new Date().toISOString().split('T')[0]}
          required
        />

        <button type="submit">Solicitar hora</button>
      </form>

      {mensaje && <p className="mensaje-confirmacion" role="status">{mensaje}</p>}
    </main>
  )
}

export default AgendarHora