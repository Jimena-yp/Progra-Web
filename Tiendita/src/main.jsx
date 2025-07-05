import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { UserProvider } from './context/UserContext.jsx'

import { CarritoProvider } from './context/CarritoContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CarritoProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </CarritoProvider>
  </React.StrictMode>
)