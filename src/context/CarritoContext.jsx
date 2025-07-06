import { createContext, useContext, useState } from 'react'

const CarritoContext = createContext()

export const useCarrito = () => useContext(CarritoContext)

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([])

  const agregarProducto = (producto) => {
    const existe = carrito.find(p => p.id === producto.id)
    if (existe) {
      setCarrito(carrito.map(p =>
        p.id === producto.id
          ? { ...p, cantidad: p.cantidad + 1 }
          : p
      ))
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }])
    }
  }

  const eliminarProducto = (id) => {
    setCarrito(carrito.filter(p => p.id !== id))
  }

  const vaciarCarrito = () => setCarrito([])

  const aumentarCantidad = (id) => {
    setCarrito(carrito.map(p =>
      p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
    ))
  }

  const reducirCantidad = (id) => {
    setCarrito(carrito.map(p =>
      p.id === id && p.cantidad > 1
        ? { ...p, cantidad: p.cantidad - 1 }
        : p
    ))
  }

  return (
    <CarritoContext.Provider value={{
      carrito,
      agregarProducto,
      eliminarProducto,
      vaciarCarrito,
      aumentarCantidad,
      reducirCantidad
    }}>
      {children}
    </CarritoContext.Provider>
  )
}