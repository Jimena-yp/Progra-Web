// Landing de categorías
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './CategoryLanding.css'

const Categorias = () => {
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    fetch('http://localhost:3001/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(() => setCategorias([]))
  }, [])

  return (
    <section className="category">
      <h2>Categorías</h2>
      <div className="grid-category">
        {categorias.map(cat => (
          <Link
            key={cat.id}
            to={`/category/${encodeURIComponent(cat.nombre)}`}
            className="category-link"
          >
            <div className="category-card">
              {cat.imagen && (
                <img src={cat.imagen} alt={cat.nombre} style={{ width: '90px', height: '90px', objectFit: 'cover', marginBottom: '1rem' }} />
              )}
              <p>{cat.nombre}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Categorias
