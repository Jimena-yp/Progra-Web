// Carrito de compras y guardados para después
import { useState } from 'react'
import { useCarrito } from '../context/CarritoContext'
import { Link } from 'react-router-dom'
import './Cart.css'

// aaa

const Cart = () => {
  const {
    carrito,
    eliminarProducto,
    aumentarCantidad,
    reducirCantidad,
    agregarProducto
  } = useCarrito()


  const [guardados, setGuardados] = useState([])

  const moverAGuardados = (item) => {
    eliminarProducto(item.id)
    setGuardados(prev => [...prev, item])
  }

  const volverAlCarrito = (item) => {
    setGuardados(prev => prev.filter(p => p.id !== item.id))
    agregarProducto(item) // ✅ Lo agrega con cantidad 1 o aumenta si ya está
  }


  const eliminarDeGuardados = (id) => {
    setGuardados(prev => prev.filter(item => item.id !== id))
  }

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

  return (
    <section className="cart">
      <h2>Mi Carrito de Compras</h2>

      {carrito.length === 0 ? (
        <div className="cart-vacio">
          <p className="mensaje-vacio">No hay productos en el carrito.</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {carrito.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.imagen} alt={item.nombre} />
                <div className="item-info">
                  <h4>{item.nombre}</h4>
                  <p>S/. {item.precio.toFixed(2)}</p>
                  <div className="cantidad">
                    <button onClick={() => reducirCantidad(item.id)}>-</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => aumentarCantidad(item.id)}>+</button>
                  </div>
                  <p><strong>Subtotal:</strong> S/. {(item.precio * item.cantidad).toFixed(2)}</p>
                  <div className="acciones">
                    <button onClick={() => moverAGuardados(item)}>Mover a guardados</button>
                    <button onClick={() => eliminarProducto(item.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="resumen">
            <h3>Total del carrito: <span>S/. {total.toFixed(2)}</span></h3>
            <Link to="/checkout">
              <button>Ir a pagar</button>
            </Link>
          </div>
        </>
      )}

      <div className="guardados">
        <h3>Guardados para después</h3>
        {guardados.length === 0 ? (
          <p>No tienes productos guardados.</p>
        ) : (
          guardados.map((item) => (
            <div key={item.id} className="guardado-item">
              <img src={item.imagen} alt={item.nombre} />
              <div>
                <h4>{item.nombre}</h4>
                <p>S/. {item.precio.toFixed(2)}</p>
                <button onClick={() => volverAlCarrito(item)}>Volver al carrito</button>
                <button onClick={() => eliminarDeGuardados(item.id)}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default Cart
