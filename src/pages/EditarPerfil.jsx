// Editar datos del perfil de usuario
import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import './EditarPerfil.css'

const EditarPerfil = () => {
  const { usuario, actualizarUsuario } = useUser()
  const [datos, setDatos] = useState({
    nombre: '',
    apellido: '',
    correo: ''
  })
  const [guardado, setGuardado] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (usuario) {
      setDatos({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        correo: usuario.correo || ''
      })
    }
  }, [usuario])

  const handleChange = e => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setGuardado(false)
    setError('')
    try {
      const res = await fetch(`http://localhost:3001/api/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      })
      if (!res.ok) throw new Error('Error al guardar cambios')
      const actualizado = await res.json()
      actualizarUsuario(actualizado)
      setGuardado(true)
    } catch (err) {
      setError('No se pudo guardar. Intenta de nuevo.')
    }
  }

  return (
    <section className="editar-perfil">
      <h2>Editar Perfil</h2>
      <form className="formulario" onSubmit={handleSubmit}>
        <input name="nombre" type="text" placeholder="Nombre" value={datos.nombre} onChange={handleChange} />
        <input name="apellido" type="text" placeholder="Apellido" value={datos.apellido} onChange={handleChange} />
        <input name="correo" type="email" placeholder="Correo" value={datos.correo} onChange={handleChange} />
        <button type="submit">Guardar cambios</button>
        {guardado && <p className="mensaje-vacio">¡Datos guardados!</p>}
        {error && <p className="mensaje-vacio" style={{color:'red'}}>{error}</p>}
      </form>
    </section>
  )
}

export default EditarPerfil
