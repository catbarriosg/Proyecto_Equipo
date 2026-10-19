import { useCallback, useEffect, useState } from 'react'

/**
 * Carga datos asíncronos y expone { datos, cargando, error, recargar }.
 * "clave" identifica la consulta: cuando cambia (por ejemplo, otro médico u otra semana) se vuelve a cargar.
 * Si la respuesta llega cuando la clave ya cambió, se descarta.
 */
export function useCarga(cargar, clave) {
  const [version, setVersion] = useState(0)
  const [resultado, setResultado] = useState({ consulta: null, datos: null, error: null })
  const consulta = `${clave}#${version}`

  useEffect(() => {
    let vigente = true
    cargar()
      .then((datos) => { if (vigente) setResultado({ consulta, datos, error: null }) })
      .catch((error) => { if (vigente) setResultado({ consulta, datos: null, error }) })
    return () => { vigente = false }
    // "cargar" cambia en cada render; la consulta se identifica con la clave
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consulta])

  const recargar = useCallback(() => setVersion((actual) => actual + 1), [])
  const cargando = resultado.consulta !== consulta

  return {
    datos: cargando ? null : resultado.datos,
    error: cargando ? null : resultado.error,
    cargando,
    recargar,
  }
}
