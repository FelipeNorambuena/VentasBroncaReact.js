import { http } from './http'

export const productsService = {
  async list(params = {}) {
    const query = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') query.append(k, v)
    }
    const qs = query.toString()
    return http.get(`/product${qs ? `?${qs}` : ''}`)
  },
  async getByIdOrSlug(idOrSlug) {
    return http.get(`/product/${encodeURIComponent(idOrSlug)}`)
  },
  async create(data) {
    const isForm = typeof FormData !== 'undefined' && data instanceof FormData
    return http.post('/product', data, { auth: true, headers: isForm ? {} : undefined })
  },
  async update(id, data) {
    const isForm = typeof FormData !== 'undefined' && data instanceof FormData
    return http.patch(`/product/${encodeURIComponent(id)}`, data, { auth: true, headers: isForm ? {} : undefined })
  },
  async remove(id) {
    return http.del(`/product/${encodeURIComponent(id)}`, { auth: true })
  },
}
