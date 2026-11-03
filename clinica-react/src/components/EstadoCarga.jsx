import { mensajeDeError } from '../api/index.js'

// Indicador mientras se cargan datos, o mensaje de error con opción de reintentar
// Props:
//   cargando     → muestra el spinner con el texto
//   error        → muestra el mensaje del error
//   alReintentar → si se entrega, agrega el botón "Reintentar"
// Si no está cargando ni hay error no muestra nada (devuelve null)
function EstadoCarga({ cargando, error, alReintentar, texto = 'Cargando información…' }) {
  if (cargando) {
    return (
      <p className="estado-carga" role="status">
        <span className="spinner-border spinner-border-sm" aria-hidden="true" /> {texto}
      </p>
    )
  }
  if (error) {
    return (
      <div className="estado-error" role="alert">
        <p>{mensajeDeError(error)}</p>
        {alReintentar && <button type="button" className="perfil-boton perfil-boton-secundario" onClick={alReintentar}>Reintentar</button>}
      </div>
    )
  }
  return null
}

export default EstadoCarga
