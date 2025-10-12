import React, { useState, useEffect } from 'react'
import logo from '../assets/images/logo.jpg'
import { useNavigate } from 'react-router-dom'

function mockAuthenticate(email, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const validEmail = 'demo@ventasbronca.local'
      const validPassword = 'ventas123'
      if (email === validEmail && password === validPassword) {
        resolve({ ok: true, token: 'demo-token-ventasbronca-2025', user: { name: 'Demo Usuario', email } })
        return
      }
      if (email && password && password.length >= 6) {
        resolve({ ok: true, token: 'dev-token-' + btoa(email + ':' + password).slice(0, 24), user: { name: email.split('@')[0], email } })
        return
      }
      resolve({ ok: false, error: 'Credenciales incorrectas' })
    }, 600)
  })
}

function saveSession(result) {
  try {
    localStorage.setItem('ventasbronca_token', result.token)
    localStorage.setItem('ventasbronca_user', JSON.stringify(result.user))
    const expires = Date.now() + 24 * 60 * 60 * 1000
    localStorage.setItem('ventasbronca_token_expires', String(expires))
  } catch (err) {
    console.warn('No se pudo guardar la sesión', err)
  }
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const token = localStorage.getItem('ventasbronca_token')
      const expires = Number(localStorage.getItem('ventasbronca_token_expires') || 0)
      if (token && expires && Date.now() < expires) {
        const params = new URLSearchParams(window.location.search)
        const next = params.get('next') || '/'
        navigate(next, { replace: true })
      }
    } catch (err) {
      // ignore
    }
  }, [navigate])

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
    mockAuthenticate(email, password)
      .then((result) => {
        setLoading(false)
        if (result.ok) {
          saveSession(result)
          setMessage({ type: 'success', text: '¡Bienvenido! Redirigiendo...' })
          setTimeout(() => {
            const params = new URLSearchParams(window.location.search)
            const next = params.get('next') || '/'
            navigate(next, { replace: true })
          }, 700)
        } else {
          setMessage({ type: 'danger', text: result.error })
        }
      })
      .catch(() => {
        setLoading(false)
        setMessage({ type: 'danger', text: 'Error de red. Intente nuevamente.' })
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
          <button type="button" className="btn btn-outline-primary w-100" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/registro'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Registrar usuario nuevo</button>

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
