// RUT chileno: el backend lo recibe sin puntos (12345678-5) y en pantalla se muestra con puntos (12.345.678-5).

export function limpiarRut(valor = '') {
  return valor.replace(/[^0-9kK]/g, '').toUpperCase()
}

/** "12.345.678-5", "123456785" o "12345678-5" -> "12345678-5" */
export function normalizarRut(valor = '') {
  const limpio = limpiarRut(valor)
  if (limpio.length < 2) return limpio
  return `${limpio.slice(0, -1)}-${limpio.slice(-1)}`
}

/** "123456785" -> "12.345.678-5" (para mostrar mientras se escribe) */
export function formatearRut(valor = '') {
  const limpio = limpiarRut(valor)
  if (limpio.length < 2) return limpio
  const cuerpo = limpio.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${cuerpo}-${limpio.slice(-1)}`
}

export function calcularDigitoVerificador(cuerpo) {
  let suma = 0
  let factor = 2
  for (let i = cuerpo.length - 1; i >= 0; i -= 1) {
    suma += Number(cuerpo[i]) * factor
    factor = factor === 7 ? 2 : factor + 1
  }
  const resto = 11 - (suma % 11)
  return resto === 11 ? '0' : resto === 10 ? 'K' : String(resto)
}

/** Valida formato y dígito verificador (módulo 11). */
export function rutValido(valor = '') {
  const rut = normalizarRut(valor)
  const partes = rut.match(/^(\d{7,8})-([\dK])$/)
  return Boolean(partes) && calcularDigitoVerificador(partes[1]) === partes[2]
}
