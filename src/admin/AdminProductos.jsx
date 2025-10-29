import React, { useEffect, useMemo, useState } from 'react'
import ProductModal from './ProductModal'
import ProductPreviewModal from './ProductPreviewModal'
import Toast from '../components/Toast'
import { productsService } from '../services/products'
import { productImageService } from '../services/productImage'
import { useAuth } from '../context/AuthContext'

export default function AdminProductos() {
  const [showModal, setShowModal] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [previewProduct, setPreviewProduct] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const { isAdmin } = useAuth()

  const filtered = useMemo(() => {
    if (!search) return items
    const q = search.toLowerCase()
    return items.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.slug || '').toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q)
    )
  }, [items, search])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await productsService.list({ page, limit })
        const list = Array.isArray(res) ? res : (res?.data || [])
        
        console.log('📦 Productos recibidos de Xano:', list) // DEBUG: Ver estructura completa
        console.log('📦 Primer producto con detalle:', list[0]) // DEBUG: Ver un producto completo
        
        const mapped = list.map((it) => ({
          id: it.id,
          name: it.name || '',
          slug: it.slug || '',
          description: it.description || '',
          brand: it.brand || '',
          price: Number(it.price ?? 0),
          compare_at_price: Number(it.compare_at_price ?? 0),
          currency: it.currency || 'CLP',
          is_active: it.is_active ?? true,
          tags: it.tags || [],
          attributes: it.attributes || '',
          category_id: it.category_id || null,
          created_at: it.created_at,
          updated_at: it.updated_at,
          // ✅ Campo de imagen principal (Xano retorna ARRAY de objetos)
          image: Array.isArray(it.image) && it.image.length > 0 ? it.image[0] : null,
          // Incluir las imágenes que vienen desde la relación de Xano
          // Xano puede usar guion bajo _ al inicio según la configuración del Addon
          imagen_producto_of_product: it._imagen_producto_of_product || it.imagen_producto_of_product || [],
          imagenes: it._imagen_producto_of_product || it.imagen_producto_of_product || []
        }))
        
        console.log('📦 Productos mapeados:', mapped) // DEBUG: Ver si las imágenes están incluidas
        
        if (mounted) setItems(mapped)
      } catch (err) {
        console.error('No se pudo cargar productos', err)
        if (mounted) setError(err.message || 'Error cargando productos')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [page, limit])

  const handleNewProduct = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  const handleEditProduct = async (product) => {
    // Las imágenes ya vienen con el producto desde la relación de Xano
    // No es necesario cargarlas por separado
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleSaveProduct = async (formData, imageFile = null) => {
    try {
      if (!isAdmin()) throw new Error('Solo administradores pueden modificar productos')
      
      let result;
      if (editingProduct?.id) {
        // 🎯 ACTUALIZAR producto con imagen opcional usando la nueva función
        result = await productsService.updateWithImage(editingProduct.id, formData, imageFile)
        setToast({ show: true, message: 'Producto actualizado exitosamente', type: 'success' })
      } else {
        // 🎯 CREAR producto con imagen opcional usando la nueva función
        result = await productsService.createWithImage(formData, imageFile)
        setToast({ show: true, message: 'Producto creado exitosamente', type: 'success' })
      }
      
      setShowModal(false)
      
      // Recargar lista
      const res = await productsService.list({ page, limit })
      const list = Array.isArray(res) ? res : (res?.data || [])
      const mapped = list.map((it) => ({
        id: it.id,
        name: it.name || '',
        slug: it.slug || '',
        description: it.description || '',
        brand: it.brand || '',
        price: Number(it.price ?? 0),
        compare_at_price: Number(it.compare_at_price ?? 0),
        currency: it.currency || 'CLP',
        is_active: it.is_active ?? true,
        tags: it.tags || [],
        attributes: it.attributes || '',
        category_id: it.category_id || null,
        created_at: it.created_at,
        updated_at: it.updated_at,
        image: it.image || null, // ✅ El campo en Xano se llama 'image'
        imagenes: it._imagen_producto_of_product || it.imagen_producto_of_product || []
      }))
      setItems(mapped)
      
      return result
    } catch (err) {
      setToast({ show: true, message: err.message || 'No se pudo guardar el producto', type: 'error' })
      throw err
    }
  }

  const handleDeleteProduct = async (product) => {
    if (!isAdmin()) {
      setToast({ show: true, message: 'Solo administradores pueden eliminar', type: 'warning' })
      return
    }
    if (!confirm(`¿Eliminar producto ${product.name}?`)) return
    try {
      await productsService.remove(product.id)
      setToast({ show: true, message: 'Producto eliminado exitosamente', type: 'success' })
      setItems(prev => prev.filter(p => p.id !== product.id))
    } catch (err) {
      setToast({ show: true, message: err.message || 'No se pudo eliminar', type: 'error' })
    }
  }

  const handleViewProduct = (product) => {
    setPreviewProduct(product)
    setShowPreview(true)
  }
  return (
    <section className="mb-4">
      <div className="card">
        <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center">
          <span><i className="fas fa-boxes me-2"></i>Gestión de Productos</span>
          <button className="btn btn-success btn-sm" onClick={handleNewProduct}>
            <i className="fas fa-plus me-1"></i>Nuevo Producto
          </button>
        </div>
        <div className="card-body p-0">
          <div className="p-3 d-flex gap-2 align-items-center">
            <input
              type="search"
              className="form-control"
              placeholder="Buscar por nombre, slug o marca"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 320 }}
            />
            <select className="form-select" style={{ width: 100 }} value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-success" role="status" /></div>
          ) : error ? (
            <div className="alert alert-danger m-3">{error}</div>
          ) : (
          <table className="table mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Slug</th>
                <th>Marca</th>
                <th>Precio</th>
                <th>Moneda</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td><code>{p.slug}</code></td>
                  <td>{p.brand || '-'}</td>
                  <td>${p.price.toLocaleString('es-CL')}</td>
                  <td>{p.currency}</td>
                  <td>
                    {p.is_active ? (
                      <span className="badge bg-success">Activo</span>
                    ) : (
                      <span className="badge bg-secondary">Inactivo</span>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-primary btn-sm me-1" title="Editar" onClick={() => handleEditProduct(p)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-danger btn-sm me-1" title="Eliminar" onClick={() => handleDeleteProduct(p)}>
                      <i className="fas fa-trash"></i>
                    </button>
                    <button className="btn btn-secondary btn-sm" title="Ver" onClick={() => handleViewProduct(p)}>
                      <i className="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {/* Modal para crear/editar productos */}
      <ProductModal
        show={showModal}
        onClose={() => setShowModal(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      {/* Modal de vista previa del producto */}
      <ProductPreviewModal
        show={showPreview}
        onClose={() => setShowPreview(false)}
        product={previewProduct}
      />

      {/* Toast de notificaciones */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </section>
  )
}
