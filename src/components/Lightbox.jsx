import React from 'react'

export default function Lightbox({ image, onClose }) {
  if (!image) return null
  return (
    <div className="lightbox-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }} onClick={onClose}>
      <img src={image} alt="Producto ampliado" style={{ maxWidth: '90%', maxHeight: '90%', boxShadow: '0 0 20px rgba(0,0,0,.5)' }} />
    </div>
  )
}
