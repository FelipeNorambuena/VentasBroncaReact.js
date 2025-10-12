import React, { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ nombreCompleto: '', correo: '', descripcion: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    const e = {}
    if (!form.nombreCompleto.trim()) e.nombreCompleto = true
    if (!form.correo.trim()) e.correo = true
    if (!form.descripcion.trim()) e.descripcion = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSent(true)
    setForm({ nombreCompleto: '', correo: '', descripcion: '' })
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <main className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9">
          <div className="card shadow-lg p-4 mb-5">
            <div className="text-center mb-4">
              <img src="/src/assets/images/logo.jpg" alt="Logo VentasBronca" className="mb-3 rounded-circle shadow" style={{ width: 72, height: 72, objectFit: 'cover', border: '2px solid #198754', background: '#fff' }} />
              <h2 className="h4 mb-0">Contáctanos</h2>
              <p className="text-muted mb-0">¿Tienes dudas o necesitas ayuda? Completa el formulario y te responderemos pronto.</p>
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="nombreCompleto" className="form-label">Nombre completo</label>
                <input type="text" className={`form-control ${errors.nombreCompleto ? 'is-invalid' : ''}`} id="nombreCompleto" name="nombreCompleto" value={form.nombreCompleto} onChange={handleChange} placeholder="Tu nombre completo" required />
              </div>
              <div className="mb-3">
                <label htmlFor="correo" className="form-label">Correo electrónico</label>
                <input type="email" className={`form-control ${errors.correo ? 'is-invalid' : ''}`} id="correo" name="correo" value={form.correo} onChange={handleChange} placeholder="tucorreo@ejemplo.com" required />
              </div>
              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label">Descripción de tu consulta</label>
                <textarea className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`} id="descripcion" name="descripcion" rows="5" value={form.descripcion} onChange={handleChange} placeholder="Cuéntanos en detalle cómo podemos ayudarte" required></textarea>
              </div>

              {sent && (
                <div id="mensajeExito" className="alert alert-success mt-3 text-center" role="alert">
                  Mensaje enviado con éxito, será respondido dentro de 72 horas.
                </div>
              )}

              <button type="submit" className="btn btn-success w-100 mt-2">Enviar mensaje</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
