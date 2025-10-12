import React, { useContext } from 'react'
import { CartContext } from '../context/CartContext'

export default function CartModal() {
  const { items, totalItems, totalPrice, removeItem, clearCart } = useContext(CartContext)

  return (
    <div className="modal fade" id="cartModal" tabIndex={-1} aria-labelledby="cartModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title" id="cartModalLabel"><i className="fas fa-shopping-cart me-2"></i>Tu Carrito de Compras</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar carrito"></button>
          </div>
          <div className="modal-body">
            <div id="cart-items-container">
              <ul id="cart-items" className="list-group mb-3">
                {items.length === 0 && (
                  <div id="cart-empty" className="text-center py-4">
                    <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <h6 className="text-muted">Tu carrito está vacío</h6>
                    <p className="text-muted">Agrega algunos productos para comenzar</p>
                  </div>
                )}
                {items.map((p) => (
                  <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{p.name}</strong>
                      <div className="small text-muted">Cantidad: {p.quantity}</div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">${(p.price * p.quantity).toFixed(2)}</div>
                      <button className="btn btn-link btn-sm text-danger" onClick={() => removeItem(p.id)}>Eliminar</button>
                    </div>
                  </li>
                ))}
              </ul>

              {items.length > 0 && (
                <div id="cart-summary">
                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Total de productos:</h6>
                    <span id="total-items" className="fw-bold">{totalItems}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Total a pagar:</h5>
                    <span id="total-price" className="h5 text-primary fw-bold">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><i className="fas fa-arrow-left me-1"></i>Seguir comprando</button>
            <button id="checkout-btn" className="btn btn-success" disabled={items.length === 0}><i className="fab fa-whatsapp me-1"></i>Finalizar pedido por WhatsApp</button>
          </div>
        </div>
      </div>
    </div>
  )
}
