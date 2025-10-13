import React, { useState } from 'react'

export default function ProductModal({ show, onClose, product = null, onSave }) {
  const [form, setForm] = useState({
    nombre: product?.nombre || '',
    sku: product?.sku || '',
    descripcion: product?.descripcion || '',
    precio: product?.precio || '',
    stock: product?.stock || '',
    stockCritico: product?.stockCritico || '',
    categoria: product?.categoria || ''
  })
  
  const [imagenes, setImagenes] = useState([])
  const [imagenesExistentes, setImagenesExistentes] = useState(product?.imagenes || [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      esPrincipal: imagenes.length === 0 && index === 0, // Primera imagen es principal por defecto
      id: Date.now() + index
    }))
    setImagenes([...imagenes, ...newImages])
  }

  const removeImage = (id) => {
    setImagenes(imagenes.filter(img => img.id !== id))
  }

  const setAsPrincipal = (id) => {
    setImagenes(imagenes.map(img => ({
      ...img,
      esPrincipal: img.id === id
    })))
  }

  const removeExistingImage = (id) => {
    setImagenesExistentes(imagenesExistentes.filter(img => img.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    
    // Datos del producto
    Object.keys(form).forEach(key => {
      formData.append(key, form[key])
    })
    
    // Imágenes nuevas
    imagenes.forEach((img, index) => {
      formData.append('imagenes', img.file)
      formData.append(`imagen_${index}_principal`, img.esPrincipal)
    })
    
    // Imágenes existentes a mantener/eliminar
    formData.append('imagenesExistentes', JSON.stringify(imagenesExistentes))
    
    onSave(formData)
  }

  if (!show) return null

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {product ? 'Editar Producto' : 'Nuevo Producto'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Datos básicos del producto */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">Nombre del Producto</label>
                  <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">SKU</label>
                  <input className="form-control" name="sku" value={form.sku} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Precio</label>
                  <input className="form-control" name="precio" type="number" value={form.precio} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Stock</label>
                  <input className="form-control" name="stock" type="number" value={form.stock} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Stock Crítico</label>
                  <input className="form-control" name="stockCritico" type="number" value={form.stockCritico} onChange={handleChange} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-control" name="descripcion" rows={3} value={form.descripcion} onChange={handleChange}></textarea>
                </div>
              </div>

              {/* Sección de imágenes existentes */}
              {imagenesExistentes.length > 0 && (
                <div className="mb-4">
                  <h6>Imágenes Actuales</h6>
                  <div className="row g-2">
                    {imagenesExistentes.map(img => (
                      <div key={img.id} className="col-md-3">
                        <div className="card">
                          <img src={img.url} className="card-img-top" style={{ height: 120, objectFit: 'cover' }} />
                          <div className="card-body p-2">
                            <div className="form-check mb-1">
                              <input className="form-check-input" type="radio" name="principalExistente" checked={img.esPrincipal} readOnly />
                              <label className="form-check-label small">Principal</label>
                            </div>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeExistingImage(img.id)}>
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subir nuevas imágenes */}
              <div className="mb-4">
                <label className="form-label">Agregar Imágenes</label>
                <input 
                  type="file" 
                  className="form-control" 
                  multiple 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <small className="form-text text-muted">Puedes seleccionar múltiples imágenes. La primera será la imagen principal por defecto.</small>
              </div>

              {/* Preview de nuevas imágenes */}
              {imagenes.length > 0 && (
                <div className="mb-4">
                  <h6>Nuevas Imágenes</h6>
                  <div className="row g-2">
                    {imagenes.map(img => (
                      <div key={img.id} className="col-md-3">
                        <div className="card">
                          <img src={img.preview} className="card-img-top" style={{ height: 120, objectFit: 'cover' }} />
                          <div className="card-body p-2">
                            <div className="form-check mb-1">
                              <input 
                                className="form-check-input" 
                                type="radio" 
                                name="principal"
                                checked={img.esPrincipal}
                                onChange={() => setAsPrincipal(img.id)}
                              />
                              <label className="form-check-label small">Principal</label>
                            </div>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeImage(img.id)}>
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">
                {product ? 'Actualizar' : 'Crear'} Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}