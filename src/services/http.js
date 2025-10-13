// Cliente HTTP para Xano, soporta dos bases: productos y auth
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const API_AUTH_URL = (import.meta.env.VITE_API_AUTH_URL || '').replace(/\/$/, '')

import { getAuthToken } from '../utils/authToken'

function getToken() {
  try {
    return getAuthToken() || ''
  } catch {
    return ''
  }
}

export async function request(path, { method = 'GET', body, auth = false, headers = {}, base = 'default' } = {}) {
  let baseUrl = API_BASE_URL
  if (base === 'auth' && API_AUTH_URL) baseUrl = API_AUTH_URL
  if (!baseUrl) throw new Error('VITE_API_BASE_URL no está configurado')
  const url = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`

  const isJSON = body && typeof body === 'object' && !(body instanceof FormData)
  const finalHeaders = { ...headers }
  if (isJSON) finalHeaders['Content-Type'] = 'application/json'
  if (auth) {
    const token = getToken()
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: isJSON ? JSON.stringify(body) : body,
  })

  const contentType = res.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await res.json().catch(() => null) : await res.text()

  if (!res.ok) {
    const message = data?.error?.message || data?.message || res.statusText || 'Error HTTP'
    const code = data?.error?.code || res.status
    const details = data?.error?.details || data
    const err = new Error(message)
    err.code = code
    err.details = details
    throw err
  }

  return data
}

export const http = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
}
