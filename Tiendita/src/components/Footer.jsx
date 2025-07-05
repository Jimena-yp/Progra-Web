import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>mi<span className="highlight">Tienda</span></h2>
          <p>Tu tienda de confianza en línea</p>
        </div>

        <div className="footer-links">
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/categorias">Categorías</Link></li>
            <li><Link to="/nosotros">Sobre Nosotros</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contáctanos</h3>
          <p>Email: soporte@mitiendita.com</p>
          <p>Teléfono: +51 999 888 777</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 miTienda. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
