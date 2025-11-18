import { http } from './http'

export const productsService = {
  async list(params = {}) {
    const query = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') query.append(k, v)
    }
    const qs = query.toString()
    return http.get(`/product${qs ? `?${qs}` : ''}`)
  },
  async getByIdOrSlug(idOrSlug) {
    return http.get(`/product/${encodeURIComponent(idOrSlug)}`)
  },
  async create(data) {
    const isForm = typeof FormData !== 'undefined' && data instanceof FormData
    return http.post('/product', data, { auth: true, headers: isForm ? {} : undefined })
  },
  async update(id, data) {
    const isForm = typeof FormData !== 'undefined' && data instanceof FormData
    return http.patch(`/product/${encodeURIComponent(id)}`, data, { auth: true, headers: isForm ? {} : undefined })
  },
  async remove(id) {
    return http.del(`/product/${encodeURIComponent(id)}`, { auth: true })
  },
  
  /**
   * Sube una imagen al servidor
   * @param {File} imageFile - Archivo de imagen a subir
   * @returns {Promise<{path: string}>} - Retorna objeto con la ruta de la imagen
   */
  async uploadImage(imageFile) {
    const formData = new FormData()
    formData.append('content', imageFile)  // ✅ Xano espera 'content' no 'image'
    
    // Subir la imagen y obtener la respuesta
    const response = await http.post('/upload/image', formData, { auth: true })
    
    // El endpoint retorna la respuesta, asegurarse de que sea JSON
    // Si la respuesta no es un objeto, intentar parsearla
    if (typeof response === 'string') {
      return JSON.parse(response)
    }
    return response
  },
  
  /**
   * Actualiza un producto para asociarle una imagen
   * @param {number} productId - ID del producto
   * @param {Object|Array} imageData - Objeto o array de imagen retornado por uploadImage
   * @returns {Promise} - Producto actualizado
   */
  async updateProductImage(productId, imageData) {
    // Si imageData es un array, tomar el primer elemento
    const imageObject = Array.isArray(imageData) ? imageData[0] : imageData
    
    // Xano espera el objeto completo de imagen, no solo el path
    const data = { image: imageObject }
    return http.patch(`/product/${encodeURIComponent(productId)}`, data, { auth: true })
  },
  
  /**
   * Crea un producto completo con imagen en un solo flujo
   * Paso 1: Crea el producto y obtiene su ID
   * Paso 2: Sube la imagen si existe
   * Paso 3: Actualiza el producto con la ruta de la imagen
   * 
   * @param {Object} productData - Datos del producto (nombre, precio, descripción, etc.)
   * @param {File|null} imageFile - Archivo de imagen opcional
   * @returns {Promise<Object>} - Producto creado con imagen asociada
   */
  async createWithImage(productData, imageFile = null) {
    try {
      // Paso 1: Crear el producto sin imagen
      console.log('📝 Paso 1: Creando producto...', productData)
      const product = await this.create(productData)
      console.log('✅ Producto creado con ID:', product.id)
      
      // Si no hay imagen, retornar el producto tal cual
      if (!imageFile) {
        console.log('ℹ️ No se proporcionó imagen, retornando producto')
        return product
      }
      
      // Paso 2: Subir la imagen
      console.log('📤 Paso 2: Subiendo imagen...')
      const imageResponse = await this.uploadImage(imageFile)
      console.log('📥 Respuesta del servidor:', imageResponse)
      
      // Xano retorna un array con el objeto de imagen completo
      // Ejemplo: [{path: "...", size: 123, type: "image", mime: "image/jpeg", ...}]
      let imageData = null
      let imagePath = null
      
      if (Array.isArray(imageResponse) && imageResponse.length > 0) {
        // Guardar el objeto completo (Xano lo necesita así)
        imageData = imageResponse[0]
        imagePath = imageData?.path || imageData?.url
      } else {
        // Si viene como objeto directo
        imageData = imageResponse
        imagePath = imageData?.path || imageData?.url
      }
      
      if (!imagePath) {
        throw new Error('No se pudo obtener la ruta de la imagen desde la respuesta del servidor')
      }
      
      console.log('✅ Imagen subida:', imagePath)
      console.log('📦 Objeto completo de imagen:', imageData)
      
      // Paso 3: Actualizar el producto con el objeto completo de imagen
      console.log('🔄 Paso 3: Asociando imagen al producto...')
      const updatedProduct = await this.updateProductImage(product.id, imageData)
      console.log('✅ Producto actualizado con imagen:', updatedProduct)
      
      return updatedProduct
      
    } catch (error) {
      console.error('❌ Error en createWithImage:', error)
      throw error
    }
  },
  
  /**
   * Actualiza un producto existente y opcionalmente cambia su imagen
   * 
   * @param {number} productId - ID del producto a actualizar
   * @param {Object} productData - Datos del producto a actualizar
   * @param {File|null} imageFile - Archivo de imagen opcional (si se quiere cambiar)
   * @returns {Promise<Object>} - Producto actualizado
   */
  async updateWithImage(productId, productData, imageFile = null) {
    try {
      // Paso 1: Actualizar los datos del producto
      console.log('📝 Paso 1: Actualizando datos del producto...', productData)
      let product = await this.update(productId, productData)
      console.log('✅ Producto actualizado')
      
      // Si no hay imagen nueva, retornar el producto actualizado
      if (!imageFile) {
        console.log('ℹ️ No se proporcionó imagen nueva')
        return product
      }
      
      // Paso 2: Subir la nueva imagen
      console.log('📤 Paso 2: Subiendo nueva imagen...')
      const imageResponse = await this.uploadImage(imageFile)
      console.log('📥 Respuesta del servidor:', imageResponse)
      
      // Xano retorna un array con el objeto de imagen completo
      let imageData = null
      let imagePath = null
      
      if (Array.isArray(imageResponse) && imageResponse.length > 0) {
        // Guardar el objeto completo (Xano lo necesita así)
        imageData = imageResponse[0]
        imagePath = imageData?.path || imageData?.url
      } else {
        // Si viene como objeto directo
        imageData = imageResponse
        imagePath = imageData?.path || imageData?.url
      }
      
      if (!imagePath) {
        throw new Error('No se pudo obtener la ruta de la imagen desde la respuesta del servidor')
      }
      
      console.log('✅ Imagen subida:', imagePath)
      console.log('📦 Objeto completo de imagen:', imageData)
      
      // Paso 3: Actualizar el producto con el objeto completo de imagen
      console.log('🔄 Paso 3: Actualizando imagen del producto...')
      product = await this.updateProductImage(productId, imageData)
      console.log('✅ Producto actualizado con nueva imagen:', product)
      
      return product
      
    } catch (error) {
      console.error('❌ Error en updateWithImage:', error)
      throw error
    }
  },
}
