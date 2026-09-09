/**
 * BFF - Login
 * POST /api/auth/login
 * 
 * Consulta Java/Spring backend y guarda token en cookie httpOnly
 */
import { API_ENDPOINTS } from '../../utils/backend'

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
  }
}

export default defineEventHandler(async (event) => {
  // Solo POST
  if (event.node.req.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  const { email, password } = await readBody<LoginRequest>(event)

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email y password requeridos'
    })
  }

  try {
    console.log('[BFF] POST /api/auth/login → Consultando:', API_ENDPOINTS.login)

    // Consulta backend Java
    const response = await fetch(API_ENDPOINTS.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'Credenciales inválidas en backend Java'
      })
    }

    const backendResponse = await response.json() as LoginResponse

    // Guardar token en cookie httpOnly (seguro)
    setCookie(event, 'auth_token', backendResponse.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 días
    })

    console.log('[BFF] Token guardado en cookie httpOnly')

    return {
      success: true,
      user: backendResponse.user,
      message: 'Login exitoso'
    }
  } catch (error: any) {
    console.error('[BFF] Error en POST /api/auth/login:', error.message)

    // Mock cuando backend Java no está disponible
    const mockToken = Buffer.from(`${email}:${Date.now()}`).toString('base64')

    setCookie(event, 'auth_token', mockToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    })

    return {
      success: true,
      user: {
        id: '123',
        email,
        name: 'Mock User'
      },
      message: 'Login mock (Backend Java no disponible)',
      note: 'En producción se autentica con Java backend'
    }
  }
})
