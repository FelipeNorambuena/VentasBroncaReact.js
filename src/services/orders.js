import { http } from './http'

/**
 * Servicio para gestionar pedidos/órdenes del e-commerce
 */
export const ordersService = {
  /**
   * Crear un nuevo pedido
   * @param {Object} orderData - Datos del pedido
   * @param {number} orderData.client_id - ID del cliente
   * @param {string} orderData.client_name - Nombre del cliente
   * @param {string} orderData.client_email - Email del cliente
   * @param {string} orderData.client_phone - Teléfono del cliente
   * @param {string} orderData.shipping_address - Dirección de envío
   * @param {string} orderData.shipping_region - Región de envío
   * @param {string} orderData.shipping_commune - Comuna de envío
   * @param {number} orderData.shipping_cost - Costo de envío
   * @param {string} orderData.payment_method - Método de pago
   * @param {string} orderData.notes - Notas adicionales
   * @param {Array} orderData.items - Array de items [{product_id, quantity}]
   * @returns {Promise<Object>} Pedido creado con sus items
   */
  async create(orderData) {
    console.log('📦 Creando pedido:', orderData)
    try {
      const result = await http.post('/orders', orderData)
      console.log('✅ Pedido creado exitosamente:', result)
      return result
    } catch (error) {
      console.error('❌ Error al crear pedido:', error)
      throw error
    }
  },

  /**
   * Obtener todos los pedidos (Admin)
   * @returns {Promise<Array>} Lista de todos los pedidos
   */
  async getAll() {
    console.log('📋 Obteniendo todos los pedidos...')
    try {
      const result = await http.get('/orders')
      console.log(`✅ ${result.length} pedidos obtenidos`)
      
      // Cargar order_items para cada pedido si no vienen incluidos
      const ordersWithItems = await Promise.all(
        result.map(async (order) => {
          if (!order.order_items || order.order_items.length === 0) {
            try {
              const items = await http.get(`/order_items?order_id=${order.id}`)
              return { ...order, order_items: items }
            } catch (error) {
              console.warn(`⚠️ No se pudieron cargar items del pedido ${order.id}`)
              return { ...order, order_items: [] }
            }
          }
          return order
        })
      )
      
      return ordersWithItems
    } catch (error) {
      console.error('❌ Error al obtener pedidos:', error)
      throw error
    }
  },

  /**
   * Obtener pedidos de un cliente específico
   * @param {number} clientId - ID del cliente
   * @returns {Promise<Array>} Lista de pedidos del cliente
   */
  async getByClient(clientId) {
    console.log(`� Obteniendo pedidos del cliente ${clientId}...`)
    try {
      // Intenta primero con el endpoint específico
      try {
        const result = await http.get(`/orders/client/${clientId}`)
        console.log('✅ Pedidos del cliente obtenidos:', result)
        return result
      } catch (endpointError) {
        // Si el endpoint no existe, obtener todos y filtrar
        console.log('⚠️ Endpoint /orders/client/{id} no existe, filtrando del lado cliente...')
        const allOrders = await this.getAll()
        const clientOrders = allOrders.filter(order => order.client_id === clientId)
        console.log('✅ Pedidos del cliente filtrados:', clientOrders)
        return clientOrders
      }
    } catch (error) {
      console.error('❌ Error al obtener pedidos del cliente:', error)
      throw error
    }
  },

  /**
   * Obtener un pedido específico por ID
   * @param {number} orderId - ID del pedido
   * @returns {Promise<Object>} Pedido con sus items
   */
  async getById(orderId) {
    console.log(`📋 Obteniendo pedido ${orderId}...`)
    try {
      const result = await http.get(`/orders/${orderId}`)
      
      // Cargar order_items si no vienen incluidos
      if (!result.order_items || result.order_items.length === 0) {
        try {
          const items = await http.get(`/order_items?order_id=${orderId}`)
          result.order_items = items
        } catch (error) {
          console.warn(`⚠️ No se pudieron cargar items del pedido ${orderId}`)
          result.order_items = []
        }
      }
      
      console.log('✅ Pedido obtenido:', result)
      return result
    } catch (error) {
      console.error('❌ Error al obtener pedido:', error)
      throw error
    }
  },

  /**
   * Actualizar el estado de un pedido (Admin)
   * @param {number} orderId - ID del pedido
   * @param {string} status - Nuevo estado ('pendiente', 'aprobado', 'enviado', 'entregado', 'rechazado', 'cancelado')
   * @returns {Promise<Object>} Pedido actualizado
   */
  async updateStatus(orderId, status) {
    console.log(`🔄 Actualizando estado del pedido ${orderId} a "${status}"...`)
    
    // Validar estado
    const validStatuses = ['pendiente', 'aprobado', 'enviado', 'entregado', 'rechazado', 'cancelado']
    if (!validStatuses.includes(status)) {
      throw new Error(`Estado inválido. Use uno de: ${validStatuses.join(', ')}`)
    }

    try {
      const result = await http.patch(`/orders/${orderId}`, { status })
      console.log('✅ Estado actualizado:', result)
      return result
    } catch (error) {
      console.error('❌ Error al actualizar estado:', error)
      throw error
    }
  },

  /**
   * Eliminar un pedido (Admin)
   * @param {number} orderId - ID del pedido
   * @returns {Promise<void>}
   */
  async delete(orderId) {
    console.log(`🗑️ Eliminando pedido ${orderId}...`)
    try {
      await http.delete(`/orders/${orderId}`)
      console.log('✅ Pedido eliminado exitosamente')
    } catch (error) {
      console.error('❌ Error al eliminar pedido:', error)
      throw error
    }
  },

  /**
   * Obtener estadísticas de pedidos (para dashboard admin)
   * @returns {Promise<Object>} Estadísticas de pedidos
   */
  async getStatistics() {
    console.log('📊 Obteniendo estadísticas de pedidos...')
    try {
      const orders = await this.getAll()
      
      const stats = {
        total: orders.length,
        pendientes: orders.filter(o => o.status === 'pendiente').length,
        aprobados: orders.filter(o => o.status === 'aprobado').length,
        enviados: orders.filter(o => o.status === 'enviado').length,
        entregados: orders.filter(o => o.status === 'entregado').length,
        rechazados: orders.filter(o => o.status === 'rechazado').length,
        cancelados: orders.filter(o => o.status === 'cancelado').length,
        totalVentas: orders
          .filter(o => o.status !== 'rechazado' && o.status !== 'cancelado')
          .reduce((sum, o) => sum + (o.total || 0), 0)
      }
      
      console.log('✅ Estadísticas obtenidas:', stats)
      return stats
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error)
      throw error
    }
  },

  /**
   * Validar datos del pedido antes de enviar
   * @param {Object} orderData - Datos del pedido a validar
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validateOrder(orderData) {
    const errors = []

    // Validar cliente (permitir sin client_id para compras como invitado)
    if (!orderData.client_name || orderData.client_name.trim().length < 3) {
      errors.push('Nombre debe tener al menos 3 caracteres')
    }
    if (!orderData.client_email || !this.isValidEmail(orderData.client_email)) {
      errors.push('Email inválido')
    }
    if (!orderData.client_phone || orderData.client_phone.trim().length < 8) {
      errors.push('Teléfono inválido')
    }

    // Validar envío
    if (!orderData.shipping_address || orderData.shipping_address.trim().length < 10) {
      errors.push('Dirección de envío debe tener al menos 10 caracteres')
    }
    if (!orderData.shipping_region || orderData.shipping_region.trim().length === 0) {
      errors.push('Región es requerida')
    }
    if (!orderData.shipping_commune || orderData.shipping_commune.trim().length === 0) {
      errors.push('Comuna es requerida')
    }

    // Validar items
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      errors.push('El carrito está vacío')
    } else {
      // Validar cada item
      for (let i = 0; i < orderData.items.length; i++) {
        const item = orderData.items[i]
        if (!item.product_id || typeof item.product_id !== 'number') {
          errors.push(`Item ${i + 1}: product_id inválido`)
        }
        if (!item.quantity || item.quantity < 1 || typeof item.quantity !== 'number') {
          errors.push(`Item ${i + 1}: cantidad inválida`)
        }
      }
    }

    // Validar costos
    if (typeof orderData.shipping_cost !== 'number' || orderData.shipping_cost < 0) {
      errors.push('Costo de envío inválido')
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    }
  },

  /**
   * Validar formato de email
   * @param {string} email - Email a validar
   * @returns {boolean}
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Obtener badge de estado con color
   * @param {string} status - Estado del pedido
   * @returns {Object} {text, color, icon}
   */
  getStatusBadge(status) {
    const statusMap = {
      pendiente: { text: 'Pendiente', color: 'warning', icon: 'clock' },
      aprobado: { text: 'Aprobado', color: 'info', icon: 'check-circle' },
      enviado: { text: 'Enviado', color: 'primary', icon: 'truck' },
      entregado: { text: 'Entregado', color: 'success', icon: 'check-double' },
      rechazado: { text: 'Rechazado', color: 'danger', icon: 'times-circle' },
      cancelado: { text: 'Cancelado', color: 'secondary', icon: 'ban' }
    }
    return statusMap[status] || { text: status, color: 'secondary', icon: 'question' }
  },

  /**
   * Formatear precio en pesos chilenos
   * @param {number} price - Precio a formatear
   * @returns {string} Precio formateado
   */
  formatPrice(price) {
    return `$${Number(price).toLocaleString('es-CL')}`
  },

  /**
   * Formatear fecha
   * @param {number|string} timestamp - Timestamp o fecha
   * @returns {string} Fecha formateada
   */
  formatDate(timestamp) {
    if (!timestamp) return 'N/A'
    const date = new Date(timestamp)
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

export default ordersService
