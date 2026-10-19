import { USAR_API } from './config.js'
import { apiHttp } from './http/index.js'
import { apiLocal } from './local/index.js'

// Punto único de acceso a los datos. Los componentes no saben si hablan con el backend o con la base local.
export const api = USAR_API ? apiHttp : apiLocal

export { ErrorApi, mensajeDeError } from './errores.js'
