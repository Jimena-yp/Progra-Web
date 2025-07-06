import { useEffect, useState } from 'react'
import { useUser } from '../../context/UserContext'
import { useNavigate, Link } from 'react-router-dom'
import './ProductosAdmin.css'

const ProductosAdmin = () => {
  const { usuario } = useUser()
  const navigate = useNavigate()
  const [productos, setProductos] = useState([])

  const fetchProductos = () => {
    fetch('http://localhost:3001/api/productos')
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener productos')
        return res.json()
      })
      .then(data => {
        setProductos(data)
      })
      .catch(() => setProductos([]))
  }

  useEffect(() => {
    if (!usuario || usuario.rol !== 'admin') {
      navigate('/login')
    }
  }, [usuario, navigate])

  useEffect(() => {
    fetchProductos()
  }, [])

  const handleBorrar = async (id) => {
    if (!window.confirm('¿Seguro que deseas borrar este producto?')) return
    try {
      const res = await fetch(`http://localhost:3001/api/productos/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('No se pudo borrar el producto')
      fetchProductos()
    } catch (err) {
      alert('Error al borrar el producto.')
    }
  }

  return (
    <section className="admin-categorias">
      <h2>Productos Registrados</h2>
      <div className="botones-categorias">
        <Link to="/admin/productos/nuevo" className="btn-nueva">
          + Añadir Producto
        </Link>
      </div>
      <ul className="lista-categorias-mini">
        {productos.map(prod => (
          <li
            key={prod.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <div>
              <strong>{prod.nombre}</strong>
              {prod.descripcion && (
                <div style={{ fontWeight: 400, color: '#444', fontSize: '0.97rem' }}>
                  {prod.descripcion}
                </div>
              )}
            </div>
            <button
              title="Borrar producto"
              onClick={() => handleBorrar(prod.id)}
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

export default ProductosAdmin
