import React, { useState, useEffect } from 'react'
import { usersService } from '../services/users'

export default function AdminUsuarios() {
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
  const [usuarios, setUsuarios] = useState([])
  const [usuariosLoading, setUsuariosLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null)
  const [adminPassword, setAdminPassword] = useState('')
  const [deleteError, setDeleteError] = useState(null)
    // Eliminar usuario (requiere clave admin)
    async function handleDeleteUsuario() {
      setDeleteError(null)
      if (!adminPassword || adminPassword.length < 4) {
        setDeleteError('Debes ingresar la clave del admin')
        return
      }
      setUsuariosLoading(true)
      try {
        // Aquí podrías validar la clave del admin con el backend si lo deseas
        await usersService.delete(usuarioAEliminar.id)
        setMsg('Usuario eliminado correctamente')
        setShowDeleteModal(false)
        setAdminPassword('')
        setUsuarioAEliminar(null)
        await cargarUsuarios()
      } catch (err) {
        setDeleteError('No se pudo eliminar el usuario')
      } finally {
        setUsuariosLoading(false)
      }
    }
  // Cargar usuarios al montar
  useEffect(() => {
    cargarUsuarios()
  }, [])

  async function cargarUsuarios() {
    setUsuariosLoading(true)
    try {
      const lista = await usersService.list()
      setUsuarios(lista)
    } catch (err) {
      setError('Error al cargar usuarios')
    } finally {
      setUsuariosLoading(false)
    }
  }

  // Bloquear/desbloquear usuario
  async function toggleActivoUsuario(id, is_active) {
    setUsuariosLoading(true)
    try {
      // Buscar el usuario actual en la lista
      const usuarioActual = usuarios.find(u => u.id === id)
      if (!usuarioActual) throw new Error('Usuario no encontrado')
      // Enviar todos los campos requeridos por Xano
      const datosActualizados = {
        name: usuarioActual.name,
        email: usuarioActual.email,
        role: usuarioActual.role,
        is_active: is_active
      }
      await usersService.update(id, datosActualizados)
      setMsg(is_active ? 'Usuario activado' : 'Usuario bloqueado')
      await cargarUsuarios()
    } catch (err) {
      setError('No se pudo cambiar el estado del usuario')
    } finally {
      setUsuariosLoading(false)
    }
  }

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
      <div className="card mb-4">
        <div className="card-header bg-dark text-white fw-bold">
          <i className="fas fa-user-plus me-2"></i>Usuarios del Sistema
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
            {/* ...formulario de registro de usuario... */}
            <div className="row g-3">
              {/* ...campos del formulario... */}
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
      {/* Listado de usuarios con bloqueo/desbloqueo */}
      <div className="card">
        <div className="card-header bg-primary text-white fw-bold d-flex justify-content-between align-items-center">
          <span><i className="fas fa-users me-2"></i>Lista de Usuarios</span>
          <button
            className="btn btn-sm btn-outline-light"
            disabled={usuariosLoading}
            onClick={cargarUsuarios}
            title="Actualizar lista"
          >
            <i className="fas fa-sync-alt"></i> Actualizar
          </button>
        </div>
        <div className="card-body">
          {usuariosLoading ? (
            <div className="text-center py-4">
              <span className="spinner-border" role="status"></span> Cargando usuarios...
            </div>
          ) : (
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr><td colSpan="5" className="text-center">No hay usuarios registrados</td></tr>
                ) : (
                  usuarios.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        {u.is_active ? (
                          <span className="badge bg-success">Activo</span>
                        ) : (
                          <span className="badge bg-danger">Bloqueado</span>
                        )}
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-success'} me-2`}
                          disabled={usuariosLoading || u.role === 'admin'}
                          onClick={() => toggleActivoUsuario(u.id, !u.is_active)}
                        >
                          {u.is_active ? 'Bloquear' : 'Activar'}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={usuariosLoading || u.role === 'admin'}
                          onClick={() => {
                            setUsuarioAEliminar(u)
                            setShowDeleteModal(true)
                          }}
                        >
                          <i className="fas fa-trash-alt"></i> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* Modal para confirmar eliminación de usuario */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{background: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button type="button" className="btn-close" onClick={() => {setShowDeleteModal(false); setAdminPassword(''); setDeleteError(null);}}></button>
              </div>
              <div className="modal-body">
                <p>¿Seguro que deseas eliminar al usuario <b>{usuarioAEliminar?.name}</b>?</p>
                <div className="mb-3">
                  <label className="form-label">Ingresa la clave del admin para confirmar:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    placeholder="Clave del admin"
                  />
                </div>
                {deleteError && <div className="alert alert-danger py-2">{deleteError}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => {setShowDeleteModal(false); setAdminPassword(''); setDeleteError(null);}}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteUsuario} disabled={usuariosLoading}>
                  Eliminar usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
