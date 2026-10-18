import { useState } from 'react'
import { Link } from 'react-router-dom'

function Header() {
  const [cuentaAbierta, setCuentaAbierta] = useState(false)
  const cerrarCuenta = () => setCuentaAbierta(false)

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-top">
          <Link to="/" className="brand-logo" aria-label="Clínica Agenda Médica, inicio">
            <img src="/logo.png" alt="Clínica Agenda Médica" />
          </Link>
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
        </div>

        <nav className="menu-principal" aria-label="Navegación principal">
          <Link to="/">Inicio</Link>
          <Link to="/quienes-somos">Quiénes somos</Link>
          <Link to="/especialidades">Especialidades</Link>
          <Link to="/medicos">Médicos</Link>
          <Link to="/sucursales">Sucursales</Link>
          <Link to="/contacto">Contacto</Link>
          <Link to="/preguntas-frecuentes">Preguntas frecuentes</Link>
          <Link to="/agendar-hora" className="link-agendar">Agendar hora</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header