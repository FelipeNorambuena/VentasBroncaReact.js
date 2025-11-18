import React, { useState } from 'react'
import { authService } from '../services/auth'
import { useAuth } from '../context/AuthContext'

export default function AdminConfiguracion() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({ actual: '', nueva: '', confirmar: '' })
  const [msg, setMsg] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // Limpiar mensajes al escribir
    if (msg) setMsg(null)
    if (error) setError(null)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setMsg(null)
    
    // Validaciones
    if (form.actual.length < 6) {
      setError('La contraseña actual debe tener al menos 6 caracteres')
      return
    }
    
    if (form.nueva.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }
    
    if (form.nueva !== form.confirmar) {
      setError('Las contraseñas nuevas no coinciden')
      return
    }
    
    if (form.actual === form.nueva) {
      setError('La nueva contraseña debe ser diferente a la actual')
      return
    }
    
    setLoading(true)
    
    try {
      // Actualizar contraseña en Xano
      const updateData = {
        password: form.nueva
      }
      
      console.log('🔐 Actualizando contraseña...')
      
      await authService.updateMe(updateData)
      
      console.log('✅ Contraseña actualizada exitosamente')
      
      setMsg('Contraseña cambiada exitosamente')
      setForm({ actual: '', nueva: '', confirmar: '' })
      
      // Opcional: Actualizar el usuario en el contexto si es necesario
      if (user) {
        updateUser({ ...user })
      }
    } catch (error) {
      console.error('❌ Error al cambiar contraseña:', error)
      setError(error.message || 'Error al cambiar la contraseña. Verifica que la contraseña actual sea correcta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mb-4">
      <div className="card">
        <div className="card-header bg-dark text-white fw-bold">
          <i className="fas fa-cog me-2"></i>Configuración del Sistema
        </div>
        <div className="card-body">
          {/* Título de la sección */}
          <div className="mb-4">
            <h5 className="fw-bold">
              <i className="fas fa-lock me-2 text-primary"></i>
              Cambiar Contraseña
            </h5>
            <p className="text-muted mb-0">
              Actualiza tu contraseña de administrador para mantener tu cuenta segura
            </p>
          </div>

          {/* Mensajes de éxito y error */}
          {msg && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="fas fa-check-circle me-2"></i>{msg}
              <button type="button" className="btn-close" onClick={() => setMsg(null)}></button>
            </div>
          )}
          
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="fas fa-exclamation-circle me-2"></i>{error}
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}
          
          {/* Información del usuario actual */}
          {user && (
            <div className="alert alert-info mb-4">
              <i className="fas fa-info-circle me-2"></i>
              Sesión activa como: <strong>{user.name || user.email}</strong>
            </div>
          )}

          {/* Formulario de cambio de contraseña */}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label fw-bold">
                  <i className="fas fa-key me-2"></i>Contraseña actual
                </label>
                <input 
                  className="form-control" 
                  name="actual" 
                  type="password" 
                  value={form.actual} 
                  onChange={handleChange} 
                  placeholder="Ingresa tu contraseña actual"
                  required 
                  disabled={loading}
                />
                <small className="text-muted">Mínimo 6 caracteres</small>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <i className="fas fa-lock me-2"></i>Nueva contraseña
                </label>
                <input 
                  className="form-control" 
                  name="nueva" 
                  type="password" 
                  value={form.nueva} 
                  onChange={handleChange} 
                  placeholder="Ingresa nueva contraseña"
                  required 
                  disabled={loading}
                />
                <small className="text-muted">Mínimo 6 caracteres</small>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <i className="fas fa-lock me-2"></i>Confirmar nueva contraseña
                </label>
                <input 
                  className="form-control" 
                  name="confirmar" 
                  type="password" 
                  value={form.confirmar} 
                  onChange={handleChange} 
                  placeholder="Confirma la nueva contraseña"
                  required 
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="mt-4 d-flex gap-2">
              <button 
                className="btn btn-success" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Cambiando contraseña...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>Cambiar contraseña
                  </>
                )}
              </button>
              
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => {
                  setForm({ actual: '', nueva: '', confirmar: '' })
                  setError(null)
                  setMsg(null)
                }}
                disabled={loading}
              >
                <i className="fas fa-times me-2"></i>Cancelar
              </button>
            </div>
          </form>

          {/* Consejos de seguridad */}
          <div className="mt-4 p-3 bg-light border rounded">
            <h6 className="fw-bold mb-2">
              <i className="fas fa-shield-alt me-2 text-success"></i>
              Consejos de seguridad
            </h6>
            <ul className="mb-0 small text-muted">
              <li>Use una contraseña segura con al menos 8 caracteres</li>
              <li>Combine letras mayúsculas, minúsculas, números y símbolos</li>
              <li>No comparta su contraseña con nadie</li>
              <li>Cambie su contraseña regularmente</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
