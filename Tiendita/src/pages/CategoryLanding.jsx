import { Link } from 'react-router-dom'
import categorias from '../data/categorias.json'
import './CategoryLanding.css'

const Categorias = () => {
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
              <img src={cat.imagen} alt={cat.nombre} />
              <p>{cat.nombre}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Categorias
