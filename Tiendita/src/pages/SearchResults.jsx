import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './SearchResults.css'



const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}


const SearchResults = () => {
  const query = useQuery().get('query') || ''
  const textoBusqueda = query.toLowerCase()

  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriasActivas, setCategoriasActivas] = useState([])
  const [orden, setOrden] = useState('nombre')

  useEffect(() => {
    fetch('http://localhost:3001/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(() => setProductos([]))
    fetch('http://localhost:3001/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(() => setCategorias([]))
  }, [])

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
    <section className="search-results">
      <h2>Resultados de búsqueda</h2>
      <div className="filtros">
        {categorias.map(cat => (
          <button
            key={cat.nombre}
            className={categoriasActivas.includes(cat.nombre) ? 'activo' : ''}
            onClick={() => toggleCategoria(cat.nombre)}
          >
            {cat.nombre}
          </button>
        ))}
        <button
          className={categoriasActivas.length === 0 ? 'activo' : ''}
          onClick={() => setCategoriasActivas([])}
        >
          Todas
        </button>
      </div>
      <div className="resultados-grid">
        {resultados.length === 0 ? (
          <p>No se encontraron productos.</p>
        ) : (
          resultados.map((producto) => (
            <div key={producto.id} className="producto-card">
              <img src={producto.imagen} alt={producto.nombre} />
              <h4>{producto.nombre}</h4>
              <p>S/. {producto.precio.toFixed(2)}</p>
              <Link to={`/producto/${producto.id}`}>
                <button>Ver más</button>
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default SearchResults