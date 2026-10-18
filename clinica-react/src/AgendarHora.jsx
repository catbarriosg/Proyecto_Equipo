import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { obtenerSesion } from './auth.js'
import CalendarioHoras from './CalendarioHoras.jsx'
import medicos from './medicos.js'

const especialidades = ['Medicina General', 'Pediatría', 'Cardiología', 'Dermatología', 'Ginecología', 'Traumatología']
const estiloAlerta = {
  customClass: { popup: 'clinica-swal-popup', confirmButton: 'clinica-swal-confirm' },
  buttonsStyling: false
}

function slugEspecialidad(valor) {
  return valor?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-')
}

function AgendarHora({ horas, agregarHora }) {
  const sesion = obtenerSesion()
  const esMedico = sesion?.rol === 'medico'
  const [parametros] = useSearchParams()
  const medicoEnSesion = esMedico
    ? medicos.find((medico) => medico.nombre.replace(/^(Dr\.|Dra\.)\s*/, '') === `${sesion.nombre} ${sesion.apellido}`)
    : null
  const medicoEnlace = medicos.find((medico) => medico.id === parametros.get('medico'))
  const especialidadEnlace = especialidades.find(
    (nombre) => slugEspecialidad(nombre) === slugEspecialidad(parametros.get('especialidad'))
  )
  const especialidadInicial = sesion?.especialidad || medicoEnlace?.especialidad || especialidadEnlace || ''
  const medicosIniciales = medicos.filter((medico) =>
    medico.especialidad === especialidadInicial && (!esMedico || medico.id === medicoEnSesion?.id)
  )
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [especialidad, setEspecialidad] = useState(especialidadInicial)
  const [medicoId, setMedicoId] = useState(() =>
    medicoEnSesion?.id || medicoEnlace?.id || (medicosIniciales.length === 1 ? medicosIniciales[0].id : '')
  )
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')

  const medicosDisponibles = medicos.filter((medico) =>
    medico.especialidad === especialidad && (!esMedico || medico.id === medicoEnSesion?.id)
  )
  const medicoElegido = medicos.find((medico) => medico.id === medicoId)

  function cambiarEspecialidad(event) {
    const nuevaEspecialidad = event.target.value
    const disponibles = medicos.filter((medico) =>
      medico.especialidad === nuevaEspecialidad && (!esMedico || medico.id === medicoEnSesion?.id)
    )
    setEspecialidad(nuevaEspecialidad)
    setMedicoId(disponibles.length === 1 ? disponibles[0].id : '')
    setFecha('')
    setHora('')
  }

  function cambiarMedico(event) {
    setMedicoId(event.target.value)
    setFecha('')
    setHora('')
  }

  async function manejarEnvio(event) {
    event.preventDefault()
    if (!medicoElegido) {
      await Swal.fire({ ...estiloAlerta, icon: 'warning', title: 'Selecciona un médico', confirmButtonText: 'Entendido' })
      return
    }
    if (!fecha || !hora) {
      await Swal.fire({ ...estiloAlerta, icon: 'warning', title: 'Selecciona fecha y hora', text: 'Elige un día y un horario disponible en el calendario.', confirmButtonText: 'Entendido' })
      return
    }
    const yaReservada = horas.some((reserva) => {
      const mismoMedico = reserva.medicoId
        ? reserva.medicoId === medicoElegido.id
        : reserva.medico === medicoElegido.nombre
      return mismoMedico && reserva.fecha === fecha && reserva.hora === hora && reserva.estado !== 'Cancelada'
    })
    if (yaReservada) {
      setFecha('')
      setHora('')
      await Swal.fire({ ...estiloAlerta, icon: 'warning', title: 'Ese horario ya no está disponible', text: 'Elige otro horario para continuar.', confirmButtonText: 'Entendido' })
      return
    }

    const id = Date.now()
    const codigo = `AM-${id}`
    agregarHora({
      id,
      codigo,
      paciente: nombre,
      correo,
      medico: medicoElegido.nombre,
      medicoId: medicoElegido.id,
      creadoPor: sesion?.correo || correo,
      rolCreador: sesion?.rol || 'paciente',
      especialidad: medicoElegido.especialidad,
      fecha,
      hora,
      estado: 'Confirmada'
    })
    setNombre('')
    setCorreo('')
    if (!esMedico) {
      setEspecialidad('')
      setMedicoId('')
    }
    setFecha('')
    setHora('')
    await Swal.fire({
      ...estiloAlerta,
      icon: 'success',
      title: '¡Hora médica agendada!',
      html: `<p><strong>Médico:</strong> ${medicoElegido.nombre}</p><p><strong>Fecha:</strong> ${fecha}</p><p><strong>Hora:</strong> ${hora}</p><p><strong>Código:</strong> ${codigo}</p>`,
      confirmButtonText: 'Entendido'
    })
  }

  return (
    <main className="pagina-agenda-react">
      <section className="agenda-hero-react">
        <span className="etiqueta-seccion">RESERVA TU ATENCIÓN</span>
        <h1>Agendar hora médica</h1>
        <p>{esMedico ? `Agenda una hora para un paciente. Médico: ${sesion.nombre} ${sesion.apellido}.` : 'Elige la especialidad, el profesional y el horario que más te acomode.'}</p>
      </section>

      <form className="formulario-agenda formulario-agenda-react" onSubmit={manejarEnvio}>
        {esMedico && <p className="agenda-aviso-medico">La reserva quedará asociada a tu cuenta de profesional.</p>}
        <div className="agenda-campos-grid">
          <div className="agenda-campo">
            <label htmlFor="nombre">Nombre completo del paciente</label>
            <input id="nombre" type="text" value={nombre} onChange={(event) => setNombre(event.target.value)} placeholder="Ingresa el nombre del paciente" required />
          </div>
          <div className="agenda-campo">
            <label htmlFor="correo">Correo electrónico del paciente</label>
            <input id="correo" type="email" value={correo} onChange={(event) => setCorreo(event.target.value)} placeholder="ejemplo@correo.cl" required />
          </div>
          <div className="agenda-campo">
            <label htmlFor="especialidad">Especialidad</label>
            <select id="especialidad" value={especialidad} onChange={cambiarEspecialidad} disabled={esMedico} required>
              <option value="">Selecciona una especialidad</option>
              {especialidades.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
            </select>
          </div>
          <div className="agenda-campo">
            <label htmlFor="medico">Médico</label>
            <select id="medico" value={medicoId} onChange={cambiarMedico} disabled={!especialidad || esMedico} required>
              <option value="">Selecciona un médico</option>
              {medicosDisponibles.map((medico) => <option key={medico.id} value={medico.id}>{medico.nombre}</option>)}
            </select>
            {esMedico && medicoElegido && <small className="agenda-ayuda">Profesional asociado a la sesión actual.</small>}
          </div>
        </div>

        {medicoElegido && (
          <CalendarioHoras
            key={medicoElegido.id}
            medico={medicoElegido}
            especialidad={medicoElegido.especialidad}
            horasReservadas={horas}
            alCambiarSeleccion={({ fecha: nuevaFecha, hora: nuevaHora }) => {
              setFecha(nuevaFecha)
              setHora(nuevaHora)
            }}
          />
        )}

        <button className="agenda-boton-confirmar" type="submit">Confirmar hora</button>
      </form>
    </main>
  )
}

export default AgendarHora