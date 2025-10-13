import React from 'react'
import AdminInventario from './AdminInventario'
import AdminVentasDia from './AdminVentasDia'
import AdminVentasVendedor from './AdminVentasVendedor'

export default function AdminDashboard() {
  return (
    <div>
      <div className="alert alert-primary mb-4">¡Bienvenido, Administrador! Gestiona usuarios y productos.</div>
      <AdminInventario />
      <AdminVentasDia />
      <AdminVentasVendedor />
    </div>
  )
}
