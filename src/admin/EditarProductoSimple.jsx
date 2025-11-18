import React, { useState, useEffect } from 'react'
import { productsService } from '../services/products'
import { useParams, useNavigate } from 'react-router-dom'

/**
 * Componente de ejemplo que muestra cómo actualizar un producto existente
 * con opción de cambiar su imagen usando updateWithImage
 */
export default function EditarProductoSimple() {
  const { id } = useParams() // Obtener ID del producto de la URL
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [product, setProduct] = useState(null)
  const [preview, setPreview] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Cargar el producto al montar el componente
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await productsService.getByIdOrSlug(id)
        setProduct(data)
        // Si el producto tiene imagen, mostrarla como preview
        if (data.imagen) {
          setPreview(data.imagen)
        }
      } catch (error) {
        console.error('Error al cargar producto:', error)
        setErrorMessage('No se pudo cargar el producto')
      } finally {
        setLoadingProduct(false)
      }
    }
    
    if (id) {
      loadProduct()
    }
  }, [id])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Crear preview de la nueva imagen
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else if (product?.imagen) {
      // Si se elimina el archivo, volver a la imagen original
      setPreview(product.imagen)
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
      slug: e.target.slug.value,
      description: e.target.description.value,
      brand: e.target.brand.value,
      price: parseFloat(e.target.price.value),
      compare_at_price: e.target.compare_at_price.value ? parseFloat(e.target.compare_at_price.value) : null,
      currency: e.target.currency.value,
      is_active: e.target.is_active.checked,
      tags: e.target.tags.value.split(',').map(t => t.trim()).filter(Boolean),
      category_id: e.target.category_id.value ? parseInt(e.target.category_id.value) : null,
    }

    // Obtener archivo de imagen (puede ser null si no se quiere cambiar)
    const imageFile = e.target.imagen.files[0] || null

    try {
      // 🎯 ACTUALIZACIÓN CON IMAGEN: Un solo llamado que hace todo
      // Si imageFile es null, solo actualiza los datos
      // Si imageFile existe, además sube la imagen y la asocia
      const updatedProduct = await productsService.updateWithImage(
        product.id,
        formData,
        imageFile
      )
      
      console.log('✅ Producto actualizado exitosamente:', updatedProduct)
      setSuccessMessage(`¡Producto "${updatedProduct.name}" actualizado exitosamente!`)
      
      // Actualizar el estado local con los nuevos datos
      setProduct(updatedProduct)
      if (updatedProduct.imagen) {
        setPreview(updatedProduct.imagen)
      }
      
    } catch (error) {
      console.error('❌ Error al actualizar producto:', error)
      setErrorMessage(error.message || 'Error al actualizar el producto')
    } finally {
      setLoading(false)
    }
  }

  if (loadingProduct) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando producto...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          No se encontró el producto
        </div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left me-2"></i>Volver
        </button>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            <i className="fas fa-edit me-2"></i>
            Editar Producto (Flujo Simplificado)
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
                  <label className="form-label">ID del Producto</label>
                  <input
                    type="text"
                    className="form-control"
                    value={product.id}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Nombre del Producto *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    defaultValue={product.name}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Slug (URL amigable) *</label>
                  <input
                    type="text"
                    name="slug"
                    className="form-control"
                    defaultValue={product.slug}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción *</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    defaultValue={product.description}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Marca</label>
                  <input
                    type="text"
                    name="brand"
                    className="form-control"
                    defaultValue={product.brand || ''}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Tags (separados por comas)</label>
                  <input
                    type="text"
                    name="tags"
                    className="form-control"
                    defaultValue={Array.isArray(product.tags) ? product.tags.join(', ') : product.tags || ''}
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
                        defaultValue={product.price}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Moneda</label>
                      <select name="currency" className="form-select" defaultValue={product.currency}>
                        <option value="CLP">CLP</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Precio de Comparación</label>
                  <input
                    type="number"
                    name="compare_at_price"
                    className="form-control"
                    step="0.01"
                    min="0"
                    defaultValue={product.compare_at_price || ''}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Categoría ID</label>
                  <input
                    type="number"
                    name="category_id"
                    className="form-control"
                    defaultValue={product.category_id || ''}
                  />
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="is_active"
                      className="form-check-input"
                      id="is_active"
                      defaultChecked={product.is_active}
                    />
                    <label className="form-check-label" htmlFor="is_active">
                      Producto activo
                    </label>
                  </div>
                </div>

                {/* Sección de imagen */}
                <div className="mb-3">
                  <label className="form-label">
                    {product.imagen ? 'Cambiar Imagen' : 'Agregar Imagen'}
                  </label>
                  <input
                    type="file"
                    name="imagen"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <small className="text-muted">
                    JPG, PNG, GIF (dejar vacío para mantener la imagen actual)
                  </small>
                </div>

                {/* Preview de la imagen */}
                {preview && (
                  <div className="mb-3">
                    <label className="form-label">
                      {product.imagen === preview ? 'Imagen Actual:' : 'Nueva Imagen:'}
                    </label>
                    <div className="border rounded p-2 text-center bg-light">
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
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                <i className="fas fa-times me-2"></i>Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>Actualizar Producto
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Información adicional */}
          <div className="alert alert-info mt-4" role="alert">
            <h6 className="alert-heading">
              <i className="fas fa-info-circle me-2"></i>¿Cómo funciona la actualización?
            </h6>
            <p className="mb-0">
              Al hacer clic en "Actualizar Producto":
            </p>
            <ul className="mb-0 mt-2">
              <li>Si <strong>NO</strong> seleccionaste una nueva imagen, solo se actualizan los datos del producto</li>
              <li>Si <strong>SÍ</strong> seleccionaste una nueva imagen, se ejecutan automáticamente:
                <ol>
                  <li><strong>PATCH /product/&#123;id&#125;</strong> - Actualiza los datos del producto</li>
                  <li><strong>POST /upload/image</strong> - Sube la nueva imagen</li>
                  <li><strong>PATCH /product/&#123;id&#125;</strong> - Asocia la nueva imagen</li>
                </ol>
              </li>
            </ul>
            <p className="mt-2 mb-0">
              <small className="text-muted">
                Todo esto ocurre en un solo llamado a <code>productsService.updateWithImage()</code>
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
