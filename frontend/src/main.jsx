// Punto de entrada de la aplicación React.
// Carga los estilos globales (Bootstrap, SweetAlert2 y los propios) y monta <App /> en el div#root del index.html.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import './index.css'
// JavaScript de Bootstrap: necesario para el menú desplegable, el colapso del navbar y los acordeones
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import SesionProvider from './context/SesionProvider.jsx'

// Orden de los envoltorios:
//   StrictMode     → avisa en desarrollo de prácticas inseguras de React
//   BrowserRouter  → habilita la navegación por rutas sin recargar la página
//   SesionProvider → comparte el usuario conectado con todos los componentes
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SesionProvider>
        <App />
      </SesionProvider>
    </BrowserRouter>
  </StrictMode>
)
