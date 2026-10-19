// Origen de los datos de la aplicación.
//   VITE_USE_API=true  (por defecto): usa el backend a través del gateway (/api/...)
//   VITE_USE_API=false: usa la base de datos simulada en localStorage (sin backend)
export const USAR_API = import.meta.env.VITE_USE_API !== 'false'

// Vacío = mismo origen. En desarrollo Vite redirige /api al gateway y en Docker lo hace nginx.
export const URL_API = import.meta.env.VITE_API_URL || ''
