import { useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { api, mensajeDeError } from './api/index.js'
import EstadoCarga from './components/EstadoCarga.jsx'
import { useSesion } from './context/useSesion.js'
import { useCarga } from './hooks/useCarga.js'
import { fechaLocal } from './utils/agenda.js'
import { estadoLegible, formatearFecha } from './utils/formato.js'

const estiloAlerta = {
  customClass: { popup: 'clinica-swal-popup', confirmButton: 'clinica-swal-confirm', cancelButton: 'clinica-swal-cancel' },
  buttonsStyling: false
}

const TITULOS = {
  PACIENTE: { titulo: 'Mis horas médicas', descripcion: 'Revisa, modifica o cancela tus horas agendadas.' },
  MEDICO: { titulo: 'Mi agenda', descripcion: 'Horas agendadas con tus pacientes.' },
  ADMINISTRADOR: { titulo: 'Horas agendadas', descripcion: 'Todas las horas médicas de la clínica.' },
}

function MisHoras() {
  const { usuario } = useSesion()
  const esPaciente = usuario.rol === 'PACIENTE'
  const { datos: citasCargadas, cargando, error, recargar } = useCarga(() => api.citas.listar(), `citas-${usuario.id}`)
  const [actualizadas, setActualizadas] = useState({})
  const [filtroEstado, setFiltroEstado] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const textos = TITULOS[usuario.rol]
  const hoy = fechaLocal(new Date())

  // Las citas que cambian de estado se reemplazan sin volver a cargar toda la lista
  const citas = (citasCargadas || []).map((cita) => actualizadas[cita.id] || cita)
  const termino = busqueda.trim().toLowerCase()
  const citasFiltradas = citas
    .filter((cita) => !filtroEstado || cita.estado === filtroEstado)
    .filter((cita) => !termino || [cita.codigo, cita.pacienteNombre, cita.medicoNombre, cita.especialidad]
      .some((valor) => valor?.toLowerCase().includes(termino)))

  async function marcarAtendida(cita) {
    const respuesta = await Swal.fire({
      ...estiloAlerta, icon: 'question', title: '¿Marcar la hora como atendida?',
      text: `${cita.pacienteNombre} · ${formatearFecha(cita.fecha)} ${cita.hora}`,
      showCancelButton: true, confirmButtonText: 'Sí, marcar atendida', cancelButtonText: 'Volver', reverseButtons: true,
    })
    if (!respuesta.isConfirmed) return
    try {
      const actualizada = await api.citas.cambiarEstado(cita.id, 'ATENDIDA')
      setActualizadas((actuales) => ({ ...actuales, [cita.id]: actualizada }))
    } catch (errorEstado) {
      await Swal.fire({ ...estiloAlerta, icon: 'error', title: 'No se pudo actualizar', text: mensajeDeError(errorEstado), confirmButtonText: 'Entendido' })
    }
  }

  return (
    <main className="pagina-mis-horas">
      <header className="mis-horas-hero">
        <h1>{textos.titulo}</h1>
        <p>{textos.descripcion}</p>
      </header>

      <EstadoCarga cargando={cargando} error={error} alReintentar={recargar} />

      {citasCargadas && (
        <>
          <form className="filtros-lista" role="search" onSubmit={(evento) => evento.preventDefault()}>
            <div className="login-campo">
              <label htmlFor="buscar-hora">Buscar</label>
              <input id="buscar-hora" type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                placeholder={esPaciente ? 'Código, médico o especialidad' : 'Código, paciente, médico o especialidad'} />
            </div>
            <div className="login-campo">
              <label htmlFor="filtro-estado">Estado</label>
              <select id="filtro-estado" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                <option value="">Todos</option>
                <option value="CONFIRMADA">Confirmadas</option>
                <option value="ATENDIDA">Atendidas</option>
                <option value="CANCELADA">Canceladas</option>
              </select>
            </div>
            <Link className="perfil-boton" to="/agendar-hora">＋ Agendar hora</Link>
          </form>

          {citasFiltradas.length === 0 ? (
            <p className="estado-vacio">{citas.length === 0 ? 'No hay horas médicas registradas.' : 'Ninguna hora coincide con la búsqueda.'}</p>
          ) : (
            <ul className="lista-horas">
              {citasFiltradas.map((cita) => {
                const activa = cita.estado === 'CONFIRMADA' || cita.estado === 'SOLICITADA'
                return (
                  <li key={cita.id} className="tarjeta-hora">
                    <div className="contenido-hora">
                      <div className="datos-hora">
                        <p><strong>Código de reserva:</strong> {cita.codigo}</p>
                        {!esPaciente && <p><strong>Paciente:</strong> {cita.pacienteNombre}</p>}
                        <p><strong>Médico:</strong> {cita.medicoNombre}</p>
                        <p><strong>Especialidad:</strong> {cita.especialidad}</p>
                        <p><strong>Fecha:</strong> {formatearFecha(cita.fecha)} a las {cita.hora}</p>
                        {cita.motivo && <p><strong>Motivo:</strong> {cita.motivo}</p>}
                        <p><strong>Estado:</strong> <span className={`panel-estado ${activa || cita.estado === 'ATENDIDA' ? 'panel-activo' : 'panel-inactivo'}`}>{estadoLegible(cita.estado)}</span></p>
                        {esPaciente && activa && !cita.gestionable && (
                          <p className="agenda-ayuda">Faltan menos de 24 horas: para cambios, comunícate con la clínica.</p>
                        )}
                      </div>
                      <div className="acciones-hora">
                        {cita.gestionable && (
                          <>
                            <Link className="accion-link-hora accion-link-modificar" to={`/modificar-hora?codigo=${encodeURIComponent(cita.codigo)}`}>Modificar hora</Link>
                            <Link className="accion-link-hora" to={`/cancelar-hora?codigo=${encodeURIComponent(cita.codigo)}`}>Cancelar hora</Link>
                          </>
                        )}
                        {!esPaciente && activa && cita.fecha <= hoy && (
                          <button type="button" onClick={() => marcarAtendida(cita)}>Marcar atendida</button>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </main>
  )
}

export default MisHoras
