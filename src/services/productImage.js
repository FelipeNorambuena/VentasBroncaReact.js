import { http } from './http'

export const productImageService = {
  async list(params = {}) {
    const query = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') query.append(k, v)
    }
    const qs = query.toString()
    return http.get(`/product_image${qs ? `?${qs}` : ''}`)
  },
  async create(data) {
    // data: { product_id, file, alt, sort_order }
    const isForm = typeof FormData !== 'undefined' && data instanceof FormData
    return http.post('/product_image', data, { auth: true, headers: isForm ? {} : undefined })
  },
  async remove(id) {
    return http.del(`/product_image/${encodeURIComponent(id)}`, { auth: true })
  },
}
