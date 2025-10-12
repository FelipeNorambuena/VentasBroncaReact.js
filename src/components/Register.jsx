import React, { useEffect, useState } from 'react'
import logo from '../assets/images/logo.jpg'

// Lista de ejemplo de regiones y comunas (puedes reemplazar por API real)
const REGIONES = [
  { id: 'rm', name: 'Región Metropolitana', comunas: ['Santiago', 'Providencia', 'Las Condes'] },
  { id: 'biobio', name: 'Biobío', comunas: ['Concepción', 'Talcahuano', 'Chiguayante'] },
]

function mockRegister(payload) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ok: true, user: { id: Date.now(), ...payload } })
    }, 700)
  })
}

export default function Register() {
  const [form, setForm] = useState({ nombre: '', correo: '', confirmarCorreo: '', password: '', confirmarPassword: '', telefono: '', region: '', comuna: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [comunas, setComunas] = useState([])

  useEffect(() => {
    // inicializamos regiones; como ejemplo no hacemos fetch
  }, [])

  function onRegionChange(regionId) {
    setForm((s) => ({ ...s, region: regionId, comuna: '' }))
    const reg = REGIONES.find((r) => r.id === regionId)
    setComunas(reg ? reg.comunas : [])
  }

  function validate() {
    const e = {}
    if (!form.nombre || form.nombre.length < 3) e.nombre = 'Ingrese su nombre completo.'
    if (!form.correo || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.correo)) e.correo = 'Ingrese un correo válido.'
    if (form.correo !== form.confirmarCorreo) e.confirmarCorreo = 'Los correos no coinciden.'
    if (!form.password || form.password.length < 8) e.password = 'La contraseña debe tener al menos 8 caracteres.'
    // simple policy: mayúscula + minúscula + número
    if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/[0-9]/.test(form.password)) e.password = 'La contraseña debe incluir mayúscula, minúscula y número.'
    if (form.password !== form.confirmarPassword) e.confirmarPassword = 'Las contraseñas no coinciden.'
    if (!form.region) e.region = 'Seleccione una región.'
    if (!form.comuna) e.comuna = 'Seleccione una comuna.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setMessage(null)
    if (!validate()) return
    setLoading(true)
    mockRegister(form)
      .then((res) => {
        setLoading(false)
        if (res.ok) {
          // guardamos usuario demo y redirigimos a login
          try {
            localStorage.setItem('ventasbronca_registered_user', JSON.stringify(res.user))
          } catch (err) {}
          setMessage({ type: 'success', text: 'Registro exitoso. Redirigiendo al login...' })
          setTimeout(() => {
            window.history.pushState({}, '', '/login')
            window.dispatchEvent(new PopStateEvent('popstate'))
          }, 700)
        } else {
          setMessage({ type: 'danger', text: res.error || 'Error al registrar.' })
        }
      })
      .catch(() => {
        setLoading(false)
        setMessage({ type: 'danger', text: 'Error de red. Intente nuevamente.' })
      })
  }

  return (
    <main className="main-content" tabIndex={-1}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4">
                <div className="text-center mb-3">
                  <img src={logo} alt="Logo" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: '50%' }} />
                  <h2 className="mb-1 mt-2">Registro de Usuario</h2>
                  <p className="text-muted">Crea tu cuenta en VentasBronca</p>
                </div>
                <form id="registroForm" onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre completo</label>
                    <input type="text" className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} id="nombre" name="nombre" required minLength={3} maxLength={80} placeholder="Ej: Juan Pérez" value={form.nombre} onChange={handleChange} />
                    <div className="invalid-feedback">{errors.nombre}</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="correo" className="form-label">Correo electrónico</label>
                    <input type="email" className={`form-control ${errors.correo ? 'is-invalid' : ''}`} id="correo" name="correo" required placeholder="Ej: correo@ejemplo.cl" value={form.correo} onChange={handleChange} />
                    <div className="invalid-feedback">{errors.correo}</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmarCorreo" className="form-label">Confirmar correo electrónico</label>
                    <input type="email" className={`form-control ${errors.confirmarCorreo ? 'is-invalid' : ''}`} id="confirmarCorreo" name="confirmarCorreo" required placeholder="Repita su correo" value={form.confirmarCorreo} onChange={handleChange} />
                    <div className="invalid-feedback">{errors.confirmarCorreo}</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} id="password" name="password" required minLength={8} placeholder="Mínimo 8 caracteres" value={form.password} onChange={handleChange} />
                    <div className="invalid-feedback">{errors.password}</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmarPassword" className="form-label">Confirmar contraseña</label>
                    <input type="password" className={`form-control ${errors.confirmarPassword ? 'is-invalid' : ''}`} id="confirmarPassword" name="confirmarPassword" required minLength={8} value={form.confirmarPassword} onChange={handleChange} />
                    <div className="invalid-feedback">{errors.confirmarPassword}</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="telefono" className="form-label">Teléfono (opcional)</label>
                    <input type="tel" className="form-control" id="telefono" name="telefono" pattern="^(\+?56)?[2-9]\d{8}$" placeholder="Ej: +56912345678" value={form.telefono} onChange={handleChange} />
                    <div className="invalid-feedback">Ingrese un teléfono válido en Chile.</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="region" className="form-label">Región</label>
                    <select className={`form-select ${errors.region ? 'is-invalid' : ''}`} id="region" name="region" required value={form.region} onChange={(e) => onRegionChange(e.target.value)}>
                      <option value="">Seleccione una región</option>
                      {REGIONES.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                    <div className="invalid-feedback">{errors.region}</div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="comuna" className="form-label">Comuna</label>
                    <select className={`form-select ${errors.comuna ? 'is-invalid' : ''}`} id="comuna" name="comuna" required disabled={!comunas.length} value={form.comuna} onChange={handleChange}>
                      <option value="">Seleccione una comuna</option>
                      {comunas.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="invalid-feedback">{errors.comuna}</div>
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>{loading ? 'Registrando...' : 'Registrar'}</button>
                  </div>
                </form>

                {message ? (
                  <div className={`alert alert-${message.type} mt-3`} role={message.type === 'success' ? 'status' : 'alert'}>
                    {message.text}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
