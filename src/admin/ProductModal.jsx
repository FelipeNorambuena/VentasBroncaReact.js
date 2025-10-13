import React, { useState } from 'react'
import { productImageService } from '../services/productImage'

export default function ProductModal({ show, onClose, product = null, onSave }) {
  if (!show) return null;

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    brand: product?.brand || '',
    price: product?.price || '',
    compare_at_price: product?.compare_at_price || '',
    currency: product?.currency || 'CLP',
    is_active: product?.is_active ?? true,
    tags: product?.tags ? product.tags.join(',') : '',
    attributes: product?.attributes || '',
    category_id: product?.category_id || ''
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
      esPrincipal: imagenes.length === 0 && index === 0,
      id: Date.now() + index
    }))
    setImagenes([...imagenes, ...newImages])
  }

  const removeImage = (id) => {
    setImagenes(imagenes.filter(img => img.id !== id))
  }

  const setAsPrincipal = (id) => {
    setImagenes(imagenes.map(img => ({ ...img, esPrincipal: img.id === id })))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let productData = { ...form };
    
    // Convertir tags a array si es string
    if (typeof productData.tags === 'string') {
      productData.tags = productData.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    
    try {
      // Crear o actualizar producto
      const created = await onSave(productData);
      
      // Subir imágenes si hay y si el producto fue creado
      if (imagenes.length > 0 && created?.id) {
        for (let i = 0; i < imagenes.length; i++) {
          const img = imagenes[i];
          const formImg = new FormData();
          formImg.append('product_id', created.id);
          formImg.append('url', img.file); // Xano espera 'url' como nombre del archivo
          formImg.append('alt', img.file.name);
          formImg.append('sort_order', i);
          
          console.log('Subiendo imagen:', {
            product_id: created.id,
            filename: img.file.name,
            size: img.file.size,
            type: img.file.type
          }); // DEBUG
          
          await productImageService.create(formImg);
        }
      }
      
      // Resetear formulario
      setForm({
        name: '', slug: '', description: '', brand: '', price: '', 
        compare_at_price: '', currency: 'CLP', is_active: true, 
        tags: '', attributes: '', category_id: ''
      });
      setImagenes([]);
      setImagenesExistentes([]);
      onClose();
    } catch (err) {
      console.error('Error al guardar producto:', err);
      // No mostramos alert aquí, el error se propaga a AdminProductos
    }
  }

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg" style={{ maxWidth: 900 }}>
        <div className="modal-content" style={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
          <div className="modal-header">
            <h5 className="modal-title">{product ? 'Editar Producto' : 'Nuevo Producto'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            <div className="modal-body" style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
              {/* Datos básicos del producto */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">Nombre *</label>
                  <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Slug *</label>
                  <input className="form-control" name="slug" value={form.slug} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Marca</label>
                  <input className="form-control" name="brand" value={form.brand} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Categoría (ID)</label>
                  <input className="form-control" name="category_id" type="number" value={form.category_id} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Precio *</label>
                  <input className="form-control" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Precio Comparativo</label>
                  <input className="form-control" name="compare_at_price" type="number" step="0.01" value={form.compare_at_price} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Moneda</label>
                  <input className="form-control" name="currency" value={form.currency} onChange={handleChange} placeholder="CLP" />
                </div>
                <div className="col-12">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-control" name="description" rows={3} value={form.description} onChange={handleChange}></textarea>
                </div>
                <div className="col-12">
                  <label className="form-label">Tags (separados por coma)</label>
                  <input className="form-control" name="tags" value={form.tags} onChange={handleChange} placeholder="camping, outdoor, militar" />
                </div>
                <div className="col-12">
                  <label className="form-label">Atributos (JSON)</label>
                  <input className="form-control" name="attributes" value={form.attributes} onChange={handleChange} placeholder='{"color": "verde", "talla": "M"}' />
                </div>
                <div className="col-12">
                  <label className="form-label">¿Activo?</label>
                  <select className="form-select" name="is_active" value={form.is_active ? '1' : '0'} onChange={e => setForm(f => ({ ...f, is_active: e.target.value === '1' }))}>
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                  </select>
                </div>
              </div>

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
                <small className="form-text text-muted">Puedes seleccionar múltiples imágenes.</small>
              </div>

              {/* Preview de nuevas imágenes */}
              {imagenes.length > 0 && (
                <div className="mb-4">
                  <h6>Nuevas Imágenes</h6>
                  <div
                    className="row g-2"
                    style={{
                      maxHeight: 220,
                      overflowY: 'auto',
                      border: '1px solid #eee',
                      borderRadius: 8,
                      padding: 8,
                      background: '#fafbfc'
                    }}
                  >
                    {imagenes.map(img => (
                      <div key={img.id} className="col-md-3 col-6">
                        <div className="card">
                          <img src={img.preview} className="card-img-top" alt="Preview" style={{ height: 120, objectFit: 'cover' }} />
                          <div className="card-body p-2">
                            <button type="button" className="btn btn-danger btn-sm w-100" onClick={() => removeImage(img.id)}>
                              <i className="fas fa-trash"></i> Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer" style={{ background: '#fff', zIndex: 2 }}>
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