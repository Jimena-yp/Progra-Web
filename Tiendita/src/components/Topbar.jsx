import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import './Topbar.css'


const Topbar = () => {
  const { usuario, logout } = useUser()

  return (
    <nav className="navbar__menu">
      <Link to="/categorias">Categorías</Link>
      <Link to="/productos">Productos</Link>
      <Link to="/nosotros">Nosotros</Link>

      {usuario ? (
        <>
          <Link to="/cuenta">👤 {usuario.nombre}</Link>
          <button onClick={logout} className="logout-btn">Cerrar sesión</button>
        </>
      ) : (
        <Link to="/login">Mi cuenta</Link>
      )}
    </nav>
  )
}

export default Topbar