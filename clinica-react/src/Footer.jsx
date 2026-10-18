import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="nombre-clinica">Clínica Agenda Médica</p>
        <p>📍 Av. Salud 1234, Santiago</p>
        <p>📞 +56 2 2345 6789</p>
        <p>✉️ contacto@clinicaagendamedica.cl</p>
        <p><Link className="footer-faq" to="/preguntas-frecuentes">Preguntas frecuentes</Link></p>
        <p className="copyright">© 2026 Clínica Agenda Médica. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
