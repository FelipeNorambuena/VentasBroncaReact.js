import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import ordersService from '../services/orders'
import Footer from '../components/Footer'

/**
 * Página de Checkout - Finalización de compra
 * Permite al cliente completar su pedido ingresando información de envío
 */
function Checkout() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { items, clearCart, total, showNotification } = useContext(CartContext)

  // Estado del formulario
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    shipping_address: '',
    shipping_region: '',
    shipping_commune: '',
    payment_method: 'transferencia',
    notes: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [shippingCost, setShippingCost] = useState(0)

  // Regiones y comunas de Chile
  const regiones = [
    'Metropolitana',
    'Valparaíso',
    'Biobío',
    'Maule',
    'La Araucanía',
    'Los Lagos',
    'O\'Higgins',
    'Coquimbo',
    'Antofagasta',
    'Tarapacá',
    'Atacama',
    'Aysén',
    'Magallanes',
    'Los Ríos',
    'Arica y Parinacota',
    'Ñuble'
  ]

  // Calcular costo de envío según región
  useEffect(() => {
    const costoEnvio = formData.shipping_region === 'Metropolitana' ? 3000 : 5000
    setShippingCost(costoEnvio)
  }, [formData.shipping_region])

  // Prellenar datos del usuario si está autenticado
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        client_name: user.name || '',
        client_email: user.email || '',
        client_phone: user.phone || ''
      }))
    }
  }, [user])

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (items.length === 0) {
      showNotification('Tu carrito está vacío', 'warning')
      navigate('/productos')
    }
  }, [items, navigate, showNotification])

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Validar formulario
  const validateForm = () => {
    const newErrors = {}

    if (!formData.client_name.trim()) {
      newErrors.client_name = 'El nombre es obligatorio'
    }

    if (!formData.client_email.trim()) {
      newErrors.client_email = 'El correo es obligatorio'
    } else if (!ordersService.isValidEmail(formData.client_email)) {
      newErrors.client_email = 'El correo no es válido'
    }

    if (!formData.client_phone.trim()) {
      newErrors.client_phone = 'El teléfono es obligatorio'
    }

    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = 'La dirección es obligatoria'
    }

    if (!formData.shipping_region) {
      newErrors.shipping_region = 'La región es obligatoria'
    }

    if (!formData.shipping_commune.trim()) {
      newErrors.shipping_commune = 'La comuna es obligatoria'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Procesar el pedido
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showNotification('Por favor, completa todos los campos obligatorios', 'error')
      return
    }

    setLoading(true)

    try {
      // Preparar datos del pedido
      const orderData = {
        client_id: user?.id || null,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        shipping_address: formData.shipping_address,
        shipping_region: formData.shipping_region,
        shipping_commune: formData.shipping_commune,
        payment_method: formData.payment_method,
        notes: formData.notes,
        items: items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal: total,
        shipping_cost: shippingCost,
        total: total + shippingCost
      }

      // Validar con el servicio
      const validation = ordersService.validateOrder(orderData)
      if (!validation.isValid) {
        showNotification(validation.errors[0], 'error')
        setLoading(false)
        return
      }

      // Crear el pedido
      const createdOrder = await ordersService.create(orderData)

      // Limpiar carrito sin confirmación
      clearCart(true)

      // Mostrar mensaje de éxito
      showNotification('¡Pedido realizado con éxito!', 'success')

      // Redirigir a página de confirmación
      navigate('/checkout/confirmacion', { 
        state: { 
          order: createdOrder,
          message: '¡Gracias por tu compra! Recibirás un correo con los detalles de tu pedido.'
        } 
      })

    } catch (error) {
      console.error('Error al crear pedido:', error)
      showNotification(
        error.response?.data?.message || 'Error al procesar el pedido. Intenta nuevamente.',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  // Calcular subtotal
  const subtotal = total

  // Banner para usuarios no autenticados
  const [showGuestBanner, setShowGuestBanner] = useState(!isAuthenticated);
  // Si el usuario no está autenticado, bloquear el submit
  const isCheckoutDisabled = !isAuthenticated;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, paddingTop: '100px', paddingBottom: '60px', backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="row">
            {/* Columna del formulario */}
            <div className="col-lg-7 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <h2 className="mb-4" style={{ color: '#2d5016', fontWeight: 'bold' }}>
                    <i className="bi bi-bag-check me-2"></i>
                    Finalizar Compra
                  </h2>

                  {/* Banner para clientes no autenticados */}
                  {showGuestBanner && !isAuthenticated && (
                    <div className="alert alert-warning d-flex align-items-center justify-content-between" role="alert" style={{ marginBottom: '2rem' }}>
                      <div>
                        <strong>¡Debes registrarte para finalizar la compra!</strong> Por favor crea una cuenta o inicia sesión para continuar.
                      </div>
                      <div>
                        <button type="button" className="btn btn-primary btn-sm me-2" onClick={() => navigate('/register')}>Registrarse</button>
                        <button type="button" className="btn btn-success btn-sm" onClick={() => navigate('/login')}>Iniciar sesión</button>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {/* Información de contacto */}
                    <div className="mb-4">
                      <h5 className="mb-3" style={{ color: '#5a8c3a' }}>
                        <i className="bi bi-person-circle me-2"></i>
                        Información de Contacto
                      </h5>
                      
                      <div className="mb-3">
                        <label htmlFor="client_name" className="form-label">
                          Nombre Completo <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.client_name ? 'is-invalid' : ''}`}
                          id="client_name"
                          name="client_name"
                          value={formData.client_name}
                          onChange={handleChange}
                          placeholder="Juan Pérez"
                        />
                        {errors.client_name && (
                          <div className="invalid-feedback">{errors.client_name}</div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="client_email" className="form-label">
                          Correo Electrónico <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className={`form-control ${errors.client_email ? 'is-invalid' : ''}`}
                          id="client_email"
                          name="client_email"
                          value={formData.client_email}
                          onChange={handleChange}
                          placeholder="correo@ejemplo.com"
                        />
                        {errors.client_email && (
                          <div className="invalid-feedback">{errors.client_email}</div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="client_phone" className="form-label">
                          Teléfono <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          className={`form-control ${errors.client_phone ? 'is-invalid' : ''}`}
                          id="client_phone"
                          name="client_phone"
                          value={formData.client_phone}
                          onChange={handleChange}
                          placeholder="+56 9 1234 5678"
                        />
                        {errors.client_phone && (
                          <div className="invalid-feedback">{errors.client_phone}</div>
                        )}
                      </div>
                    </div>

                    {/* Dirección de envío */}
                    <div className="mb-4">
                      <h5 className="mb-3" style={{ color: '#5a8c3a' }}>
                        <i className="bi bi-geo-alt-fill me-2"></i>
                        Dirección de Envío
                      </h5>

                      <div className="mb-3">
                        <label htmlFor="shipping_address" className="form-label">
                          Dirección Completa <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.shipping_address ? 'is-invalid' : ''}`}
                          id="shipping_address"
                          name="shipping_address"
                          value={formData.shipping_address}
                          onChange={handleChange}
                          placeholder="Calle 123, Depto 456"
                        />
                        {errors.shipping_address && (
                          <div className="invalid-feedback">{errors.shipping_address}</div>
                        )}
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="shipping_region" className="form-label">
                            Región <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`form-select ${errors.shipping_region ? 'is-invalid' : ''}`}
                            id="shipping_region"
                            name="shipping_region"
                            value={formData.shipping_region}
                            onChange={handleChange}
                          >
                            <option value="">Selecciona una región</option>
                            {regiones.map(region => (
                              <option key={region} value={region}>{region}</option>
                            ))}
                          </select>
                          {errors.shipping_region && (
                            <div className="invalid-feedback">{errors.shipping_region}</div>
                          )}
                        </div>

                        <div className="col-md-6 mb-3">
                          <label htmlFor="shipping_commune" className="form-label">
                            Comuna <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${errors.shipping_commune ? 'is-invalid' : ''}`}
                            id="shipping_commune"
                            name="shipping_commune"
                            value={formData.shipping_commune}
                            onChange={handleChange}
                            placeholder="Santiago Centro"
                          />
                          {errors.shipping_commune && (
                            <div className="invalid-feedback">{errors.shipping_commune}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Método de pago */}
                    <div className="mb-4">
                      <h5 className="mb-3" style={{ color: '#5a8c3a' }}>
                        <i className="bi bi-credit-card me-2"></i>
                        Método de Pago
                      </h5>

                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="payment_method"
                          id="transferencia"
                          value="transferencia"
                          checked={formData.payment_method === 'transferencia'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="transferencia">
                          <i className="bi bi-bank me-2"></i>
                          Transferencia Bancaria
                        </label>
                      </div>

                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="payment_method"
                          id="efectivo"
                          value="efectivo"
                          checked={formData.payment_method === 'efectivo'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="efectivo">
                          <i className="bi bi-cash me-2"></i>
                          Efectivo (Pago contra entrega)
                        </label>
                      </div>
                    </div>

                    {/* Notas adicionales */}
                    <div className="mb-4">
                      <label htmlFor="notes" className="form-label">
                        <i className="bi bi-chat-left-text me-2"></i>
                        Notas Adicionales (Opcional)
                      </label>
                      <textarea
                        className="form-control"
                        id="notes"
                        name="notes"
                        rows="3"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Instrucciones de entrega, horarios preferidos, etc."
                      ></textarea>
                    </div>

                    {/* Botón de envío */}
                    <button
                      type="submit"
                      className="btn btn-lg w-100"
                      disabled={loading || items.length === 0 || isCheckoutDisabled}
                      style={{
                        backgroundColor: '#2d5016',
                        color: 'white',
                        border: 'none',
                        fontWeight: 'bold',
                        padding: '15px',
                        transition: 'all 0.3s ease'
                      }}
                      title={isCheckoutDisabled ? 'Debes estar registrado para finalizar la compra' : ''}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#3d6826'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#2d5016'}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Confirmar Pedido
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Columna del resumen */}
            <div className="col-lg-5">
              <div className="card shadow-sm border-0 sticky-top" style={{ top: '100px' }}>
                <div className="card-body p-4">
                  <h5 className="mb-4" style={{ color: '#2d5016', fontWeight: 'bold' }}>
                    <i className="bi bi-receipt me-2"></i>
                    Resumen del Pedido
                  </h5>

                  {/* Lista de productos */}
                  <div className="mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {items.map(item => (
                      <div key={item.id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                        <div className="flex-grow-1">
                          <h6 className="mb-1" style={{ fontSize: '14px' }}>{item.name}</h6>
                          <small className="text-muted">Cantidad: {item.quantity}</small>
                        </div>
                        <div className="text-end">
                          <strong style={{ color: '#2d5016' }}>
                            {ordersService.formatPrice(item.price * item.quantity)}
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cálculos */}
                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <strong>{ordersService.formatPrice(subtotal)}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>
                        Envío:
                        {formData.shipping_region && (
                          <small className="text-muted ms-1">({formData.shipping_region})</small>
                        )}
                      </span>
                      <strong>{ordersService.formatPrice(shippingCost)}</strong>
                    </div>
                    <div className="d-flex justify-content-between pt-3 border-top">
                      <h5 style={{ color: '#2d5016', fontWeight: 'bold' }}>Total:</h5>
                      <h5 style={{ color: '#2d5016', fontWeight: 'bold' }}>
                        {ordersService.formatPrice(subtotal + shippingCost)}
                      </h5>
                    </div>
                  </div>

                  {/* Info de envío */}
                  <div className="alert alert-info mt-3" style={{ fontSize: '13px' }}>
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Información de Envío:</strong>
                    <br />
                    Región Metropolitana: $3.000
                    <br />
                    Otras regiones: $5.000
                  </div>

                  {/* Botón volver */}
                  <button
                    className="btn btn-outline-secondary w-100 mt-2"
                    onClick={() => navigate('/productos')}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Seguir Comprando
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Checkout
