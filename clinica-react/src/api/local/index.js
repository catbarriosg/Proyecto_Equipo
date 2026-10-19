import { ErrorApi } from '../errores.js'
import { obtenerSesion } from '../sesion.js'
import { asegurarDatos, cifrarContrasena, escribir, leer, siguienteId } from './baseDatos.js'
import {
  DIAS_ANTICIPACION, esReservable, faltanMasDe24Horas, fechaHora, fechaLocal, horariosDelDia, sumarDias,
} from '../../utils/agenda.js'
import { normalizarRut, rutValido } from '../../utils/rut.js'

// Implementación sin backend: mismas funciones, respuestas y reglas que la API real (ver api/http/index.js).

const ESTADOS_ACTIVOS = ['SOLICITADA', 'CONFIRMADA']

const noEncontrado = (mensaje) => new ErrorApi(404, 'NO_ENCONTRADO', mensaje)
const solicitudInvalida = (mensaje) => new ErrorApi(400, 'SOLICITUD_INVALIDA', mensaje)
const conflicto = (mensaje) => new ErrorApi(409, 'CONFLICTO', mensaje)
const prohibido = (mensaje) => new ErrorApi(403, 'ACCESO_DENEGADO', mensaje)
const noAutorizado = (mensaje) => new ErrorApi(401, 'NO_AUTORIZADO', mensaje)

// Envuelve cada operación: carga los datos de ejemplo y devuelve copias para que nadie modifique la base por referencia
function operacion(funcion) {
  return async (...argumentos) => {
    await asegurarDatos()
    return structuredClone(await funcion(...argumentos))
  }
}

function usuarioActual({ obligatorio = true, roles = null } = {}) {
  const usuario = obtenerSesion()?.usuario || null
  if (!usuario && obligatorio) throw noAutorizado('Debes iniciar sesión para realizar esta acción.')
  if (usuario && roles && !roles.includes(usuario.rol)) throw prohibido('Tu cuenta no tiene permisos para realizar esta acción.')
  return usuario
}

function datosPublicos(usuario) {
  const { id, correo, nombre, rol, pacienteId, personalId, activo } = usuario
  return { id, correo, nombre, rol, pacienteId, personalId, activo }
}

function crearSesion(usuario) {
  return { token: `local-${usuario.id}`, expiraEnSegundos: 8 * 60 * 60, usuario: datosPublicos(usuario) }
}

// ------------------------------------------------------------------ Médicos

function medicoPublico(registro, especialidades) {
  const especialidad = especialidades.find((item) => item.nombre === registro.especialidad)
  return {
    id: registro.id, nombre: registro.nombre, especialidad: registro.especialidad, especialidadSlug: especialidad?.slug || null,
    descripcion: registro.descripcion, imagenUrl: registro.imagenUrl, sucursalId: registro.hospitalId, activo: registro.activo,
  }
}

function buscarMedico(id) {
  const registro = leer('personal').find((item) => item.id === Number(id) && item.rol === 'MEDICO' && item.activo)
  if (!registro) throw noEncontrado('El médico seleccionado no existe o no está disponible.')
  return medicoPublico(registro, leer('especialidades'))
}

// ------------------------------------------------------------------ Citas

function tieneAcceso(cita, usuario) {
  if (usuario.rol === 'ADMINISTRADOR') return true
  if (usuario.rol === 'PACIENTE') return cita.pacienteId === usuario.pacienteId
  if (usuario.rol === 'MEDICO') return cita.medicoId === usuario.personalId
  return false
}

function conGestionable(cita, usuario) {
  const activa = ESTADOS_ACTIVOS.includes(cita.estado)
  const gestionable = activa && (usuario.rol === 'PACIENTE'
    ? faltanMasDe24Horas(cita.fecha, cita.hora)
    : fechaHora(cita.fecha, cita.hora) > new Date())
  return { ...cita, gestionable }
}

function buscarCitaConAcceso(id, usuario) {
  const cita = leer('citas').find((item) => item.id === Number(id))
  if (!cita || !tieneAcceso(cita, usuario)) throw noEncontrado('No encontramos la reserva solicitada.')
  return cita
}

function validarHorarioLibre(citas, { medicoId, pacienteId, fecha, hora, citaActual = null }) {
  if (!esReservable(fecha, hora)) {
    throw solicitudInvalida('El horario elegido no está dentro de la atención de la clínica o ya pasó. Elige otro en el calendario.')
  }
  const activas = citas.filter((cita) => ESTADOS_ACTIVOS.includes(cita.estado) && cita.id !== citaActual)
  if (activas.some((cita) => cita.medicoId === medicoId && cita.fecha === fecha && cita.hora === hora)) {
    throw conflicto('Ese horario ya fue reservado. Elige otro horario disponible.')
  }
  if (activas.some((cita) => cita.pacienteId === pacienteId && cita.fecha === fecha && cita.hora === hora)) {
    throw conflicto('El paciente ya tiene otra hora agendada en ese mismo horario.')
  }
}

function exigirGestionable(cita, usuario, accion) {
  if (!ESTADOS_ACTIVOS.includes(cita.estado)) {
    throw solicitudInvalida(`Esta reserva está ${cita.estado.toLowerCase()} y no se puede ${accion}.`)
  }
  if (usuario.rol === 'PACIENTE' && !faltanMasDe24Horas(cita.fecha, cita.hora)) {
    throw solicitudInvalida(`Las horas se pueden ${accion} con al menos 24 horas de anticipación. Comunícate con la clínica.`)
  }
}

function guardarCita(citaActualizada) {
  const citas = leer('citas').map((cita) => (cita.id === citaActualizada.id ? citaActualizada : cita))
  escribir('citas', citas)
  return citaActualizada
}

function resolverPaciente(usuario, rutPaciente) {
  const pacientes = leer('pacientes')
  let paciente
  if (usuario.rol === 'PACIENTE') {
    paciente = pacientes.find((item) => item.id === usuario.pacienteId)
  } else {
    if (!rutPaciente) throw solicitudInvalida('Ingresa el RUT del paciente.')
    paciente = pacientes.find((item) => item.rut === normalizarRut(rutPaciente))
    if (!paciente) throw noEncontrado('No encontramos un paciente con ese RUT. El paciente debe registrarse o ser ingresado por la administración.')
  }
  if (!paciente?.activo) throw solicitudInvalida('La ficha del paciente está inactiva. Comunícate con la clínica.')
  return paciente
}

// ------------------------------------------------------------------ Pacientes

function verificarAccesoPaciente(id) {
  const usuario = usuarioActual()
  if (usuario.rol === 'PACIENTE' && usuario.pacienteId !== Number(id)) {
    throw prohibido('Solo puedes acceder a tu propia ficha de paciente.')
  }
}

function crearFichaPaciente(datos) {
  const rut = normalizarRut(datos.rut)
  if (!rutValido(rut)) throw solicitudInvalida(`El RUT ${rut} no es válido: revisa el dígito verificador.`)
  const pacientes = leer('pacientes')
  if (pacientes.some((item) => item.rut === rut)) throw conflicto(`Ya existe un paciente registrado con el RUT ${rut}.`)
  const paciente = {
    id: siguienteId(pacientes), rut, nombreCompleto: datos.nombreCompleto.trim(), correo: datos.correo.trim().toLowerCase(),
    fechaNacimiento: datos.fechaNacimiento, prevision: datos.prevision || null, telefono: datos.telefono || null, activo: true,
  }
  escribir('pacientes', [...pacientes, paciente])
  return paciente
}

// ------------------------------------------------------------------ API

export const apiLocal = {
  auth: {
    login: operacion(async ({ correo, contrasena, rol }) => {
      const correoNormalizado = correo.trim().toLowerCase()
      const usuario = leer('usuarios').find((item) => item.correo === correoNormalizado)
      if (!usuario || usuario.contrasenaHash !== await cifrarContrasena(contrasena, correoNormalizado)) {
        throw noAutorizado('Correo o contraseña incorrectos.')
      }
      if (!usuario.activo) throw prohibido('Tu cuenta está desactivada. Comunícate con la clínica.')
      if (rol && rol !== usuario.rol) {
        throw prohibido(usuario.rol === 'PACIENTE'
          ? 'Esta cuenta es de paciente. Ingresa desde el acceso de pacientes.'
          : 'Estas credenciales no corresponden a este acceso.')
      }
      return crearSesion(usuario)
    }),

    registrar: operacion(async (datos) => {
      const correo = datos.correo.trim().toLowerCase()
      const usuarios = leer('usuarios')
      if (usuarios.some((item) => item.correo === correo)) {
        throw conflicto('Este correo ya está registrado. Inicia sesión o usa otro correo.')
      }
      const nombreCompleto = `${datos.nombre.trim()} ${datos.apellido.trim()}`
      const existente = leer('pacientes').find((item) => item.rut === normalizarRut(datos.rut))
      let paciente
      if (existente) {
        if (existente.correo !== correo || usuarios.some((item) => item.pacienteId === existente.id)) {
          throw conflicto('Ya existe un paciente registrado con ese RUT. Si es tuyo, inicia sesión o comunícate con la clínica.')
        }
        paciente = existente
      } else {
        paciente = crearFichaPaciente({ ...datos, correo, nombreCompleto })
      }
      const usuario = {
        id: siguienteId(usuarios), correo, contrasenaHash: await cifrarContrasena(datos.contrasena, correo), rol: 'PACIENTE',
        nombre: nombreCompleto, pacienteId: paciente.id, personalId: null, activo: true,
      }
      escribir('usuarios', [...usuarios, usuario])
      return crearSesion(usuario)
    }),

    crearCuenta: operacion(async (datos) => {
      usuarioActual({ roles: ['ADMINISTRADOR'] })
      const correo = datos.correo.trim().toLowerCase()
      const usuarios = leer('usuarios')
      if (usuarios.some((item) => item.correo === correo)) throw conflicto('Ya existe una cuenta con ese correo.')
      if (datos.personalId && usuarios.some((item) => item.personalId === datos.personalId)) {
        throw conflicto('Ese profesional ya tiene una cuenta.')
      }
      const usuario = {
        id: siguienteId(usuarios), correo, contrasenaHash: await cifrarContrasena(datos.contrasena, correo), rol: datos.rol,
        nombre: datos.nombre.trim(), pacienteId: datos.pacienteId || null, personalId: datos.personalId || null, activo: true,
      }
      escribir('usuarios', [...usuarios, usuario])
      return datosPublicos(usuario)
    }),
  },

  especialidades: {
    listar: operacion(() => leer('especialidades').filter((item) => item.activa)
      .sort((a, b) => a.nombre.localeCompare(b.nombre))),
  },

  medicos: {
    listar: operacion(({ especialidad, sucursalId } = {}) => {
      const especialidades = leer('especialidades')
      const buscada = especialidad
        ? (especialidades.find((item) => item.slug === especialidad || item.nombre.toLowerCase() === especialidad.toLowerCase())?.nombre || especialidad)
        : null
      return leer('personal')
        .filter((item) => item.rol === 'MEDICO' && item.activo)
        .filter((item) => !buscada || item.especialidad === buscada)
        .filter((item) => !sucursalId || item.hospitalId === Number(sucursalId))
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .map((item) => medicoPublico(item, especialidades))
    }),
    obtener: operacion((id) => buscarMedico(id)),
  },

  sucursales: {
    listar: operacion(() => leer('sucursales')),
  },

  citas: {
    listar: operacion(({ estado } = {}) => {
      const usuario = usuarioActual()
      return leer('citas')
        .filter((cita) => tieneAcceso(cita, usuario))
        .filter((cita) => !estado || cita.estado === estado)
        .sort((a, b) => `${b.fecha}${b.hora}`.localeCompare(`${a.fecha}${a.hora}`))
        .map((cita) => conGestionable(cita, usuario))
    }),

    obtenerPorCodigo: operacion((codigo) => {
      const usuario = usuarioActual()
      const cita = leer('citas').find((item) => item.codigo.toUpperCase() === codigo.trim().toUpperCase())
      if (!cita || !tieneAcceso(cita, usuario)) {
        throw noEncontrado('No encontramos una reserva con ese código. Revisa Mis horas médicas.')
      }
      return conGestionable(cita, usuario)
    }),

    disponibilidad: operacion(({ medicoId, desde, hasta, excluirCitaId }) => {
      buscarMedico(medicoId)
      const hoy = fechaLocal(new Date())
      const limite = fechaLocal(sumarDias(new Date(), DIAS_ANTICIPACION))
      const inicio = !desde || desde < hoy ? hoy : desde
      const fin = !hasta ? fechaLocal(sumarDias(new Date(`${inicio}T12:00:00`), 6)) : (hasta > limite ? limite : hasta)
      const ocupadas = leer('citas').filter((cita) => cita.medicoId === Number(medicoId)
        && ESTADOS_ACTIVOS.includes(cita.estado) && cita.id !== Number(excluirCitaId))
      const dias = []
      for (let dia = new Date(`${inicio}T12:00:00`); fechaLocal(dia) <= fin; dia = sumarDias(dia, 1)) {
        const fecha = fechaLocal(dia)
        const tomadas = ocupadas.filter((cita) => cita.fecha === fecha).map((cita) => cita.hora)
        dias.push({ fecha, horas: horariosDelDia(fecha).filter((hora) => !tomadas.includes(hora)) })
      }
      return dias
    }),

    crear: operacion(({ medicoId, fecha, hora, motivo, rutPaciente }) => {
      const usuario = usuarioActual()
      const medico = buscarMedico(medicoId)
      if (usuario.rol === 'MEDICO' && medico.id !== usuario.personalId) {
        throw prohibido('Solo puedes agendar horas en tu propia agenda.')
      }
      const paciente = resolverPaciente(usuario, rutPaciente)
      const citas = leer('citas')
      validarHorarioLibre(citas, { medicoId: medico.id, pacienteId: paciente.id, fecha, hora })
      const id = siguienteId(citas)
      const cita = {
        id, codigo: `AM-${String(id).padStart(6, '0')}`,
        pacienteId: paciente.id, pacienteNombre: paciente.nombreCompleto, pacienteRut: paciente.rut, pacienteCorreo: paciente.correo,
        medicoId: medico.id, medicoNombre: medico.nombre, especialidad: medico.especialidad, sucursalId: medico.sucursalId,
        fecha, hora, estado: 'CONFIRMADA', motivo: motivo?.trim() || null, creadoEn: new Date().toISOString(),
      }
      escribir('citas', [...citas, cita])
      return conGestionable(cita, usuario)
    }),

    reprogramar: operacion((id, { fecha, hora }) => {
      const usuario = usuarioActual()
      const cita = buscarCitaConAcceso(id, usuario)
      exigirGestionable(cita, usuario, 'modificar')
      if (cita.fecha === fecha && cita.hora === hora) {
        throw solicitudInvalida('Elegiste la misma fecha y hora de tu reserva actual.')
      }
      validarHorarioLibre(leer('citas'), { medicoId: cita.medicoId, pacienteId: cita.pacienteId, fecha, hora, citaActual: cita.id })
      return conGestionable(guardarCita({ ...cita, fecha, hora }), usuario)
    }),

    cancelar: operacion((id) => {
      const usuario = usuarioActual()
      const cita = buscarCitaConAcceso(id, usuario)
      exigirGestionable(cita, usuario, 'cancelar')
      return conGestionable(guardarCita({ ...cita, estado: 'CANCELADA' }), usuario)
    }),

    cambiarEstado: operacion((id, estado) => {
      const usuario = usuarioActual({ roles: ['MEDICO', 'ADMINISTRADOR'] })
      const cita = buscarCitaConAcceso(id, usuario)
      if (!ESTADOS_ACTIVOS.includes(cita.estado)) {
        throw solicitudInvalida(`La cita ya está ${cita.estado.toLowerCase()} y no se puede cambiar.`)
      }
      return conGestionable(guardarCita({ ...cita, estado }), usuario)
    }),
  },

  pacientes: {
    listar: operacion(({ incluirInactivos = false } = {}) => {
      usuarioActual({ roles: ['MEDICO', 'ADMINISTRADOR'] })
      return leer('pacientes').filter((item) => incluirInactivos || item.activo)
    }),
    obtener: operacion((id) => {
      verificarAccesoPaciente(id)
      const paciente = leer('pacientes').find((item) => item.id === Number(id))
      if (!paciente) throw noEncontrado(`No encontramos al paciente con ID ${id}.`)
      return paciente
    }),
    crear: operacion((datos) => {
      usuarioActual({ roles: ['ADMINISTRADOR'] })
      return crearFichaPaciente(datos)
    }),
    actualizar: operacion((id, datos) => {
      verificarAccesoPaciente(id)
      const pacientes = leer('pacientes')
      const paciente = pacientes.find((item) => item.id === Number(id))
      if (!paciente) throw noEncontrado(`No encontramos al paciente con ID ${id}.`)
      const actualizado = {
        ...paciente, nombreCompleto: datos.nombreCompleto.trim(), correo: datos.correo.trim().toLowerCase(),
        fechaNacimiento: datos.fechaNacimiento, prevision: datos.prevision || null, telefono: datos.telefono || null,
      }
      escribir('pacientes', pacientes.map((item) => (item.id === actualizado.id ? actualizado : item)))
      return actualizado
    }),
    cambiarEstado: operacion((id, activo) => {
      usuarioActual({ roles: ['ADMINISTRADOR'] })
      const pacientes = leer('pacientes')
      const paciente = pacientes.find((item) => item.id === Number(id))
      if (!paciente) throw noEncontrado(`No encontramos al paciente con ID ${id}.`)
      const actualizado = { ...paciente, activo }
      escribir('pacientes', pacientes.map((item) => (item.id === actualizado.id ? actualizado : item)))
      return actualizado
    }),
  },

  personal: {
    listar: operacion(({ incluirInactivos = false } = {}) => {
      usuarioActual({ roles: ['ADMINISTRADOR'] })
      return leer('personal').filter((item) => incluirInactivos || item.activo)
    }),
    crear: operacion((datos) => {
      usuarioActual({ roles: ['ADMINISTRADOR'] })
      const registros = leer('personal')
      if (registros.some((item) => item.rut === datos.rut)) throw conflicto('Ya existe un profesional con ese RUT.')
      if (registros.some((item) => item.email === datos.email)) throw conflicto('Ya existe un profesional con ese correo.')
      const registro = { ...datos, id: siguienteId(registros), activo: true }
      escribir('personal', [...registros, registro])
      return registro
    }),
    cambiarEstado: operacion((id, activo) => {
      usuarioActual({ roles: ['ADMINISTRADOR'] })
      const registros = leer('personal')
      const registro = registros.find((item) => item.id === Number(id))
      if (!registro) throw noEncontrado(`Personal con ID ${id} no encontrado`)
      const actualizado = { ...registro, activo }
      escribir('personal', registros.map((item) => (item.id === actualizado.id ? actualizado : item)))
      return actualizado
    }),
  },

  historial: {
    porPaciente: operacion((idPaciente) => {
      const usuario = usuarioActual()
      if (usuario.rol === 'PACIENTE' && usuario.pacienteId !== Number(idPaciente)) {
        throw prohibido('Solo puedes consultar tu propio historial de atenciones.')
      }
      return leer('historial')
        .filter((item) => item.idPaciente === Number(idPaciente))
        .sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''))
    }),
  },
}
