import React, { useEffect, useState } from 'react'
import { getImageUrl } from '../utils/imageHelper'

export default function ProductPreviewModal({ show, onClose, product }) {
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    if (show && product) {
      let foundImages = []
      
      // Opción 1: Imagen principal del producto (campo 'image')
      // Xano retorna 'image' como array, pero después de mapear en AdminProductos viene como objeto
      if (product.image) {
        const imageObj = {
          id: 'main',
          imagen: product.image,
          // Si product.image ya es un objeto con path/url, usarlo directamente
          // Si es string, usarlo tal cual
          url: product.image?.path || product.image?.url || (typeof product.image === 'string' ? product.image : null),
          alt_text: product.name,
          es_principal: true
        }
        foundImages.push(imageObj)
        console.log(`ProductPreview - Imagen principal del producto ${product.id}:`, imageObj)
      }
      
      // Opción 2: Usar las imágenes que vienen con el producto desde la relación de Xano
      // Xano puede usar guion bajo _ al inicio según la configuración del Addon
      if (product._imagen_producto_of_product && product._imagen_producto_of_product.length > 0) {
        const relatedImages = product._imagen_producto_of_product
        foundImages.push(...relatedImages)
        console.log(`ProductPreview - Imágenes relacionadas del producto ${product.id}:`, relatedImages)
      } else if (product.imagen_producto_of_product && product.imagen_producto_of_product.length > 0) {
        // Fallback sin guion bajo
        const relatedImages = product.imagen_producto_of_product
        foundImages.push(...relatedImages)
        console.log(`ProductPreview - Imágenes relacionadas del producto ${product.id}:`, relatedImages)
      } else if (product.imagenes && product.imagenes.length > 0) {
        // Fallback por si el campo se llama "imagenes"
        const relatedImages = product.imagenes
        foundImages.push(...relatedImages)
        console.log(`ProductPreview - Imágenes del producto ${product.id}:`, relatedImages)
      }
      
      if (foundImages.length > 0) {
        const normalizedImages = foundImages.map(img => ({
          ...img,
          normalizedUrl: getImageUrl(img)
        }))
        
        setImages(normalizedImages)
        setSelectedImage(normalizedImages[0])
        
        console.log(`ProductPreview - Total de imágenes para producto ${product.id}:`, normalizedImages.length)
      } else {
        setImages([])
        setSelectedImage(null)
        console.log(`ProductPreview - Producto ${product.id} sin imágenes`)
      }
    }
  }, [show, product])

  if (!show || !product) return null

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-eye me-2"></i>
              Vista de Producto
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            <div className="row">
              {/* Columna de imágenes */}
              <div className="col-md-6">
                <div className="mb-3">
                  <h6 className="text-muted mb-2">Imágenes del Producto</h6>
                  {images.length > 0 ? (
                    <>
                      {/* Imagen principal */}
                      <div className="mb-3 border rounded p-2 bg-light" style={{ minHeight: 300 }}>
                        <img 
                          src={selectedImage?.normalizedUrl || selectedImage?.url} 
                          alt={selectedImage?.alt_text || product.name}
                          className="img-fluid rounded"
                          style={{ width: '100%', height: 300, objectFit: 'contain' }}
                          onError={(e) => {
                            console.error('Error cargando imagen:', selectedImage)
                            e.target.onerror = null // Prevenir loop infinito
                            e.target.style.display = 'none' // Ocultar imagen rota
                          }}
                        />
                      </div>
                      
                      {/* Miniaturas */}
                      {images.length > 1 && (
                        <div className="d-flex gap-2 overflow-auto pb-2">
                          {images.map((img) => (
                            <div 
                              key={img.id}
                              className={`border rounded p-1 cursor-pointer ${selectedImage?.id === img.id ? 'border-primary border-3' : ''}`}
                              onClick={() => setSelectedImage(img)}
                              style={{ cursor: 'pointer', minWidth: 80 }}
                            >
                              <img 
                                src={img.normalizedUrl || img.url} 
                                alt={img.alt_text}
                                className="rounded"
                                style={{ width: 80, height: 80, objectFit: 'cover' }}
                                onError={(e) => {
                                  e.target.onerror = null // Prevenir loop infinito
                                  e.target.style.display = 'none' // Ocultar imagen rota
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-5 border rounded bg-light">
                      <i className="fas fa-image fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No hay imágenes disponibles</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Columna de información */}
              <div className="col-md-6">
                <div className="mb-3">
                  <h6 className="text-muted mb-2">Información General</h6>
                  <div className="card">
                    <div className="card-body">
                      <h4 className="card-title mb-3">{product.name}</h4>
                      
                      <div className="row mb-2">
                        <div className="col-4 text-muted">ID:</div>
                        <div className="col-8"><strong>#{product.id}</strong></div>
                      </div>
                      
                      <div className="row mb-2">
                        <div className="col-4 text-muted">Slug:</div>
                        <div className="col-8"><code>{product.slug}</code></div>
                      </div>
                      
                      <div className="row mb-2">
                        <div className="col-4 text-muted">Marca:</div>
                        <div className="col-8">{product.brand || '-'}</div>
                      </div>
                      
                      <div className="row mb-2">
                        <div className="col-4 text-muted">Categoría:</div>
                        <div className="col-8">{product.category_id || '-'}</div>
                      </div>
                      
                      <div className="row mb-2">
                        <div className="col-4 text-muted">Estado:</div>
                        <div className="col-8">
                          {product.is_active ? (
                            <span className="badge bg-success">Activo</span>
                          ) : (
                            <span className="badge bg-secondary">Inactivo</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="text-muted mb-2">Precios</h6>
                  <div className="card">
                    <div className="card-body">
                      <div className="row mb-2">
                        <div className="col-6 text-muted">Precio:</div>
                        <div className="col-6">
                          <h5 className="text-success mb-0">
                            ${product.price.toLocaleString('es-CL')} {product.currency}
                          </h5>
                        </div>
                      </div>
                      
                      {product.compare_at_price > 0 && (
                        <div className="row mb-2">
                          <div className="col-6 text-muted">Precio anterior:</div>
                          <div className="col-6">
                            <span className="text-muted text-decoration-line-through">
                              ${product.compare_at_price.toLocaleString('es-CL')} {product.currency}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="text-muted mb-2">Descripción</h6>
                  <div className="card">
                    <div className="card-body">
                      <p className="mb-0">{product.description || 'Sin descripción'}</p>
                    </div>
                  </div>
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">Tags</h6>
                    <div className="d-flex gap-2 flex-wrap">
                      {product.tags.map((tag, idx) => (
                        <span key={idx} className="badge bg-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.attributes && (
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">Atributos</h6>
                    <div className="card">
                      <div className="card-body">
                        <code>{product.attributes}</code>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
