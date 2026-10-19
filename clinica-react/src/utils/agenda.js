// Reglas del horario de la clínica (las mismas que aplica ms-citas en el backend):
// lunes a viernes 08:00-19:30, sábado 09:00-13:30, domingo cerrado, bloques de 30 minutos.
export const DIAS_ANTICIPACION = 90
export const HORAS_MINIMAS_GESTION = 24

export function fechaLocal(fecha) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

export function sumarDias(fecha, cantidad) {
  const resultado = new Date(fecha)
  resultado.setDate(resultado.getDate() + cantidad)
  return resultado
}

// "2026-11-05" -> Date a mediodía (evita saltos de día por zona horaria)
export function aFecha(valor) {
  return new Date(`${valor}T12:00:00`)
}

export function fechaHora(fecha, hora) {
  return new Date(`${fecha}T${hora}:00`)
}

/** Bloques de atención de un día ("HH:mm"). Si el día es hoy, solo los que aún no pasan. */
export function horariosDelDia(valorFecha, ahora = new Date()) {
  const fecha = aFecha(valorFecha)
  if (fecha.getDay() === 0) return []
  const esSabado = fecha.getDay() === 6
  const inicio = esSabado ? 9 * 60 : 8 * 60
  const fin = esSabado ? 13 * 60 + 30 : 19 * 60 + 30
  const horarios = []
  for (let minutos = inicio; minutos <= fin; minutos += 30) {
    const hora = `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`
    if (fechaHora(valorFecha, hora) > ahora) horarios.push(hora)
  }
  return horarios
}

export function esReservable(fecha, hora, ahora = new Date()) {
  const hoy = fechaLocal(ahora)
  const limite = fechaLocal(sumarDias(ahora, DIAS_ANTICIPACION))
  return fecha >= hoy && fecha <= limite && horariosDelDia(fecha, ahora).includes(hora)
}

export function faltanMasDe24Horas(fecha, hora, ahora = new Date()) {
  return fechaHora(fecha, hora) - ahora > HORAS_MINIMAS_GESTION * 60 * 60 * 1000
}
