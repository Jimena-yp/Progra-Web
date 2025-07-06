import { useState, useEffect } from 'react'
import './AgregarProducto.css'

const AdminAgregarProducto = () => {
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [imagen, setImagen] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [mensaje, setMensaje] = useState('')
  

 

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('')
    if (!nombre || !precio ) {
      setMensaje('Todos los campos obligatorios')
      return
    }
    try {
      const res = await fetch('http://localhost:3001/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, precio: parseFloat(precio), imagen, descripcion })
      })
      if (res.ok) {
        setNombre('')
        setPrecio('')
        
        setImagen('')
        setDescripcion('')
        alert('Producto agregado correctamente ✅')
        setMensaje('Producto agregado correctamente ✅')
      } else {
        const data = await res.json()
        setMensaje(data.error || 'Error al agregar producto')
      }
    } catch (err) {
      setMensaje('Error de conexión')
    }
  }

  return (
    <section className="admin-agregar-producto">
      <h2>Agregar Producto</h2>
      <form className="agregar-producto-form" onSubmit={handleSubmit}>
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" required />
        <input value={precio} onChange={e => setPrecio(e.target.value)} placeholder="Precio" type="number" min="0" step="0.01" required />
        
        <input value={imagen} onChange={e => setImagen(e.target.value)} placeholder="URL de imagen" />
        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción" />
        <button type="submit">Agregar</button>
        {mensaje && <p className="mensaje">{mensaje}</p>}
      </form>
    </section>
  )
}

export default AdminAgregarProducto
