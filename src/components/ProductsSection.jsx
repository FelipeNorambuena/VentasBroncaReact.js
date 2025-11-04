import React, { useState, useContext, useEffect } from 'react'
import ProductCard from './ProductCard'
import Lightbox from './Lightbox'
import { CartContext } from '../context/CartContext'
import './products-section.css'
import { productsService } from '../services/products'
import { productImageService } from '../services/productImage'
import { getImageUrl } from '../utils/imageHelper'
import { useSearchParams } from 'react-router-dom'

import imgA from '../assets/images/productos/tactico/MultiusoGerber.jpg'
import imgB from '../assets/images/productos/tactico/MultiusoGerber2.jpg'
import imgC from '../assets/images/productos/tactico/MultiusoGerber3.jpg'
import imgD from '../assets/images/productos/tactico/Guantesimpermeables1.jpg'
import imgE from '../assets/images/productos/tactico/CuerdaParacord15mts1.jpg'
import imgF from '../assets/images/productos/tactico/ChalecoTactico1.jpg'
import imgG from '../assets/images/productos/otros/SilbatoMulti1.jpg'
import imgH from '../assets/images/productos/camping/PlatoDoble1.jpg'

const SAMPLE_PRODUCTS = [
  { id: 'p1', name: 'Cuchillo multiuso Gerber', price: 19.99, category: 'Táctico', image: imgA },
  { id: 'p2', name: 'Guantes impermeables', price: 14.5, category: 'Táctico', image: imgD },
  { id: 'p3', name: 'Cuerda Paracord 15m', price: 9.99, category: 'Táctico', image: imgE },
  { id: 'p4', name: 'Chaleco táctico', price: 49.99, category: 'Táctico', image: imgF },
  { id: 'p5', name: 'Plato doble camping', price: 7.99, category: 'Camping', image: imgH },
  { id: 'p6', name: 'Silbato multiuso', price: 4.99, category: 'Otros', image: imgG },
  { id: 'p7', name: 'Cuchillo multiuso Gerber (2)', price: 24.99, category: 'Táctico', image: imgB },
  { id: 'p8', name: 'Cuchillo multiuso Gerber (3)', price: 29.99, category: 'Táctico', image: imgC },
]

export default function ProductsSection() {
  const { addItem, showNotification } = useContext(CartContext)
  const [lightboxProduct, setLightboxProduct] = useState(null)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const searchTerm = searchParams.get('search') || ''
  const categoryFilter = searchParams.get('category') || ''
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        // Cargar productos activos desde la API
        const res = await productsService.list({ page: 1, limit: 50 })
        const list = Array.isArray(res) ? res : (res?.data || [])
        
        console.log('📦 Productos recibidos del API:', list.length)
        console.log('📦 Productos completos:', list)
        
        // Filtrar solo productos activos
        const activeProducts = list.filter(p => p.is_active !== false)
        console.log('✅ Productos activos después de filtrar:', activeProducts.length)
        
        // Mapear productos con imágenes (ahora vienen incluidas desde Xano)
        const productsWithImages = activeProducts.map((product) => {
          let imageUrl = imgA // Imagen por defecto
          let totalImages = 0 // Contador de imágenes totales
          
          // ✅ PRIORIDAD 1: Campo 'image' principal (puede venir como array u objeto)
          if (product.image) {
            let imageObject = null
            
            // Si image es un array, tomar el primer elemento y contar total
            if (Array.isArray(product.image) && product.image.length > 0) {
              imageObject = product.image[0]
              totalImages = product.image.length // Contar todas las imágenes del array
            } 
            // Si image es un objeto directo
            else if (typeof product.image === 'object' && !Array.isArray(product.image)) {
              imageObject = product.image
              totalImages = 1
            }
            
            // Intentar obtener la URL del objeto
            if (imageObject) {
              const normalizedUrl = getImageUrl(imageObject)
              if (normalizedUrl) {
                imageUrl = normalizedUrl
                console.log(`Producto ${product.id} - URL desde campo 'image':`, imageUrl)
              }
            }
          }
          // ✅ PRIORIDAD 2: Imágenes relacionadas (tabla imagen_producto)
          else {
            // Xano puede usar guion bajo _ al inicio según la configuración del Addon
            const productImages = product._imagen_producto_of_product || 
                                  product.imagen_producto_of_product || 
                                  product.imagenes || []
            
            totalImages = productImages.length
            
            // Si el producto tiene imágenes desde Xano
            if (productImages.length > 0) {
              // Buscar imagen principal o tomar la primera por orden
              const mainImage = productImages.find(img => img.es_principal) || 
                               productImages.sort((a, b) => (a.orden || 0) - (b.orden || 0))[0]
              
              const normalizedUrl = getImageUrl(mainImage)
              
              if (normalizedUrl) {
                imageUrl = normalizedUrl
                console.log(`Producto ${product.id} - URL desde relación:`, imageUrl)
              }
            }
          }
          
          if (!imageUrl || imageUrl === imgA) {
            console.log(`Producto ${product.id} - Sin imágenes, usando default`)
          }
          
          const mappedProduct = {
            id: product.id,
            name: product.name || 'Producto',
            price: Number(product.price || 0),
            category: product.brand || 'General',
            image: imageUrl,
            description: product.description || '',
            currency: product.currency || 'CLP',
            totalImages: totalImages, // ✅ Agregar conteo de imágenes
            // ✅ IMPORTANTE: Incluir el campo image completo y las relaciones para el Lightbox
            _fullProduct: product // Guardamos el producto completo para el Lightbox
          }
          
          console.log(`📦 Producto ${product.id} mapeado:`, mappedProduct)
          
          return mappedProduct
        })
        
        console.log('✅ Total productos mapeados:', productsWithImages.length)
        console.log('✅ Productos finales:', productsWithImages)
        
        // Extraer categorías únicas
        const uniqueCategories = [...new Set(productsWithImages.map(p => p.category).filter(Boolean))]
        console.log('📂 Categorías encontradas:', uniqueCategories)
        
        if (mounted) {
          setProducts(productsWithImages)
          setFilteredProducts(productsWithImages) // Inicialmente mostrar todos
          setCategories(uniqueCategories.sort())
        }
      } catch (err) {
        console.error('Error cargando productos:', err)
        if (mounted) {
          // Usar productos de ejemplo en caso de error
          setProducts(SAMPLE_PRODUCTS)
          setFilteredProducts(SAMPLE_PRODUCTS)
          setCategories([...new Set(SAMPLE_PRODUCTS.map(p => p.category).filter(Boolean))].sort())
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // Efecto para filtrar productos cuando cambie el término de búsqueda o categoría
  useEffect(() => {
    let filtered = [...products]
    
    // Filtrar por categoría si está seleccionada
    if (categoryFilter) {
      filtered = filtered.filter(product => {
        const productCategory = (product.category || '').toLowerCase()
        const filterCategory = categoryFilter.toLowerCase()
        return productCategory.includes(filterCategory) || filterCategory.includes(productCategory)
      })
      console.log(`📂 Filtrando por categoría "${categoryFilter}": ${filtered.length} productos`)
    }
    
    // Filtrar por término de búsqueda si existe
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(product => {
        const name = (product.name || '').toLowerCase()
        const description = (product.description || '').toLowerCase()
        const category = (product.category || '').toLowerCase()
        
        return name.includes(term) || 
               description.includes(term) || 
               category.includes(term)
      })
      console.log(`🔍 Buscando "${searchTerm}": ${filtered.length} resultados`)
    }
    
    setFilteredProducts(filtered)
    setSelectedCategory(categoryFilter)
  }, [searchTerm, categoryFilter, products])
  
  // Función para cambiar categoría
  const handleCategoryChange = (category) => {
    if (category === '') {
      // Eliminar filtro de categoría
      searchParams.delete('category')
    } else {
      // Establecer nueva categoría
      searchParams.set('category', category)
    }
    setSearchParams(searchParams)
  }

  const handleAdd = (product) => addItem(product)
  const handleOpen = (product) => setLightboxProduct(product)

  return (
    <section className="products-section py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h1 className="display-6 fw-bold mb-2 products-section-title">
              {searchTerm 
                ? `Resultados de búsqueda: "${searchTerm}"` 
                : categoryFilter 
                  ? `Categoría: ${categoryFilter}` 
                  : 'Catálogo de Productos'}
            </h1>
            <p className="text-muted products-section-desc">
              {searchTerm 
                ? `${filteredProducts.length} producto${filteredProducts.length !== 1 ? 's' : ''} encontrado${filteredProducts.length !== 1 ? 's' : ''}`
                : categoryFilter
                  ? `${filteredProducts.length} producto${filteredProducts.length !== 1 ? 's' : ''} en esta categoría`
                  : 'Explora nuestra selección de productos tácticos, militares, camping y más'
              }
            </p>
            <hr className="mx-auto" style={{ width: 100, height: 3 }} />
          </div>
        </div>

        {/* Filtro de categorías */}
        {!searchTerm && categories.length > 0 && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex flex-wrap justify-content-center gap-2 align-items-center">
                <span className="fw-bold me-2">Filtrar por:</span>
                <button 
                  className={`btn btn-sm ${!selectedCategory ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleCategoryChange('')}
                >
                  Todas las categorías
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat}
                    className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status" aria-live="polite" aria-label="Cargando productos" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-search fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">No se encontraron productos</h5>
            <p className="text-muted">
              {searchTerm 
                ? `No hay productos que coincidan con "${searchTerm}". Intenta con otros términos.`
                : categoryFilter
                  ? `No hay productos disponibles en la categoría "${categoryFilter}".`
                  : 'No hay productos disponibles en este momento.'
              }
            </p>
            {(searchTerm || categoryFilter) && (
              <button 
                className="btn btn-primary mt-3"
                onClick={() => {
                  searchParams.delete('search')
                  searchParams.delete('category')
                  setSearchParams(searchParams)
                }}
              >
                Ver todos los productos
              </button>
            )}
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4" id="catalog-grid" aria-live="polite">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={handleAdd} onOpen={handleOpen} />
            ))}
          </div>
        )}
      </div>
      <Lightbox product={lightboxProduct} onClose={() => setLightboxProduct(null)} />
    </section>
  )
}
