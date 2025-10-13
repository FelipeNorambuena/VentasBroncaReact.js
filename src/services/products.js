import { http } from './http'

export const productsService = {
  async list(params = {}) {
    const query = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') query.append(k, v)
    }
    const qs = query.toString()
    return http.get(`/products${qs ? `?${qs}` : ''}`)
  },
  async getByIdOrSlug(idOrSlug) {
    return http.get(`/products/${encodeURIComponent(idOrSlug)}`)
  },
}
