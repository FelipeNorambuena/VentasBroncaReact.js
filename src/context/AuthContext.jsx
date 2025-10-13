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
  const [userRole, setUserRole] = useState(null) // 'admin', 'cliente', etc.

  // Verificar si hay una sesión activa al inicializar
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = getAuthToken()
      const storedUser = localStorage.getItem('ventasbronca_user')
      const storedRole = localStorage.getItem('ventasbronca_user_role')
      const expires = Number(localStorage.getItem('ventasbronca_token_expires') || 0)

      if (token && expires && Date.now() < expires) {
        // Token válido, verificar con el servidor
        try {
          const userData = await authService.me()
          const role = detectUserRole(userData)
          setUser(userData)
          setUserRole(role)
          setIsAuthenticated(true)
        } catch (error) {
          // Token inválido o expirado en el servidor
          logout()
        }
      } else if (storedUser && token) {
        // Usar datos almacenados si no ha expirado localmente
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setUserRole(storedRole || detectUserRole(userData))
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

  const detectUserRole = (userData) => {
    // Detectar el rol basado en los datos del usuario (soporta 'role' y 'rol')
    const raw = (userData?.role ?? userData?.rol ?? '').toString().toLowerCase().trim()
    if (raw) {
      // Normalizar "administrador" a "admin"
      return raw === 'administrador' ? 'admin' : raw
    }
    // Booleans comunes
    if (userData?.is_admin === true || userData?.admin === true) {
      return 'admin'
    }
    // Heurísticas por email (fallback)
    const email = (userData?.email ?? userData?.correo ?? userData?.correo_electronico ?? '').toString().toLowerCase()
    if (email && (email.startsWith('admin@') || email.includes('@admin.') || email.endsWith('.admin'))) {
      return 'admin'
    }
    return 'cliente'
  }

  const login = (userData, token) => {
    const role = detectUserRole(userData)
    
    setUser(userData)
    setUserRole(role)
    setIsAuthenticated(true)
    
    // Guardar en localStorage
    if (userData) localStorage.setItem('ventasbronca_user', JSON.stringify(userData))
    if (role) localStorage.setItem('ventasbronca_user_role', role)
    const expires = Date.now() + 24 * 60 * 60 * 1000 // 24 horas
    localStorage.setItem('ventasbronca_token_expires', String(expires))
  }

  const logout = () => {
    setUser(null)
    setUserRole(null)
    setIsAuthenticated(false)
    removeAuthToken()
    localStorage.removeItem('ventasbronca_user')
    localStorage.removeItem('ventasbronca_user_role')
    localStorage.removeItem('ventasbronca_token_expires')
  }

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData)
    const role = detectUserRole(updatedUserData)
    setUserRole(role)
    if (updatedUserData) {
      localStorage.setItem('ventasbronca_user', JSON.stringify(updatedUserData))
      localStorage.setItem('ventasbronca_user_role', role)
    }
  }

  // Funciones de utilidad para verificar roles
  const isAdmin = () => userRole === 'admin'
  const isClient = () => userRole === 'cliente'

  const value = {
    user,
    userRole,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
    checkAuthStatus,
    isAdmin,
    isClient
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}