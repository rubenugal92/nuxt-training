/**
 * Configuración de URLs del backend
 * En producción cambiar a backend real
 */

// URL del backend Java/Spring (mock por ahora)
export const JAVA_BACKEND_URL = process.env.JAVA_BACKEND_URL || 'http://localhost:8080'

export const API_ENDPOINTS = {
  users: `${JAVA_BACKEND_URL}/api/users`,
  tasks: `${JAVA_BACKEND_URL}/api/tasks`,
  login: `${JAVA_BACKEND_URL}/api/auth/login`,
  profile: `${JAVA_BACKEND_URL}/api/auth/profile`,
}
