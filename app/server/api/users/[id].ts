/**
 * BFF - Obtener usuario desde backend Java
 * GET /api/users/[id]
 */
import { API_ENDPOINTS } from '../../utils/backend'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID requerido'
    })
  }

  try {
    // Consulta backend Java
    const response = await fetch(`${API_ENDPOINTS.users}/${id}`, {
      headers: {
        'Authorization': getHeader(event, 'authorization') || ''
      }
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Usuario ${id} no encontrado en backend Java`
      })
    }

    const backendUser = await response.json()

    // Transformar/enriquecer datos (lógica BFF)
    return {
      id: backendUser.id,
      email: backendUser.email,
      name: backendUser.name,
      role: backendUser.role,
      createdAt: backendUser.createdDate,
      // Enriquecimiento del BFF
      source: 'Java/Spring Backend',
      fetchedAt: new Date().toISOString()
    }
  } catch (error: any) {
    console.error(`[BFF] Error en /api/users/${id}:`, error.message)

    // Mock cuando backend Java no está disponible
    return {
      id,
      email: `user${id}@example.com`,
      name: `Usuario #${id} (Mock)`,
      role: 'user',
      createdAt: new Date().toISOString(),
      source: 'Mock Data (Backend Java no disponible)',
      note: 'En producción este dato viene del backend Java'
    }
  }
})

