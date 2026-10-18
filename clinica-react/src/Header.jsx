import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand-logo" aria-label="Clínica Agenda Médica, inicio">
          <img src="/logo.png" alt="Clínica Agenda Médica" />
        </Link>

        <nav className="menu-principal" aria-label="Navegación principal">
          <Link to="/">Inicio</Link>
          <Link to="/quienes-somos">Quiénes somos</Link>
          <Link to="/especialidades">Especialidades</Link>
          <Link to="/mis-horas">Mis horas médicas</Link>
          <Link to="/agendar-hora" className="link-agendar">Agendar hora</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header