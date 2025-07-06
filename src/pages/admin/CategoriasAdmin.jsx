// Administración de categorías
import { useEffect, useState } from 'react'
import { useUser } from '../../context/UserContext'
import { useNavigate, Link } from 'react-router-dom'
import './CategoriasAdmin.css'

const CategoriasAdmin = () => {
  const { usuario } = useUser()
  const navigate = useNavigate()
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    if (!usuario || usuario.rol !== 'admin') {
      navigate('/login')
    }
  }, [usuario, navigate])

  const fetchCategorias = () => {
    fetch('http://localhost:3001/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(() => setCategorias([]))
  }

  useEffect(() => {
    fetchCategorias()
  }, [])

  const handleBorrar = async (id) => {
    if (!window.confirm('¿Seguro que deseas borrar esta categoría?')) return
    try {
      const res = await fetch(`http://localhost:3001/api/categorias/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('No se pudo borrar la categoría')
      fetchCategorias()
    } catch (err) {
      alert('Error al borrar la categoría.')
    }
  }

  return (
    <section className="admin-categorias">
      <h2>Categorías Registradas</h2>
      <div className="botones-categorias">
        <Link to="/admin/categorias/nuevo" className="btn-nueva">
          + Añadir Categoría
        </Link>
      </div>
      <ul className="lista-categorias-mini">
        {categorias.map(cat => (
          <li
            key={cat.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <div>
              <strong>{cat.nombre}</strong>
              {cat.descripcion && (
                <div style={{ fontWeight: 400, color: '#444', fontSize: '0.97rem' }}>
                  {cat.descripcion}
                </div>
              )}
            </div>
            <button
              title="Borrar categoría"
              onClick={() => handleBorrar(cat.id)}
              style={{
                background: 'transparent',
                color: '#dc2626',
                border: 'none',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                padding: '0 0.5rem',
                lineHeight: 1
              }}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default CategoriasAdmin
