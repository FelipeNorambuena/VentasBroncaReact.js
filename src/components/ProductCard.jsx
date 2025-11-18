import React, { useState } from 'react'

export default function ProductCard({ product, onAdd, onOpen }) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const formatPrice = (price, currency = 'CLP') => {
    const formatted = Number(price).toLocaleString('es-CL')
    return currency === 'CLP' ? `$${formatted}` : `${formatted} ${currency}`
  }

  return (
    <div className="col">
      <style>{`
        .product-card {
          transition: all 0.3s ease;
          border: none;
          border-radius: 12px;
          overflow: hidden;
          height: 100%;
        }
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
        }
        .product-card-image-wrapper {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          height: 250px;
        }
        .product-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
          cursor: pointer;
        }
        .product-card:hover .product-card-image {
          transform: scale(1.1);
        }
        .product-card-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.75);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        .product-card-category {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(40, 167, 69, 0.9);
          color: white;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 11px;
          font-weight: 600;
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .product-card-body {
          padding: 1.25rem;
          background: white;
        }
        .product-card-title {
          font-size: 1rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          min-height: 2.8rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .product-card-description {
          font-size: 0.85rem;
          color: #6c757d;
          margin-bottom: 1rem;
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          min-height: 2.5rem;
        }
        .product-card-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #28a745;
          margin-bottom: 1rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        .product-card-actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
        }
        .btn-view-product {
          flex: 0 0 auto;
          background: #fff;
          border: 2px solid #007bff;
          color: #007bff;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.3s ease;
          font-weight: 600;
        }
        .btn-view-product:hover {
          background: #007bff;
          color: white;
          transform: scale(1.05);
        }
        .btn-add-cart {
          flex: 1;
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          border: none;
          color: white;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }
        .btn-add-cart:hover {
          background: linear-gradient(135deg, #20c997 0%, #28a745 100%);
          transform: scale(1.02);
          box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
        }
        .product-card-no-image {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-size: 4rem;
        }
      `}</style>
      
      <div 
        className="card product-card shadow-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="product-card-image-wrapper">
          {!imageError ? (
            <img 
              src={product.image} 
              className="product-card-image"
              alt={product.name} 
              onClick={() => onOpen(product)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div 
              className="product-card-no-image"
              onClick={() => onOpen(product)}
              style={{ cursor: 'pointer' }}
            >
              <i className="fas fa-image"></i>
            </div>
          )}
          
          {/* Badge de múltiples imágenes */}
          {product.totalImages > 1 && (
            <div className="product-card-badge">
              <i className="fas fa-images"></i>
              {product.totalImages}
            </div>
          )}
          
          {/* Categoría */}
          {product.category && (
            <div className="product-card-category">
              <i className="fas fa-tag me-1"></i>
              {product.category}
            </div>
          )}
        </div>
        
        <div className="product-card-body d-flex flex-column">
          <h6 className="product-card-title">{product.name}</h6>
          
          {product.description && (
            <p className="product-card-description">
              {product.description}
            </p>
          )}
          
          <div className="product-card-price">
            {formatPrice(product.price, product.currency)}
          </div>
          
          <div className="product-card-actions">
            <button 
              className="btn btn-view-product" 
              onClick={() => onOpen(product)}
              title="Ver detalles del producto"
            >
              <i className="fas fa-eye"></i>
            </button>
            <button 
              className="btn btn-add-cart" 
              onClick={() => onAdd(product)}
              title="Agregar al carrito"
            >
              <i className="fas fa-cart-plus me-2"></i>
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
