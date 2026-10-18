import { useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerSesion } from './auth.js'

const pacientesIniciales = [
  { rut: '12.345.678-9', nombre: 'Ana Pérez', activo: true },
  { rut: '9.876.543-2', nombre: 'Luis Soto', activo: true },
  { rut: '15.222.333-K', nombre: 'Carla Díaz', activo: false },
]
const medicosIniciales = [
  { nombre: 'Juan Pérez', especialidad: 'Medicina General', activo: true },
  { nombre: 'María González', especialidad: 'Pediatría', activo: true },
  { nombre: 'Carlos Rodríguez', especialidad: 'Cardiología', activo: false },
]
const opcionesEspecialidad = ['Medicina General', 'Pediatría', 'Cardiología', 'Ginecología', 'Dermatología', 'Traumatología']

function rutValido(rut) {
  const limpio = rut.replace(/[.\s]/g, '').toUpperCase()
  const partes = limpio.match(/^(\d{7,8})-([\dK])$/)
  if (!partes) return false
  let suma = 0
  let factor = 2
  for (let i = partes[1].length - 1; i >= 0; i -= 1) {
    suma += Number(partes[1][i]) * factor
    factor = factor === 7 ? 2 : factor + 1
  }
  const resto = 11 - (suma % 11)
  const verificador = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto)
  return verificador === partes[2]
}

function PanelContenido({ horas, actualizarHora }) {
  const [pacientes, setPacientes] = useState(pacientesIniciales)
  const [medicos, setMedicos] = useState(medicosIniciales)
  const [mostrarPaciente, setMostrarPaciente] = useState(false)
  const [mostrarMedico, setMostrarMedico] = useState(false)
  const [rut, setRut] = useState('')
  const [nombrePaciente, setNombrePaciente] = useState('')
  const [nombreMedico, setNombreMedico] = useState('')
  const [especialidad, setEspecialidad] = useState('')
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')

  function agregarPaciente(evento) {
    evento.preventDefault()
    const rutLimpio = rut.trim().toUpperCase()
    const nombreLimpio = nombrePaciente.trim()
    if (!rutValido(rutLimpio)) {
      setError('Ingresa un RUT válido, por ejemplo 12.345.678-9.')
      return
    }
    if (nombreLimpio.length < 3 || nombreLimpio.length > 60) {
      setError('El nombre debe tener entre 3 y 60 caracteres.')
      return
    }
    if (pacientes.some((paciente) => paciente.rut === rutLimpio)) {
      setError('Ese RUT ya está registrado en la tabla.')
      return
    }
    setPacientes([...pacientes, { rut: rutLimpio, nombre: nombreLimpio, activo: true }])
    setAviso(`Paciente ${nombreLimpio} agregado correctamente.`)
    setError('')
    setRut('')
    setNombrePaciente('')
    setMostrarPaciente(false)
  }

  function agregarMedico(evento) {
    evento.preventDefault()
    const nombreLimpio = nombreMedico.trim()
    if (nombreLimpio.length < 3 || nombreLimpio.length > 60 || !especialidad) {
      setError('Ingresa el nombre del médico y selecciona una especialidad.')
      return
    }
    setMedicos([...medicos, { nombre: nombreLimpio, especialidad, activo: true }])
    setAviso(`Médico ${nombreLimpio} agregado correctamente.`)
    setError('')
    setNombreMedico('')
    setEspecialidad('')
    setMostrarMedico(false)
  }

  function alternarPaciente(index) {
    setPacientes(pacientes.map((item, i) => i === index ? { ...item, activo: !item.activo } : item))
    setAviso(`${pacientes[index].nombre} cambió de estado.`)
  }

  function alternarMedico(index) {
    setMedicos(medicos.map((item, i) => i === index ? { ...item, activo: !item.activo } : item))
    setAviso(`${medicos[index].nombre} cambió de estado.`)
  }

  function cancelarHora(hora) {
    actualizarHora({ ...hora, estado: 'Cancelada' })
    setAviso(`La hora ${hora.codigo || `AM-${hora.id}`} se marcó como cancelada.`)
  }

  return (
    <main className="panel-admin-react">
      <section className="panel-admin-hero">
        <span className="etiqueta-seccion">ADMINISTRACIÓN</span>
        <h1>Panel de administración</h1>
        <p>Gestiona pacientes, médicos y horas médicas de la clínica. Los datos son de ejemplo para esta versión del proyecto.</p>
      </section>

      <section className="panel-admin-resumen" aria-label="Resumen de registros">
        <article><strong>{pacientes.length}</strong><span>Pacientes</span></article>
        <article><strong>{medicos.length}</strong><span>Médicos</span></article>
        <article><strong>{horas.length}</strong><span>Horas agendadas</span></article>
      </section>
      {aviso && <p className="panel-admin-aviso" role="status">{aviso}</p>}
      {error && <p className="login-mensaje login-error" role="alert">{error}</p>}

      <section className="panel-admin-seccion">
        <div className="panel-admin-titulo">
          <h2>Pacientes</h2>
          <button className="perfil-boton" type="button" onClick={() => { setMostrarPaciente(!mostrarPaciente); setError('') }}>＋ Agregar paciente</button>
        </div>
        {mostrarPaciente && (
          <form className="panel-admin-form" onSubmit={agregarPaciente}>
            <div className="login-campo"><label htmlFor="panel-rut">RUT</label><input id="panel-rut" value={rut} onChange={(e) => setRut(e.target.value)} placeholder="Ej: 12.345.678-9" required /></div>
            <div className="login-campo"><label htmlFor="panel-nombre-paciente">Nombre completo</label><input id="panel-nombre-paciente" value={nombrePaciente} onChange={(e) => setNombrePaciente(e.target.value)} maxLength={60} required /></div>
            <div className="panel-admin-form-acciones"><button className="perfil-boton" type="submit">Guardar</button><button className="perfil-boton perfil-boton-secundario" type="button" onClick={() => { setMostrarPaciente(false); setError('') }}>Cancelar</button></div>
          </form>
        )}
        <div className="panel-tabla-wrap"><table className="panel-tabla"><caption>Listado de pacientes registrados</caption><thead><tr><th>RUT</th><th>Nombre</th><th>Estado</th><th>Acción</th></tr></thead>
          <tbody>{pacientes.map((paciente, index) => <tr key={paciente.rut}><td>{paciente.rut}</td><td>{paciente.nombre}</td><td><span className={paciente.activo ? 'panel-estado panel-activo' : 'panel-estado panel-inactivo'}>{paciente.activo ? 'Activo' : 'Inactivo'}</span></td><td className="panel-acciones"><button type="button" onClick={() => alternarPaciente(index)}>{paciente.activo ? 'Desactivar' : 'Activar'}</button><button type="button" onClick={() => setPacientes(pacientes.filter((_, i) => i !== index))}>Eliminar</button></td></tr>)}</tbody>
        </table></div>
      </section>

      <section className="panel-admin-seccion">
        <div className="panel-admin-titulo">
          <h2>Médicos</h2>
          <button className="perfil-boton" type="button" onClick={() => { setMostrarMedico(!mostrarMedico); setError('') }}>＋ Agregar médico</button>
        </div>
        {mostrarMedico && (
          <form className="panel-admin-form" onSubmit={agregarMedico}>
            <div className="login-campo"><label htmlFor="panel-nombre-medico">Nombre del médico</label><input id="panel-nombre-medico" value={nombreMedico} onChange={(e) => setNombreMedico(e.target.value)} maxLength={60} required /></div>
            <div className="login-campo"><label htmlFor="panel-especialidad">Especialidad</label><select id="panel-especialidad" value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} required><option value="">Selecciona una especialidad</option>{opcionesEspecialidad.map((opcion) => <option key={opcion}>{opcion}</option>)}</select></div>
            <div className="panel-admin-form-acciones"><button className="perfil-boton" type="submit">Guardar</button><button className="perfil-boton perfil-boton-secundario" type="button" onClick={() => { setMostrarMedico(false); setError('') }}>Cancelar</button></div>
          </form>
        )}
        <div className="panel-tabla-wrap"><table className="panel-tabla"><caption>Listado de médicos de la clínica</caption><thead><tr><th>Médico</th><th>Especialidad</th><th>Estado</th><th>Acción</th></tr></thead>
          <tbody>{medicos.map((medico, index) => <tr key={`${medico.nombre}-${index}`}><td>{medico.nombre}</td><td>{medico.especialidad}</td><td><span className={medico.activo ? 'panel-estado panel-activo' : 'panel-estado panel-inactivo'}>{medico.activo ? 'Activo' : 'Inactivo'}</span></td><td className="panel-acciones"><button type="button" onClick={() => alternarMedico(index)}>{medico.activo ? 'Desactivar' : 'Activar'}</button><button type="button" onClick={() => setMedicos(medicos.filter((_, i) => i !== index))}>Eliminar</button></td></tr>)}</tbody>
        </table></div>
      </section>

      <section className="panel-admin-seccion">
        <div className="panel-admin-titulo"><h2>Horas médicas</h2><Link className="perfil-boton" to="/agendar-hora">＋ Agendar hora</Link></div>
        <div className="panel-tabla-wrap"><table className="panel-tabla"><caption>Horas médicas agendadas</caption><thead><tr><th>Fecha</th><th>Especialidad</th><th>Paciente</th><th>Estado</th><th>Acción</th></tr></thead>
          <tbody>{horas.map((hora) => <tr key={hora.id}><td>{hora.fecha}</td><td>{hora.especialidad}</td><td>{hora.paciente}</td><td><span className={hora.estado === 'Cancelada' ? 'panel-estado panel-inactivo' : 'panel-estado panel-activo'}>{hora.estado}</span></td><td className="panel-acciones">{hora.estado !== 'Cancelada' && <button type="button" onClick={() => cancelarHora(hora)}>Cancelar</button>}</td></tr>)}</tbody>
        </table></div>
      </section>
    </main>
  )
}

function PanelAdministracion(props) {
  const sesion = obtenerSesion()
  if (sesion?.rol !== 'administrador') {
    return (
      <main className="panel-admin-denegado">
        <section className="perfil-sin-sesion" role="status">
          <h1>Acceso restringido</h1>
          <p>El panel de administración requiere una sesión de administrador.</p>
          <Link className="perfil-boton" to="/acceso-administracion">Acceso administrativo</Link>
          {sesion && <p>La sesión actual corresponde a otro tipo de usuario.</p>}
        </section>
      </main>
    )
  }
  return <PanelContenido {...props} />
}

export default PanelAdministracion