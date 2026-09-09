/**
 * BFF - Backend For Frontend
 * Consulta Java/Spring backend y transforma datos para frontend
 */
import { API_ENDPOINTS } from '../utils/backend'

export default defineEventHandler(async (event) => {
  try {
    // Llama al backend Java
    const response = await fetch(`${API_ENDPOINTS.profile}`, {
      headers: {
        'Authorization': getHeader(event, 'authorization') || ''
      }
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'Error consultando backend Java'
      })
    }

    const backendData = await response.json()

    // Transformar datos para frontend (lógica BFF)
    return {
      success: true,
      message: 'Datos transformados desde BFF',
      user: {
        id: backendData.userId,
        email: backendData.userEmail,
        name: backendData.userName,
      },
      app: {
        framework: 'Nuxt 3 (BFF)',
        backend: 'Java/Spring',
        mode: 'fullstack con BFF'
      }
    }
  } catch (error: any) {
    console.error('[BFF] Error en /api/info:', error.message)
    
    return {
      success: false,
      message: 'Backend Java no disponible (esperado en demo)',
      mockData: {
        framework: 'Nuxt 3 (BFF)',
        backend: 'Java/Spring (mock)',
        mode: 'fullstack con BFF'
      }
    }
  }
})

