import { useState } from 'react'
import './RecuperarPassword.css'

const RecuperarPassword = () => {
  const [correo, setCorreo] = useState('')
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setEnviado(true) // Simulación
  }

  return (
    <section className="recuperar-password">
      <h2>Recuperar Contraseña</h2>

      {enviado ? (
        <p className="mensaje">
          📩 Si el correo <strong>{correo}</strong> está registrado, recibirás un mensaje para restablecer tu contraseña.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="formulario">
          <input
            type="email"
            placeholder="Ingresa tu correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <button type="submit">Enviar instrucciones</button>
        </form>
      )}
    </section>
  )
}

export default RecuperarPassword