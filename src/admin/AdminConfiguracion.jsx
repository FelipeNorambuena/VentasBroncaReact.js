import React, { useState } from 'react'

export default function AdminConfiguracion() {
  const [form, setForm] = useState({ actual: '', nueva: '', confirmar: '' })
  const [msg, setMsg] = useState(null)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (form.nueva !== form.confirmar) {
      setMsg('Las contraseñas no coinciden')
      return
    }
    setMsg('Contraseña cambiada (mock)')
    setForm({ actual: '', nueva: '', confirmar: '' })
  }

  return (
    <section className="mb-4">
      <div className="card">
        <div className="card-header bg-dark text-white fw-bold">
          <i className="fas fa-cog me-2"></i>Configuración del Sistema
        </div>
        <div className="card-body">
          {msg && <div className="alert alert-info">{msg}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Contraseña actual</label>
              <input className="form-control" name="actual" type="password" value={form.actual} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Nueva contraseña</label>
              <input className="form-control" name="nueva" type="password" value={form.nueva} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirmar nueva contraseña</label>
              <input className="form-control" name="confirmar" type="password" value={form.confirmar} onChange={handleChange} required />
            </div>
            <button className="btn btn-primary" type="submit">Cambiar contraseña</button>
          </form>
        </div>
      </div>
    </section>
  )
}
