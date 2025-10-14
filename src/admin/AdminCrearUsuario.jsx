import React, { useState } from 'react'

export default function AdminCrearUsuario() {
  const [form, setForm] = useState({ usuario: '', nombre: '', apellido: '', rut: '', correo: '' })
  const [msg, setMsg] = useState(null)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    setMsg('Usuario registrado (mock)')
    setForm({ usuario: '', nombre: '', apellido: '', rut: '', correo: '' })
  }

  return (
    <section className="mb-4">
      <div className="card">
        <div className="card-header bg-dark text-white fw-bold">
          <i className="fas fa-user-plus me-2"></i>Registrar Usuario Vendedor
        </div>
        <div className="card-body">
          {msg && <div className="alert alert-success">{msg}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Usuario de Sistema</label>
                <input className="form-control" name="usuario" value={form.usuario} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Nombre</label>
                <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Apellido</label>
                <input className="form-control" name="apellido" value={form.apellido} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">RUT</label>
                <input className="form-control" name="rut" value={form.rut} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Correo Electrónico</label>
                <input className="form-control" name="correo" value={form.correo} onChange={handleChange} required />
              </div>
            </div>
            <button className="btn btn-success mt-3" type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </section>
  )
}
