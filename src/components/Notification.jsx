import React, { useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CartContext } from '../context/CartContext'

function Notification() {
  const { notification, clearNotification } = useContext(CartContext)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (notification) {
      setIsVisible(true)
      
      // Auto-cerrar después de 5 segundos
      const timer = setTimeout(() => {
        handleClose()
      }, 5000)
      
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [notification])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      if (clearNotification) {
        clearNotification()
      }
    }, 300) // Esperar a que termine la animación
  }

  if (!notification || !isVisible) {
    return null
  }

  const notificationElement = (
    <div 
      className={`alert alert-${notification.type === 'error' ? 'danger' : notification.type} alert-dismissible fade show position-fixed shadow-lg`}
      style={{ 
        top: '100px', 
        right: '20px', 
        zIndex: 9999, 
        minWidth: '300px',
        maxWidth: '500px',
        animation: 'slideInRight 0.3s ease-out'
      }}
      role="alert"
    >
      <strong>{notification.type === 'success' ? '✓ ' : notification.type === 'error' ? '✗ ' : 'ℹ '}</strong>
      {notification.message}
      <button 
        type="button" 
        className="btn-close" 
        onClick={handleClose}
        aria-label="Close"
      ></button>
    </div>
  )

  // Usar portal para renderizar fuera del árbol de componentes
  return createPortal(notificationElement, document.body)
}

export default Notification
