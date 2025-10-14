import React from 'react'

const ventas = [
  { id: 1001, fecha: '10/09/2025 09:15', cliente: 'Juan Pérez', producto: 'Chaleco Táctico', cantidad: 2, total: 64000, estado: 'Pagado' },
  { id: 1002, fecha: '10/09/2025 10:22', cliente: 'María López', producto: 'Plato Doble Camping', cantidad: 1, total: 4990, estado: 'Pagado' },
  { id: 1003, fecha: '10/09/2025 11:05', cliente: 'Carlos Soto', producto: 'Sobaquera para Pistola', cantidad: 1, total: 15990, estado: 'Pagado' },
  { id: 1004, fecha: '10/09/2025 12:40', cliente: 'Andrea Ruiz', producto: 'Multiuso Gerber', cantidad: 3, total: 75000, estado: 'Pagado' },
]

export default function AdminVentasDia() {
  return (
    <section className="mb-4">
      <div className="card">
        <div className="card-header bg-primary text-white fw-bold">
          <i className="fas fa-chart-bar me-2"></i>Reporte de Ventas del Día
        </div>
        <div className="card-body p-0">
          <table className="table table-bordered mb-0">
            <thead>
              <tr>
                <th># Venta</th>
                <th>Fecha/Hora</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map(v => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.fecha}</td>
                  <td>{v.cliente}</td>
                  <td>{v.producto}</td>
                  <td>{v.cantidad}</td>
                  <td>${v.total.toLocaleString('es-CL')}</td>
                  <td><span className="badge bg-success">{v.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
