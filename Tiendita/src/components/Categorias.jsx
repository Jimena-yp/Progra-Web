import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Categorias.css'

const Categorias = () => {
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    fetch('http://localhost:3001/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(() => setCategorias([]))
  }, [])

  const categoriasDestacadas = categorias.slice(0, 3)


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
              
              <img src={cat.imagen || '/default-categoria.png'} alt={cat.nombre} />
              <h3>{cat.nombre}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Categorias


