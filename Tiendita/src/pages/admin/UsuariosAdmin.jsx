import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './UsuariosAdmin.css'

const UsuariosAdmin = () => {
  const [busqueda, setBusqueda] = useState('')
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    fetch('http://localhost:3001/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(() => setUsuarios([]))
  }, [])

  const toggleActivo = (id) => {
    const actualizados = usuarios.map(u =>
      u.id === id ? { ...u, activo: !u.activo } : u
    )
    setUsuarios(actualizados)
  }

  // Solo mostrar usuarios que no sean admin
  const filtrados = usuarios.filter(u => {
    if (u.rol === 'admin') return false
    const texto = `${u.id} ${u.nombre} ${u.apellido}`.toLowerCase()
    return texto.includes(busqueda.toLowerCase())
  })

  return (
    <section className="usuarios-admin">
      <h2>Usuarios Registrados</h2>

      <input
        type="text"
        placeholder="Buscar por ID, nombre o apellido..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="filtro"
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acción</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre} {u.apellido}</td>
              <td>{u.correo}</td>
              <td>{u.activo === false ? 'Inactivo' : 'Activo'}</td>
              <td>
                <button onClick={() => toggleActivo(u.id)}>
                  {u.activo === false ? 'Activar' : 'Desactivar'}
                </button>
              </td>
              <td>
                <Link to={`/admin/usuarios/${u.id}`}>Ver</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default UsuariosAdmin