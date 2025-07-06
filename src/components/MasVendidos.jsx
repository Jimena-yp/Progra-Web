// Componente para mostrar los productos más vendidos del mes
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './MasVendidos.css'

const MasVendidos = () => {
  const [masVendidos, setMasVendidos] = useState([])

  useEffect(() => {
    fetch('http://localhost:3001/api/mas-vendidos')
      .then((res) => res.json())
      .then((data) => setMasVendidos(data))
      .catch(() => setMasVendidos([]))
  }, [])

  return (
    <section className="mas-vendidos">
      <h2>Más vendidos del mes</h2>
      <div className="mas-vendidos-grid">
        {Array.isArray(masVendidos) && masVendidos.length > 0 ? (
          masVendidos.map((p) => (
            <div key={p.id} className="mas-vendido-card">
              <Link to={`/producto/${p.id}`}>
                <img src={p.imagen} alt={p.nombre} />
                <h4>{p.nombre}</h4>
                <p>S/. {p.precio.toFixed(2)}</p>
                <span style={{ fontSize: '0.95rem', color: '#888' }}>
                  Vendidos: {p.vendidos}
                </span>
              </Link>
            </div>
          ))
        ) : (
          <p style={{ color: '#888', margin: '2rem auto' }}>
            No hay productos vendidos este mes.
          </p>
        )}
      </div>
    </section>
  )
}

export default MasVendidos
