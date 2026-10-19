import { mensajeDeError } from '../api/index.js'

// Indicador mientras se cargan datos, o mensaje de error con opción de reintentar
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
