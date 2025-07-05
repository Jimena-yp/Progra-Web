import { useState } from 'react'
import './CambiarPassword.css'

const CambiarPassword = () => {
  const [actual, setActual] = useState('')
  const [nueva, setNueva] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [mensaje, setMensaje] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (!actual || !nueva || !confirmar) {
      setMensaje('Por favor, completa todos los campos.')
      return
    }
    if (nueva !== confirmar) {
      setMensaje('Las contraseñas no coinciden.')
      return
    }
    setMensaje('¡Contraseña cambiada exitosamente!')
    // Aquí iría la lógica real de cambio de contraseña
  }

  return (
    <section className="cambiar-password">
      <h2>Cambiar Contraseña</h2>
      <form className="formulario" onSubmit={handleSubmit}>
        <input type="password" placeholder="Contraseña actual" value={actual} onChange={e => setActual(e.target.value)} />
        <input type="password" placeholder="Nueva contraseña" value={nueva} onChange={e => setNueva(e.target.value)} />
        <input type="password" placeholder="Confirmar nueva contraseña" value={confirmar} onChange={e => setConfirmar(e.target.value)} />
        <button type="submit">Guardar</button>
        {mensaje && <p className="mensaje-vacio">{mensaje}</p>}
      </form>
    </section>
  )
}

export default CambiarPassword
