import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import ordersService from '../services/orders'
import { productImageService } from '../services/productImage'
import Footer from '../components/Footer'

/**
 * Página de Mis Pedidos - Vista del cliente
 * Muestra el historial de pedidos del usuario autenticado
 */
export default function Orders() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [productImages, setProductImages] = useState({}) // Cache de imágenes por product_id

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  // Cargar pedidos del usuario
  useEffect(() => {
    if (user?.id) {
      loadOrders()
    }
  }, [user])

  const loadOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await ordersService.getByClient(user.id)
      // Ordenar por fecha más reciente primero
      const sortedOrders = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setOrders(sortedOrders)
      
      // Cargar imágenes de productos
      await loadProductImages(sortedOrders)
    } catch (err) {
      console.error('Error al cargar pedidos:', err)
      let customMsg = err.message || 'No se pudieron cargar los pedidos. Intenta nuevamente.';
      if (customMsg.includes('Your plan only supports 10 requests per 20 seconds')) {
        customMsg = 'Has realizado demasiadas solicitudes. Por favor espera unos segundos y vuelve a intentarlo.';
      }
      setError(customMsg)
    } finally {
      setLoading(false)
    }
  }

  // Cargar imágenes de todos los productos en los pedidos
  const loadProductImages = async (orders) => {
    const productIds = new Set()
    
    // Recolectar todos los product_id únicos
    orders.forEach(order => {
      if (order.order_items) {
        order.order_items.forEach(item => {
          if (item.product_id) {
            productIds.add(item.product_id)
          }
        })
      }
    })

    // Cargar imágenes para cada producto
    const imagesCache = {}
    for (const productId of productIds) {
      try {
        const images = await productImageService.list({ id_producto: productId })
        if (images && images.length > 0) {
          // Buscar imagen principal o usar la primera
          const mainImage = images.find(img => img.es_principal) || images[0]
          imagesCache[productId] = mainImage.imagen
        }
      } catch (error) {
        console.error(`Error al cargar imagen del producto ${productId}:`, error)
      }
    }
    
    setProductImages(imagesCache)
  }

  // Obtener imagen de un producto (con fallback)
  const getProductImage = (productId) => {
    return productImages[productId] || '/placeholder-product.jpg'
  }

  // Filtrar pedidos por estado
  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus)

  // Ver detalle de un pedido
  const handleViewDetail = (order) => {
    console.log('📋 Mostrando detalle del pedido:', order)
    console.log('📦 Items del pedido:', order.order_items)
    setSelectedOrder(order)
  }

  const closeDetail = () => {
    setSelectedOrder(null)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, paddingTop: '100px', paddingBottom: '60px', backgroundColor: '#f8f9fa' }}>
        <div className="container">
          {/* Header */}
          <div className="row mb-4">
            <div className="col-12">
              <h2 style={{ color: '#2d5016', fontWeight: 'bold' }}>
                <i className="bi bi-bag-check me-2"></i>
                Mis Pedidos
              </h2>
              <p className="text-muted">Revisa el estado de tus compras</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="btn-group" role="group">
                <button
                  className={`btn ${filterStatus === 'all' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setFilterStatus('all')}
                >
                  Todos ({orders.length})
                </button>
                <button
                  className={`btn ${filterStatus === 'pendiente' ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => setFilterStatus('pendiente')}
                >
                  Pendientes ({orders.filter(o => o.status === 'pendiente').length})
                </button>
                <button
                  className={`btn ${filterStatus === 'aprobado' ? 'btn-info' : 'btn-outline-info'}`}
                  onClick={() => setFilterStatus('aprobado')}
                >
                  Aprobados ({orders.filter(o => o.status === 'aprobado').length})
                </button>
                <button
                  className={`btn ${filterStatus === 'enviado' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilterStatus('enviado')}
                >
                  Enviados ({orders.filter(o => o.status === 'enviado').length})
                </button>
                <button
                  className={`btn ${filterStatus === 'entregado' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setFilterStatus('entregado')}
                >
                  Entregados ({orders.filter(o => o.status === 'entregado').length})
                </button>
              </div>
            </div>
          </div>

          {/* Contenido */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted">Cargando tus pedidos...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
              <button className="btn btn-sm btn-outline-danger ms-3" onClick={loadOrders}>
                Reintentar
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="card shadow-sm border-0 text-center py-5">
              <div className="card-body">
                <i className="bi bi-bag-x" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                <h5 className="mt-3 text-muted">
                  {filterStatus === 'all' ? 'No tienes pedidos aún' : `No tienes pedidos ${filterStatus}`}
                </h5>
                <p className="text-muted">Explora nuestros productos y realiza tu primera compra</p>
                <button 
                  className="btn btn-lg mt-3"
                  style={{
                    backgroundColor: '#2d5016',
                    color: 'white',
                    border: 'none',
                    fontWeight: 'bold'
                  }}
                  onClick={() => navigate('/productos')}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#3d6826'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#2d5016'}
                >
                  <i className="bi bi-shop me-2"></i>
                  Explorar Productos
                </button>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {filteredOrders.map(order => {
                const statusBadge = ordersService.getStatusBadge(order.status)
                return (
                  <div key={order.id} className="col-12">
                    <div className="card shadow-sm border-0 h-100">
                      <div className="card-header" style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                        <div className="row align-items-center">
                          <div className="col-md-3">
                            <small className="text-muted">Pedido</small>
                            <div className="fw-bold" style={{ color: '#2d5016' }}>#{order.id}</div>
                          </div>
                          <div className="col-md-3">
                            <small className="text-muted">Fecha</small>
                            <div>{ordersService.formatDate(order.created_at)}</div>
                          </div>
                          <div className="col-md-3">
                            <small className="text-muted">Total</small>
                            <div className="fw-bold" style={{ color: '#2d5016' }}>
                              {ordersService.formatPrice(order.total)}
                            </div>
                          </div>
                          <div className="col-md-3 text-end">
                            <span 
                              className="badge"
                              style={{ 
                                backgroundColor: statusBadge.color, 
                                color: 'white',
                                padding: '8px 12px',
                                fontSize: '0.85rem'
                              }}
                            >
                              <i className={`${statusBadge.icon} me-1`}></i>
                              {statusBadge.text}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        {/* Información de envío */}
                        <div className="mb-3">
                          <h6 style={{ color: '#5a8c3a' }}>
                            <i className="bi bi-geo-alt-fill me-2"></i>
                            Dirección de Envío
                          </h6>
                          <p className="mb-1 small">{order.shipping_address}</p>
                          <p className="mb-0 small text-muted">{order.shipping_commune}, {order.shipping_region}</p>
                        </div>

                        {/* Productos */}
                        <div className="mb-3">
                          <h6 style={{ color: '#5a8c3a' }}>
                            <i className="bi bi-box-seam me-2"></i>
                            Productos ({order.order_items?.length || 0})
                          </h6>
                          <div className="list-group list-group-flush">
                            {order.order_items && order.order_items.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="list-group-item px-0 py-2 border-0">
                                <div className="d-flex align-items-center gap-3">
                                  {/* Imagen del producto */}
                                  <img 
                                    src={getProductImage(item.product_id)} 
                                    alt={item.product_name}
                                    style={{
                                      width: '60px',
                                      height: '60px',
                                      objectFit: 'cover',
                                      borderRadius: '8px',
                                      border: '1px solid #dee2e6'
                                    }}
                                    onError={(e) => {
                                      e.target.src = 'https://via.placeholder.com/60x60?text=Producto'
                                    }}
                                  />
                                  {/* Info del producto */}
                                  <div className="flex-grow-1">
                                    <div className="fw-medium">{item.product_name}</div>
                                    <small className="text-muted">Cantidad: {item.quantity}</small>
                                  </div>
                                  {/* Precio */}
                                  <div className="text-end">
                                    <span className="fw-bold" style={{ color: '#2d5016' }}>
                                      {ordersService.formatPrice(item.subtotal)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {order.order_items && order.order_items.length > 3 && (
                              <div className="small text-muted mt-2">
                                +{order.order_items.length - 3} producto(s) más
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Método de pago */}
                        <div className="mb-3">
                          <small className="text-muted">
                            <i className="bi bi-credit-card me-1"></i>
                            Método de pago: {order.payment_method === 'transferencia' ? 'Transferencia Bancaria' : 'Efectivo'}
                          </small>
                        </div>

                        {/* Botones */}
                        <div className="text-end">
                          <button 
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleViewDetail(order)}
                          >
                            <i className="bi bi-eye me-1"></i>
                            Ver Detalle Completo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalle del pedido */}
      {selectedOrder && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={closeDetail}
        >
          <div 
            className="modal-dialog modal-lg modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#2d5016', color: 'white' }}>
                <h5 className="modal-title">
                  <i className="bi bi-receipt me-2"></i>
                  Detalle del Pedido #{selectedOrder.id}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={closeDetail}
                ></button>
              </div>
              <div className="modal-body">
                {/* Estado y fecha */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <strong>Estado:</strong>
                    <p className="mb-0">
                      <span 
                        className="badge mt-1"
                        style={{ 
                          backgroundColor: ordersService.getStatusBadge(selectedOrder.status).color,
                          color: 'white',
                          fontSize: '0.9rem',
                          padding: '6px 10px'
                        }}
                      >
                        <i className={`${ordersService.getStatusBadge(selectedOrder.status).icon} me-1`}></i>
                        {ordersService.getStatusBadge(selectedOrder.status).text}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <strong>Fecha:</strong>
                    <p className="mb-0">{ordersService.formatDate(selectedOrder.created_at)}</p>
                  </div>
                </div>

                <hr />

                {/* Información de contacto */}
                <h6 style={{ color: '#5a8c3a' }}>
                  <i className="bi bi-person-circle me-2"></i>
                  Información de Contacto
                </h6>
                <p className="mb-1"><strong>Nombre:</strong> {selectedOrder.client_name}</p>
                <p className="mb-1"><strong>Email:</strong> {selectedOrder.client_email}</p>
                <p className="mb-3"><strong>Teléfono:</strong> {selectedOrder.client_phone}</p>

                {/* Dirección de envío */}
                <h6 style={{ color: '#5a8c3a' }}>
                  <i className="bi bi-geo-alt-fill me-2"></i>
                  Dirección de Envío
                </h6>
                <p className="mb-1">{selectedOrder.shipping_address}</p>
                <p className="mb-3">{selectedOrder.shipping_commune}, {selectedOrder.shipping_region}</p>

                {/* Productos */}
                <h6 style={{ color: '#5a8c3a' }}>
                  <i className="bi bi-box-seam me-2"></i>
                  Productos
                </h6>
                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead>
                      <tr>
                        <th style={{ width: '70px' }}>Imagen</th>
                        <th>Producto</th>
                        <th className="text-center">Cantidad</th>
                        <th className="text-end">Precio Unit.</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.order_items && selectedOrder.order_items.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <img 
                              src={getProductImage(item.product_id)} 
                              alt={item.product_name}
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                                borderRadius: '6px',
                                border: '1px solid #dee2e6'
                              }}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/50x50?text=Producto'
                              }}
                            />
                          </td>
                          <td>
                            <div className="fw-medium">{item.product_name}</div>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-secondary">{item.quantity}</span>
                          </td>
                          <td className="text-end">{ordersService.formatPrice(item.price)}</td>
                          <td className="text-end">
                            <strong style={{ color: '#2d5016' }}>
                              {ordersService.formatPrice(item.subtotal)}
                            </strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totales */}
                <div className="row">
                  <div className="col-md-6 ms-auto">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <strong>{ordersService.formatPrice(selectedOrder.subtotal)}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Envío:</span>
                      <strong>{ordersService.formatPrice(selectedOrder.shipping_cost)}</strong>
                    </div>
                    <div className="d-flex justify-content-between pt-2 border-top">
                      <h6 style={{ color: '#2d5016', fontWeight: 'bold' }}>Total:</h6>
                      <h6 style={{ color: '#2d5016', fontWeight: 'bold' }}>
                        {ordersService.formatPrice(selectedOrder.total)}
                      </h6>
                    </div>
                  </div>
                </div>

                {/* Método de pago */}
                <hr />
                <div className="alert alert-info mb-0">
                  <strong>
                    <i className="bi bi-credit-card me-2"></i>
                    Método de Pago:
                  </strong> {selectedOrder.payment_method === 'transferencia' ? 'Transferencia Bancaria' : 'Efectivo'}
                </div>

                {/* Notas */}
                {selectedOrder.notes && (
                  <>
                    <hr />
                    <h6 style={{ color: '#5a8c3a' }}>
                      <i className="bi bi-chat-left-text me-2"></i>
                      Notas
                    </h6>
                    <p className="text-muted mb-0">{selectedOrder.notes}</p>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeDetail}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
