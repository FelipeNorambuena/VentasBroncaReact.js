import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Orders() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  // Pedidos de ejemplo (puedes reemplazar con datos reales de una API)
  const orders = [
    {
      id: 1,
      fecha: '2025-10-15',
      total: 45990,
      estado: 'Entregado',
      productos: [
        { nombre: 'Mochila Táctica 40L', cantidad: 1, precio: 32000 },
        { nombre: 'Linterna LED', cantidad: 2, precio: 6995 }
      ]
    },
    {
      id: 2,
      fecha: '2025-10-28',
      total: 28000,
      estado: 'En camino',
      productos: [
        { nombre: 'Botas Militares', cantidad: 1, precio: 28000 }
      ]
    }
  ]

  const getEstadoBadge = (estado) => {
    const badges = {
      'Entregado': 'success',
      'En camino': 'primary',
      'Procesando': 'warning',
      'Cancelado': 'danger'
    }
    return badges[estado] || 'secondary'
  }

  return (
    <main className="container py-5 mt-5">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-bag me-2"></i>
                Mis Pedidos
              </h4>
            </div>
            <div className="card-body">
              {orders.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-bag-x" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                  <p className="text-muted mt-3">No tienes pedidos aún</p>
                  <button className="btn btn-primary" onClick={() => navigate('/productos')}>
                    Explorar Productos
                  </button>
                </div>
              ) : (
                <div className="row g-3">
                  {orders.map(order => (
                    <div key={order.id} className="col-12">
                      <div className="card border">
                        <div className="card-header bg-light">
                          <div className="row align-items-center">
                            <div className="col-md-3">
                              <small className="text-muted">Pedido</small>
                              <div className="fw-bold">#{order.id}</div>
                            </div>
                            <div className="col-md-3">
                              <small className="text-muted">Fecha</small>
                              <div>{new Date(order.fecha).toLocaleDateString('es-CL')}</div>
                            </div>
                            <div className="col-md-3">
                              <small className="text-muted">Total</small>
                              <div className="fw-bold text-success">
                                ${order.total.toLocaleString('es-CL')}
                              </div>
                            </div>
                            <div className="col-md-3 text-end">
                              <span className={`badge bg-${getEstadoBadge(order.estado)}`}>
                                {order.estado}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          <h6 className="mb-3">Productos:</h6>
                          <ul className="list-unstyled">
                            {order.productos.map((prod, idx) => (
                              <li key={idx} className="mb-2">
                                <div className="d-flex justify-content-between">
                                  <span>
                                    {prod.nombre} x {prod.cantidad}
                                  </span>
                                  <span className="text-muted">
                                    ${prod.precio.toLocaleString('es-CL')}
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                          <div className="text-end mt-3">
                            <button className="btn btn-sm btn-outline-primary">
                              Ver Detalle
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
