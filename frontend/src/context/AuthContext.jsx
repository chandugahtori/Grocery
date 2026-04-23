import { createContext, useContext, useState } from 'react'
import { login as loginApi, register as registerApi } from '../api/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('navix_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = async (credentials) => {
    const { data } = await loginApi(credentials)
    localStorage.setItem('navix_token', data.access_token)
    // Decode payload for user info
    const payload = JSON.parse(atob(data.access_token.split('.')[1]))
    const userData = { id: payload.sub, role: payload.role }
    localStorage.setItem('navix_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = async (formData) => {
    const { data } = await registerApi(formData)
    return data
  }

  const logout = () => {
    localStorage.removeItem('navix_token')
    localStorage.removeItem('navix_user')
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'
  const isLoggedIn = !!user

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
