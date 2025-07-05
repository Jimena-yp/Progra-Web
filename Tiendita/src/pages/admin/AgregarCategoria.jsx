import { useState } from 'react'
import productos from '../../data/productos.json'
import './AgregarCategoria.css'
import { useNavigate } from 'react-router-dom'

const AgregarCategoria = () => {
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [imagen, setImagen] = useState('')
  const [productosSeleccionados, setProductosSeleccionados] = useState([])
  const [busqueda, setBusqueda] = useState('')

  const toggleProducto = (id) => {
    setProductosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleGuardar = (e) => {
    e.preventDefault()

    if (!nombre || !imagen) {
      alert('Todos los campos son obligatorios.')
      return
    }

    const nuevaCategoria = {
      id: nombre.toLowerCase().replaceAll(' ', '-'),
      nombre,
      imagen,
      productos: productosSeleccionados
    }

    console.log('✅ Nueva categoría creada:', nuevaCategoria)
    alert('Categoría registrada con éxito.')
    navigate('/admin/categorias')
  }

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <section className="admin-agregar-categoria">
      <h2>Nueva Categoría</h2>

      <form onSubmit={handleGuardar} className="formulario">
        <input
          type="text"
          placeholder="Nombre de categoría"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL de la imagen"
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
        />

        <h3>Agregar productos a esta categoría</h3>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="lista-productos">
          {productosFiltrados.map(p => (
            <label key={p.id} className="producto-item">
              <input
                type="checkbox"
                checked={productosSeleccionados.includes(p.id)}
                onChange={() => toggleProducto(p.id)}
              />
              <img src={p.imagen} alt={p.nombre} width="40" />
              {p.nombre}
            </label>
          ))}
        </div>

        <button type="submit">Guardar Categoría</button>
      </form>
    </section>
  )
}

export default AgregarCategoria