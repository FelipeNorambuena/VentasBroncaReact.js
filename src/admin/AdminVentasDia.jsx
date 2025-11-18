import React, { useEffect, useState } from 'react'
import { productsService } from '../services/products'

// Mapeo de categorías
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

// Colores para las categorías
const categoriasColores = {
  1: '#198754', // Verde - Militares
  2: '#0d6efd', // Azul - Mochilas
  3: '#fd7e14', // Naranja - Camping
  4: '#6610f2', // Púrpura - Jockey
  5: '#20c997', // Turquesa - Caza y pesca
  6: '#ffc107', // Amarillo - Iluminación
  7: '#0dcaf0', // Cyan - Lentes
  8: '#dc3545', // Rojo - Botas
  9: '#6c757d'  // Gris - Accesorios
}

export default function AdminVentasDia() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stockData, setStockData] = useState({
    porCategoria: [],
    topProductos: [],
    stats: {
      totalProductos: 0,
      totalValor: 0,
      totalGanancias: 0,
      promedioGanancia: 0
    }
  })

  useEffect(() => {
    loadStockData()
  }, [])

  const loadStockData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const res = await productsService.list({ page: 1, limit: 1000 })
      const list = Array.isArray(res) ? res : (res?.data || [])
      
      // Mapear productos
      const productos = list.map(p => ({
        id: p.id,
        nombre: p.name || 'Sin nombre',
        categoria: p.category_id,
        categoriaNombre: categoriasMap[p.category_id] || 'Sin categoría',
        precioCosto: Number(p.slug) || 0,
        precioVenta: Number(p.price) || 0,
        ganancias: Number(p.compare_at_price) || 0,
        is_active: p.is_active ?? true
      }))
      
      // Agrupar por categoría
      const porCategoria = {}
      productos.forEach(p => {
        if (!porCategoria[p.categoria]) {
          porCategoria[p.categoria] = {
            id: p.categoria,
            nombre: p.categoriaNombre,
            cantidad: 0,
            valorTotal: 0,
            gananciasTotal: 0
          }
        }
        porCategoria[p.categoria].cantidad++
        porCategoria[p.categoria].valorTotal += p.precioVenta
        porCategoria[p.categoria].gananciasTotal += p.ganancias
      })
      
      const categorias = Object.values(porCategoria).sort((a, b) => b.cantidad - a.cantidad)
      const maxCantidad = Math.max(...categorias.map(c => c.cantidad), 1)
      
      // Top 10 productos con mayor ganancia
      const topProductos = productos
        .filter(p => p.is_active)
        .sort((a, b) => b.ganancias - a.ganancias)
        .slice(0, 10)
      
      const maxGanancia = Math.max(...topProductos.map(p => p.ganancias), 1)
      
      // Estadísticas generales
      const stats = {
        totalProductos: productos.length,
        totalValor: productos.reduce((sum, p) => sum + p.precioVenta, 0),
        totalGanancias: productos.reduce((sum, p) => sum + p.ganancias, 0),
        promedioGanancia: productos.length > 0 
          ? productos.reduce((sum, p) => sum + p.ganancias, 0) / productos.length 
          : 0
      }
      
      setStockData({
        porCategoria: categorias.map(c => ({ ...c, maxCantidad })),
        topProductos: topProductos.map(p => ({ ...p, maxGanancia })),
        stats
      })
      
    } catch (err) {
      console.error('Error cargando datos de stock:', err)
      setError(err.message || 'Error cargando datos')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="mb-4">
        <div className="card">
          <div className="card-header bg-primary text-white fw-bold">
            <i className="fas fa-chart-bar me-2"></i>Dashboard de Stock por Categorías
          </div>
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
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
          <div className="card-header bg-primary text-white fw-bold">
            <i className="fas fa-chart-bar me-2"></i>Dashboard de Stock por Categorías
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
        <div className="card-header bg-primary text-white fw-bold d-flex justify-content-between align-items-center">
          <span><i className="fas fa-chart-bar me-2"></i>Dashboard de Stock por Categorías</span>
          <button className="btn btn-sm btn-light" onClick={loadStockData} title="Recargar">
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
        
        <div className="card-body">
          {/* Estadísticas generales */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card bg-light border-0 h-100">
                <div className="card-body text-center">
                  <i className="fas fa-boxes fa-2x text-primary mb-2"></i>
                  <div className="text-muted small">Total Productos</div>
                  <div className="fs-3 fw-bold text-primary">{stockData.stats.totalProductos}</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-light border-0 h-100">
                <div className="card-body text-center">
                  <i className="fas fa-dollar-sign fa-2x text-success mb-2"></i>
                  <div className="text-muted small">Valor Total</div>
                  <div className="fs-5 fw-bold text-success">
                    ${stockData.stats.totalValor.toLocaleString('es-CL')}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-light border-0 h-100">
                <div className="card-body text-center">
                  <i className="fas fa-chart-line fa-2x text-info mb-2"></i>
                  <div className="text-muted small">Ganancias Totales</div>
                  <div className="fs-5 fw-bold text-info">
                    ${stockData.stats.totalGanancias.toLocaleString('es-CL')}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-light border-0 h-100">
                <div className="card-body text-center">
                  <i className="fas fa-calculator fa-2x text-warning mb-2"></i>
                  <div className="text-muted small">Ganancia Promedio</div>
                  <div className="fs-5 fw-bold text-warning">
                    ${Math.round(stockData.stats.promedioGanancia).toLocaleString('es-CL')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Gráfico de productos por categoría */}
            <div className="col-md-6 mb-4">
              <h6 className="fw-bold mb-3">
                <i className="fas fa-layer-group me-2 text-primary"></i>
                Productos por Categoría
              </h6>
              <div className="bg-light p-3 rounded">
                {stockData.porCategoria.map(cat => (
                  <div key={cat.id} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-semibold small">{cat.nombre}</span>
                      <span className="badge bg-primary">{cat.cantidad}</span>
                    </div>
                    <div className="progress" style={{ height: '20px' }}>
                      <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ 
                          width: `${(cat.cantidad / cat.maxCantidad) * 100}%`,
                          backgroundColor: categoriasColores[cat.id] || '#6c757d'
                        }}
                        aria-valuenow={cat.cantidad} 
                        aria-valuemin="0" 
                        aria-valuemax={cat.maxCantidad}
                      >
                        ${cat.valorTotal.toLocaleString('es-CL')}
                      </div>
                    </div>
                    <div className="text-muted small mt-1">
                      Ganancias: ${cat.gananciasTotal.toLocaleString('es-CL')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 10 productos con mayor ganancia */}
            <div className="col-md-6 mb-4">
              <h6 className="fw-bold mb-3">
                <i className="fas fa-trophy me-2 text-warning"></i>
                Top 10 Productos - Mayor Ganancia
              </h6>
              <div className="bg-light p-3 rounded" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {stockData.topProductos.map((prod, index) => (
                  <div key={prod.id} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-warning text-dark">{index + 1}</span>
                        <span className="fw-semibold small">{prod.nombre}</span>
                      </div>
                      <span className="badge bg-success">
                        ${prod.ganancias.toLocaleString('es-CL')}
                      </span>
                    </div>
                    <div className="progress" style={{ height: '15px' }}>
                      <div 
                        className="progress-bar bg-success" 
                        role="progressbar" 
                        style={{ width: `${(prod.ganancias / prod.maxGanancia) * 100}%` }}
                        aria-valuenow={prod.ganancias} 
                        aria-valuemin="0" 
                        aria-valuemax={prod.maxGanancia}
                      >
                      </div>
                    </div>
                    <div className="text-muted small mt-1">
                      {prod.categoriaNombre} - Venta: ${prod.precioVenta.toLocaleString('es-CL')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
