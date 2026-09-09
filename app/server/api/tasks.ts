/**
 * BFF - Obtener todas las tareas desde backend Java
 * GET /api/tasks
 */
import { API_ENDPOINTS } from '../utils/backend'

export default defineEventHandler(async (event) => {
  try {
    console.log('[BFF] GET /api/tasks → Consultando:', API_ENDPOINTS.tasks)

    // Consulta backend Java
    const response = await fetch(API_ENDPOINTS.tasks, {
      headers: {
        'Authorization': getHeader(event, 'authorization') || '',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Backend retornó ${response.status}`)
    }

    const backendTasks = await response.json()

    // Transformar datos para frontend (lógica BFF)
    const tasks = Array.isArray(backendTasks) ? backendTasks : backendTasks.data || []

    return {
      success: true,
      data: tasks.map((task: any) => ({
        id: task.id,
        title: task.title || task.name,
        completed: task.completed || task.isDone,
        createdAt: task.createdDate || task.createdAt,
        // Enriquecimiento del BFF
        source: 'Java/Spring Backend'
      })),
      count: tasks.length
    }
  } catch (error: any) {
    console.error('[BFF] Error en GET /api/tasks:', error.message)

    // Mock cuando backend Java no está disponible
    return {
      success: true,
      data: [
        { 
          id: '1', 
          title: 'Integrar BFF Nuxt', 
          completed: true,
          createdAt: new Date().toISOString(),
          source: 'Mock Data'
        },
        { 
          id: '2', 
          title: 'Conectar con Java backend', 
          completed: false,
          createdAt: new Date().toISOString(),
          source: 'Mock Data'
        },
        { 
          id: '3', 
          title: 'Configurar auth JWT', 
          completed: false,
          createdAt: new Date().toISOString(),
          source: 'Mock Data'
        }
      ],
      count: 3,
      note: 'Mock data (Backend Java no disponible en http://localhost:8080)'
    }
  }
})
