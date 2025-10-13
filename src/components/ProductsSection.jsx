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
        
        // Para cada producto, obtener su primera imagen
        const productsWithImages = await Promise.all(
          activeProducts.map(async (product) => {
            let imageUrl = imgA // Imagen por defecto
            try {
              const imagesRes = await productImageService.list({ product_id: product.id })
              const images = Array.isArray(imagesRes) ? imagesRes : (imagesRes?.data || [])
              
              console.log(`Producto ${product.id} - Imágenes recibidas:`, images) // DEBUG
              
              if (images.length > 0) {
                // Ordenar por sort_order y tomar la primera
                const sortedImages = images.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                const normalizedUrl = getImageUrl(sortedImages[0])
                
                if (normalizedUrl) {
                  imageUrl = normalizedUrl
                  console.log(`Producto ${product.id} - URL final:`, imageUrl) // DEBUG
                }
              } else {
                console.log(`Producto ${product.id} - Sin imágenes, usando default`) // DEBUG
              }
            } catch (err) {
              console.warn(`No se pudieron cargar imágenes para producto ${product.id}`, err)
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
        )
        
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
