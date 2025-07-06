import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Products.css'

const Products = () => {
  const [productos, setProductos] = useState([])
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')

  useEffect(() => {
    fetch('http://localhost:3001/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(() => setProductos([]))
  }, [])

  const categorias = ['Todas', ...new Set(productos.map(p => p.categoria))]

  const productosFiltrados = categoriaActiva === 'Todas'
    ? productos
    : productos.filter(p => p.categoria === categoriaActiva)

  return (
    <section className="productos">
      <h2>Catálogo de Productos</h2>
      <div className="filtros">
        {categorias.map(cat => (
          <button
            key={cat}
            className={categoriaActiva === cat ? 'activo' : ''}
            onClick={() => setCategoriaActiva(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid-productos">
        {productosFiltrados.map(p => (
          <div key={p.id} className="producto-card">
            <img src={p.imagen} alt={p.nombre} />
            <h4>{p.nombre}</h4>
            <p>S/. {p.precio.toFixed(2)}</p>
            <Link to={`/producto/${p.id}`}><button>Ver más</button></Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Products
