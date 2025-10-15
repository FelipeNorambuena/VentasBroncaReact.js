/**
 * Normaliza la URL de una imagen de Xano
 * Si es una URL relativa, construye la URL completa
 * @param {string} url - URL de la imagen (puede ser relativa o absoluta)
 * @returns {string} - URL completa de la imagen
 */
export function normalizeImageUrl(url) {
  // Verificar que url sea un string válido
  if (!url || typeof url !== 'string') return null
  
  // Si ya es una URL completa (http o https), devolverla tal cual
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // Si es una URL relativa, construir la URL completa
  // Para archivos de Xano (/vault/...), usar el dominio base SIN el path de la API
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:trIO7Z5n'
  
  // Extraer solo el dominio (sin /api:xxx)
  const domain = baseUrl.split('/api:')[0]
  
  // Si la URL empieza con /, no duplicar la barra
  return url.startsWith('/') ? `${domain}${url}` : `${domain}/${url}`
}

/**
 * Extrae la URL de un objeto de imagen de Xano
 * Xano puede devolver diferentes campos: imagen (texto/URL), url, image, file, path, etc.
 * @param {Object} imageObject - Objeto de imagen de Xano
 * @returns {string|null} - URL normalizada o null
 */
export function getImageUrl(imageObject) {
  if (!imageObject) return null
  
  console.log('getImageUrl - Objeto recibido:', imageObject) // DEBUG
  
  let rawUrl = null
  
  // Prioridad 1: Campo 'imagen' como texto (nuevo formato con URLs)
  if (imageObject.imagen && typeof imageObject.imagen === 'string') {
    rawUrl = imageObject.imagen
    console.log('getImageUrl - URL desde texto imagen:', rawUrl) // DEBUG
  }
  // Prioridad 2: Campo 'imagen' como objeto (formato antiguo)
  else if (imageObject.imagen && typeof imageObject.imagen === 'object') {
    rawUrl = imageObject.imagen.path || imageObject.imagen.url || imageObject.imagen.name
    console.log('getImageUrl - URL desde objeto imagen.path:', rawUrl) // DEBUG
  }
  // Si url es un objeto (formato Xano con {path, name, etc})
  else if (imageObject.url && typeof imageObject.url === 'object') {
    rawUrl = imageObject.url.path || imageObject.url.url || imageObject.url.name
    console.log('getImageUrl - URL desde objeto url.path:', rawUrl) // DEBUG
  } 
  // Si image es un objeto
  else if (imageObject.image && typeof imageObject.image === 'object') {
    rawUrl = imageObject.image.path || imageObject.image.url
  }
  // Si file es un objeto
  else if (imageObject.file && typeof imageObject.file === 'object') {
    rawUrl = imageObject.file.path || imageObject.file.url
  }
  // Intentar diferentes campos comunes (strings)
  else {
    rawUrl = imageObject.url || 
             imageObject.image || 
             imageObject.file ||
             imageObject.path
  }
  
  console.log('getImageUrl - URL extraída:', rawUrl) // DEBUG
  
  return normalizeImageUrl(rawUrl)
}
