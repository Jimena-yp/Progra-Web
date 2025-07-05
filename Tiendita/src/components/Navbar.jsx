import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useUser } from '../context/UserContext'
import './Navbar.css'
import logo from '../assets/Mi-Tiendita.png'

const Navbar = () => {
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()
  const { usuario } = useUser()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (busqueda.trim() !== '') {
      navigate(`/busqueda?query=${encodeURIComponent(busqueda)}`)
      setBusqueda('')
    }
  }

  return (
    <header className="navbar">
      <div className="navbar__logo">
        <Link to="/">
          <img src={logo} alt="Logo MiTiendita" className="logo-img" />
        </Link>
      </div>

      <form className="navbar__search" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Buscar productos..."
          aria-label="Buscar productos"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button type="submit" aria-label="Buscar">🔍</button>
      </form>

      <div className="navbar__actions">
        <Link to="/carrito">Carrito 🛒</Link>
        {usuario ? (
          <Link to="/cuenta">Cuenta 👤</Link>
        ) : (
          <Link to="/login">Cuenta 👤</Link>
        )}
      </div>
    </header>
  )
}

export default Navbar
