import { http } from './http'

export const productImageService = {
  async list(params = {}) {
    const query = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') query.append(k, v)
    }
    const qs = query.toString()
    return http.get(`/imagen_producto${qs ? `?${qs}` : ''}`)
  },
  async create(data) {
    // data: FormData con { id_producto, imagen (URL de texto), alt_text, orden, es_principal }
    // Enviar directamente como FormData
    return http.post('/imagen_producto', data, { auth: true })
  },
  async remove(id) {
    return http.del(`/imagen_producto/${encodeURIComponent(id)}`, { auth: true })
  },
}
