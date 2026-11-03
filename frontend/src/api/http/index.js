import { solicitar } from './cliente.js'

// Implementación que conversa con el backend (gateway en /api)
// Cada grupo corresponde a un microservicio; cada método es un endpoint REST.
export const apiHttp = {
  // ms-auth: inicio de sesión, registro de pacientes y creación de cuentas por el administrador
  auth: {
    login: (datos) => solicitar('/api/auth/login', { metodo: 'POST', cuerpo: datos }),
    registrar: (datos) => solicitar('/api/auth/registro', { metodo: 'POST', cuerpo: datos }),
    crearCuenta: (datos) => solicitar('/api/auth/usuarios', { metodo: 'POST', cuerpo: datos }),
  },

  // ms-personal: catálogo de especialidades médicas
  especialidades: {
    listar: () => solicitar('/api/especialidades'),
  },

  // ms-personal: médicos de la clínica (se pueden filtrar por especialidad o sucursal)
  medicos: {
    listar: (filtros = {}) => solicitar('/api/medicos', { parametros: filtros }),
    obtener: (id) => solicitar(`/api/medicos/${id}`),
  },

  // ms-hospitales: sedes de la clínica
  sucursales: {
    listar: () => solicitar('/api/sucursales'),
  },

  // ms-citas: agenda de horas médicas
  citas: {
    listar: (filtros = {}) => solicitar('/api/citas', { parametros: filtros }),
    obtenerPorCodigo: (codigo) => solicitar(`/api/citas/codigo/${encodeURIComponent(codigo.trim())}`),
    disponibilidad: (filtros) => solicitar('/api/citas/disponibilidad', { parametros: filtros }),
    crear: (datos) => solicitar('/api/citas', { metodo: 'POST', cuerpo: datos }),
    reprogramar: (id, datos) => solicitar(`/api/citas/${id}/reprogramar`, { metodo: 'PUT', cuerpo: datos }),
    cancelar: (id) => solicitar(`/api/citas/${id}/cancelar`, { metodo: 'PATCH' }),
    cambiarEstado: (id, estado) => solicitar(`/api/citas/${id}/estado`, { metodo: 'PATCH', cuerpo: { estado } }),
  },

  // ms-pacientes: fichas de los pacientes
  pacientes: {
    listar: ({ incluirInactivos = false } = {}) => solicitar('/api/pacientes', { parametros: { incluirInactivos } }),
    obtener: (id) => solicitar(`/api/pacientes/id/${id}`),
    crear: (datos) => solicitar('/api/pacientes', { metodo: 'POST', cuerpo: datos }),
    actualizar: (id, datos) => solicitar(`/api/pacientes/${id}`, { metodo: 'PUT', cuerpo: datos }),
    cambiarEstado: (id, activo) => solicitar(`/api/pacientes/${id}/estado`, { metodo: 'PATCH', cuerpo: { activo } }),
  },

  // ms-personal: profesionales y funcionarios de la clínica (panel de administración)
  personal: {
    listar: ({ incluirInactivos = false } = {}) => solicitar('/api/personal', { parametros: { incluirInactivos } }),
    crear: (datos) => solicitar('/api/personal', { metodo: 'POST', cuerpo: datos }),
    cambiarEstado: (id, activo) => solicitar(`/api/personal/${id}/estado`, { metodo: 'PATCH', cuerpo: { activo } }),
  },

  // ms-historial: atenciones registradas de un paciente
  historial: {
    porPaciente: (idPaciente) => solicitar(`/api/historial/paciente/${idPaciente}`),
  },
}
