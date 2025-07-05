import { Link } from 'react-router-dom'
import './PedidoCompletado.css'

const PedidoCompletado = () => {
  return (
    <section className="pedido-completado">
      <div className="check-container">
        <div className="check-icon">✔️</div>
        <h2>¡Gracias por tu compra!</h2>
        <p>Tu orden ha sido registrada correctamente.</p>
        <Link to="/">
          <button>Volver a la tienda</button>
        </Link>
      </div>
    </section>
  )
}

export default PedidoCompletado
