import { http } from './http'
import { get, post } from './http'

export const authService = {
  async register({ email, password, name, phone }) {
    return http.post('/auth/signup', { email, password, name, phone }, { base: 'auth' })
  },
  
  /**
   * Login unificado: Intenta primero con tabla user (admins), luego con tabla client (clientes)
   */
  async login({ email, password }) {
    console.log('🔐 Intentando login con:', email)
    
    try {
      // INTENTO 1: Login como Admin (tabla user con endpoint /auth/login)
      console.log('👤 Intento 1: Buscando en tabla USER (admins)...')
      try {
        const userResult = await http.post('/auth/login', { email, password }, { base: 'auth' })
        console.log('✅ Login exitoso como ADMIN:', userResult)
        
        // Si el login fue exitoso, retornar con rol admin
        return {
          ...userResult,
          user: {
            ...(userResult.user || {}),
            email: email,
            role: 'admin',
            userType: 'admin'
          }
        }
      } catch (adminError) {
        console.log('⚠️ No encontrado en tabla USER, intentando tabla CLIENT...')
        // Si falla, continuar al siguiente intento
      }
      
      // INTENTO 2: Buscar en tabla client (clientes registrados)
      console.log('👥 Intento 2: Buscando en tabla CLIENT (clientes)...')
      
      // Obtener todos los clientes y buscar por email
      const clients = await get('/client')
      const clientList = Array.isArray(clients) ? clients : (clients?.data || [])
      
      console.log('📋 Total de clientes encontrados:', clientList.length)
      console.log('🔍 Buscando cliente con email:', email)
      
      const matchingClient = clientList.find(c => {
        const clientEmail = (c.email || '').toLowerCase().trim()
        const inputEmail = email.toLowerCase().trim()
        const passwordMatch = c.password === password
        
        console.log(`  Comparando: ${clientEmail} === ${inputEmail}? ${clientEmail === inputEmail}`)
        if (clientEmail === inputEmail) {
          console.log(`  Cliente encontrado! Password match: ${passwordMatch}`)
          console.log(`  Password almacenado: ${c.password}`)
          console.log(`  Password ingresado: ${password}`)
        }
        
        return clientEmail === inputEmail && passwordMatch
      })
      
      if (matchingClient) {
        console.log('✅ Login exitoso como CLIENTE:', matchingClient)
        
        // Retornar formato compatible con el sistema de auth
        return {
          token: `client_${matchingClient.id}_${Date.now()}`, // Token simulado para clientes
          user: {
            id: matchingClient.id,
            email: matchingClient.email,
            name: matchingClient.full_name,
            phone: matchingClient.phone,
            region: matchingClient.region,
            commune: matchingClient.commune,
            role: 'cliente',
            userType: 'client',
            created_at: matchingClient.created_at
          }
        }
      }
      
      // Si no se encontró en ninguna tabla
      console.log('❌ Credenciales no encontradas en ninguna tabla')
      console.log('📧 Email buscado:', email)
      console.log('🔑 Password ingresado:', password)
      throw new Error('Credenciales incorrectas')
      
    } catch (error) {
      console.error('❌ Error en login:', error)
      throw error
    }
  },
  
  async me() {
    return http.get('/auth/me', { auth: true, base: 'auth' })
  },
  
  async updateMe(payload) {
    return http.patch('/auth/me', payload, { auth: true, base: 'auth' })
  },
}
