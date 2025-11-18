import React, { useState } from 'react'
import { usersService } from '../services/users'

export default function AdminCrearUsuario() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    role: 'vendedor' 
  })
  const [msg, setMsg] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // Limpiar mensajes al escribir
    if (msg) setMsg(null)
    if (error) setError(null)
  }

  const validateForm = () => {
    if (form.name.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres')
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError('El correo electrónico no es válido')
      return false
    }
    
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }
    
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return false
    }
    
    return true
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setMsg(null)
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      // Preparar datos para el endpoint de Xano
      const userData = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      }
      
      console.log('📤 Enviando datos de usuario:', userData)
      
      await usersService.create(userData)
      
      setMsg(`Usuario ${form.role} registrado exitosamente`)
      setForm({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '',
        role: 'vendedor' 
      })
    } catch (error) {
      console.error('Error al registrar usuario:', error)
      setError(error.message || 'Error al registrar usuario. Por favor intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mb-4">
      <div className="card">
        <div className="card-header bg-dark text-white fw-bold">
          <i className="fas fa-user-plus me-2"></i>Registrar Usuario del Sistema
        </div>
        <div className="card-body">
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
          
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label fw-bold">
                  <i className="fas fa-user me-2"></i>Nombre Completo
                </label>
                <input 
                  className="form-control" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="Ej: Juan Pérez González"
                  required 
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <i className="fas fa-envelope me-2"></i>Correo Electrónico
                </label>
                <input 
                  className="form-control" 
                  type="email"
                  name="email" 
                  value={form.email} 
                  onChange={handleChange}
                  placeholder="usuario@ejemplo.com"
                  required 
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <i className="fas fa-user-tag me-2"></i>Rol en el Sistema
                </label>
                <select 
                  className="form-select" 
                  name="role" 
                  value={form.role} 
                  onChange={handleChange}
                  required
                >
                  <option value="vendedor">Vendedor</option>
                  <option value="encargado">Encargado de Tienda</option>
                </select>
                <small className="text-muted">
                  {form.role === 'vendedor' 
                    ? 'Podrá registrar ventas y gestionar inventario' 
                    : 'Tendrá acceso completo al panel administrativo'}
                </small>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <i className="fas fa-lock me-2"></i>Contraseña
                </label>
                <input 
                  className="form-control" 
                  type="password"
                  name="password" 
                  value={form.password} 
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required 
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <i className="fas fa-lock me-2"></i>Confirmar Contraseña
                </label>
                <input 
                  className="form-control" 
                  type="password"
                  name="confirmPassword" 
                  value={form.confirmPassword} 
                  onChange={handleChange}
                  placeholder="Repite la contraseña"
                  required 
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
                    Registrando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>Registrar Usuario
                  </>
                )}
              </button>
              
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => {
                  setForm({ 
                    name: '', 
                    email: '', 
                    password: '', 
                    confirmPassword: '',
                    role: 'vendedor' 
                  })
                  setError(null)
                  setMsg(null)
                }}
                disabled={loading}
              >
                <i className="fas fa-times me-2"></i>Limpiar
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
