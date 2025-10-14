import React, { useEffect } from 'react'

export default function Toast({ show, message, type = 'success', onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  const bgColors = {
    success: 'bg-success',
    error: 'bg-danger',
    warning: 'bg-warning',
    info: 'bg-info'
  }

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  }

  return (
    <div 
      className="position-fixed top-0 end-0 p-3" 
      style={{ zIndex: 9999 }}
    >
      <div 
        className={`toast show ${bgColors[type]} text-white`} 
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
        style={{ minWidth: 300 }}
      >
        <div className="toast-header text-white" style={{ background: 'rgba(0,0,0,0.1)', border: 'none' }}>
          <i className={`fas ${icons[type]} me-2`}></i>
          <strong className="me-auto">
            {type === 'success' && 'Éxito'}
            {type === 'error' && 'Error'}
            {type === 'warning' && 'Advertencia'}
            {type === 'info' && 'Información'}
          </strong>
          <button 
            type="button" 
            className="btn-close btn-close-white" 
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body">
          {message}
        </div>
      </div>
    </div>
  )
}
