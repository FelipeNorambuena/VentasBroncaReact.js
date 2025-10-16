import React, { useState, useContext, useEffect } from 'react'
import ProductCard from './ProductCard'
import Lightbox from './Lightbox'
import { CartContext } from '../context/CartContext'
import './products-section.css'
import { productsService } from '../services/products'
import { productImageService } from '../services/productImage'
import { getImageUrl } from '../utils/imageHelper'

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        // Cargar productos activos desde la API
        const res = await productsService.list({ page: 1, limit: 50 })
        const list = Array.isArray(res) ? res : (res?.data || [])
        
        // Filtrar solo productos activos
        const activeProducts = list.filter(p => p.is_active !== false)
        
        // Mapear productos con imágenes (ahora vienen incluidas desde Xano)
        const productsWithImages = activeProducts.map((product) => {
          let imageUrl = imgA // Imagen por defecto
          
          // ✅ PRIORIDAD 1: Campo 'image' principal (puede venir como array u objeto)
          if (product.image) {
            let imageObject = null
            
            // Si image es un array, tomar el primer elemento
            if (Array.isArray(product.image) && product.image.length > 0) {
              imageObject = product.image[0]
            } 
            // Si image es un objeto directo
            else if (typeof product.image === 'object' && !Array.isArray(product.image)) {
              imageObject = product.image
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
          
          return {
            id: product.id,
            name: product.name || 'Producto',
            price: Number(product.price || 0),
            category: product.brand || 'General',
            image: imageUrl,
            description: product.description || '',
            currency: product.currency || 'CLP'
          }
        })
        
        if (mounted) {
          setProducts(productsWithImages)
        }
      } catch (err) {
        console.error('Error cargando productos:', err)
        if (mounted) {
          // Usar productos de ejemplo en caso de error
          setProducts(SAMPLE_PRODUCTS)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const handleAdd = (product) => addItem(product)
  const handleOpen = (product) => setLightboxProduct(product)

  return (
    <section className="products-section py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h1 className="display-6 fw-bold mb-2 products-section-title">Catálogo de Productos</h1>
            <p className="text-muted products-section-desc">Explora nuestra selección de productos tácticos, militares, camping y más</p>
            <hr className="mx-auto" style={{ width: 100, height: 3 }} />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status" aria-live="polite" aria-label="Cargando productos" />
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4" id="catalog-grid" aria-live="polite">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={handleAdd} onOpen={handleOpen} />
            ))}
          </div>
        )}
      </div>
      <Lightbox product={lightboxProduct} onClose={() => setLightboxProduct(null)} />
    </section>
  )
}
