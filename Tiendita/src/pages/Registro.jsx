import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import './Registro.css'

const Registro = () => {
  const { registrar } = useUser()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    confirmar: ''
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const { nombre, apellido, correo, password, confirmar } = form

    if (!nombre || !apellido || !correo || !password || !confirmar) {
      setError('Todos los campos son obligatorios.')
      return
    }

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }

    const creado = registrar({ nombre, apellido, correo, password })

    if (!creado) {
      setError('Ese correo ya está registrado.')
      return
    }

    navigate('/cuenta')
  }

  return (
    <section className="registro">
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit} className="registro-form">
        <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        <input type="text" name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} />
        <input type="email" name="correo" placeholder="Correo electrónico" value={form.correo} onChange={handleChange} />
        <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} />
        <input type="password" name="confirmar" placeholder="Confirmar contraseña" value={form.confirmar} onChange={handleChange} />
        <button type="submit">Registrarme</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </section>
  )
}

export default Registro