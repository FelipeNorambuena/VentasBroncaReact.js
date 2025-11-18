import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { clientsService } from '../services/clients'

export default function Profile() {
  const { user, isAuthenticated, updateUser } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    region: '',
    commune: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    // Cargar datos del usuario
    if (user) {
      setForm({
        full_name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        region: user.region || '',
        commune: user.commune || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    }
  }, [isAuthenticated, navigate, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    
    // Validaciones
    if (!form.full_name || form.full_name.length < 3) {
      setMessage({ type: 'danger', text: 'El nombre debe tener al menos 3 caracteres' })
      return
    }
    
    if (form.newPassword) {
      if (form.newPassword.length < 6) {
        setMessage({ type: 'danger', text: 'La nueva contraseña debe tener al menos 6 caracteres' })
        return
      }
      if (form.newPassword !== form.confirmPassword) {
        setMessage({ type: 'danger', text: 'Las contraseñas no coinciden' })
        return
      }
    }
    
    setLoading(true)
    
    try {
      // Preparar datos para actualizar
      const updateData = {
        full_name: form.full_name,
        phone: form.phone,
        region: form.region,
        commune: form.commune
      }
      
      // Si está cambiando la contraseña
      if (form.newPassword) {
        updateData.password = form.newPassword
      }
      
      // Actualizar en la base de datos
      await clientsService.update(user.id, updateData)
      
      // Actualizar contexto local
      updateUser({
        ...user,
        name: form.full_name,
        phone: form.phone,
        region: form.region,
        commune: form.commune
      })
      
      setMessage({ type: 'success', text: '¡Perfil actualizado exitosamente!' })
      setEditing(false)
      
      // Limpiar campos de contraseña
      setForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (error) {
      console.error('Error actualizando perfil:', error)
      setMessage({ type: 'danger', text: error.message || 'Error al actualizar el perfil' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="fas fa-user-circle me-2"></i>
                Mi Perfil
              </h4>
            </div>
            <div className="card-body">
              {message && (
                <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                  {message.text}
                  <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Información Personal */}
                <div className="mb-4">
                  <h5 className="border-bottom pb-2">Información Personal</h5>
                  
                  <div className="mb-3">
                    <label className="form-label">Nombre Completo</label>
                    <input
                      type="text"
                      className="form-control"
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      disabled={!editing}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={form.email}
                      disabled
                      readOnly
                    />
                    <small className="text-muted">El correo no se puede modificar</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Región</label>
                      <input
                        type="text"
                        className="form-control"
                        name="region"
                        value={form.region}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Comuna</label>
                      <input
                        type="text"
                        className="form-control"
                        name="commune"
                        value={form.commune}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                </div>

                {/* Cambiar Contraseña (solo cuando está editando) */}
                {editing && (
                  <div className="mb-4">
                    <h5 className="border-bottom pb-2">Cambiar Contraseña (opcional)</h5>
                    
                    <div className="mb-3">
                      <label className="form-label">Nueva Contraseña</label>
                      <input
                        type="password"
                        className="form-control"
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        minLength={6}
                        placeholder="Dejar en blanco para no cambiar"
                      />
                      <small className="text-muted">Mínimo 6 caracteres</small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Confirmar Nueva Contraseña</label>
                      <input
                        type="password"
                        className="form-control"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        minLength={6}
                      />
                    </div>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="d-flex gap-2">
                  {!editing ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setEditing(true)}
                    >
                      <i className="fas fa-pencil-alt me-2"></i>
                      Editar Perfil
                    </button>
                  ) : (
                    <>
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check me-2"></i>
                            Guardar Cambios
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setEditing(false)
                          setMessage(null)
                          // Restaurar valores originales
                          setForm({
                            full_name: user.name || '',
                            email: user.email || '',
                            phone: user.phone || '',
                            region: user.region || '',
                            commune: user.commune || '',
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          })
                        }}
                        disabled={loading}
                      >
                        <i className="fas fa-times me-2"></i>
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
