import { solicitar } from './cliente.js'

// Implementación que conversa con el backend (gateway en /api)
export const apiHttp = {
  auth: {
    login: (datos) => solicitar('/api/auth/login', { metodo: 'POST', cuerpo: datos }),
    registrar: (datos) => solicitar('/api/auth/registro', { metodo: 'POST', cuerpo: datos }),
    crearCuenta: (datos) => solicitar('/api/auth/usuarios', { metodo: 'POST', cuerpo: datos }),
  },

  especialidades: {
    listar: () => solicitar('/api/especialidades'),
  },

  medicos: {
    listar: (filtros = {}) => solicitar('/api/medicos', { parametros: filtros }),
    obtener: (id) => solicitar(`/api/medicos/${id}`),
  },

  sucursales: {
    listar: () => solicitar('/api/sucursales'),
  },

  citas: {
    listar: (filtros = {}) => solicitar('/api/citas', { parametros: filtros }),
    obtenerPorCodigo: (codigo) => solicitar(`/api/citas/codigo/${encodeURIComponent(codigo.trim())}`),
    disponibilidad: (filtros) => solicitar('/api/citas/disponibilidad', { parametros: filtros }),
    crear: (datos) => solicitar('/api/citas', { metodo: 'POST', cuerpo: datos }),
    reprogramar: (id, datos) => solicitar(`/api/citas/${id}/reprogramar`, { metodo: 'PUT', cuerpo: datos }),
    cancelar: (id) => solicitar(`/api/citas/${id}/cancelar`, { metodo: 'PATCH' }),
    cambiarEstado: (id, estado) => solicitar(`/api/citas/${id}/estado`, { metodo: 'PATCH', cuerpo: { estado } }),
  },

  pacientes: {
    listar: ({ incluirInactivos = false } = {}) => solicitar('/api/pacientes', { parametros: { incluirInactivos } }),
    obtener: (id) => solicitar(`/api/pacientes/id/${id}`),
    crear: (datos) => solicitar('/api/pacientes', { metodo: 'POST', cuerpo: datos }),
    actualizar: (id, datos) => solicitar(`/api/pacientes/${id}`, { metodo: 'PUT', cuerpo: datos }),
    cambiarEstado: (id, activo) => solicitar(`/api/pacientes/${id}/estado`, { metodo: 'PATCH', cuerpo: { activo } }),
  },

  personal: {
    listar: ({ incluirInactivos = false } = {}) => solicitar('/api/personal', { parametros: { incluirInactivos } }),
    crear: (datos) => solicitar('/api/personal', { metodo: 'POST', cuerpo: datos }),
    cambiarEstado: (id, activo) => solicitar(`/api/personal/${id}/estado`, { metodo: 'PATCH', cuerpo: { activo } }),
  },

  historial: {
    porPaciente: (idPaciente) => solicitar(`/api/historial/paciente/${idPaciente}`),
  },
}
