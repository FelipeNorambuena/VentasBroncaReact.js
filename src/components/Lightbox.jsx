import React, { useContext } from 'react'
import { CartContext } from '../context/CartContext'

export default function Lightbox({ image, product, onClose }) {
  const { addItem } = useContext(CartContext)
  
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
          <div className="col-md-6">
            <img 
              src={product.image} 
              alt={product.name} 
              className="img-fluid rounded-start"
              style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 400 }}
            />
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
