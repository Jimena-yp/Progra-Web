// Listado de órdenes del usuario
import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import './Ordenes.css'

const Ordenes = () => {
  const { usuario } = useUser()
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const fetchOrdenes = async () => {
      if (!usuario) return setCargando(false)
      try {
        const res = await fetch(`http://localhost:3001/api/ordenes?usuarioId=${usuario.id}`)
        if (!res.ok) throw new Error('Error al obtener órdenes')
        const data = await res.json()
        setOrdenes(data)
      } catch (e) {
        setOrdenes([])
      } finally {
        setCargando(false)
      }
    }
    fetchOrdenes()
  }, [usuario])

  return (
    <section className="ordenes">
      <h2>Mis Órdenes</h2>
      {cargando ? (
        <p>Cargando...</p>
      ) : ordenes.length === 0 ? (
        <p className="mensaje-vacio">Aún no tienes órdenes registradas.</p>
      ) : (
        <div className="tabla-ordenes-container">
          <table className="tabla-ordenes">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>ID Orden</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map(orden => (
                <tr key={orden.id}>
                  <td>{new Date(orden.fecha).toLocaleDateString()}</td>
                  <td>S/. {orden.total.toFixed(2)}</td>
                  <td>{orden.estado}</td>
                  <td>{orden.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Ordenes
