import React from 'react'

const usuarios = [
  { usuario: 'vendedor1', nombre: 'Camila', apellido: 'Soto', rut: '12.345.678-9', correo: 'camila@ventasbronca.cl' },
  { usuario: 'vendedor2', nombre: 'Felipe', apellido: 'Norambuena', rut: '11.222.333-4', correo: 'felipe@ventasbronca.cl' },
  { usuario: 'vendedor3', nombre: 'Juan Pablo', apellido: 'Gonzalez', rut: '15.444.555-6', correo: 'jp@ventasbronca.cl' },
]

export default function AdminUsuarios() {
  return (
    <section className="mb-4">
      <div className="card">
        <div className="card-header bg-dark text-white fw-bold">
          <i className="fas fa-users me-2"></i>Usuarios del Sistema
        </div>
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Usuario de Sistema</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>RUT</th>
                <th>Correo Electrónico</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.usuario}>
                  <td>{u.usuario}</td>
                  <td>{u.nombre}</td>
                  <td>{u.apellido}</td>
                  <td>{u.rut}</td>
                  <td>{u.correo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
