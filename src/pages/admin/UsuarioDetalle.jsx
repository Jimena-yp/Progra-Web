// Detalle de usuario para el panel admin
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './UsuarioDetalle.css'

const UsuarioDetalle = () => {
  const { id } = useParams()
  const [usuario, setUsuario] = useState(null)
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/usuarios`)
        const data = await res.json()
        const user = data.find(u => u.id === parseInt(id))
        setUsuario(user)
      } catch {
        setUsuario(null)
      }
    }
    fetchUsuario()
  }, [id])

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/ordenes?usuarioId=${id}`)
        const data = await res.json()
        setOrdenes(data)
      } catch {
        setOrdenes([])
      } finally {
        setCargando(false)
      }
    }
    fetchOrdenes()
  }, [id])

  if (!usuario) {
    return <p style={{ padding: '2rem' }}>Usuario no encontrado</p>
  }

  return (
    <section className="usuario-detalle">
      <h2>Detalle del Usuario</h2>
      <div className="info">
        <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}</p>
        <p><strong>Correo:</strong> {usuario.correo}</p>
        <p><strong>Rol:</strong> {usuario.rol}</p>
        <p><strong>Estado:</strong> {usuario.activo === false ? 'Inactivo' : 'Activo'}</p>
        <p><strong>Fecha de registro:</strong> {usuario.fechaRegistro || '-'}</p>
      </div>
      <hr />
      <h3>Últimas órdenes</h3>
      {cargando ? (
        <p>Cargando...</p>
      ) : ordenes.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.slice(0, 10).map((orden) => (
              <tr key={orden.id}>
                <td>{orden.id}</td>
                <td>{new Date(orden.fecha).toLocaleDateString()}</td>
                <td>{orden.estado}</td>
                <td>S/. {orden.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Este usuario no tiene órdenes registradas.</p>
      )}
    </section>
  )
}

export default UsuarioDetalle