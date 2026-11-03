import { useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { api, mensajeDeError } from '../api/index.js'
import EstadoCarga from '../components/EstadoCarga.jsx'
import { useCarga } from '../hooks/useCarga.js'
import { estadoLegible, formatearFecha, mostrarRut } from '../utils/formato.js'
import { formatearRut, normalizarRut, rutValido } from '../utils/rut.js'

const estiloAlerta = {
  customClass: { popup: 'clinica-swal-popup', confirmButton: 'clinica-swal-confirm', cancelButton: 'clinica-swal-cancel' },
  buttonsStyling: false
}

// Valores iniciales de los formularios de nuevo paciente y nuevo médico
const pacienteVacio = { rut: '', nombreCompleto: '', correo: '', fechaNacimiento: '', telefono: '', prevision: '' }
const medicoVacio = {
  nombre: '', rut: '', email: '', telefono: '', especialidad: '', hospitalId: '', descripcion: '', imagenUrl: '/logo-hombre.png',
  crearCuenta: true, contrasena: '',
}

// Carga en paralelo todo lo que muestra el panel: pacientes, personal, citas, especialidades y sucursales
function cargarPanel() {
  return Promise.all([
    api.pacientes.listar({ incluirInactivos: true }),
    api.personal.listar({ incluirInactivos: true }),
    api.citas.listar(),
    api.especialidades.listar(),
    api.sucursales.listar(),
  ]).then(([pacientes, personal, citas, especialidades, sucursales]) => ({ pacientes, personal, citas, especialidades, sucursales }))
}

// Devuelve una nueva lista con el elemento actualizado en lugar del anterior (mismo id), sin mutar la original
function reemplazar(lista, actualizado) {
  return lista.map((item) => (item.id === actualizado.id ? actualizado : item))
}

// ------------------------------------------------------------------ Formularios

// Formulario para que la administración ingrese un paciente nuevo.
// alGuardar recibe el paciente creado; alCancelar cierra el formulario.
function FormularioPaciente({ alGuardar, alCancelar }) {
  const [datos, setDatos] = useState(pacienteVacio)
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const cambiar = (campo, valor) => { setDatos((actual) => ({ ...actual, [campo]: valor })); setError('') }

  async function guardar(evento) {
    evento.preventDefault()
    if (!rutValido(datos.rut)) return setError('Ingresa un RUT válido, por ejemplo 12.345.678-5.')
    if (datos.nombreCompleto.trim().length < 3) return setError('El nombre debe tener al menos 3 caracteres.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) return setError('Ingresa un correo electrónico válido.')
    if (!datos.fechaNacimiento) return setError('Ingresa la fecha de nacimiento.')
    setGuardando(true)
    try {
      // Validaciones superadas: se crea la ficha con el RUT normalizado y los campos opcionales en null si están vacíos
      const creado = await api.pacientes.crear({
        ...datos, rut: normalizarRut(datos.rut), telefono: datos.telefono.replace(/\s/g, '') || null, prevision: datos.prevision || null,
      })
      alGuardar(creado)
    } catch (errorGuardar) {
      setError(mensajeDeError(errorGuardar))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form className="panel-admin-form" onSubmit={guardar} noValidate>
      <div className="login-campo"><label htmlFor="panel-rut">RUT</label><input id="panel-rut" value={datos.rut} maxLength={12} onChange={(e) => cambiar('rut', formatearRut(e.target.value))} placeholder="Ej: 12.345.678-5" required /></div>
      <div className="login-campo"><label htmlFor="panel-nombre-paciente">Nombre completo</label><input id="panel-nombre-paciente" value={datos.nombreCompleto} onChange={(e) => cambiar('nombreCompleto', e.target.value)} maxLength={100} required /></div>
      <div className="login-campo"><label htmlFor="panel-correo-paciente">Correo</label><input id="panel-correo-paciente" type="email" value={datos.correo} onChange={(e) => cambiar('correo', e.target.value)} maxLength={120} required /></div>
      <div className="login-campo"><label htmlFor="panel-fecha-paciente">Fecha de nacimiento</label><input id="panel-fecha-paciente" type="date" max={new Date().toISOString().slice(0, 10)} value={datos.fechaNacimiento} onChange={(e) => cambiar('fechaNacimiento', e.target.value)} required /></div>
      <div className="login-campo"><label htmlFor="panel-telefono-paciente">Teléfono <span className="registro-opcional">(opcional)</span></label><input id="panel-telefono-paciente" type="tel" value={datos.telefono} onChange={(e) => cambiar('telefono', e.target.value)} maxLength={16} /></div>
      <div className="login-campo"><label htmlFor="panel-prevision-paciente">Previsión <span className="registro-opcional">(opcional)</span></label><input id="panel-prevision-paciente" value={datos.prevision} onChange={(e) => cambiar('prevision', e.target.value)} maxLength={40} placeholder="Ej: Fonasa" /></div>
      {error && <p className="login-mensaje login-error" role="alert">{error}</p>}
      <div className="panel-admin-form-acciones">
        <button className="perfil-boton" type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar'}</button>
        <button className="perfil-boton perfil-boton-secundario" type="button" onClick={alCancelar}>Cancelar</button>
      </div>
    </form>
  )
}

// Formulario para agregar un médico a la clínica y, opcionalmente, crearle su cuenta de acceso al portal médico
function FormularioMedico({ especialidades, sucursales, alGuardar, alCancelar }) {
  const [datos, setDatos] = useState(medicoVacio)
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const cambiar = (campo, valor) => { setDatos((actual) => ({ ...actual, [campo]: valor })); setError('') }

  async function guardar(evento) {
    evento.preventDefault()
    const telefono = datos.telefono.replace(/\s/g, '')
    if (datos.nombre.trim().length < 3) return setError('El nombre debe tener al menos 3 caracteres.')
    if (!rutValido(datos.rut)) return setError('Ingresa un RUT válido, por ejemplo 12.345.678-5.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email.trim())) return setError('Ingresa un correo electrónico válido.')
    if (!/^\+?\d{8,15}$/.test(telefono)) return setError('El teléfono debe tener entre 8 y 15 dígitos, por ejemplo +56912345678.')
    if (!datos.especialidad) return setError('Selecciona una especialidad.')
    if (!datos.hospitalId) return setError('Selecciona la sucursal donde atiende.')
    if (datos.crearCuenta && datos.contrasena.length < 8) return setError('La contraseña de la cuenta debe tener al menos 8 caracteres.')

    setGuardando(true)
    try {
      // Paso 1: se registra el profesional en ms-personal
      const creado = await api.personal.crear({
        nombre: datos.nombre.trim(), rut: normalizarRut(datos.rut), email: datos.email.trim().toLowerCase(), telefono,
        rol: 'MEDICO', especialidad: datos.especialidad, departamento: 'Consulta ambulatoria', hospitalId: Number(datos.hospitalId),
        descripcion: datos.descripcion.trim() || null, imagenUrl: datos.imagenUrl,
      })
      let avisoCuenta = ''
      // Paso 2 (opcional): se crea la cuenta en ms-auth vinculada al profesional (personalId).
      // Si falla, el médico igual queda creado y se informa el problema en el aviso.
      if (datos.crearCuenta) {
        try {
          await api.auth.crearCuenta({ correo: creado.email, contrasena: datos.contrasena, rol: 'MEDICO', nombre: creado.nombre, personalId: creado.id })
          avisoCuenta = ` Puede ingresar con ${creado.email}.`
        } catch (errorCuenta) {
          avisoCuenta = ` No se pudo crear su cuenta de acceso: ${mensajeDeError(errorCuenta)}`
        }
      }
      alGuardar(creado, avisoCuenta)
    } catch (errorGuardar) {
      setError(mensajeDeError(errorGuardar))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form className="panel-admin-form" onSubmit={guardar} noValidate>
      <div className="login-campo"><label htmlFor="panel-nombre-medico">Nombre del médico</label><input id="panel-nombre-medico" value={datos.nombre} onChange={(e) => cambiar('nombre', e.target.value)} maxLength={100} placeholder="Ej: Dra. Paula Muñoz" required /></div>
      <div className="login-campo"><label htmlFor="panel-rut-medico">RUT</label><input id="panel-rut-medico" value={datos.rut} maxLength={12} onChange={(e) => cambiar('rut', formatearRut(e.target.value))} required /></div>
      <div className="login-campo"><label htmlFor="panel-email-medico">Correo</label><input id="panel-email-medico" type="email" value={datos.email} onChange={(e) => cambiar('email', e.target.value)} maxLength={120} placeholder="nombre@clinica.cl" required /></div>
      <div className="login-campo"><label htmlFor="panel-telefono-medico">Teléfono</label><input id="panel-telefono-medico" type="tel" value={datos.telefono} onChange={(e) => cambiar('telefono', e.target.value)} maxLength={16} placeholder="+56912345678" required /></div>
      <div className="login-campo"><label htmlFor="panel-especialidad">Especialidad</label><select id="panel-especialidad" value={datos.especialidad} onChange={(e) => cambiar('especialidad', e.target.value)} required><option value="">Selecciona una especialidad</option>{especialidades.map((opcion) => <option key={opcion.id} value={opcion.nombre}>{opcion.nombre}</option>)}</select></div>
      <div className="login-campo"><label htmlFor="panel-sucursal">Sucursal</label><select id="panel-sucursal" value={datos.hospitalId} onChange={(e) => cambiar('hospitalId', e.target.value)} required><option value="">Selecciona una sucursal</option>{sucursales.map((opcion) => <option key={opcion.id} value={opcion.id}>{opcion.nombre}</option>)}</select></div>
      <div className="login-campo"><label htmlFor="panel-imagen">Ilustración</label><select id="panel-imagen" value={datos.imagenUrl} onChange={(e) => cambiar('imagenUrl', e.target.value)}><option value="/logo-hombre.png">Médico</option><option value="/logo-mujer.png">Médica</option></select></div>
      <div className="login-campo"><label htmlFor="panel-descripcion">Descripción <span className="registro-opcional">(opcional)</span></label><input id="panel-descripcion" value={datos.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} maxLength={500} /></div>
      <label className="login-recordar" htmlFor="panel-crear-cuenta"><input id="panel-crear-cuenta" type="checkbox" checked={datos.crearCuenta} onChange={(e) => cambiar('crearCuenta', e.target.checked)} /> Crear cuenta de acceso al portal médico</label>
      {datos.crearCuenta && (
        <div className="login-campo"><label htmlFor="panel-contrasena-medico">Contraseña inicial</label><input id="panel-contrasena-medico" type="password" autoComplete="new-password" value={datos.contrasena} onChange={(e) => cambiar('contrasena', e.target.value)} minLength={8} maxLength={64} required /></div>
      )}
      {error && <p className="login-mensaje login-error" role="alert">{error}</p>}
      <div className="panel-admin-form-acciones">
        <button className="perfil-boton" type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar'}</button>
        <button className="perfil-boton perfil-boton-secundario" type="button" onClick={alCancelar}>Cancelar</button>
      </div>
    </form>
  )
}

// ------------------------------------------------------------------ Panel

// Panel exclusivo del administrador: resumen de cifras y tablas de pacientes, médicos y horas médicas
function PanelAdministracion() {
  const { datos: datosCargados, cargando, error, recargar } = useCarga(cargarPanel, 'panel')
  const [cambios, setCambios] = useState(null)
  const [mostrarPaciente, setMostrarPaciente] = useState(false)
  const [mostrarMedico, setMostrarMedico] = useState(false)
  const [aviso, setAviso] = useState('')
  // Las modificaciones se aplican sobre una copia local para no recargar todo el panel
  const datos = cambios || datosCargados

  // Aplica un cambio sobre los datos actuales (por ejemplo, reemplazar un paciente) y lo guarda como copia local
  function actualizar(funcion) {
    setCambios(funcion(datos))
  }

  // Pide confirmación con SweetAlert2; devuelve true si el usuario acepta
  async function confirmar(titulo, texto) {
    const respuesta = await Swal.fire({
      ...estiloAlerta, icon: 'warning', title: titulo, text: texto, showCancelButton: true,
      confirmButtonText: 'Sí, continuar', cancelButtonText: 'Volver', reverseButtons: true,
    })
    return respuesta.isConfirmed
  }

  // Ejecuta una acción de la API y muestra el aviso de éxito, o una alerta con el error
  async function ejecutar(accion, mensajeExito) {
    try {
      await accion()
      setAviso(mensajeExito)
    } catch (errorAccion) {
      await Swal.fire({ ...estiloAlerta, icon: 'error', title: 'No se pudo completar la acción', text: mensajeDeError(errorAccion), confirmButtonText: 'Entendido' })
    }
  }

  // Activa o desactiva un paciente (para desactivar se pide confirmación)
  async function alternarPaciente(paciente) {
    if (paciente.activo && !await confirmar('¿Desactivar paciente?', `${paciente.nombreCompleto} no podrá agendar nuevas horas. Su historial se conserva.`)) return
    await ejecutar(async () => {
      const actualizado = await api.pacientes.cambiarEstado(paciente.id, !paciente.activo)
      actualizar((actual) => ({ ...actual, pacientes: reemplazar(actual.pacientes, actualizado) }))
    }, `${paciente.nombreCompleto} quedó ${paciente.activo ? 'inactivo' : 'activo'}.`)
  }

  // Activa o desactiva un médico; un médico inactivo deja de aparecer para agendar
  async function alternarMedico(medico) {
    if (medico.activo && !await confirmar('¿Desactivar médico?', `${medico.nombre} dejará de aparecer para agendar horas.`)) return
    await ejecutar(async () => {
      const actualizado = await api.personal.cambiarEstado(medico.id, !medico.activo)
      actualizar((actual) => ({ ...actual, personal: reemplazar(actual.personal, actualizado) }))
    }, `${medico.nombre} quedó ${medico.activo ? 'inactivo' : 'activo'}.`)
  }

  // Cancela una hora desde el panel, previa confirmación
  async function cancelarCita(cita) {
    if (!await confirmar('¿Cancelar la hora?', `${cita.codigo} · ${cita.pacienteNombre} con ${cita.medicoNombre}`)) return
    await ejecutar(async () => {
      const actualizada = await api.citas.cancelar(cita.id)
      actualizar((actual) => ({ ...actual, citas: reemplazar(actual.citas, actualizada) }))
    }, `La hora ${cita.codigo} se marcó como cancelada.`)
  }

  // Del personal solo se muestran los médicos; nombreSucursal traduce el id de sucursal a su nombre
  const medicos = datos?.personal.filter((persona) => persona.rol === 'MEDICO') || []
  const nombreSucursal = (id) => datos?.sucursales.find((sucursal) => sucursal.id === id)?.nombre || 'Sin sucursal'

  return (
    <main className="panel-admin-react">
      <section className="panel-admin-hero">
        <span className="etiqueta-seccion">ADMINISTRACIÓN</span>
        <h1>Panel de administración</h1>
        <p>Gestiona pacientes, médicos y horas médicas de la clínica.</p>
      </section>

      <EstadoCarga cargando={cargando && !cambios} error={error} alReintentar={recargar} />

      {datos && (
        <>
          {/* Tarjetas de resumen con los totales calculados a partir de los datos cargados */}
          <section className="panel-admin-resumen" aria-label="Resumen de registros">
            <div className="row g-2 g-sm-3">
              <div className="col-4"><article className="h-100"><strong>{datos.pacientes.filter((paciente) => paciente.activo).length}</strong><span>Pacientes activos</span></article></div>
              <div className="col-4"><article className="h-100"><strong>{medicos.filter((medico) => medico.activo).length}</strong><span>Médicos activos</span></article></div>
              <div className="col-4"><article className="h-100"><strong>{datos.citas.filter((cita) => cita.estado === 'CONFIRMADA').length}</strong><span>Horas confirmadas</span></article></div>
            </div>
          </section>
          {aviso && <p className="panel-admin-aviso" role="status">{aviso}</p>}

          <section className="panel-admin-seccion">
            <div className="panel-admin-titulo">
              {/* Sección de pacientes: botón para agregar y tabla con opción de activar/desactivar */}
              <h2>Pacientes</h2>
              <button className="perfil-boton" type="button" onClick={() => setMostrarPaciente(!mostrarPaciente)}>＋ Agregar paciente</button>
            </div>
            {mostrarPaciente && (
              <FormularioPaciente
                alCancelar={() => setMostrarPaciente(false)}
                alGuardar={(creado) => {
                  actualizar((actual) => ({ ...actual, pacientes: [...actual.pacientes, creado] }))
                  setMostrarPaciente(false)
                  setAviso(`Paciente ${creado.nombreCompleto} agregado correctamente.`)
                }}
              />
            )}
            <div className="panel-tabla-wrap"><table className="panel-tabla"><caption>Listado de pacientes registrados</caption><thead><tr><th scope="col">RUT</th><th scope="col">Nombre</th><th scope="col">Correo</th><th scope="col">Estado</th><th scope="col">Acción</th></tr></thead>
              <tbody>{datos.pacientes.map((paciente) => <tr key={paciente.id}><td>{mostrarRut(paciente.rut)}</td><td>{paciente.nombreCompleto}</td><td>{paciente.correo}</td><td><span className={paciente.activo ? 'panel-estado panel-activo' : 'panel-estado panel-inactivo'}>{paciente.activo ? 'Activo' : 'Inactivo'}</span></td><td className="panel-acciones"><button type="button" onClick={() => alternarPaciente(paciente)}>{paciente.activo ? 'Desactivar' : 'Activar'}</button></td></tr>)}</tbody>
            </table></div>
          </section>

          <section className="panel-admin-seccion">
            <div className="panel-admin-titulo">
              {/* Sección de médicos: mismo esquema que pacientes */}
              <h2>Médicos</h2>
              <button className="perfil-boton" type="button" onClick={() => setMostrarMedico(!mostrarMedico)}>＋ Agregar médico</button>
            </div>
            {mostrarMedico && (
              <FormularioMedico
                especialidades={datos.especialidades}
                sucursales={datos.sucursales}
                alCancelar={() => setMostrarMedico(false)}
                alGuardar={(creado, avisoCuenta) => {
                  actualizar((actual) => ({ ...actual, personal: [...actual.personal, creado] }))
                  setMostrarMedico(false)
                  setAviso(`Médico ${creado.nombre} agregado correctamente.${avisoCuenta}`)
                }}
              />
            )}
            <div className="panel-tabla-wrap"><table className="panel-tabla"><caption>Listado de médicos de la clínica</caption><thead><tr><th scope="col">Médico</th><th scope="col">Especialidad</th><th scope="col">Sucursal</th><th scope="col">Estado</th><th scope="col">Acción</th></tr></thead>
              <tbody>{medicos.map((medico) => <tr key={medico.id}><td>{medico.nombre}</td><td>{medico.especialidad}</td><td>{nombreSucursal(medico.hospitalId)}</td><td><span className={medico.activo ? 'panel-estado panel-activo' : 'panel-estado panel-inactivo'}>{medico.activo ? 'Activo' : 'Inactivo'}</span></td><td className="panel-acciones"><button type="button" onClick={() => alternarMedico(medico)}>{medico.activo ? 'Desactivar' : 'Activar'}</button></td></tr>)}</tbody>
            </table></div>
          </section>

          <section className="panel-admin-seccion">
            {/* Sección de horas médicas: solo las citas gestionables muestran el botón Cancelar */}
            <div className="panel-admin-titulo"><h2>Horas médicas</h2><Link className="perfil-boton" to="/agendar-hora">＋ Agendar hora</Link></div>
            <div className="panel-tabla-wrap"><table className="panel-tabla"><caption>Horas médicas agendadas</caption><thead><tr><th scope="col">Código</th><th scope="col">Fecha</th><th scope="col">Médico</th><th scope="col">Paciente</th><th scope="col">Estado</th><th scope="col">Acción</th></tr></thead>
              <tbody>{datos.citas.map((cita) => <tr key={cita.id}><td>{cita.codigo}</td><td>{formatearFecha(cita.fecha)} {cita.hora}</td><td>{cita.medicoNombre}</td><td>{cita.pacienteNombre}</td><td><span className={cita.estado === 'CANCELADA' ? 'panel-estado panel-inactivo' : 'panel-estado panel-activo'}>{estadoLegible(cita.estado)}</span></td><td className="panel-acciones">{cita.gestionable && <button type="button" onClick={() => cancelarCita(cita)}>Cancelar</button>}</td></tr>)}</tbody>
            </table></div>
          </section>
        </>
      )}
    </main>
  )
}

export default PanelAdministracion
