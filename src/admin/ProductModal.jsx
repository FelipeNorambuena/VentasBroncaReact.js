import React, { useState, useEffect } from 'react'
import { productImageService } from '../services/productImage'

export default function ProductModal({ show, onClose, product = null, onSave }) {
  if (!show) return null;

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '', // Ahora representa Precio Costo
    description: product?.description || '',
    brand: product?.brand || '',
    price: product?.price || '', // Precio Venta
    compare_at_price: product?.compare_at_price || '', // Ganancias (calculado)
    currency: 'CLP', // Siempre CLP, oculto
    is_active: product?.is_active ?? true,
    tags: product?.tags ? product.tags.join(',') : '',
    attributes: product?.attributes || '',
    category_id: product?.category_id || ''
  })
  
  // Lista de categorías disponibles
  const categorias = [
    { id: '', nombre: 'Seleccionar categoría...' },
    { id: 'Militares', nombre: 'Militares' },
    { id: 'Mochilas y bolsos', nombre: 'Mochilas y bolsos' },
    { id: 'Camping', nombre: 'Camping' },
    { id: 'Jockey', nombre: 'Jockey' },
    { id: 'Caza y pesca', nombre: 'Caza y pesca' },
    { id: 'Iluminación', nombre: 'Iluminación' },
    { id: 'Lentes', nombre: 'Lentes' },
    { id: 'Botas Militares', nombre: 'Botas Militares' },
    { id: 'Accesorios', nombre: 'Accesorios' }
  ]
  
  const [imagenes, setImagenes] = useState([])
  const [imagenesExistentes, setImagenesExistentes] = useState([])

  // Cargar los datos del producto cuando cambia
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        slug: product.slug || '', // Precio Costo
        description: product.description || '',
        brand: product.brand || '',
        price: product.price || '', // Precio Venta
        compare_at_price: product.compare_at_price || '', // Ganancias
        currency: 'CLP',
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
  
  // Calcular ganancias automáticamente cuando cambian precio costo o precio venta
  useEffect(() => {
    const precioCosto = parseFloat(form.slug) || 0 // slug = precio costo
    const precioVenta = parseFloat(form.price) || 0 // price = precio venta
    const ganancias = precioVenta - precioCosto
    
    setForm(prev => ({
      ...prev,
      compare_at_price: ganancias >= 0 ? ganancias.toFixed(2) : '0'
    }))
  }, [form.slug, form.price])

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
    
    // Convertir valores numéricos a enteros
    productData.slug = parseInt(productData.slug) || 0; // Precio Costo
    productData.price = parseInt(productData.price) || 0; // Precio Venta
    productData.compare_at_price = parseInt(productData.compare_at_price) || 0; // Ganancias
    productData.category_id = parseInt(productData.category_id) || 1; // Categoría
    
    // Convertir tags a array si es string
    if (typeof productData.tags === 'string') {
      productData.tags = productData.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    
    try {
      // 🎯 PASO 1: Guardar producto con la primera imagen
      const imageFile = imagenes.length > 0 ? imagenes[0].file : null;
      
      if (imageFile) {
        console.log(`📤 Se enviará imagen principal: ${imageFile.name}`);
      } else {
        console.log('ℹ️ No hay imagen para subir, solo se guardarán los datos');
      }
      
      // Guardar el producto y obtener el resultado (incluye el ID)
      const savedProduct = await onSave(productData, imageFile);
      
      console.log('✅ Producto guardado:', savedProduct);
      
      // 🎯 PASO 2: Si hay más de una imagen, actualizar el campo image con TODAS las imágenes
      if (imagenes.length > 1 && savedProduct && savedProduct.id) {
        console.log(`📤 Subiendo ${imagenes.length - 1} imagen(es) adicional(es) y actualizando campo image...`);
        
        // Array para almacenar TODAS las imágenes (incluyendo la primera)
        const allImageObjects = [];
        
        // La primera imagen ya está en savedProduct.image
        if (savedProduct.image && Array.isArray(savedProduct.image)) {
          allImageObjects.push(...savedProduct.image);
          console.log(`✅ Primera imagen ya en el producto (array):`, savedProduct.image);
        } else if (savedProduct.image) {
          allImageObjects.push(savedProduct.image);
          console.log(`✅ Primera imagen ya en el producto (objeto):`, savedProduct.image);
        }
        
        // Subir las imágenes restantes
        for (let i = 1; i < imagenes.length; i++) {
          const img = imagenes[i];
          console.log(`📤 Subiendo imagen adicional ${i}: ${img.file.name}`);
          
          try {
            // Subir la imagen al servidor
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
            console.log(`📥 Respuesta upload imagen ${i}:`, uploadData);
            
            // Agregar el OBJETO COMPLETO de la imagen al array
            if (Array.isArray(uploadData) && uploadData.length > 0) {
              allImageObjects.push(uploadData[0]);
              console.log(`✅ Imagen adicional ${i} agregada al array`);
            } else if (uploadData) {
              allImageObjects.push(uploadData);
              console.log(`✅ Imagen adicional ${i} agregada al array`);
            }
            
          } catch (uploadError) {
            console.error(`❌ Error subiendo imagen adicional ${i}:`, uploadError);
            alert(`Error al subir imagen ${img.file.name}: ${uploadError.message}`);
          }
        }
        
        // Actualizar el producto con el array completo de imágenes
        console.log(`🔄 Actualizando producto con ${allImageObjects.length} imágenes...`);
        console.log('📦 Array completo de imágenes:', allImageObjects);
        
        try {
          const updateUrl = `${import.meta.env.VITE_API_BASE_URL}/product/${savedProduct.id}`;
          const updateResponse = await fetch(updateUrl, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              image: allImageObjects
            })
          });
          
          if (!updateResponse.ok) {
            throw new Error(`Error actualizando producto: ${updateResponse.status}`);
          }
          
          const updatedProduct = await updateResponse.json();
          console.log('✅ Producto actualizado con todas las imágenes:', updatedProduct);
          
        } catch (updateError) {
          console.error('❌ Error al actualizar producto con array de imágenes:', updateError);
          alert(`Error al actualizar producto con imágenes: ${updateError.message}`);
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
                <div className="col-12">
                  <label className="form-label fw-bold">Nombre del Producto *</label>
                  <input 
                    className="form-control" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    placeholder="Ej: Mochila Táctica 40L"
                    required 
                  />
                </div>
                
                <div className="col-md-4">
                  <label className="form-label fw-bold">Precio Costo *</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input 
                      className="form-control" 
                      name="slug" 
                      type="number" 
                      value={form.slug} 
                      onChange={handleChange}
                      placeholder="0"
                      required 
                    />
                  </div>
                  <small className="text-muted">Costo del producto</small>
                </div>
                
                <div className="col-md-4">
                  <label className="form-label fw-bold">Precio Venta *</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input 
                      className="form-control" 
                      name="price" 
                      type="number" 
                      value={form.price} 
                      onChange={handleChange}
                      placeholder="0"
                      required 
                    />
                  </div>
                  <small className="text-muted">Precio de venta al público</small>
                </div>
                
                <div className="col-md-4">
                  <label className="form-label fw-bold">Ganancias Producto</label>
                  <div className="input-group">
                    <span className="input-group-text bg-success text-white">$</span>
                    <input 
                      className="form-control bg-light" 
                      name="compare_at_price" 
                      type="number" 
                      value={form.compare_at_price} 
                      readOnly
                      disabled
                    />
                  </div>
                  <small className="text-success fw-semibold">Calculado automáticamente</small>
                </div>
                
                <div className="col-md-6">
                  <label className="form-label fw-bold">Marca</label>
                  <input 
                    className="form-control" 
                    name="brand" 
                    value={form.brand} 
                    onChange={handleChange}
                    placeholder="Ej: Rapala, Gerber, etc."
                  />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label fw-bold">Categoría *</label>
                  <select 
                    className="form-select" 
                    name="category_id" 
                    value={form.category_id} 
                    onChange={handleChange}
                    required
                  >
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-control" name="description" rows={3} value={form.description} onChange={handleChange}></textarea>
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold">Tags (separados por coma)</label>
                  <input 
                    className="form-control" 
                    name="tags" 
                    value={form.tags} 
                    onChange={handleChange} 
                    placeholder="camping, outdoor, militar, impermeable" 
                  />
                  <small className="text-muted">Palabras clave para búsqueda y filtrado del producto</small>
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold">¿Activo?</label>
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