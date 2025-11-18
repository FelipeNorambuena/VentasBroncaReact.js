import React, { useContext, useState, useEffect } from 'react'
import { CartContext } from '../context/CartContext'
import { getImageUrl } from '../utils/imageHelper'

export default function Lightbox({ image, product, onClose }) {
  const { addItem } = useContext(CartContext)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [productImages, setProductImages] = useState([])
  
  // Efecto para recopilar todas las imágenes del producto
  useEffect(() => {
    if (product) {
      let images = []
      
      // ✅ Usar el producto completo si está disponible
      const fullProduct = product._fullProduct || product
      
      // 1. Campo 'image' del producto (puede ser array u objeto)
      if (fullProduct.image) {
        // Si image es un array (múltiples imágenes)
        if (Array.isArray(fullProduct.image) && fullProduct.image.length > 0) {
          fullProduct.image.forEach((img, index) => {
            const imageUrl = getImageUrl(img)
            if (imageUrl) {
              images.push({
                url: imageUrl,
                alt: `${product.name} - Imagen ${index + 1}`,
                isPrincipal: index === 0
              })
            }
          })
        } 
        // Si image es un objeto único
        else if (typeof fullProduct.image === 'object' && !Array.isArray(fullProduct.image)) {
          const imageUrl = getImageUrl(fullProduct.image)
          if (imageUrl) {
            images.push({
              url: imageUrl,
              alt: product.name,
              isPrincipal: true
            })
          }
        }
        // Si image es una string (URL directa del producto mapeado)
        else if (typeof fullProduct.image === 'string') {
          images.push({
            url: fullProduct.image,
            alt: product.name,
            isPrincipal: true
          })
        }
      }
      
      // 2. Si no hay imágenes del campo 'image', buscar en relaciones
      if (images.length === 0) {
        const relatedImages = fullProduct._imagen_producto_of_product || 
                             fullProduct.imagen_producto_of_product || 
                             fullProduct.imagenes || []
        
        if (relatedImages.length > 0) {
          relatedImages.forEach((img, index) => {
            const imageUrl = getImageUrl(img)
            if (imageUrl) {
              images.push({
                url: imageUrl,
                alt: img.alt_text || `${product.name} - Imagen ${index + 1}`,
                isPrincipal: img.es_principal || false
              })
            }
          })
        }
      }
      
      // 3. Fallback: usar la imagen mapeada del producto si no hay ninguna
      if (images.length === 0 && product.image && typeof product.image === 'string') {
        images.push({
          url: product.image,
          alt: product.name,
          isPrincipal: true
        })
      }
      
      setProductImages(images)
      setCurrentImageIndex(0)
      
      console.log(`Lightbox - Total de imágenes para ${product.name}:`, images.length)
      console.log(`Lightbox - Imágenes recopiladas:`, images)
    }
  }, [product])
  
  const handlePrevImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))
  }
  
  const handleNextImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))
  }
  
  const handleThumbnailClick = (e, index) => {
    e.stopPropagation()
    setCurrentImageIndex(index)
  }
  
  if (!image && !product) return null
  
  // Si solo hay imagen (modo antiguo), mostrar solo imagen
  if (image && !product) {
    return (
      <div 
        className="lightbox-overlay" 
        style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.8)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          zIndex: 2000 
        }} 
        onClick={onClose}
      >
        <img 
          src={image} 
          alt="Producto ampliado" 
          style={{ maxWidth: '90%', maxHeight: '90%', boxShadow: '0 0 20px rgba(0,0,0,.5)' }} 
        />
      </div>
    )
  }
  
  // Modo producto completo
  const formatPrice = (price, currency = 'CLP') => {
    const formatted = Number(price).toLocaleString('es-CL')
    return currency === 'CLP' ? `$${formatted}` : `${formatted} ${currency}`
  }
  
  const handleAddToCart = (e) => {
    e.stopPropagation()
    addItem(product)
    onClose()
  }
  
  return (
    <div 
      className="lightbox-overlay" 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        background: 'rgba(0,0,0,0.9)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        zIndex: 2000,
        padding: '20px'
      }} 
      onClick={onClose}
    >
      <div 
        className="card" 
        style={{ maxWidth: 900, width: '100%', maxHeight: '90vh', overflow: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="row g-0">
          {/* Columna de imagen con carrusel */}
          <div className="col-md-6 position-relative">
            <div className="position-relative" style={{ minHeight: 400 }}>
              {/* Imagen principal */}
              <img 
                src={productImages.length > 0 ? productImages[currentImageIndex].url : product.image} 
                alt={productImages.length > 0 ? productImages[currentImageIndex].alt : product.name} 
                className="img-fluid rounded-start"
                style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 400 }}
              />
              
              {/* Botones de navegación (solo si hay más de 1 imagen) */}
              {productImages.length > 1 && (
                <>
                  <button
                    className="btn btn-dark position-absolute top-50 start-0 translate-middle-y ms-2"
                    onClick={handlePrevImage}
                    style={{ 
                      opacity: 0.7, 
                      zIndex: 10,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      padding: 0
                    }}
                    aria-label="Imagen anterior"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  <button
                    className="btn btn-dark position-absolute top-50 end-0 translate-middle-y me-2"
                    onClick={handleNextImage}
                    style={{ 
                      opacity: 0.7, 
                      zIndex: 10,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      padding: 0
                    }}
                    aria-label="Imagen siguiente"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                  
                  {/* Indicador de posición */}
                  <div 
                    className="position-absolute bottom-0 start-50 translate-middle-x mb-2 bg-dark text-white px-3 py-1 rounded-pill"
                    style={{ opacity: 0.7, fontSize: '0.875rem' }}
                  >
                    {currentImageIndex + 1} / {productImages.length}
                  </div>
                </>
              )}
            </div>
            
            {/* Miniaturas (solo si hay más de 1 imagen) */}
            {productImages.length > 1 && (
              <div className="d-flex gap-2 p-2 overflow-auto" style={{ maxHeight: 100 }}>
                {productImages.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
                    alt={img.alt}
                    className={`img-thumbnail ${index === currentImageIndex ? 'border-primary border-3' : ''}`}
                    style={{ 
                      width: 60, 
                      height: 60, 
                      objectFit: 'cover', 
                      cursor: 'pointer',
                      opacity: index === currentImageIndex ? 1 : 0.6
                    }}
                    onClick={(e) => handleThumbnailClick(e, index)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="col-md-6">
            <div className="card-body d-flex flex-column h-100">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h3 className="card-title mb-0">{product.name}</h3>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={onClose}
                  aria-label="Cerrar"
                ></button>
              </div>
              
              <div className="mb-3">
                <span className="badge bg-secondary">
                  <i className="fas fa-tag me-1"></i>
                  {product.category}
                </span>
              </div>
              
              {product.description && (
                <div className="mb-3">
                  <h6 className="text-muted">Descripción</h6>
                  <p className="card-text">{product.description}</p>
                </div>
              )}
              
              <div className="mt-auto">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h4 className="text-success mb-0">
                      {formatPrice(product.price, product.currency)}
                    </h4>
                  </div>
                </div>
                
                <button 
                  className="btn btn-success w-100 btn-lg"
                  onClick={handleAddToCart}
                >
                  <i className="fas fa-cart-plus me-2"></i>
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
