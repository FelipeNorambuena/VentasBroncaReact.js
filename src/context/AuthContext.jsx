import React, { createContext, useContext, useState, useEffect } from 'react'
import { getAuthToken, removeAuthToken } from '../utils/authToken'
import { authService } from '../services/auth'

const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Verificar si hay una sesión activa al inicializar
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = getAuthToken()
      const storedUser = localStorage.getItem('ventasbronca_user')
      const expires = Number(localStorage.getItem('ventasbronca_token_expires') || 0)

      if (token && expires && Date.now() < expires) {
        // Token válido, verificar con el servidor
        try {
          const userData = await authService.me()
          setUser(userData)
          setIsAuthenticated(true)
        } catch (error) {
          // Token inválido o expirado en el servidor
          logout()
        }
      } else if (storedUser && token) {
        // Usar datos almacenados si no ha expirado localmente
        try {
          setUser(JSON.parse(storedUser))
          setIsAuthenticated(true)
        } catch {
          logout()
        }
      } else {
        // No hay sesión válida
        logout()
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = (userData, token) => {
    setUser(userData)
    setIsAuthenticated(true)
    
    // Guardar en localStorage
    if (userData) localStorage.setItem('ventasbronca_user', JSON.stringify(userData))
    const expires = Date.now() + 24 * 60 * 60 * 1000 // 24 horas
    localStorage.setItem('ventasbronca_token_expires', String(expires))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    removeAuthToken()
    localStorage.removeItem('ventasbronca_user')
    localStorage.removeItem('ventasbronca_token_expires')
  }

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData)
    if (updatedUserData) {
      localStorage.setItem('ventasbronca_user', JSON.stringify(updatedUserData))
    }
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}