import { http } from './http'

/**
 * Servicio para gestionar usuarios de la tabla USER (vendedores y encargados)
 */
export const usersService = {
  /**
   * Crear un nuevo usuario en la tabla user
   * @param {Object} data - Datos del usuario
   * @param {string} data.name - Nombre completo
   * @param {string} data.email - Correo electrónico
   * @param {string} data.password - Contraseña
   * @param {string} data.role - Rol del usuario (vendedor o encargado)
   * @returns {Promise} Usuario creado
   */
  async create(data) {
    console.log('📝 Creando usuario en tabla USER:', data)
    try {
      const result = await http.post('/auth/signup', data, { base: 'auth' })
      console.log('✅ Usuario creado exitosamente:', result)
      return result
    } catch (error) {
      console.error('❌ Error al crear usuario:', error)
      throw error
    }
  },

  /**
   * Obtener todos los usuarios de la tabla user
   * @returns {Promise<Array>} Lista de usuarios
   */
  async list() {
    console.log('📋 Obteniendo lista de usuarios...')
    try {
      const result = await http.get('/user')
      console.log('✅ Usuarios obtenidos:', result)
      return Array.isArray(result) ? result : (result?.data || [])
    } catch (error) {
      console.error('❌ Error al obtener usuarios:', error)
      throw error
    }
  },

  /**
   * Obtener un usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise} Usuario encontrado
   */
  async getById(id) {
    console.log('🔍 Buscando usuario con ID:', id)
    try {
      const result = await http.get(`/user/${id}`)
      console.log('✅ Usuario encontrado:', result)
      return result
    } catch (error) {
      console.error('❌ Error al obtener usuario:', error)
      throw error
    }
  },

  /**
   * Actualizar un usuario existente
   * @param {number} id - ID del usuario
   * @param {Object} data - Datos a actualizar
   * @returns {Promise} Usuario actualizado
   */
  async update(id, data) {
    console.log('📝 Actualizando usuario ID:', id, 'con datos:', data)
    try {
      const result = await http.patch(`/user/${id}`, data)
      console.log('✅ Usuario actualizado:', result)
      return result
    } catch (error) {
      console.error('❌ Error al actualizar usuario:', error)
      throw error
    }
  },

  /**
   * Eliminar un usuario
   * @param {number} id - ID del usuario
   * @returns {Promise} Confirmación de eliminación
   */
  async delete(id) {
    console.log('🗑️ Eliminando usuario ID:', id)
    try {
      const result = await http.delete(`/user/${id}`)
      console.log('✅ Usuario eliminado:', result)
      return result
    } catch (error) {
      console.error('❌ Error al eliminar usuario:', error)
      throw error
    }
  }
}
