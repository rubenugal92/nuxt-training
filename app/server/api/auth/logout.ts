/**
 * BFF - Logout
 * POST /api/auth/logout
 */
export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  // Limpiar cookie
  deleteCookie(event, 'auth_token')

  console.log('[BFF] Token eliminado')

  return {
    success: true,
    message: 'Logout exitoso'
  }
})
