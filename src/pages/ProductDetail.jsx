// Detalle de producto y agregar al carrito
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCarrito } from '../context/CarritoContext'
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const { agregarProducto, carrito } = useCarrito()

  useEffect(() => {
    fetch('http://localhost:3001/api/productos')
      .then(res => res.json())
      .then(data => {
        const prod = data.find((p) => p.id === parseInt(id))
        setProducto(prod)
      })
      .catch(() => setProducto(null))
  }, [id])

  const handleAgregar = () => {
    if (!producto) return
    agregarProducto({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen
    })
    alert('Producto agregado al carrito ✅')
  }

  if (!producto) {
    return <div style={{ padding: '2rem' }}><h2>Producto no encontrado</h2></div>
  }

  return (
    <div className="detalle-producto">
      <img src={producto.imagen} alt={producto.nombre} />
      <div className="info">
        <h2>{producto.nombre}</h2>
        <p className="categoria">Categoría: {producto.categoria}</p>
        <p className="descripcion">{producto.descripcion}</p>
        <p className="precio">S/. {producto.precio.toFixed(2)}</p>
        <button onClick={handleAgregar}>
          Agregar al carrito
        </button>
      </div>
    </div>
  )
}

export default ProductDetail
