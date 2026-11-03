// Componente raíz: define la estructura común (accesibilidad, encabezado y pie)
// y la tabla de rutas que decide qué página se muestra según la URL.
import { Link, Route, Routes } from 'react-router-dom'
import './styles/App.css'
import Accesibilidad from './components/Accesibilidad'
import RutaProtegida from './components/RutaProtegida.jsx'
import Header from './components/layout/Header'
import Inicio from './pages/Inicio'
import Footer from './components/layout/Footer'
import QuienesSomos from './pages/QuienesSomos'
import Especialidades from './pages/Especialidades'
import AgendarHora from './pages/AgendarHora'
import CancelarHora from './pages/CancelarHora.jsx'
import ModificarHora from './pages/ModificarHora.jsx'
import PanelAdministracion from './pages/PanelAdministracion.jsx'
import MisHoras from './pages/MisHoras'
import Medicos from './pages/Medicos.jsx'
import Contacto from './pages/Contacto.jsx'
import Sucursales from './pages/Sucursales.jsx'
import PreguntasFrecuentes from './pages/PreguntasFrecuentes.jsx'
import Login from './pages/Login.jsx'
import RegistroPaciente from './pages/RegistroPaciente.jsx'
import PerfilPaciente from './pages/PerfilPaciente.jsx'
import HistorialAtenciones from './pages/HistorialAtenciones.jsx'

// Roles que pueden entrar a las páginas de gestión de horas (agendar, ver, modificar y cancelar)
const TODOS_LOS_ROLES = ['PACIENTE', 'MEDICO', 'ADMINISTRADOR']

// Página 404: se muestra cuando la URL no coincide con ninguna ruta definida
function PaginaNoEncontrada() {
  return (
    <main className="panel-admin-denegado">
      <section className="perfil-sin-sesion" role="status">
        <h1>Página no encontrada</h1>
        <p>La dirección que buscas no existe o cambió de lugar.</p>
        <Link className="perfil-boton" to="/">Volver al inicio</Link>
      </section>
    </main>
  )
}

// Estructura de la aplicación: barra de accesibilidad + encabezado + página según la ruta + pie de página
function App() {
  return (
    <div className="app-shell">
      <Accesibilidad />
      <Header />

      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/especialidades" element={<Especialidades />} />
        <Route path="/medicos" element={<Medicos />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/sucursales" element={<Sucursales />} />
        <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
        {/* El mismo componente Login sirve para los tres accesos; cambia el rol que exige */}
        <Route path="/login" element={<Login rolRequerido="PACIENTE" />} />
        <Route path="/acceso-medico" element={<Login rolRequerido="MEDICO" />} />
        <Route path="/acceso-administracion" element={<Login rolRequerido="ADMINISTRADOR" />} />
        <Route path="/registro-paciente" element={<RegistroPaciente />} />

        {/* Páginas con sesión */}
        {/* RutaProtegida revisa que haya sesión y que el rol del usuario esté en la lista "roles" */}
        <Route path="/perfil" element={<RutaProtegida roles={['PACIENTE']}><PerfilPaciente /></RutaProtegida>} />
        <Route path="/historial-atenciones" element={<RutaProtegida roles={['PACIENTE']}><HistorialAtenciones /></RutaProtegida>} />
        <Route path="/agendar-hora" element={<RutaProtegida roles={TODOS_LOS_ROLES}><AgendarHora /></RutaProtegida>} />
        <Route path="/mis-horas" element={<RutaProtegida roles={TODOS_LOS_ROLES}><MisHoras /></RutaProtegida>} />
        <Route path="/modificar-hora" element={<RutaProtegida roles={TODOS_LOS_ROLES}><ModificarHora /></RutaProtegida>} />
        <Route path="/cancelar-hora" element={<RutaProtegida roles={TODOS_LOS_ROLES}><CancelarHora /></RutaProtegida>} />
        <Route path="/panel-administracion" element={<RutaProtegida roles={['ADMINISTRADOR']}><PanelAdministracion /></RutaProtegida>} />

        {/* Cualquier otra dirección */}
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
