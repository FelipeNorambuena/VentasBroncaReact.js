import React from 'react'

const productos = [
  { imagen: '', nombre: 'Chaleco Táctico', sku: 'CHA-001', precio: 32000, stock: 15, stockCritico: 5, descripcion: 'Chaleco táctico de alta resistencia.' },
  { imagen: '', nombre: 'Plato Doble Camping', sku: 'PLA-005', precio: 4990, stock: 40, stockCritico: 10, descripcion: 'Plato doble ideal para camping.' },
  { imagen: '', nombre: 'Sobaquera para Pistola', sku: 'SOB-006', precio: 15990, stock: 7, stockCritico: 3, descripcion: 'Sobaquera adaptable para pistola.' },
]

export default function AdminProductos() {
  return (
    <section className="mb-4">
      <div className="card">
        <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center">
          <span><i className="fas fa-boxes me-2"></i>Gestión de Productos</span>
          <button className="btn btn-success btn-sm"><i className="fas fa-plus me-1"></i>Nuevo Producto</button>
        </div>
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Código (SKU)</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Stock Crítico</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.sku}>
                  <td>{p.imagen ? <img src={p.imagen} alt={p.nombre} style={{ width: 48, height: 48, objectFit: 'cover' }} /> : <span className="text-muted">Sin imagen</span>}</td>
                  <td>{p.nombre}</td>
                  <td>{p.sku}</td>
                  <td>${p.precio.toLocaleString('es-CL')}</td>
                  <td>{p.stock}</td>
                  <td>{p.stockCritico}</td>
                  <td>{p.descripcion}</td>
                  <td>
                    <button className="btn btn-primary btn-sm me-1" title="Editar"><i className="fas fa-edit"></i></button>
                    <button className="btn btn-danger btn-sm me-1" title="Eliminar"><i className="fas fa-trash"></i></button>
                    <button className="btn btn-secondary btn-sm" title="Ver"><i className="fas fa-eye"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
