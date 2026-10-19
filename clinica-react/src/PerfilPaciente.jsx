import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, mensajeDeError } from './api/index.js'
import EstadoCarga from './components/EstadoCarga.jsx'
import { useSesion } from './context/useSesion.js'
import { useCarga } from './hooks/useCarga.js'
import { formatearFecha, formatearTelefono, mostrarRut } from './utils/formato.js'

const PREVISIONES = ['Fonasa', 'Isapre Banmédica', 'Isapre Colmena', 'Isapre Consalud', 'Isapre Cruz Blanca',
  'Isapre Nueva Masvida', 'Isapre Vida Tres', 'Particular']

// Formulario para que el paciente actualice sus datos de contacto
function EditarContacto({ paciente, alGuardar, alCancelar }) {
  const [telefono, setTelefono] = useState(paciente.telefono || '')
  const [prevision, setPrevision] = useState(paciente.prevision || '')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function guardar(evento) {
    evento.preventDefault()
    const telefonoLimpio = telefono.replace(/\s/g, '')
    if (telefonoLimpio && !/^\+?\d{8,15}$/.test(telefonoLimpio)) {
      setError('El teléfono debe tener entre 8 y 15 dígitos, por ejemplo +56912345678.')
      return
    }
    setGuardando(true)
    try {
      const actualizado = await api.pacientes.actualizar(paciente.id, { ...paciente, telefono: telefonoLimpio, prevision })
      alGuardar(actualizado)
    } catch (errorGuardar) {
      setError(mensajeDeError(errorGuardar))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form className="panel-admin-form" onSubmit={guardar} noValidate>
      <div className="login-campo">
        <label htmlFor="perfil-telefono">Teléfono</label>
        <input id="perfil-telefono" type="tel" maxLength={16} value={telefono} onChange={(e) => { setTelefono(e.target.value); setError('') }} />
      </div>
      <div className="login-campo">
        <label htmlFor="perfil-prevision">Previsión</label>
        <select id="perfil-prevision" value={prevision} onChange={(e) => setPrevision(e.target.value)}>
          <option value="">No indicada</option>
          {PREVISIONES.map((opcion) => <option key={opcion}>{opcion}</option>)}
        </select>
      </div>
      {error && <p className="login-mensaje login-error" role="alert">{error}</p>}
      <div className="panel-admin-form-acciones">
        <button className="perfil-boton" type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar'}</button>
        <button className="perfil-boton perfil-boton-secundario" type="button" onClick={alCancelar}>Cancelar</button>
      </div>
    </form>
  )
}

function PerfilPaciente() {
  const { usuario } = useSesion()
  const { datos: pacienteCargado, cargando, error, recargar } = useCarga(
    () => api.pacientes.obtener(usuario.pacienteId), usuario.pacienteId)
  const [pacienteEditado, setPacienteEditado] = useState(null)
  const [editando, setEditando] = useState(false)
  const [aviso, setAviso] = useState('')
  const paciente = pacienteEditado || pacienteCargado

  return (
    <main className="perfil-pagina-react">
      <section className="perfil-hero-react">
        <span className="etiqueta-seccion">MI CUENTA</span>
        <h1>Perfil del paciente</h1>
        <p>Consulta y actualiza la información de tu ficha.</p>
      </section>

      <EstadoCarga cargando={cargando} error={error} alReintentar={recargar} />

      {paciente && (
        <section className="perfil-tarjeta-react">
          <div className="perfil-datos-react">
            <h2>Mis datos</h2>
            {aviso && <p className="panel-admin-aviso" role="status">{aviso}</p>}
            <dl>
              <div><dt>Nombre</dt><dd>{paciente.nombreCompleto}</dd></div>
              <div><dt>RUT</dt><dd>{mostrarRut(paciente.rut)}</dd></div>
              <div><dt>Correo</dt><dd>{paciente.correo}</dd></div>
              <div><dt>Fecha de nacimiento</dt><dd>{formatearFecha(paciente.fechaNacimiento)}</dd></div>
              <div><dt>Teléfono</dt><dd>{paciente.telefono ? formatearTelefono(paciente.telefono) : 'No registrado'}</dd></div>
              <div><dt>Previsión</dt><dd>{paciente.prevision || 'No indicada'}</dd></div>
            </dl>
            {editando ? (
              <EditarContacto
                paciente={paciente}
                alGuardar={(actualizado) => { setPacienteEditado(actualizado); setEditando(false); setAviso('Tus datos se actualizaron correctamente.') }}
                alCancelar={() => setEditando(false)}
              />
            ) : (
              <button className="perfil-boton perfil-boton-secundario" type="button" onClick={() => { setEditando(true); setAviso('') }}>
                Editar teléfono y previsión
              </button>
            )}
          </div>
          <div className="perfil-acciones-react">
            <Link className="perfil-boton" to="/mis-horas">Mis horas médicas</Link>
            <Link className="perfil-boton perfil-boton-secundario" to="/historial-atenciones">Historial de atenciones</Link>
            <Link className="perfil-boton perfil-boton-secundario" to="/agendar-hora">Agendar una hora</Link>
          </div>
        </section>
      )}
    </main>
  )
}

export default PerfilPaciente
