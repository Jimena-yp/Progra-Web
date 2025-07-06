import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './AgregarProducto.css'

const AgregarProducto = () => {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState('')
  const [imagen, setImagen] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    fetch('http://localhost:3001/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(() => setCategorias([]))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nombre || !precio || !categoria || !imagen || !descripcion) {
      alert('Todos los campos son obligatorios.')
      return
    }
    if (!/^https?:\/\//.test(imagen)) {
      alert('La imagen debe ser un link (http o https), no un archivo base64.')
      return
    }
    const nuevoProducto = {
      nombre,
      precio: parseFloat(precio),
      categoria,
      imagen,
      descripcion
    }
    try {
      const res = await fetch('http://localhost:3001/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto)
      })
      if (!res.ok) throw new Error('No se pudo guardar el producto')
      alert('Producto agregado con éxito.')
      navigate('/admin') 
    } catch (err) {
      alert('Error al guardar el producto.')
    }
  }

  return (
    <section className="admin-agregar-producto">
      <h2>Agregar Producto</h2>
      <form className="formulario" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Precio"
          value={precio}
          onChange={e => setPrecio(e.target.value)}
        />
        <select
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="URL de la imagen"
          value={imagen}
          onChange={e => setImagen(e.target.value)}
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />
        <button type="submit">Agregar Producto</button>
      </form>
    </section>
  )
}

export default AgregarProducto
