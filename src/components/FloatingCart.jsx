import React, { useContext } from 'react'
import { CartContext } from '../context/CartContext'

export default function FloatingCart() {
  const { totalItems } = useContext(CartContext)

  return (
    <div className="floating-cart">
      <button id="cart-btn" className="btn btn-success btn-lg rounded-circle position-fixed shadow-lg" 
              style={{ bottom: 20, right: 20, width: 60, height: 60, zIndex: 1050 }}
              data-bs-toggle="modal" data-bs-target="#cartModal" aria-label="Ver carrito de compras">
        <i className="fas fa-shopping-cart"></i>
        <span id="cart-count" className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-pill">
          {totalItems}
        </span>
      </button>
    </div>
  )
}
