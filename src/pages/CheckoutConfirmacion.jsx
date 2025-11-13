import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ordersService from '../services/orders'
import Footer from '../components/Footer'

/**
 * Página de Confirmación de Pedido
 * Muestra mensaje de éxito y detalles del pedido creado
 */
function CheckoutConfirmacion() {
  const navigate = useNavigate()
  const location = useLocation()
  const order = location.state?.order
  const message = location.state?.message

  // Redirigir si no hay datos del pedido
  useEffect(() => {
    if (!order) {
      navigate('/productos')
    }
  }, [order, navigate])

  if (!order) {
    return null
  }

  const statusBadge = ordersService.getStatusBadge(order.status)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, paddingTop: '100px', paddingBottom: '60px', backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Mensaje de éxito */}
              <div className="text-center mb-5">
                <div 
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#d4edda',
                    animation: 'scaleIn 0.5s ease-out'
                  }}
                >
                  <i className="bi bi-check-circle-fill" style={{ fontSize: '60px', color: '#28a745' }}></i>
                </div>
                <h1 style={{ color: '#2d5016', fontWeight: 'bold' }}>¡Pedido Confirmado!</h1>
                <p className="lead text-muted">{message}</p>
              </div>

              {/* Detalles del pedido */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-4">
                  <h4 className="mb-4" style={{ color: '#2d5016' }}>
                    <i className="bi bi-receipt me-2"></i>
                    Detalles del Pedido
                  </h4>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong>Número de Pedido:</strong>
                      <p className="text-muted mb-0">#{order.id}</p>
                    </div>
                    <div className="col-md-6">
                      <strong>Fecha:</strong>
                      <p className="text-muted mb-0">{ordersService.formatDate(order.created_at)}</p>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong>Estado:</strong>
                      <p className="mb-0">
                        <span 
                          className="badge"
                          style={{ backgroundColor: statusBadge.color, color: 'white' }}
                        >
                          <i className={`${statusBadge.icon} me-1`}></i>
                          {statusBadge.text}
                        </span>
                      </p>
                    </div>
                    <div className="col-md-6">
                      <strong>Método de Pago:</strong>
                      <p className="text-muted mb-0">
                        {order.payment_method === 'transferencia' ? 'Transferencia Bancaria' : 'Efectivo'}
                      </p>
                    </div>
                  </div>

                  <hr />

                  {/* Información de contacto */}
                  <h5 className="mb-3" style={{ color: '#5a8c3a' }}>
                    <i className="bi bi-person-circle me-2"></i>
                    Información de Contacto
                  </h5>
                  <p className="mb-1"><strong>Nombre:</strong> {order.client_name}</p>
                  <p className="mb-1"><strong>Email:</strong> {order.client_email}</p>
                  <p className="mb-3"><strong>Teléfono:</strong> {order.client_phone}</p>

                  {/* Dirección de envío */}
                  <h5 className="mb-3" style={{ color: '#5a8c3a' }}>
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    Dirección de Envío
                  </h5>
                  <p className="mb-1">{order.shipping_address}</p>
                  <p className="mb-3">{order.shipping_commune}, {order.shipping_region}</p>

                  {/* Productos */}
                  <h5 className="mb-3" style={{ color: '#5a8c3a' }}>
                    <i className="bi bi-bag-check me-2"></i>
                    Productos
                  </h5>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th className="text-center">Cantidad</th>
                          <th className="text-end">Precio Unit.</th>
                          <th className="text-end">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.order_items && order.order_items.map(item => (
                          <tr key={item.id}>
                            <td>{item.product_name}</td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-end">{ordersService.formatPrice(item.price)}</td>
                            <td className="text-end">{ordersService.formatPrice(item.subtotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <hr />

                  {/* Totales */}
                  <div className="row">
                    <div className="col-md-6 ms-auto">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <strong>{ordersService.formatPrice(order.subtotal)}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Envío:</span>
                        <strong>{ordersService.formatPrice(order.shipping_cost)}</strong>
                      </div>
                      <div className="d-flex justify-content-between pt-2 border-top">
                        <h5 style={{ color: '#2d5016', fontWeight: 'bold' }}>Total:</h5>
                        <h5 style={{ color: '#2d5016', fontWeight: 'bold' }}>
                          {ordersService.formatPrice(order.total)}
                        </h5>
                      </div>
                    </div>
                  </div>

                  {/* Notas */}
                  {order.notes && (
                    <>
                      <hr />
                      <h5 className="mb-3" style={{ color: '#5a8c3a' }}>
                        <i className="bi bi-chat-left-text me-2"></i>
                        Notas
                      </h5>
                      <p className="text-muted mb-0">{order.notes}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Instrucciones de pago */}
              {order.payment_method === 'transferencia' && (
                <div className="alert alert-warning mb-4">
                  <h5 className="alert-heading">
                    <i className="bi bi-bank me-2"></i>
                    Instrucciones para Transferencia
                  </h5>
                  <p className="mb-2">Por favor, realiza la transferencia a la siguiente cuenta:</p>
                  <ul className="mb-2">
                    <li><strong>Banco:</strong> Banco Estado</li>
                    <li><strong>Tipo de Cuenta:</strong> Cuenta Corriente</li>
                    <li><strong>Número de Cuenta:</strong> 1234567890</li>
                    <li><strong>RUT:</strong> 12.345.678-9</li>
                    <li><strong>Nombre:</strong> Ventas Bronca</li>
                    <li><strong>Monto:</strong> {ordersService.formatPrice(order.total)}</li>
                  </ul>
                  <p className="mb-0">
                    <strong>Importante:</strong> Indica tu número de pedido (#{order.id}) en el concepto de la transferencia.
                  </p>
                </div>
              )}

              {/* Botones de acción */}
              <div className="d-flex gap-3 justify-content-center">
                <button
                  className="btn btn-lg"
                  style={{
                    backgroundColor: '#2d5016',
                    color: 'white',
                    border: 'none',
                    fontWeight: 'bold',
                    padding: '12px 30px'
                  }}
                  onClick={() => navigate('/mis-pedidos')}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#3d6826'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#2d5016'}
                >
                  <i className="bi bi-list-ul me-2"></i>
                  Ver Mis Pedidos
                </button>
                <button
                  className="btn btn-outline-secondary btn-lg"
                  onClick={() => navigate('/productos')}
                >
                  <i className="bi bi-shop me-2"></i>
                  Seguir Comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default CheckoutConfirmacion
