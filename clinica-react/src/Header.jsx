import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSesion } from './context/useSesion.js'
import { rolLegible } from './utils/formato.js'

// Opciones del menú "Mi cuenta" según el tipo de usuario
const OPCIONES_POR_ROL = {
  PACIENTE: [
    { ruta: '/perfil', texto: 'Mi perfil' },
    { ruta: '/mis-horas', texto: 'Mis horas médicas' },
    { ruta: '/historial-atenciones', texto: 'Historial de atenciones' },
  ],
  MEDICO: [
    { ruta: '/mis-horas', texto: 'Mi agenda' },
    { ruta: '/agendar-hora', texto: 'Agendar para un paciente' },
  ],
  ADMINISTRADOR: [
    { ruta: '/panel-administracion', texto: 'Panel de administración' },
    { ruta: '/mis-horas', texto: 'Horas agendadas' },
  ],
}

function Header() {
  const { usuario, cerrarSesion } = useSesion()
  const navegar = useNavigate()
  const [cuentaAbierta, setCuentaAbierta] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const cerrarCuenta = () => setCuentaAbierta(false)
  const cerrarMenu = () => setMenuAbierto(false)

  function salir() {
    cerrarCuenta()
    cerrarSesion()
    navegar('/')
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand-logo" aria-label="Clínica Agenda Médica, inicio">
          <img src="/logo.png" alt="Clínica Agenda Médica" />
        </Link>

        <nav className={`menu-principal${menuAbierto ? ' abierto' : ''}`} aria-label="Navegación principal" id="menu-principal">
          <Link to="/" onClick={cerrarMenu}>Inicio</Link>
          <Link to="/quienes-somos" onClick={cerrarMenu}>Quiénes somos</Link>
          <Link to="/especialidades" onClick={cerrarMenu}>Especialidades</Link>
          <Link to="/medicos" onClick={cerrarMenu}>Médicos</Link>
          <Link to="/sucursales" onClick={cerrarMenu}>Sucursales</Link>
          <Link to="/contacto" onClick={cerrarMenu}>Contacto</Link>
          <Link to="/agendar-hora" className="link-agendar" onClick={cerrarMenu}>Agendar hora</Link>
        </nav>

        <div className="header-acciones">
          <div className="menu-cuenta">
            <button className="menu-cuenta-boton" type="button"
              aria-expanded={cuentaAbierta} aria-controls="opciones-cuenta"
              onClick={() => setCuentaAbierta(!cuentaAbierta)}>
              <span aria-hidden="true">👤</span> {usuario ? usuario.nombre.split(' ')[0] : 'Mi cuenta'} <span aria-hidden="true">▾</span>
            </button>
            {cuentaAbierta && (
              <div className="menu-cuenta-panel" id="opciones-cuenta">
                {usuario ? (
                  <>
                    <p className="menu-cuenta-titulo">{rolLegible(usuario.rol)}</p>
                    <p className="menu-cuenta-usuario">{usuario.nombre}</p>
                    {OPCIONES_POR_ROL[usuario.rol]?.map((opcion) => (
                      <Link key={opcion.ruta} to={opcion.ruta} onClick={cerrarCuenta}>{opcion.texto}</Link>
                    ))}
                    <button type="button" className="menu-cuenta-salir" onClick={salir}>Cerrar sesión</button>
                  </>
                ) : (
                  <>
                    <p className="menu-cuenta-titulo">Paciente</p>
                    <Link to="/login" onClick={cerrarCuenta}>Iniciar sesión</Link>
                    <Link to="/registro-paciente" onClick={cerrarCuenta}>Crear cuenta</Link>
                    <p className="menu-cuenta-titulo menu-cuenta-personal">Zona administrativa</p>
                    <Link to="/acceso-medico" onClick={cerrarCuenta}>Acceso médico</Link>
                    <Link to="/acceso-administracion" onClick={cerrarCuenta}>Acceso administrativo</Link>
                  </>
                )}
              </div>
            )}
          </div>
          <button className="menu-movil-boton" type="button" aria-label="Abrir menú principal"
            aria-expanded={menuAbierto} aria-controls="menu-principal"
            onClick={() => setMenuAbierto(!menuAbierto)}>☰</button>
        </div>
      </div>
    </header>
  )
}

export default Header
