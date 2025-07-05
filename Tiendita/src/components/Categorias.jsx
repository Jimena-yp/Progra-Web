import { Link } from 'react-router-dom'
import categorias from '../data/categorias.json'
import './Categorias.css'

const Categorias = () => {
  const categoriasDestacadas = categorias.slice(0, 3) // solo las 3 primeras

  return (
    <section className="categorias">
      <h2>Categorías Destacadas</h2>
      <div className="categorias-grid">
        {categoriasDestacadas.map((cat, i) => (
          <Link
            to={`/category/${encodeURIComponent(cat.nombre)}`}
            className="categoria-link"
            key={i}
          >
            <div className="categoria-card">
              <img src={cat.imagen} alt={cat.nombre} />
              <h3>{cat.nombre}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Categorias


