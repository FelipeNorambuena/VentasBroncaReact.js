import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react'

export const CartContext = createContext(null)

// Función para dar formato a la moneda (CLP)
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(amount)
}

export function CartProvider({ children }) {
  // Cargar carrito desde localStorage al iniciar, o un array vacío
  const [items, setItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('ventasbronca_cart')
      return storedCart ? JSON.parse(storedCart) : []
    } catch (error) {
      console.error('Error al cargar el carrito desde localStorage:', error)
      return []
    }
  })

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    try {
      localStorage.setItem('ventasbronca_cart', JSON.stringify(items))
    } catch (error) {
      console.error('Error al guardar el carrito en localStorage:', error)
    }
  }, [items])

  // Estado para las notificaciones
  const [notification, setNotification] = useState(null)

  // Estado para el modal de confirmación
  const [confirm, setConfirm] = useState(null)

  // Función para mostrar notificaciones (memoizada)
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }, [])

  const addItem = useCallback((product) => {
    if (!product.id || !product.name || !product.price) {
        showNotification('Error: Datos del producto incompletos', 'error');
        return;
    }
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx].quantity = (copy[idx].quantity || 1) + (product.quantity || 1)
        showNotification(`Se agregaron ${product.quantity || 1} ${product.name}(s) más`, 'info')
        return copy
      }
      showNotification(`${product.name} agregado al carrito`, 'success')
      return [...prev, { ...product, quantity: product.quantity || 1 }]
    })
  }, [showNotification])

  const modifyQuantity = useCallback((productId, change) => {
    setItems(prev => {
        const itemIndex = prev.findIndex(i => i.id === productId);
        if (itemIndex === -1) return prev;

        const updatedItems = [...prev];
        const item = { ...updatedItems[itemIndex] };
        
        item.quantity += change;

        if (item.quantity <= 0) {
            // Si la cantidad es 0 o menos, se elimina del carrito
            updatedItems.splice(itemIndex, 1);
            showNotification(`${item.name} eliminado del carrito`, 'info');
        } else {
            updatedItems[itemIndex] = item;
        }
        
        return updatedItems;
    });
  }, [showNotification])

  const removeItem = useCallback((id) => {
    const item = items.find(i => i.id === id)
    if (!item) return

    // Mostrar el modal de confirmación
    setConfirm({
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que quieres eliminar ${item.name} del carrito?`,
        onConfirm: () => {
            setItems((prev) => prev.filter((p) => p.id !== id))
            showNotification('Producto eliminado del carrito', 'info')
            setConfirm(null) // Ocultar modal
        },
        onCancel: () => setConfirm(null) // Ocultar modal
    })
  }, [items, showNotification])
  
  const clearCart = useCallback(() => {
    if (items.length === 0) return
    // Mostrar el modal de confirmación
    setConfirm({
        title: 'Vaciar Carrito',
        message: '¿Estás seguro de que quieres vaciar todo el carrito?',
        onConfirm: () => {
            setItems([])
            showNotification('El carrito se ha vaciado', 'info')
            setConfirm(null)
        },
        onCancel: () => setConfirm(null)
    })
  }, [items.length, showNotification])

  const checkout = useCallback(() => {
    if (items.length === 0) {
        showNotification('El carrito está vacío', 'error');
        return;
    }
    let message = "¡Hola! Me interesa adquirir los siguientes productos:%0A%0A";
    let totalPrice = 0;
    items.forEach(item => {
        const subtotal = item.price * item.quantity;
        totalPrice += subtotal;
        message += `• ${item.name}%0A`;
        message += `  Cantidad: ${item.quantity}%0A`;
        message += `  Precio unitario: ${formatCurrency(item.price)}%0A`;
        message += `  Subtotal: ${formatCurrency(subtotal)}%0A%0A`;
    });
    message += `TOTAL: ${formatCurrency(totalPrice)}%0A%0A`;
    message += "¿Están disponibles? ¡Gracias!";
    const phoneNumber = "56974161396"; // Reemplazar con tu número si es necesario
    const whatsappURL = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${message}&type=phone_number&app_absent=0`;
    window.open(whatsappURL, '_blank');
    showNotification('Redirigiendo a WhatsApp...', 'success');
  }, [items, showNotification])

  const totalItems = useMemo(() => items.reduce((s, p) => s + (p.quantity || 0), 0), [items])
  const totalPrice = useMemo(() => items.reduce((s, p) => s + ((p.price || 0) * (p.quantity || 0)), 0), [items])

  return (
    <CartContext.Provider value={{ 
        items, 
        addItem, 
        removeItem, 
        clearCart, 
        modifyQuantity,
        checkout,
        totalItems, 
        totalPrice,
        notification,
        showNotification,
        confirm, // Pasar el estado del modal
        formatCurrency
    }}>
      {children}
    </CartContext.Provider>
  )
}
