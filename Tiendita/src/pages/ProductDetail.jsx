import { useParams } from 'react-router-dom'
import productos from '../data/productos.json'
import { useCarrito } from '../context/CarritoContext'
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams()
  const producto = productos.find((p) => p.id === parseInt(id))

  const { agregarProducto, carrito } = useCarrito()
  console.log("🧩 Desde ProductDetail: carrito actual:", carrito)

  const handleAgregar = () => {
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
