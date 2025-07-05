import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import productos from '../data/productos.json'
import categorias from '../data/categorias.json'
import './SearchResults.css'



const precioANumero = (precioTexto) => {
  return parseFloat(precioTexto.replace('S/.', '').replace(',', ''))
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}


const SearchResults = () => {
  const query = useQuery().get('query') || ''
  const textoBusqueda = query.toLowerCase()

  const [categoriasActivas, setCategoriasActivas] = useState([])
  const [orden, setOrden] = useState('nombre')

  const toggleCategoria = (categoria) => {
    setCategoriasActivas((prev) =>
      prev.includes(categoria)
        ? prev.filter((c) => c !== categoria)
        : [...prev, categoria]
    )
  }

  const filtrar = (producto) => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(textoBusqueda)
    const coincideCategoria =
      categoriasActivas.length === 0 || categoriasActivas.includes(producto.categoria)

    return coincideBusqueda && coincideCategoria
  }

  const ordenar = (a, b) => {
    if (orden === 'nombre') {
      return a.nombre.localeCompare(b.nombre)
    } else if (orden === 'precio') {
      return a.precio - b.precio
    }
    return 0
  }

  const resultados = productos.filter(filtrar).sort(ordenar)

  return (
    <section className="search">
      <aside className="search__filters">
        <h3>Filtrar por Categoría</h3>
        <ul>
          {categorias.map((cat) => (
            <li key={cat.id}>
              <label>
                <input
                  type="checkbox"
                  checked={categoriasActivas.includes(cat.nombre)}
                  onChange={() => toggleCategoria(cat.nombre)}
                />
                {cat.nombre}
              </label>
            </li>
          ))}
        </ul>

        <h3>Ordenar por</h3>
        <select value={orden} onChange={(e) => setOrden(e.target.value)}>
          <option value="nombre">Nombre</option>
          <option value="precio">Precio</option>
        </select>
      </aside>

      <div className="search__results">
        <h2>Mostrando resultados para: <em>{query}</em></h2>

        {resultados.length === 0 ? (
          <div className="sin-resultados">
            <img src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" alt="No results" />
            <p>No se encontraron resultados para <strong>{query}</strong></p>
            <p>Prueba con otra búsqueda o ajusta los filtros</p>
          </div>
        ) : (
          <div className="product-grid">
            {resultados.map((p, i) => (
              <div className="product-card" key={i}>
                <Link to={`/producto/${p.id}`}>
                  <img src={p.imagen} alt={p.nombre} />
                </Link>

                <Link to={`/producto/${p.id}`}>
                  <h4>{p.nombre}</h4>
                </Link>

                <p>S/. {p.precio.toFixed(2)}</p>

                <Link to={`/producto/${p.id}`}>
                  <button>Ver más</button>
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}

export default SearchResults