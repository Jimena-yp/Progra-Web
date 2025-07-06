import { useEffect, useState } from 'react'
import { useUser } from '../../context/UserContext'
import { useNavigate, Link } from 'react-router-dom'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const { usuario } = useUser()
  const navigate = useNavigate()

  const [ordenesFiltradas, setOrdenesFiltradas] = useState([])
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [categorias, setCategorias] = useState([]) 

  useEffect(() => {
    if (!usuario || usuario.rol !== 'admin') {
      navigate('/login')
    }
  }, [usuario, navigate])

  useEffect(() => {
    fetch('http://localhost:3001/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data.filter(u => u.rol !== 'admin')))
      .catch(() => setUsuarios([]))
  }, [])

  useEffect(() => {
    fetch('http://localhost:3001/api/ordenes')
      .then(res => res.json())
      .then(data => setOrdenesFiltradas(data))
      .catch(() => setOrdenesFiltradas([]))
  }, [])

  useEffect(() => {
    setUsuariosFiltrados(usuarios)
  }, [usuarios])

  useEffect(() => {
    fetch('http://localhost:3001/api/categorias') 
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(() => setCategorias([]))
  }, [])

  const ingresosTotales = ordenesFiltradas.reduce((acc, o) => acc + o.total, 0)

  return (
    <section className="admin-dashboard">
      <h2>Panel Administrativo</h2>
      <div className="resumen-cajas">
        <div className="caja">
          <h3>Órdenes</h3>
          <p>{ordenesFiltradas.length}</p>
        </div>
        <div className="caja">
          <h3>Usuarios nuevos</h3>
          <p>{usuariosFiltrados.length}</p>
        </div>
        <div className="caja">
          <h3>Ingresos totales</h3>
          <p>S/. {ingresosTotales.toFixed(2)}</p>
        </div>
      </div>

      <hr style={{ margin: '2rem 0' }} />

      <h3>Usuarios Registrados (últimos)</h3>
      <div className="tabla-usuarios">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Ver</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.slice(0, 5).map(u => (
              <tr key={u.id}>
                <td>{u.nombre} {u.apellido}</td>
                <td>{u.correo}</td>
                <td>{u.rol}</td>
                <td>
                  {u.activo === false
                    ? <span style={{ color: 'red' }}>Inactivo</span>
                    : <span style={{ color: 'green' }}>Activo</span>}
                </td>
                <td>
                  <Link to={`/admin/usuarios/${u.id}`}>Ver</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
          <Link to="/admin/usuarios">Ver todos</Link>
        </div>
      </div>

      <hr style={{ margin: '2rem 0' }} />

      <h3>Categorías Registradas</h3>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/admin/categorias" style={{ marginRight: '1rem', color: '#0077cc' }}>
          Ver Categorías
        </Link>
        <Link to="/admin/categorias/nuevo" style={{ color: '#0077cc', marginRight: '1rem' }}>
          + Añadir Categoría
        </Link>
        <Link to="/admin/productos/nuevo" style={{ color: '#0077cc' }}>
          + Añadir Producto
        </Link>
      </div>

      
      <div className="lista-categorias">
        {categorias.length === 0 ? (
          <p>No hay categorías aún.</p>
        ) : (
          categorias.map(cat => (
            <div key={cat.id} className="categoria-item">
              {cat.nombre}
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default AdminDashboard
