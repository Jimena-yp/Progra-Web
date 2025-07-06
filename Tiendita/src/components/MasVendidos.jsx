import productos from '../data/productos.json'
import { Link } from 'react-router-dom'
import './MasVendidos.css'

const destacados = productos.slice(0, 8) 

const MasVendidos = () => {
  return (
    <section className="masvendidos">
      <h2>Más Vendidos del Mes</h2>
      <div className="carousel-productos">
        {destacados.map((prod) => (
          <div className="producto-card" key={prod.id}>
            <img src={prod.imagen} alt={prod.nombre} />
            <h3>{prod.nombre}</h3>
            <p>S/. {prod.precio.toFixed(2)}</p>
            <Link to={`/producto/${prod.id}`}>
              <button>Ver más</button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MasVendidos
