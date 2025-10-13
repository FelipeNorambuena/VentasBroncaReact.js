import React, { useState, useEffect } from 'react'
import logo from '../assets/images/logo.jpg'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'
import { setAuthToken } from '../utils/authToken'
import { useAuth } from '../context/AuthContext'



export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    // Redirigir si ya está autenticado
    if (isAuthenticated) {
      const params = new URLSearchParams(window.location.search)
      const next = params.get('next') || '/'
      navigate(next, { replace: true })
    }
  }, [navigate, isAuthenticated])

  function validate() {
    const err = {}
    if (!email) err.email = 'Ingrese su correo electrónico.'
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) err.email = 'Ingrese un correo con formato válido.'
    if (!password) err.password = 'Ingrese su contraseña.'
    else if (password.length < 6) err.password = 'La contraseña debe tener al menos 6 caracteres.'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    setMessage(null)
    if (!validate()) return
    setLoading(true)
    authService.login({ email, password })
      .then((result) => {
        setLoading(false)
        if (result) {
          const token = result?.token || result?.authToken || result?.data?.token || ''
          const user = result?.user || result?.data?.user || result
          
          if (token) setAuthToken(token)
          login(user, token)
          
          setMessage({ type: 'success', text: '¡Bienvenido! Redirigiendo...' })
          setTimeout(() => {
            const params = new URLSearchParams(window.location.search)
            const next = params.get('next') || '/'
            navigate(next, { replace: true })
          }, 700)
        } else {
          setMessage({ type: 'danger', text: 'Credenciales incorrectas' })
        }
      })
      .catch((err) => {
        setLoading(false)
        const msg = err?.message || 'Error de red. Intente nuevamente.'
        setMessage({ type: 'danger', text: msg })
      })
  }

  return (
    <main className="container d-flex align-items-center justify-content-center min-vh-100 py-5">
      <div className="card shadow-lg p-4" style={{ maxWidth: 400, width: '100%' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo VentasBronca" className="mb-3 rounded-circle shadow" style={{ width: 72, height: 72, objectFit: 'cover', border: '2px solid #198754', background: '#fff' }} />
          <h2 className="h4 mb-0">VentasBronca</h2>
          <p className="text-muted mb-0">Inicio de sesión</p>
        </div>

        <form id="loginForm" onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="loginEmail" className="form-label">Correo electrónico</label>
            <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} id="loginEmail" name="email" placeholder="Ingrese su correo" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="invalid-feedback">{errors.email}</div>
          </div>

          <div className="mb-3">
            <label htmlFor="loginPassword" className="form-label">Contraseña</label>
            <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} id="loginPassword" name="password" placeholder="Ingrese su contraseña" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="invalid-feedback">{errors.password}</div>
          </div>

          <button type="submit" className="btn btn-success w-100 mb-2" disabled={loading}>{loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Iniciar sesión'}</button>
          <button type="button" className="btn btn-outline-primary w-100" onClick={(e) => { e.preventDefault(); navigate('/registro'); }}>Registrar usuario nuevo</button>

          {message ? (
            <div className={`alert alert-${message.type} mt-3`} role={message.type === 'success' ? 'status' : 'alert'}>
              {message.text}
            </div>
          ) : null}
        </form>
      </div>
    </main>
  )
}
