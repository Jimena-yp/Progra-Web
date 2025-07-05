import { useEffect, useState } from 'react'
import { useUser } from '../../context/UserContext'
import { useNavigate, Link } from 'react-router-dom'
import usuarios from '../../data/usuarios.json'
import categorias from '../../data/categorias.json'
import './CategoriasAdmin.css'

const AdminDashboard = () => {
  const { usuario } = useUser()
  const navigate = useNavigate()

  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().slice(0, 10))
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().slice(0, 10))

  const [ordenesFiltradas, setOrdenesFiltradas] = useState([])
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([])

  useEffect(() => {
    if (!usuario || usuario.rol !== 'admin') {
      navigate('/login')
    }
  }, [usuario, navigate])

  useEffect(() => {
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)

    const ordenes = []
    const nuevosUsuarios = []

    usuarios.forEach(u => {
      const fechaRegistro = new Date(u.fechaRegistro)
      if (fechaRegistro >= inicio && fechaRegistro <= fin) {
        nuevosUsuarios.push(u)
      }

      u.ordenes?.forEach(o => {
        const fechaOrden = new Date(o.fecha)
        if (fechaOrden >= inicio && fechaOrden <= fin) {
          ordenes.push(o)
        }
      })
    })

    setUsuariosFiltrados(nuevosUsuarios)
    setOrdenesFiltradas(ordenes)
  }, [fechaInicio, fechaFin])

  const ingresosTotales = ordenesFiltradas.reduce((acc, o) => acc + o.total, 0)

  return (
    <section className="admin-dashboard">
      <h2>Panel Administrativo</h2>

      <div className="filtro-fechas">
        <label>
          Desde:
          <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
        </label>
        <label>
          Hasta:
          <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
        </label>
      </div>

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
      <div className="botones-categorias">
        <Link to="/admin/categorias" className="btn-ver">Ver Categorías</Link>
        <Link to="/admin/categorias/nuevo" className="btn-nueva">+ Añadir Categoría</Link>
      </div>

      <ul className="lista-categorias-mini">
        {categorias.slice(0, 5).map(cat => (
          <li key={cat.id}>{cat.nombre}</li>
        ))}
      </ul>
    </section>
  )
}

export default AdminDashboard
