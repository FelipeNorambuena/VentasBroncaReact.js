import React from 'react'

export default function ProductCard({ product, onAdd, onOpen }) {
  const formatPrice = (price, currency = 'CLP') => {
    const formatted = Number(price).toLocaleString('es-CL')
    return currency === 'CLP' ? `$${formatted}` : `${formatted} ${currency}`
  }

  return (
    <div className="col">
      <div className="card h-100 shadow-sm">
        <img 
          src={product.image} 
          className="card-img-top" 
          alt={product.name} 
          style={{ objectFit: 'cover', height: 200, cursor: 'pointer' }} 
          onClick={() => onOpen(product)}
        />
        <div className="card-body d-flex flex-column">
          <h6 className="card-title">{product.name}</h6>
          <p className="card-text text-muted small mb-2">
            <i className="fas fa-tag me-1"></i>
            {product.category}
          </p>
          {product.description && (
            <p className="card-text small text-secondary mb-2" style={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              display: '-webkit-box', 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical' 
            }}>
              {product.description}
            </p>
          )}
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <div className="fw-bold text-success fs-5">
              {formatPrice(product.price, product.currency)}
            </div>
            <div>
              <button 
                className="btn btn-sm btn-outline-primary me-2" 
                onClick={() => onOpen(product)}
                title="Ver detalles"
              >
                <i className="fas fa-eye"></i>
              </button>
              <button 
                className="btn btn-sm btn-success" 
                onClick={() => onAdd(product)}
                title="Agregar al carrito"
              >
                <i className="fas fa-cart-plus me-1"></i>
                Agregar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
