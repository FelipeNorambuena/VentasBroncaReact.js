import React, { createContext, useState } from 'react'

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = (product) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx].quantity = (copy[idx].quantity || 1) + (product.quantity || 1)
        return copy
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }]
    })
  }

  const removeItem = (id) => setItems((prev) => prev.filter((p) => p.id !== id))
  const clearCart = () => setItems([])

  const totalItems = items.reduce((s, p) => s + (p.quantity || 0), 0)
  const totalPrice = items.reduce((s, p) => s + ((p.price || 0) * (p.quantity || 0)), 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}
