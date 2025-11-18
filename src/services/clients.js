import { get, post, patch, del } from './http'

/**
 * Servicio para gestionar clientes
 * Estructura de la tabla client en Xano:
 * - id: integer
 * - created_at: timestamp
 * - full_name: text
 * - email: email
 * - password: password
 * - phone: text
 * - region: text
 * - commune: text
 */
export const clientsService = {
  /**
   * Obtener todos los clientes
   */
  list: async (params = {}) => {
    try {
      const response = await get('/client', params)
      return response
    } catch (error) {
      console.error('❌ Error al listar clientes:', error)
      throw error
    }
  },

  /**
   * Obtener un cliente por ID
   */
  getById: async (clientId) => {
    try {
      const response = await get(`/client/${clientId}`)
      return response
    } catch (error) {
      console.error(`❌ Error al obtener cliente ${clientId}:`, error)
      throw error
    }
  },

  /**
   * Crear nuevo cliente (registro)
   */
  create: async (clientData) => {
    try {
      console.log('📝 Creando nuevo cliente:', clientData)
      const response = await post('/client', clientData)
      console.log('✅ Cliente creado exitosamente:', response)
      return response
    } catch (error) {
      console.error('❌ Error al crear cliente:', error)
      throw error
    }
  },

  /**
   * Actualizar cliente
   */
  update: async (clientId, clientData) => {
    try {
      console.log(`📝 Actualizando cliente ${clientId}:`, clientData)
      const response = await patch(`/client/${clientId}`, clientData)
      console.log('✅ Cliente actualizado exitosamente:', response)
      return response
    } catch (error) {
      console.error(`❌ Error al actualizar cliente ${clientId}:`, error)
      throw error
    }
  },

  /**
   * Eliminar cliente
   */
  delete: async (clientId) => {
    try {
      console.log(`🗑️ Eliminando cliente ${clientId}`)
      const response = await del(`/client/${clientId}`)
      console.log('✅ Cliente eliminado exitosamente')
      return response
    } catch (error) {
      console.error(`❌ Error al eliminar cliente ${clientId}:`, error)
      throw error
    }
  }
}
