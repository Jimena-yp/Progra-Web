import { useState, useEffect } from 'react'
import './AgregarCategoria.css'
import { useNavigate } from 'react-router-dom'

const AgregarCategoria = () => {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [imagen, setImagen] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [productos, setProductos] = useState([])
  const [productosSeleccionados, setProductosSeleccionados] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [categorias, setCategorias] = useState([])

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

  const toggleProducto = (id) => {
    setProductosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    setMensaje('')
    if (!nombre || !imagen) {
      setMensaje('Todos los campos son obligatorios.')
      return
    }
    try {
      const res = await fetch('http://localhost:3001/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, imagen })
      })

      if (res.ok) {
        if (productosSeleccionados.length > 0) {
          await fetch('http://localhost:3001/api/productos/asignar-categoria', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoria: nombre, productos: productosSeleccionados })
          })
        }
        setNombre('')
        setImagen('')
        setProductosSeleccionados([])
        setMensaje('Categoría agregada correctamente ✅')
        setTimeout(() => setMensaje(''), 2000)

        const nuevas = await fetch('http://localhost:3001/api/categorias')
        const data = await nuevas.json()
        setCategorias(data)
      } else {
        const data = await res.json()
        setMensaje(data.error || 'Error al agregar categoría')
      }
    } catch (err) {
      setMensaje('Error de conexión')
    }
  }

  const eliminarCategoria = async (id) => {
    const confirmar = window.confirm('¿Seguro que deseas eliminar esta categoría?')
    if (!confirmar) return

    try {
      const res = await fetch(`http://localhost:3001/api/categorias/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setMensaje('Categoría eliminada ✅')
        setCategorias(prev => prev.filter(c => c.id !== id))
      } else {
        setMensaje('Error al eliminar')
      }
    } catch (err) {
      setMensaje('Error de conexión')
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
        {mensaje && <p className="mensaje">{mensaje}</p>}
      </form>

      <h3>Categorías existentes</h3>
      <ul className="lista-categorias">
        {categorias.map(cat => (
          <li key={cat.id}>
            {cat.nombre}
            <button onClick={() => eliminarCategoria(cat.id)}>❌</button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default AgregarCategoria
