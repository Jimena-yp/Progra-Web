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
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  margin: '0 auto 1rem auto',
                  background: '#f7f7f7',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #eee'
                }}
              >
                {cat.imagen
                  ? <img src={cat.imagen} alt={cat.nombre} style={{ width: '90px', height: '90px', objectFit: 'cover' }} />
                  : <span style={{ color: '#bbb', fontSize: '0.9rem' }}>Sin imagen</span>
                }
              </div>
              <h3>{cat.nombre}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Categorias


