import React from 'react'

const vendedores = [
  { nombre: 'Camila', ventas: 18, total: 320000 },
  { nombre: 'Felipe', ventas: 22, total: 410000 },
  { nombre: 'Juan Pablo', ventas: 15, total: 275000 },
]

export default function AdminVentasVendedor() {
  return (
    <section className="mb-4">
      <div className="card">
        <div className="card-header bg-success text-white fw-bold">
          <i className="fas fa-users me-2"></i>Reporte Acumulado de Ventas por Vendedor (Mes Actual)
        </div>
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Vendedor</th>
                <th>Ventas Realizadas</th>
                <th>Total Acumulado</th>
              </tr>
            </thead>
            <tbody>
              {vendedores.map(v => (
                <tr key={v.nombre}>
                  <td>{v.nombre}</td>
                  <td>{v.ventas}</td>
                  <td>${v.total.toLocaleString('es-CL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
