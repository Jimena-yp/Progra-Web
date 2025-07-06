// Productos filtrados por categoría
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Products.css'

const CategoryProducts = () => {
  const { nombre } = useParams()
  const [productos, setProductos] = useState([])

  useEffect(() => {
    fetch('http://localhost:3001/api/productos')
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch(() => setProductos([]))
  }, [])

  const productosFiltrados = productos.filter(
    (p) => p.categoria && p.categoria.toLowerCase() === nombre.toLowerCase()
  )

  return (
    <section className="productos">
      <h2>Productos de la categoría: {nombre}</h2>

      {productosFiltrados.length === 0 ? (
        <p>No se encontraron productos para esta categoría.</p>
      ) : (
        <div className="grid-productos">
          {productosFiltrados.map((p) => (
            <div key={p.id} className="producto-card">
              <img src={p.imagen} alt={p.nombre} />
              <h4>{p.nombre}</h4>
              <p>S/. {p.precio.toFixed(2)}</p>
              <Link to={`/producto/${p.id}`}>
                <button>Ver más</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default CategoryProducts
