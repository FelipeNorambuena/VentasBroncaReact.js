import React, { useState, useEffect } from 'react'
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
  const [imagenesExistentes, setImagenesExistentes] = useState([])

  // Cargar los datos del producto cuando cambia
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        brand: product.brand || '',
        price: product.price || '',
        compare_at_price: product.compare_at_price || '',
        currency: product.currency || 'CLP',
        is_active: product.is_active ?? true,
        tags: product.tags ? (Array.isArray(product.tags) ? product.tags.join(',') : product.tags) : '',
        attributes: product.attributes || '',
        category_id: product.category_id || ''
      })
      setImagenesExistentes(product.imagenes || [])
    } else {
      setForm({
        name: '', slug: '', description: '', brand: '', price: '', 
        compare_at_price: '', currency: 'CLP', is_active: true, 
        tags: '', attributes: '', category_id: ''
      })
      setImagenesExistentes([])
    }
    setImagenes([])
  }, [product])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      esPrincipal: imagenes.length === 0 && imagenesExistentes.length === 0 && index === 0,
      id: Date.now() + index
    }))
    setImagenes([...imagenes, ...newImages])
  }

  const removeImage = (id) => {
    setImagenes(imagenes.filter(img => img.id !== id))
  }

  const removeExistingImage = async (imagen) => {
    if (!confirm('¿Eliminar esta imagen?')) return
    try {
      await productImageService.remove(imagen.id)
      setImagenesExistentes(imagenesExistentes.filter(img => img.id !== imagen.id))
    } catch (err) {
      console.error('Error al eliminar imagen:', err)
      alert('No se pudo eliminar la imagen')
    }
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
      // 🎯 NUEVO FLUJO SIMPLIFICADO:
      // Pasar los datos del producto y el primer archivo de imagen (si existe)
      // Las funciones createWithImage/updateWithImage harán el resto automáticamente
      
      const imageFile = imagenes.length > 0 ? imagenes[0].file : null;
      
      if (imageFile) {
        console.log(`📤 Se enviará imagen con el producto: ${imageFile.name}`);
      } else {
        console.log('ℹ️ No hay imagen para subir, solo se guardarán los datos');
      }
      
      // Llamar a onSave con los datos y el archivo
      // AdminProductos.handleSaveProduct usará createWithImage o updateWithImage
      await onSave(productData, imageFile);
      
      // Si hay más de una imagen, subir las adicionales usando el flujo anterior
      if (imagenes.length > 1) {
        console.log(`📤 Subiendo ${imagenes.length - 1} imagen(es) adicional(es)...`);
        
        // Obtener el ID del producto del resultado guardado
        // Aquí asumimos que el producto ya fue creado por onSave
        const productId = form.id; // Si estamos editando
        
        if (productId) {
          for (let i = 1; i < imagenes.length; i++) {
            const img = imagenes[i];
            
            try {
              const formUpload = new FormData();
              formUpload.append('content', img.file);
              
              const uploadUrl = `${import.meta.env.VITE_API_BASE_URL}/upload/image`;
              const uploadResponse = await fetch(uploadUrl, {
                method: 'POST',
                body: formUpload
              });
              
              if (!uploadResponse.ok) {
                throw new Error(`Error subiendo imagen: ${uploadResponse.status}`);
              }
              
              const uploadData = await uploadResponse.json();
              const imageUrl = uploadData[0]?.path || uploadData[0]?.url || uploadData.path || uploadData.url;
              
              if (imageUrl) {
                const formImg = new FormData();
                formImg.append('id_producto', String(productId));
                formImg.append('imagen', imageUrl);
                formImg.append('alt_text', img.file.name || '');
                formImg.append('orden', String(i + 1));
                formImg.append('es_principal', img.esPrincipal ? '1' : '0');
                
                await productImageService.create(formImg);
                console.log(`✅ Imagen adicional ${i} subida exitosamente`);
              }
            } catch (uploadError) {
              console.error('❌ Error subiendo imagen adicional:', uploadError);
              alert(`Error al subir imagen ${img.file.name}: ${uploadError.message}`);
            }
          }
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

              {/* Mostrar imágenes existentes */}
              {imagenesExistentes.length > 0 && (
                <div className="mb-4">
                  <h6>Imágenes Actuales</h6>
                  <div
                    className="row g-2"
                    style={{
                      maxHeight: 220,
                      overflowY: 'auto',
                      border: '1px solid #eee',
                      borderRadius: 8,
                      padding: 8,
                      background: '#fff8e1'
                    }}
                  >
                    {imagenesExistentes.map(img => (
                      <div key={img.id} className="col-md-3 col-6">
                        <div className={`card ${img.es_principal ? 'border-warning' : ''}`}>
                          <img 
                            src={img.imagen?.url || img.url || '/placeholder.jpg'} 
                            className="card-img-top" 
                            alt={img.alt_text || 'Imagen del producto'} 
                            style={{ height: 120, objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = '/placeholder.jpg'
                              console.error('Error cargando imagen:', img)
                            }}
                          />
                          <div className="card-body p-2">
                            <div className="d-flex gap-1">
                              {img.es_principal && (
                                <span className="badge bg-warning text-dark" style={{ fontSize: '0.7rem' }}>
                                  <i className="fas fa-star"></i> Principal
                                </span>
                              )}
                              <button 
                                type="button" 
                                className="btn btn-danger btn-sm ms-auto" 
                                onClick={() => removeExistingImage(img)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
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
                        <div className={`card ${img.esPrincipal ? 'border-primary' : ''}`}>
                          <img src={img.preview} className="card-img-top" alt="Preview" style={{ height: 120, objectFit: 'cover' }} />
                          <div className="card-body p-2">
                            <div className="d-flex gap-1">
                              <button 
                                type="button" 
                                className={`btn btn-sm ${img.esPrincipal ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setAsPrincipal(img.id)}
                                title="Marcar como principal"
                              >
                                <i className="fas fa-star"></i>
                              </button>
                              <button 
                                type="button" 
                                className="btn btn-danger btn-sm flex-grow-1" 
                                onClick={() => removeImage(img.id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
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