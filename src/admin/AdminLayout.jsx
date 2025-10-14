import React, { useEffect } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import './admin.css'
import logo from '../assets/images/logo.jpg'
import { useAuth } from '../context/AuthContext'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isAdmin, loading, logout, user } = useAuth()

  // Guard: solo permitir acceso a admins. Si no, redirigir a login con next=/admin
  useEffect(() => {
    if (loading) return
    if (!isAuthenticated || !isAdmin()) {
      const from = encodeURIComponent(location.pathname + location.search)
      navigate(`/login?next=${from || '/admin'}`, { replace: true })
    }
  }, [loading, isAuthenticated, isAdmin, navigate, location])

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav>
          <ul>
            <li><NavLink to="/admin" end><i className="fas fa-home me-2"></i>Inicio</NavLink></li>
            <li><NavLink to="/admin/usuarios"><i className="fas fa-user me-2"></i>Usuarios</NavLink></li>
            <li><NavLink to="/admin/productos"><i className="fas fa-boxes me-2"></i>Productos</NavLink></li>
            <li><NavLink to="/admin/crear-usuario"><i className="fas fa-user-plus me-2"></i>Crear Usuario</NavLink></li>
            <li><NavLink to="/admin/configuracion"><i className="fas fa-cog me-2"></i>Configuración</NavLink></li>
            <li><NavLink to="/admin/perfil"><i className="fas fa-id-badge me-2"></i>Perfil</NavLink></li>
          </ul>
        </nav>
        <div className="px-3 text-light small mb-2">{user?.name || user?.email}</div>
        <button className="admin-logout" onClick={handleLogout}><i className="fas fa-sign-out-alt me-2"></i>Logout</button>
      </aside>
      <main className="admin-main">
        {/* Mostrar un loader si aún está comprobando autenticación */}
        {loading ? (
          <div className="d-flex justify-content-center align-items-center min-vh-50">
            <div className="spinner-border text-success" role="status" />
          </div>
        ) : null}
        <Outlet />
      </main>
    </div>
  )
}
