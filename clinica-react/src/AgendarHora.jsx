import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { api, mensajeDeError } from './api/index.js'
import CalendarioHoras from './CalendarioHoras.jsx'
import EstadoCarga from './components/EstadoCarga.jsx'
import { useSesion } from './context/useSesion.js'
import { useCarga } from './hooks/useCarga.js'
import { formatearFecha } from './utils/formato.js'
import { formatearRut, normalizarRut, rutValido } from './utils/rut.js'

const estiloAlerta = {
  customClass: { popup: 'clinica-swal-popup', confirmButton: 'clinica-swal-confirm' },
  buttonsStyling: false
}

// Especialidades, médicos y sucursales que necesita el formulario
function cargarCatalogos() {
  return Promise.all([api.especialidades.listar(), api.medicos.listar(), api.sucursales.listar()])
    .then(([especialidades, medicos, sucursales]) => ({ especialidades, medicos, sucursales }))
}

function AgendarHora() {
  const { usuario } = useSesion()
  const esPaciente = usuario.rol === 'PACIENTE'
  const esMedico = usuario.rol === 'MEDICO'
  const [parametros] = useSearchParams()
  const { datos: catalogos, cargando, error, recargar } = useCarga(cargarCatalogos, 'catalogos')

  // La especialidad y el médico pueden venir en el enlace (?especialidad=pediatria&medico=2)
  const [seleccion, setSeleccion] = useState({
    especialidad: parametros.get('especialidad') || '',
    medicoId: parametros.get('medico') || '',
  })
  const [rutPaciente, setRutPaciente] = useState('')
  const [motivo, setMotivo] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [versionAgenda, setVersionAgenda] = useState(0)

  const especialidades = catalogos?.especialidades || []
  const medicos = catalogos?.medicos || []
  const medicoPropio = esMedico ? medicos.find((medico) => medico.id === usuario.personalId) : null
  const medicoDelEnlace = medicos.find((medico) => String(medico.id) === String(seleccion.medicoId))
  const especialidadActual = esMedico
    ? medicoPropio?.especialidad || ''
    : especialidades.find((item) => item.slug === seleccion.especialidad || item.nombre === seleccion.especialidad)?.nombre
      || medicoDelEnlace?.especialidad || ''
  const medicosDisponibles = esMedico ? (medicoPropio ? [medicoPropio] : []) : medicos.filter((medico) => medico.especialidad === especialidadActual)
  const medicoElegido = medicosDisponibles.find((medico) => String(medico.id) === String(seleccion.medicoId))
    || (medicosDisponibles.length === 1 ? medicosDisponibles[0] : null)
  const sucursalNombre = catalogos?.sucursales.find((sucursal) => sucursal.id === medicoElegido?.sucursalId)?.nombre

  function reiniciarHorario() {
    setFecha('')
    setHora('')
  }

  function cambiarEspecialidad(event) {
    setSeleccion({ especialidad: event.target.value, medicoId: '' })
    reiniciarHorario()
  }

  function cambiarMedico(event) {
    setSeleccion((actual) => ({ ...actual, medicoId: event.target.value }))
    reiniciarHorario()
  }

  async function avisar(icon, title, text) {
    await Swal.fire({ ...estiloAlerta, icon, title, text, confirmButtonText: 'Entendido' })
  }

  async function manejarEnvio(event) {
    event.preventDefault()
    if (!esPaciente && !rutValido(rutPaciente)) {
      await avisar('warning', 'Ingresa el RUT del paciente', 'Revisa el formato y el dígito verificador, por ejemplo 12.345.678-5.')
      return
    }
    if (!medicoElegido) {
      await avisar('warning', 'Selecciona un médico')
      return
    }
    if (!fecha || !hora) {
      await avisar('warning', 'Selecciona fecha y hora', 'Elige un día y un horario disponible en el calendario.')
      return
    }

    setEnviando(true)
    try {
      const cita = await api.citas.crear({
        medicoId: medicoElegido.id,
        fecha,
        hora,
        motivo: motivo.trim() || null,
        rutPaciente: esPaciente ? null : normalizarRut(rutPaciente),
      })
      reiniciarHorario()
      setMotivo('')
      setRutPaciente('')
      setVersionAgenda((actual) => actual + 1)
      await Swal.fire({
        ...estiloAlerta,
        icon: 'success',
        title: '¡Hora médica agendada!',
        html: `<p><strong>Paciente:</strong> ${cita.pacienteNombre}</p><p><strong>Médico:</strong> ${cita.medicoNombre}</p>`
          + `<p><strong>Fecha:</strong> ${formatearFecha(cita.fecha)}</p><p><strong>Hora:</strong> ${cita.hora}</p>`
          + `<p><strong>Código:</strong> ${cita.codigo}</p>`,
        confirmButtonText: 'Entendido'
      })
    } catch (errorReserva) {
      // Si otra persona tomó el horario, se vuelve a consultar la disponibilidad
      if (errorReserva.estado === 409) {
        reiniciarHorario()
        setVersionAgenda((actual) => actual + 1)
      }
      await avisar('warning', 'No se pudo agendar la hora', mensajeDeError(errorReserva))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="pagina-agenda-react">
      <section className="agenda-hero-react">
        <span className="etiqueta-seccion">RESERVA TU ATENCIÓN</span>
        <h1>Agendar hora médica</h1>
        <p>{esMedico
          ? `Agenda una hora para un paciente en tu agenda, ${usuario.nombre}.`
          : esPaciente ? 'Elige la especialidad, el profesional y el horario que más te acomode.'
            : 'Agenda una hora a nombre de un paciente registrado.'}</p>
      </section>

      <EstadoCarga cargando={cargando} error={error} alReintentar={recargar} />

      {catalogos && (
        <form className="formulario-agenda formulario-agenda-react" onSubmit={manejarEnvio} noValidate>
          {esPaciente && <p className="agenda-aviso-medico">La hora quedará a nombre de <strong>{usuario.nombre}</strong>.</p>}
          {esMedico && !medicoPropio && (
            <p className="login-mensaje login-error" role="alert">Tu cuenta no está asociada a un médico activo. Comunícate con la administración.</p>
          )}
          <div className="row gx-4 gy-3">
            {!esPaciente && (
              <div className="col-12 col-sm-6 agenda-campo">
                <label htmlFor="rut-paciente">RUT del paciente</label>
                <input id="rut-paciente" type="text" value={rutPaciente} maxLength={12}
                  onChange={(event) => setRutPaciente(formatearRut(event.target.value))}
                  placeholder="Ej: 16.543.210-K" required />
                <small className="agenda-ayuda">El paciente debe estar registrado en la clínica.</small>
              </div>
            )}
            <div className="col-12 col-sm-6 agenda-campo">
              <label htmlFor="especialidad">Especialidad</label>
              <select id="especialidad" value={especialidadActual} onChange={cambiarEspecialidad} disabled={esMedico} required>
                <option value="">Selecciona una especialidad</option>
                {especialidades.map((opcion) => <option key={opcion.id} value={opcion.nombre}>{opcion.nombre}</option>)}
              </select>
            </div>
            <div className="col-12 col-sm-6 agenda-campo">
              <label htmlFor="medico">Médico</label>
              <select id="medico" value={medicoElegido?.id || ''} onChange={cambiarMedico} disabled={!especialidadActual || esMedico} required>
                <option value="">Selecciona un médico</option>
                {medicosDisponibles.map((medico) => <option key={medico.id} value={medico.id}>{medico.nombre}</option>)}
              </select>
              {especialidadActual && medicosDisponibles.length === 0 && (
                <small className="agenda-ayuda">No hay médicos disponibles para esta especialidad.</small>
              )}
            </div>
            <div className="col-12 col-sm-6 agenda-campo">
              <label htmlFor="motivo">Motivo de la consulta <span className="registro-opcional">(opcional)</span></label>
              <input id="motivo" type="text" value={motivo} maxLength={300}
                onChange={(event) => setMotivo(event.target.value)} placeholder="Ej: control anual" />
            </div>
          </div>

          {medicoElegido && (
            <CalendarioHoras
              key={`${medicoElegido.id}-${versionAgenda}`}
              medico={medicoElegido}
              sucursalNombre={sucursalNombre}
              version={versionAgenda}
              alCambiarSeleccion={({ fecha: nuevaFecha, hora: nuevaHora }) => {
                setFecha(nuevaFecha)
                setHora(nuevaHora)
              }}
            />
          )}

          <button className="agenda-boton-confirmar" type="submit" disabled={enviando}>
            {enviando ? 'Agendando…' : 'Confirmar hora'}
          </button>
          <p className="cancelar-volver"><Link to="/mis-horas">{esMedico ? 'Ver mi agenda' : 'Ver mis horas médicas'}</Link></p>
        </form>
      )}
    </main>
  )
}

export default AgendarHora
