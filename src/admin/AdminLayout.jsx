import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import './admin.css'
import logo from '../assets/images/logo.jpg'

export default function AdminLayout() {
  const navigate = useNavigate()
  // Simulación de usuario admin
  const user = { nombre: 'Felipe', rol: 'admin', email: 'admin@ventasbronca.cl' }

  const handleLogout = () => {
    // Aquí limpiarías el estado de sesión
    navigate('/')
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
        <button className="admin-logout" onClick={handleLogout}><i className="fas fa-sign-out-alt me-2"></i>Logout</button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
