import React from 'react'

const productos = [
  { sku: 'CHA-001', nombre: 'Chaleco Táctico', categoria: 'Táctico', stock: 15, precio: 32000, estado: 'Disponible' },
  { sku: 'PLA-005', nombre: 'Plato Doble Camping', categoria: 'Camping', stock: 40, precio: 4990, estado: 'Disponible' },
  { sku: 'SOB-006', nombre: 'Sobaquera para Pistola', categoria: 'Militar', stock: 7, precio: 15990, estado: 'Bajo stock' },
  { sku: 'GUA-007', nombre: 'Guantes Impermeables', categoria: 'Táctico', stock: 0, precio: 11990, estado: 'Agotado' },
  { sku: 'MUL-001', nombre: 'Multiuso Gerber', categoria: 'Táctico', stock: 22, precio: 25000, estado: 'Disponible' },
]

export default function AdminInventario() {
  return (
    <section className="mb-4">
      <div className="card">
        <div className="card-header bg-dark text-white fw-bold">
          <i className="fas fa-clipboard-list me-2"></i>Reporte de Inventario de Productos
        </div>
        <div className="card-body p-0">
          <table className="table table-striped mb-0">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Precio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.sku}>
                  <td>{p.sku}</td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>{p.stock}</td>
                  <td>${p.precio.toLocaleString('es-CL')}</td>
                  <td>{p.estado === 'Disponible' && <span className="badge bg-success">Disponible</span>}
                      {p.estado === 'Bajo stock' && <span className="badge bg-warning text-dark">Bajo stock</span>}
                      {p.estado === 'Agotado' && <span className="badge bg-danger">Agotado</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
