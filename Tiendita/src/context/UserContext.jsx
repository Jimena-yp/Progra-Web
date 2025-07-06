import { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    const guardado = localStorage.getItem('usuario')
    if (guardado) {
      setUsuario(JSON.parse(guardado))
    }
  }, [])

  
  const login = async (correo, password) => {
    try {
      const res = await fetch('http://localhost:3001/api/usuarios')
      const usuarios = await res.json()
      const user = usuarios.find(u => u.correo === correo && u.password === password)
      if (user) {
        setUsuario(user)
        localStorage.setItem('usuario', JSON.stringify(user))
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  
  const registrar = async ({ nombre, apellido, correo, password }) => {
    try {
      const res = await fetch('http://localhost:3001/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, correo, password, rol: 'cliente' })
      })
      if (!res.ok) return false
      const user = await res.json()
      setUsuario(user)
      localStorage.setItem('usuario', JSON.stringify(user))
      return true
    } catch (error) {
      return false
    }
  }

  const actualizarUsuario = (nuevo) => {
    setUsuario(nuevo)
    localStorage.setItem('usuario', JSON.stringify(nuevo))
  }

  const logout = () => {
    setUsuario(null)
    localStorage.removeItem('usuario')
  }

  return (
    <UserContext.Provider value={{ usuario, login, logout, registrar, actualizarUsuario }}>
      {children}
    </UserContext.Provider>
  )
}