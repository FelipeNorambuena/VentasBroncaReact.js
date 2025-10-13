import React, { useState } from 'react'
import ProductModal from './ProductModal'

const productos = [
  { 
    id: 1,
    imagenes: [{ id: 1, url: '/api/placeholder/400/400', esPrincipal: true }], 
    nombre: 'Chaleco Táctico', 
    sku: 'CHA-001', 
    precio: 32000, 
    stock: 15, 
    stockCritico: 5, 
    descripcion: 'Chaleco táctico de alta resistencia.' 
  },
  { 
    id: 2,
    imagenes: [], 
    nombre: 'Plato Doble Camping', 
    sku: 'PLA-005', 
    precio: 4990, 
    stock: 40, 
    stockCritico: 10, 
    descripcion: 'Plato doble ideal para camping.' 
  },
  { 
    id: 3,
    imagenes: [], 
    nombre: 'Sobaquera para Pistola', 
    sku: 'SOB-006', 
    precio: 15990, 
    stock: 7, 
    stockCritico: 3, 
    descripcion: 'Sobaquera adaptable para pistola.' 
  },
]

export default function AdminProductos() {
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const handleNewProduct = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleSaveProduct = (formData) => {
    // Aquí conectarás con tu API del backend
    console.log('Guardando producto:', formData)
    
    // Simulación de guardado
    alert(editingProduct ? 'Producto actualizado' : 'Producto creado')
    setShowModal(false)
  }

  const handleDeleteProduct = (product) => {
    if (confirm(`¿Eliminar producto ${product.nombre}?`)) {
      // API call para eliminar
      console.log('Eliminando:', product)
      alert('Producto eliminado')
    }
  }

  const handleViewProduct = (product) => {
    // Abrir modal de vista o navegar a página de detalle
    console.log('Viendo producto:', product)
  }
  return (
    <section className="mb-4">
      <div className="card">
        <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center">
          <span><i className="fas fa-boxes me-2"></i>Gestión de Productos</span>
          <button className="btn btn-success btn-sm" onClick={handleNewProduct}>
            <i className="fas fa-plus me-1"></i>Nuevo Producto
          </button>
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
                  <td>
                    {p.imagenes.length > 0 ? (
                      <div className="position-relative">
                        <img 
                          src={p.imagenes.find(img => img.esPrincipal)?.url || p.imagenes[0].url} 
                          alt={p.nombre} 
                          style={{ width: 48, height: 48, objectFit: 'cover' }} 
                          className="rounded"
                        />
                        {p.imagenes.length > 1 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge bg-primary rounded-pill" style={{ fontSize: '0.7em' }}>
                            +{p.imagenes.length - 1}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="d-flex align-items-center justify-content-center bg-light rounded" style={{ width: 48, height: 48 }}>
                        <i className="fas fa-image text-muted"></i>
                      </div>
                    )}
                  </td>
                  <td>{p.nombre}</td>
                  <td>{p.sku}</td>
                  <td>${p.precio.toLocaleString('es-CL')}</td>
                  <td>{p.stock}</td>
                  <td>{p.stockCritico}</td>
                  <td style={{ maxWidth: 200 }}>
                    <span className="text-truncate d-inline-block" style={{ maxWidth: '100%' }} title={p.descripcion}>
                      {p.descripcion}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-primary btn-sm me-1" title="Editar" onClick={() => handleEditProduct(p)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-danger btn-sm me-1" title="Eliminar" onClick={() => handleDeleteProduct(p)}>
                      <i className="fas fa-trash"></i>
                    </button>
                    <button className="btn btn-secondary btn-sm" title="Ver" onClick={() => handleViewProduct(p)}>
                      <i className="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar productos */}
      <ProductModal
        show={showModal}
        onClose={() => setShowModal(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </section>
  )
}
