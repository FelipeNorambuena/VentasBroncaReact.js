/**
 * EJEMPLOS DE USO DIRECTO
 * Cómo usar las funciones de carga de productos con imágenes
 * sin necesidad de componentes React
 */

import { productsService } from './services/products'

// ============================================================================
// EJEMPLO 1: Crear producto SIN imagen
// ============================================================================
async function ejemplo1_CrearProductoSinImagen() {
  const productData = {
    name: 'Linterna Táctica LED',
    slug: 'linterna-tactica-led',
    description: 'Linterna LED de alta potencia para uso táctico',
    brand: 'TacticalLight',
    price: 15000,
    currency: 'CLP',
    is_active: true,
    tags: ['tactical', 'lighting', 'led'],
    category_id: 1
  }

  try {
    // Solo pasa los datos del producto, sin imagen
    const product = await productsService.createWithImage(productData)
    console.log('✅ Producto creado sin imagen:', product)
    return product
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  }
}

// ============================================================================
// EJEMPLO 2: Crear producto CON imagen
// ============================================================================
async function ejemplo2_CrearProductoConImagen() {
  const productData = {
    name: 'Mochila Militar 60L',
    slug: 'mochila-militar-60l',
    description: 'Mochila militar de gran capacidad con sistema MOLLE',
    brand: 'MilitaryGear',
    price: 89000,
    compare_at_price: 110000, // Precio antes de descuento
    currency: 'CLP',
    is_active: true,
    tags: ['military', 'backpack', 'molle'],
    category_id: 2
  }

  // Obtener el archivo de un input file
  const fileInput = document.getElementById('imagen')
  const imageFile = fileInput.files[0]

  if (!imageFile) {
    console.error('No se seleccionó ninguna imagen')
    return
  }

  try {
    // 🎯 MAGIA: Un solo llamado hace los 3 pasos automáticamente
    // 1. POST /product
    // 2. POST /upload/image
    // 3. PATCH /product/{id}
    const product = await productsService.createWithImage(productData, imageFile)
    console.log('✅ Producto creado con imagen:', product)
    console.log('🖼️ URL de la imagen:', product.imagen)
    return product
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  }
}

// ============================================================================
// EJEMPLO 3: Actualizar producto SIN cambiar la imagen
// ============================================================================
async function ejemplo3_ActualizarProductoSinCambiarImagen(productId) {
  const updatedData = {
    name: 'Mochila Militar 60L (Edición 2024)',
    price: 79000, // Nuevo precio
    compare_at_price: 110000,
    is_active: true
  }

  try {
    // Solo actualiza los datos, la imagen permanece igual
    const product = await productsService.updateWithImage(productId, updatedData)
    console.log('✅ Producto actualizado:', product)
    return product
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  }
}

// ============================================================================
// EJEMPLO 4: Actualizar producto Y cambiar su imagen
// ============================================================================
async function ejemplo4_ActualizarProductoConNuevaImagen(productId) {
  const updatedData = {
    name: 'Mochila Militar 60L (Nueva Versión)',
    price: 85000,
    description: 'Versión mejorada con nuevos compartimentos'
  }

  // Obtener la nueva imagen
  const fileInput = document.getElementById('nueva_imagen')
  const newImageFile = fileInput.files[0]

  if (!newImageFile) {
    console.error('No se seleccionó ninguna imagen nueva')
    return
  }

  try {
    // 🎯 Actualiza datos Y cambia la imagen automáticamente
    // 1. PATCH /product/{id} (datos)
    // 2. POST /upload/image
    // 3. PATCH /product/{id} (imagen)
    const product = await productsService.updateWithImage(productId, updatedData, newImageFile)
    console.log('✅ Producto actualizado con nueva imagen:', product)
    console.log('🖼️ Nueva URL de imagen:', product.imagen)
    return product
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  }
}

// ============================================================================
// EJEMPLO 5: Uso manual paso por paso (si necesitas más control)
// ============================================================================
async function ejemplo5_ProcesoManualPasoPorPaso() {
  // Paso 1: Crear el producto sin imagen
  const productData = {
    name: 'Chaleco Táctico',
    slug: 'chaleco-tactico',
    description: 'Chaleco táctico modular',
    price: 65000,
    currency: 'CLP'
  }

  try {
    console.log('📝 Paso 1: Creando producto...')
    const product = await productsService.create(productData)
    console.log('✅ Producto creado con ID:', product.id)

    // Paso 2: Subir la imagen
    const fileInput = document.getElementById('imagen')
    const imageFile = fileInput.files[0]

    if (imageFile) {
      console.log('📤 Paso 2: Subiendo imagen...')
      const imageResponse = await productsService.uploadImage(imageFile)
      const imagePath = imageResponse.path || imageResponse.url || imageResponse.imagen
      console.log('✅ Imagen subida:', imagePath)

      // Paso 3: Asociar la imagen al producto
      console.log('🔄 Paso 3: Asociando imagen al producto...')
      const updatedProduct = await productsService.updateProductImage(product.id, imagePath)
      console.log('✅ Producto final con imagen:', updatedProduct)
      return updatedProduct
    }

    return product
  } catch (error) {
    console.error('❌ Error en proceso manual:', error)
    throw error
  }
}

// ============================================================================
// EJEMPLO 6: Crear múltiples productos con imágenes
// ============================================================================
async function ejemplo6_CrearMultiplesProductos() {
  const productos = [
    {
      data: {
        name: 'Cuchillo Táctico',
        slug: 'cuchillo-tactico',
        description: 'Cuchillo de supervivencia',
        price: 25000,
        currency: 'CLP'
      },
      imageUrl: '/ruta/a/cuchillo.jpg' // Puedes pasar una URL o File
    },
    {
      data: {
        name: 'Cantimplora Militar',
        slug: 'cantimplora-militar',
        description: 'Cantimplora de aluminio 1L',
        price: 12000,
        currency: 'CLP'
      },
      imageUrl: '/ruta/a/cantimplora.jpg'
    }
  ]

  const resultados = []

  for (const producto of productos) {
    try {
      // Cargar la imagen como File si es necesario
      let imageFile = null
      if (producto.imageUrl) {
        // En un caso real, obtendrías el File de un input o lo cargarías
        imageFile = await fetch(producto.imageUrl)
          .then(r => r.blob())
          .then(blob => new File([blob], producto.data.slug + '.jpg'))
      }

      const result = await productsService.createWithImage(producto.data, imageFile)
      console.log(`✅ Creado: ${result.name}`)
      resultados.push(result)
    } catch (error) {
      console.error(`❌ Error creando ${producto.data.name}:`, error)
    }
  }

  return resultados
}

// ============================================================================
// EJEMPLO 7: Manejo de errores completo
// ============================================================================
async function ejemplo7_ManejoDeErrores() {
  const productData = {
    name: 'Producto de Prueba',
    price: 10000
    // Faltan campos requeridos a propósito para demostrar manejo de errores
  }

  const fileInput = document.getElementById('imagen')
  const imageFile = fileInput?.files[0]

  try {
    const product = await productsService.createWithImage(productData, imageFile)
    console.log('✅ Éxito:', product)
    return { success: true, product }
  } catch (error) {
    console.error('❌ Error capturado:', error)

    // Diferentes tipos de errores
    if (error.code === 400) {
      console.error('Datos inválidos:', error.details)
      return { success: false, error: 'Datos inválidos', details: error.details }
    } else if (error.code === 401) {
      console.error('No autorizado - necesitas iniciar sesión')
      return { success: false, error: 'No autorizado' }
    } else if (error.code === 403) {
      console.error('Permisos insuficientes')
      return { success: false, error: 'Sin permisos' }
    } else if (error.code === 404) {
      console.error('Recurso no encontrado')
      return { success: false, error: 'No encontrado' }
    } else {
      console.error('Error general:', error.message)
      return { success: false, error: error.message }
    }
  }
}

// ============================================================================
// EJEMPLO 8: Uso con FormData completo
// ============================================================================
async function ejemplo8_ConFormDataCompleto(formElement) {
  // Obtener datos del formulario HTML
  const formData = new FormData(formElement)

  const productData = {
    name: formData.get('name'),
    slug: formData.get('slug') || formData.get('name').toLowerCase().replace(/\s+/g, '-'),
    description: formData.get('description'),
    brand: formData.get('brand'),
    price: parseFloat(formData.get('price')),
    compare_at_price: formData.get('compare_at_price') ? parseFloat(formData.get('compare_at_price')) : null,
    currency: formData.get('currency'),
    is_active: formData.get('is_active') === 'on',
    tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : [],
    category_id: formData.get('category_id') ? parseInt(formData.get('category_id')) : null
  }

  // Obtener archivo de imagen del FormData
  const imageFile = formData.get('imagen')

  try {
    const product = await productsService.createWithImage(
      productData,
      imageFile.size > 0 ? imageFile : null // Solo enviar si hay archivo
    )
    console.log('✅ Producto creado desde formulario:', product)
    return product
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  }
}

// ============================================================================
// EXPORTAR EJEMPLOS PARA USO EN CONSOLA DEL NAVEGADOR
// ============================================================================
if (typeof window !== 'undefined') {
  window.ejemplosProductos = {
    ejemplo1_CrearProductoSinImagen,
    ejemplo2_CrearProductoConImagen,
    ejemplo3_ActualizarProductoSinCambiarImagen,
    ejemplo4_ActualizarProductoConNuevaImagen,
    ejemplo5_ProcesoManualPasoPorPaso,
    ejemplo6_CrearMultiplesProductos,
    ejemplo7_ManejoDeErrores,
    ejemplo8_ConFormDataCompleto
  }
  
  console.log('✅ Ejemplos cargados. Usa window.ejemplosProductos para acceder a ellos.')
  console.log('Ejemplos disponibles:')
  console.log('- ejemplo1_CrearProductoSinImagen()')
  console.log('- ejemplo2_CrearProductoConImagen()')
  console.log('- ejemplo3_ActualizarProductoSinCambiarImagen(productId)')
  console.log('- ejemplo4_ActualizarProductoConNuevaImagen(productId)')
  console.log('- ejemplo5_ProcesoManualPasoPorPaso()')
  console.log('- ejemplo6_CrearMultiplesProductos()')
  console.log('- ejemplo7_ManejoDeErrores()')
  console.log('- ejemplo8_ConFormDataCompleto(formElement)')
}

export {
  ejemplo1_CrearProductoSinImagen,
  ejemplo2_CrearProductoConImagen,
  ejemplo3_ActualizarProductoSinCambiarImagen,
  ejemplo4_ActualizarProductoConNuevaImagen,
  ejemplo5_ProcesoManualPasoPorPaso,
  ejemplo6_CrearMultiplesProductos,
  ejemplo7_ManejoDeErrores,
  ejemplo8_ConFormDataCompleto
}
