import { useState, useEffect } from 'react'
import './AgregarCategoria.css'
import { useNavigate } from 'react-router-dom'

const AgregarCategoria = () => {
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [imagen, setImagen] = useState('')
  const [productos, setProductos] = useState([])
  const [productosSeleccionados, setProductosSeleccionados] = useState([])
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    fetch('http://localhost:3001/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(() => setProductos([]))
  }, [])

  const toggleProducto = (id) => {
    setProductosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleGuardar = async (e) => {
    e.preventDefault()

    if (!nombre) {
      alert('El nombre es obligatorio.')
      return
    }

   
    const nuevaCategoria = {
      nombre,
      imagen
    }

    try {
      const res = await fetch('http://localhost:3001/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCategoria)
      })
      if (!res.ok) throw new Error('No se pudo guardar la categoría')
      alert('Categoría registrada con éxito.')
      navigate('/admin/categorias')
    } catch (err) {
      alert('Error al guardar la categoría.')
    }
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