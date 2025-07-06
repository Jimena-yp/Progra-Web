// Panel principal de administración
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
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [mostrarCategorias, setMostrarCategorias] = useState(false)
  const [mostrarProductos, setMostrarProductos] = useState(false)
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

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

  // Cambia este useEffect para que consulte con fechas si están definidas
  useEffect(() => {
    let url = 'http://localhost:3001/api/ordenes'
    const params = []
    if (fechaDesde) params.push(`desde=${fechaDesde}`)
    if (fechaHasta) params.push(`hasta=${fechaHasta}`)
    if (params.length > 0) url += '?' + params.join('&')
    fetch(url)
      .then(res => res.json())
      .then(data => setOrdenesFiltradas(data))
      .catch(() => setOrdenesFiltradas([]))
  }, [fechaDesde, fechaHasta])

  useEffect(() => {
    fetch('http://localhost:3001/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(() => setProductos([]))
  }, [])

  useEffect(() => {
    fetch('http://localhost:3001/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(() => setCategorias([]))
  }, [])

  useEffect(() => {
    setUsuariosFiltrados(usuarios)
  }, [usuarios])

  const ingresosTotales = ordenesFiltradas.reduce((acc, o) => acc + o.total, 0)

  return (
    <section className="admin-dashboard">
      <h2>Panel Administrativo</h2>
      <form
        className="filtro-fechas"
        style={{ marginBottom: '2rem', marginTop: '1rem' }}
        onSubmit={e => e.preventDefault()}
      >
        <label>
          Desde:{' '}
          <input
            type="date"
            value={fechaDesde}
            onChange={e => setFechaDesde(e.target.value)}
          />
        </label>
        <label>
          Hasta:{' '}
          <input
            type="date"
            value={fechaHasta}
            onChange={e => setFechaHasta(e.target.value)}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            setFechaDesde('')
            setFechaHasta('')
          }}
          style={{
            background: '#e2e8f0',
            color: '#222',
            border: 'none',
            borderRadius: '7px',
            padding: '0.4rem 1.1rem',
            marginLeft: '1rem',
            cursor: 'pointer'
          }}
        >
          Limpiar
        </button>
      </form>
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
      <div className="botones-categorias" style={{ marginBottom: '1rem' }}>
        <button
          className="btn-ver"
          style={{ marginRight: '1rem' }}
          onClick={() => {
            setMostrarCategorias(true)
            setMostrarProductos(false)
          }}
        >
          Ver Categorías
        </button>
        <Link
          to="/admin/categorias/nuevo"
          className="btn-nueva"
        >
          + Añadir Categoría
        </Link>
      </div>
      {mostrarCategorias && (
        <div style={{
          background: '#f7fbff',
          borderRadius: '12px',
          padding: '1rem',
          maxWidth: '350px',
          marginTop: '1rem'
        }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {categorias.map(cat => (
              <li key={cat.id} style={{
                borderBottom: '1px solid #e3eaf2',
                padding: '0.7rem 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <span>{cat.nombre}</span>
                <button
                  title="Borrar categoría"
                  onClick={async () => {
                    if (!window.confirm('¿Seguro que deseas borrar esta categoría?')) return
                    try {
                      // Refresca la lista después de borrar, no solo filtra localmente
                      const res = await fetch(`http://localhost:3001/api/categorias/${cat.id}`, {
                        method: 'DELETE'
                      })
                      if (res.status === 204 || res.status === 404) {
                        // Siempre refresca desde backend para evitar inconsistencias
                        const cats = await fetch('http://localhost:3001/api/categorias').then(r => r.json())
                        setCategorias(cats)
                      } else {
                        throw new Error('No se pudo borrar la categoría')
                      }
                    } catch (err) {
                      alert('Error al borrar la categoría.')
                    }
                  }}
                  style={{
                    background: 'transparent',
                    color: '#dc2626',
                    border: 'none',
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    padding: '0 0.5rem',
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sección de productos */}
      <hr style={{ margin: '2rem 0' }} />
      <h3>Productos Registrados</h3>
      <div className="botones-categorias" style={{ marginBottom: '1rem' }}>
        <button
          className="btn-ver"
          style={{ marginRight: '1rem' }}
          onClick={() => {
            setMostrarProductos(true)
            setMostrarCategorias(false)
          }}
        >
          Ver Productos
        </button>
        <Link
          to="/admin/productos/nuevo"
          className="btn-nueva"
        >
          + Añadir Producto
        </Link>
      </div>
      {mostrarProductos && (
        <div style={{
          background: '#f7fbff',
          borderRadius: '12px',
          padding: '1rem',
          maxWidth: '350px',
          marginTop: '1rem'
        }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {productos.map(prod => (
              <li key={prod.id} style={{
                borderBottom: '1px solid #e3eaf2',
                padding: '0.7rem 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div>
                  <strong>{prod.nombre}</strong>
                  {prod.descripcion && (
                    <div style={{ fontWeight: 400, color: '#444', fontSize: '0.97rem' }}>
                      {prod.descripcion}
                    </div>
                  )}
                </div>
                <button
                  title="Borrar producto"
                  onClick={async () => {
                    if (!window.confirm('¿Seguro que deseas borrar este producto?')) return
                    try {
                      const res = await fetch(`http://localhost:3001/api/productos/${prod.id}`, {
                        method: 'DELETE'
                      })
                      if (res.status === 204 || res.status === 404) {
                        // Refresca la lista desde backend
                        const prods = await fetch('http://localhost:3001/api/productos').then(r => r.json())
                        setProductos(prods)
                      } else {
                        throw new Error('No se pudo borrar el producto')
                      }
                    } catch (err) {
                      alert('Error al borrar el producto.')
                    }
                  }}
                  style={{
                    background: 'transparent',
                    color: '#dc2626',
                    border: 'none',
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    padding: '0 0.5rem',
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default AdminDashboard