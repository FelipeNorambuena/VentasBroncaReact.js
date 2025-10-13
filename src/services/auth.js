import { http } from './http'

export const authService = {
  async register({ email, password, name, phone }) {
    return http.post('/auth/signup', { email, password, name, phone }, { base: 'auth' })
  },
  async login({ email, password }) {
    return http.post('/auth/login', { email, password }, { base: 'auth' })
  },
  async me() {
    return http.get('/auth/me', { auth: true, base: 'auth' })
  },
  async updateMe(payload) {
    return http.patch('/auth/me', payload, { auth: true, base: 'auth' })
  },
}
