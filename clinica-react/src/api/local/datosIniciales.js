import { fechaLocal, sumarDias } from '../../utils/agenda.js'

// Datos de ejemplo de la base simulada. Son los mismos que carga el backend en init-scripts/01-smarthealth-init.sql.

export const especialidades = [
  { id: 1, nombre: 'Medicina General', slug: 'medicina-general', icono: '🩺', descripcion: 'Atención médica integral para la prevención, diagnóstico y tratamiento de distintas condiciones de salud.', activa: true },
  { id: 2, nombre: 'Pediatría', slug: 'pediatria', icono: '👶', descripcion: 'Atención médica especializada para niños y adolescentes, acompañando su crecimiento y desarrollo.', activa: true },
  { id: 3, nombre: 'Ginecología', slug: 'ginecologia', icono: '🌸', descripcion: 'Atención y cuidado integral de la salud de la mujer en las distintas etapas de su vida.', activa: true },
  { id: 4, nombre: 'Cardiología', slug: 'cardiologia', icono: '❤️', descripcion: 'Prevención, diagnóstico y tratamiento de enfermedades relacionadas con el corazón y el sistema cardiovascular.', activa: true },
  { id: 5, nombre: 'Traumatología', slug: 'traumatologia', icono: '🦴', descripcion: 'Atención de lesiones y enfermedades relacionadas con huesos, articulaciones y músculos.', activa: true },
  { id: 6, nombre: 'Dermatología', slug: 'dermatologia', icono: '🧴', descripcion: 'Evaluación, diagnóstico y tratamiento de enfermedades de la piel, el cabello y las uñas.', activa: true },
]

export const sucursales = [
  { id: 1, nombre: 'Santiago Centro', direccion: 'Av. Salud 1234, Santiago', comuna: 'Santiago', region: 'Metropolitana', telefono: '+56223456789', correo: 'santiago.centro@clinicaagendamedica.cl', horario: ['Lunes a viernes: 08:00 a 20:00', 'Sábados: 09:00 a 14:00'], imagenUrl: '/fachada-clinica.png', descripcionImagen: 'Fachada de la sucursal Santiago Centro' },
  { id: 2, nombre: 'Providencia', direccion: 'Av. Providencia 2456, Providencia', comuna: 'Providencia', region: 'Metropolitana', telefono: '+56223456790', correo: 'providencia@clinicaagendamedica.cl', horario: ['Lunes a viernes: 08:00 a 19:00', 'Sábados: 09:00 a 13:00'], imagenUrl: '/recepcion-clinica.png', descripcionImagen: 'Recepción de la sucursal Providencia' },
  { id: 3, nombre: 'Maipú', direccion: 'Av. Pajaritos 3210, Maipú', comuna: 'Maipú', region: 'Metropolitana', telefono: '+56223456791', correo: 'maipu@clinicaagendamedica.cl', horario: ['Lunes a viernes: 08:30 a 18:30', 'Sábados: cerrado'], imagenUrl: '/sala-espera.png', descripcionImagen: 'Sala de espera de la sucursal Maipú' },
  { id: 4, nombre: 'La Florida', direccion: 'Av. Vicuña Mackenna 7890, La Florida', comuna: 'La Florida', region: 'Metropolitana', telefono: '+56223456792', correo: 'laflorida@clinicaagendamedica.cl', horario: ['Lunes a viernes: 09:00 a 19:00', 'Sábados: 09:00 a 14:00'], imagenUrl: '/box-clinica.png', descripcionImagen: 'Box de atención de la sucursal La Florida' },
]

const medico = (id, nombre, rut, email, especialidad, hospitalId, descripcion, imagenUrl) => ({
  id, nombre, rut, email, telefono: `+5691234568${id - 1}`, rol: 'MEDICO', especialidad, departamento: 'Consulta ambulatoria',
  hospitalId, descripcion, imagenUrl, activo: true,
})

export const personal = [
  medico(1, 'Dr. Juan Pérez', '13579246-2', 'dr.juan@clinica.cl', 'Medicina General', 1, 'Atención médica integral para la prevención, diagnóstico y tratamiento de distintas condiciones de salud.', '/logo-hombre.png'),
  medico(2, 'Dra. María González', '14680357-1', 'dra.maria@clinica.cl', 'Pediatría', 2, 'Atención médica especializada para niños y adolescentes, acompañando su crecimiento y desarrollo.', '/logo-mujer.png'),
  medico(3, 'Dr. Carlos Rodríguez', '12457896-5', 'dr.carlos@clinica.cl', 'Cardiología', 1, 'Prevención, diagnóstico y tratamiento de enfermedades relacionadas con el corazón.', '/logo-hombre.png'),
  medico(4, 'Dra. Ana Martínez', '17654321-3', 'dra.ana@clinica.cl', 'Ginecología', 3, 'Atención y cuidado integral de la salud de la mujer en las distintas etapas de su vida.', '/logo-mujer.png'),
  medico(5, 'Dr. Felipe Soto', '18765432-7', 'dr.felipe@clinica.cl', 'Traumatología', 4, 'Atención de lesiones y enfermedades relacionadas con huesos, articulaciones y músculos.', '/logo-hombre.png'),
  medico(6, 'Dra. Camila Rojas', '11222333-9', 'dra.camila@clinica.cl', 'Dermatología', 2, 'Evaluación y atención de enfermedades de la piel, cabello y uñas.', '/logo-mujer.png'),
]

export const pacientes = [
  { id: 1, rut: '16543210-K', nombreCompleto: 'Ana Pérez', correo: 'ana.perez@gmail.com', fechaNacimiento: '1990-04-12', prevision: 'Fonasa', telefono: '+56987654321', activo: true },
  { id: 2, rut: '15432109-8', nombreCompleto: 'Carlos Soto', correo: 'carlos.soto@gmail.com', fechaNacimiento: '1985-09-03', prevision: 'Isapre Colmena', telefono: '+56987654322', activo: true },
]

// Las contraseñas se cifran al cargar la base (ver baseDatos.js)
export const cuentas = [
  { id: 1, correo: 'admin@clinica.cl', contrasena: 'Admin123!', rol: 'ADMINISTRADOR', nombre: 'Administración Clínica', pacienteId: null, personalId: null },
  { id: 2, correo: 'dr.juan@clinica.cl', contrasena: 'Medico123!', rol: 'MEDICO', nombre: 'Dr. Juan Pérez', pacienteId: null, personalId: 1 },
  { id: 3, correo: 'dra.maria@clinica.cl', contrasena: 'Medico123!', rol: 'MEDICO', nombre: 'Dra. María González', pacienteId: null, personalId: 2 },
  { id: 4, correo: 'ana.perez@gmail.com', contrasena: 'Paciente123!', rol: 'PACIENTE', nombre: 'Ana Pérez', pacienteId: 1, personalId: null },
]

// Fecha relativa a hoy; si cae domingo se mueve al lunes
function diasDesdeHoy(dias) {
  const fecha = sumarDias(new Date(), dias)
  if (dias > 0 && fecha.getDay() === 0) fecha.setDate(fecha.getDate() + 1)
  return fechaLocal(fecha)
}

export function crearCitasIniciales() {
  const cita = (id, paciente, medicoId, fecha, hora, estado, motivo) => {
    const profesional = personal.find((item) => item.id === medicoId)
    return {
      id, codigo: `AM-${String(id).padStart(6, '0')}`,
      pacienteId: paciente.id, pacienteNombre: paciente.nombreCompleto, pacienteRut: paciente.rut, pacienteCorreo: paciente.correo,
      medicoId, medicoNombre: profesional.nombre, especialidad: profesional.especialidad, sucursalId: profesional.hospitalId,
      fecha, hora, estado, motivo, creadoEn: new Date().toISOString(),
    }
  }
  const [ana, carlos] = pacientes
  return [
    cita(1, ana, 1, diasDesdeHoy(10), '10:00', 'CONFIRMADA', 'Control anual'),
    cita(2, ana, 3, diasDesdeHoy(-30), '10:30', 'ATENDIDA', 'Control cardiovascular'),
    cita(3, carlos, 2, diasDesdeHoy(12), '11:00', 'CONFIRMADA', 'Control de niño sano'),
    cita(4, ana, 6, diasDesdeHoy(5), '12:30', 'CANCELADA', 'Revisión de lunar'),
  ]
}

export function crearHistorialInicial() {
  return [
    { id: 1, idPaciente: 1, fecha: '2026-08-15', especialidad: 'Medicina General', idMedico: 1, medicoNombre: 'Dr. Juan Pérez', motivo: 'Control médico general', diagnostico: 'Estado de salud general estable', tratamiento: 'Mantener controles médicos periódicos.', idCita: null },
    { id: 2, idPaciente: 1, fecha: diasDesdeHoy(-30), especialidad: 'Cardiología', idMedico: 3, medicoNombre: 'Dr. Carlos Rodríguez', motivo: 'Control cardiovascular', diagnostico: 'Control sin observaciones relevantes', tratamiento: 'Continuar controles según indicación médica.', idCita: 2 },
  ]
}
