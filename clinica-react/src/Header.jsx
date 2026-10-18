import { useState } from 'react'
import { Link } from 'react-router-dom'

function Header() {
  const [cuentaAbierta, setCuentaAbierta] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const cerrarCuenta = () => setCuentaAbierta(false)
  const cerrarMenu = () => setMenuAbierto(false)

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand-logo" aria-label="Clínica Agenda Médica, inicio">
          <img src="/logo.png" alt="Clínica Agenda Médica" />
        </Link>

        <nav className={`menu-principal${menuAbierto ? ' abierto' : ''}`} aria-label="Navegación principal">
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
              <span aria-hidden="true">👤</span> Mi cuenta <span aria-hidden="true">▾</span>
            </button>
            {cuentaAbierta && (
              <div className="menu-cuenta-panel" id="opciones-cuenta">
                <p className="menu-cuenta-titulo">Paciente</p>
                <Link to="/login" onClick={cerrarCuenta}>Iniciar sesión</Link>
                <p className="menu-cuenta-titulo menu-cuenta-personal">Zona administrativa</p>
                <Link to="/acceso-medico" onClick={cerrarCuenta}>Acceso médico</Link>
                <Link to="/acceso-administracion" onClick={cerrarCuenta}>Acceso administrativo</Link>
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
