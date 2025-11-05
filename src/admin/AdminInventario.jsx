import React, { useEffect, useState } from 'react'
import { productsService } from '../services/products'

// Mapeo de IDs de categoría a nombres
const categoriasMap = {
  1: 'Militares',
  2: 'Mochilas y bolsos',
  3: 'Camping',
  4: 'Jockey',
  5: 'Caza y pesca',
  6: 'Iluminación',
  7: 'Lentes',
  8: 'Botas Militares',
  9: 'Accesorios'
}

export default function AdminInventario() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
    valorTotal: 0,
    gananciaTotal: 0
  })

  useEffect(() => {
    loadProductos()
  }, [])

  const loadProductos = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Cargar todos los productos
      const res = await productsService.list({ page: 1, limit: 1000 })
      const list = Array.isArray(res) ? res : (res?.data || [])
      
      // Mapear productos con información de inventario
      const mapped = list.map(p => ({
        id: p.id,
        nombre: p.name || 'Sin nombre',
        categoria: categoriasMap[p.category_id] || 'Sin categoría',
        marca: p.brand || '-',
        precioCosto: Number(p.slug) || 0,
        precioVenta: Number(p.price) || 0,
        ganancias: Number(p.compare_at_price) || 0,
        is_active: p.is_active ?? true
      }))
      
      // Calcular estadísticas
      const estadisticas = {
        total: mapped.length,
        activos: mapped.filter(p => p.is_active).length,
        inactivos: mapped.filter(p => !p.is_active).length,
        valorTotal: mapped.reduce((sum, p) => sum + p.precioVenta, 0),
        gananciaTotal: mapped.reduce((sum, p) => sum + p.ganancias, 0)
      }
      
      setProductos(mapped)
      setStats(estadisticas)
    } catch (err) {
      console.error('Error cargando inventario:', err)
      setError(err.message || 'Error cargando inventario')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="mb-4">
        <div className="card">
          <div className="card-header bg-dark text-white fw-bold">
            <i className="fas fa-clipboard-list me-2"></i>Reporte de Inventario de Productos
          </div>
          <div className="card-body text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mb-4">
        <div className="card">
          <div className="card-header bg-dark text-white fw-bold">
            <i className="fas fa-clipboard-list me-2"></i>Reporte de Inventario de Productos
          </div>
          <div className="card-body">
            <div className="alert alert-danger">{error}</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-4">
      <div className="card">
        <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center">
          <span><i className="fas fa-clipboard-list me-2"></i>Reporte de Inventario de Productos</span>
          <button className="btn btn-sm btn-light" onClick={loadProductos} title="Recargar">
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
        
        {/* Estadísticas del inventario */}
        <div className="card-body bg-light border-bottom">
          <div className="row g-3">
            <div className="col-md-2">
              <div className="text-center">
                <div className="text-muted small">Total Productos</div>
                <div className="fs-4 fw-bold text-primary">{stats.total}</div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="text-center">
                <div className="text-muted small">Activos</div>
                <div className="fs-4 fw-bold text-success">{stats.activos}</div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="text-center">
                <div className="text-muted small">Inactivos</div>
                <div className="fs-4 fw-bold text-secondary">{stats.inactivos}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <div className="text-muted small">Valor Total Inventario</div>
                <div className="fs-5 fw-bold text-success">
                  ${stats.valorTotal.toLocaleString('es-CL')}
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <div className="text-muted small">Ganancias Potenciales</div>
                <div className="fs-5 fw-bold text-info">
                  ${stats.gananciaTotal.toLocaleString('es-CL')}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-body p-0">
          {productos.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="fas fa-box-open fa-3x mb-3"></i>
              <p>No hay productos en el inventario</p>
            </div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="table table-striped table-hover mb-0">
                <thead className="sticky-top bg-white">
                  <tr>
                    <th style={{ width: '60px' }}>ID</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th className="text-end">P. Costo</th>
                    <th className="text-end">P. Venta</th>
                    <th className="text-end">Ganancias</th>
                    <th className="text-center" style={{ width: '100px' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(p => (
                    <tr key={p.id}>
                      <td className="text-muted">{p.id}</td>
                      <td>
                        <div className="fw-semibold">{p.nombre}</div>
                        {p.marca && <div className="text-muted small">{p.marca}</div>}
                      </td>
                      <td>
                        <span className="badge bg-secondary">{p.categoria}</span>
                      </td>
                      <td className="text-end text-muted">
                        ${p.precioCosto.toLocaleString('es-CL')}
                      </td>
                      <td className="text-end fw-bold text-success">
                        ${p.precioVenta.toLocaleString('es-CL')}
                      </td>
                      <td className="text-end fw-semibold text-primary">
                        ${p.ganancias.toLocaleString('es-CL')}
                      </td>
                      <td className="text-center">
                        {p.is_active ? (
                          <span className="badge bg-success">Activo</span>
                        ) : (
                          <span className="badge bg-secondary">Inactivo</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
