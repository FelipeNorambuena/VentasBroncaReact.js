import React, { useState } from 'react'
import { productsService } from '../services/products'

/**
 * Componente de ejemplo que muestra cómo usar el nuevo flujo de carga de productos con imágenes
 * usando las funciones createWithImage y updateWithImage
 */
export default function CrearProductoSimple() {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Crear preview de la imagen
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    // Recopilar datos del formulario
    const formData = {
      name: e.target.name.value,
      slug: e.target.slug.value || e.target.name.value.toLowerCase().replace(/\s+/g, '-'),
      description: e.target.description.value,
      brand: e.target.brand.value,
      price: parseFloat(e.target.price.value),
      compare_at_price: e.target.compare_at_price.value ? parseFloat(e.target.compare_at_price.value) : null,
      currency: e.target.currency.value,
      is_active: e.target.is_active.checked,
      tags: e.target.tags.value.split(',').map(t => t.trim()).filter(Boolean),
      category_id: e.target.category_id.value ? parseInt(e.target.category_id.value) : null,
    }

    // Obtener archivo de imagen (puede ser null)
    const imageFile = e.target.imagen.files[0] || null

    try {
      // 🎯 AQUÍ ESTÁ LA MAGIA: Un solo llamado que hace los 3 pasos automáticamente
      // 1. POST /product (crear producto)
      // 2. POST /upload/image (subir imagen)
      // 3. PATCH /product/{id} (asociar imagen)
      const product = await productsService.createWithImage(formData, imageFile)
      
      console.log('✅ Producto creado exitosamente:', product)
      setSuccessMessage(`¡Producto "${product.name}" creado exitosamente con ID: ${product.id}!`)
      
      // Limpiar formulario
      e.target.reset()
      setPreview(null)
      
    } catch (error) {
      console.error('❌ Error al crear producto:', error)
      setErrorMessage(error.message || 'Error al crear el producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-header bg-success text-white">
          <h3 className="mb-0">
            <i className="fas fa-plus-circle me-2"></i>
            Crear Producto con Imagen (Flujo Simplificado)
          </h3>
        </div>
        <div className="card-body">
          
          {/* Mensajes de éxito/error */}
          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="fas fa-check-circle me-2"></i>{successMessage}
              <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
            </div>
          )}
          
          {errorMessage && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="fas fa-exclamation-circle me-2"></i>{errorMessage}
              <button type="button" className="btn-close" onClick={() => setErrorMessage('')}></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Columna izquierda: Datos básicos */}
              <div className="col-md-6">
                <h5 className="mb-3">Información Básica</h5>
                
                <div className="mb-3">
                  <label className="form-label">Nombre del Producto *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Ej: Mochila Táctica 40L"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Slug (URL amigable)</label>
                  <input
                    type="text"
                    name="slug"
                    className="form-control"
                    placeholder="Se genera automáticamente si se deja vacío"
                  />
                  <small className="text-muted">Deja vacío para generar automáticamente</small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción *</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    placeholder="Descripción detallada del producto"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Marca</label>
                  <input
                    type="text"
                    name="brand"
                    className="form-control"
                    placeholder="Ej: TacticalPro"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Tags (separados por comas)</label>
                  <input
                    type="text"
                    name="tags"
                    className="form-control"
                    placeholder="Ej: militar, outdoor, camping"
                  />
                </div>
              </div>

              {/* Columna derecha: Precios e imagen */}
              <div className="col-md-6">
                <h5 className="mb-3">Precio e Imagen</h5>
                
                <div className="row">
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label className="form-label">Precio *</label>
                      <input
                        type="number"
                        name="price"
                        className="form-control"
                        step="0.01"
                        min="0"
                        placeholder="45000"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Moneda</label>
                      <select name="currency" className="form-select">
                        <option value="CLP">CLP</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Precio de Comparación (opcional)</label>
                  <input
                    type="number"
                    name="compare_at_price"
                    className="form-control"
                    step="0.01"
                    min="0"
                    placeholder="60000"
                  />
                  <small className="text-muted">Para mostrar descuentos</small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Categoría ID (opcional)</label>
                  <input
                    type="number"
                    name="category_id"
                    className="form-control"
                    placeholder="1"
                  />
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="is_active"
                      className="form-check-input"
                      id="is_active"
                      defaultChecked
                    />
                    <label className="form-check-label" htmlFor="is_active">
                      Producto activo
                    </label>
                  </div>
                </div>

                {/* Sección de imagen */}
                <div className="mb-3">
                  <label className="form-label">Imagen del Producto</label>
                  <input
                    type="file"
                    name="imagen"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <small className="text-muted">
                    JPG, PNG, GIF (opcional - puede crearse sin imagen)
                  </small>
                </div>

                {/* Preview de la imagen */}
                {preview && (
                  <div className="mb-3">
                    <label className="form-label">Vista Previa:</label>
                    <div className="border rounded p-2 text-center">
                      <img
                        src={preview}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="d-flex gap-2 justify-content-end mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => window.history.back()}
                disabled={loading}
              >
                <i className="fas fa-times me-2"></i>Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>Crear Producto
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Información adicional */}
          <div className="alert alert-info mt-4" role="alert">
            <h6 className="alert-heading">
              <i className="fas fa-info-circle me-2"></i>¿Cómo funciona?
            </h6>
            <p className="mb-0">
              Al hacer clic en "Crear Producto", se ejecutan automáticamente 3 pasos:
            </p>
            <ol className="mb-0 mt-2">
              <li><strong>POST /product</strong> - Se crea el producto y se obtiene su ID</li>
              <li><strong>POST /upload/image</strong> - Se sube la imagen al servidor</li>
              <li><strong>PATCH /product/&#123;id&#125;</strong> - Se asocia la imagen al producto</li>
            </ol>
            <p className="mt-2 mb-0">
              <small className="text-muted">
                Todo esto ocurre en un solo llamado a <code>productsService.createWithImage()</code>
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
