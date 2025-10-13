import React from 'react'

export default function AdminPerfil() {
  // Simulación de datos de sesión
  const user = { nombre: 'Felipe', rol: 'admin', email: 'admin@ventasbronca.cl', rut: '11.222.333-4' }
  return (
    <section className="mb-4">
      <div className="card">
        <div className="card-header bg-dark text-white fw-bold">
          <i className="fas fa-id-badge me-2"></i>Perfil de Usuario
        </div>
        <div className="card-body">
          <ul className="list-group">
            <li className="list-group-item"><strong>Nombre:</strong> {user.nombre}</li>
            <li className="list-group-item"><strong>RUT:</strong> {user.rut}</li>
            <li className="list-group-item"><strong>Correo:</strong> {user.email}</li>
            <li className="list-group-item"><strong>Rol:</strong> {user.rol}</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
