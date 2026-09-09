# BFF (Backend For Frontend) + Java/Spring Backend

## Arquitectura

```
Frontend (Nuxt/Vue 3)  ←→  BFF (Nuxt Server)  ←→  Java/Spring API
localhost:3000              localhost:3000         localhost:8080
```

## Cómo funciona

### 1. Frontend hace request sin CORS
```ts
// pages/api-demo.vue
const tasks = await $fetch('/api/tasks')  // ← mismo origen, sin CORS
```

### 2. BFF consulta Java backend
```ts
// server/api/tasks.ts
export default defineEventHandler(async (event) => {
  const response = await fetch('http://localhost:8080/api/tasks')
  const data = await response.json()
  
  // Transforma si es necesario
  return {
    success: true,
    data: data.map(task => ({
      id: task.id,
      title: task.title,
      completed: task.isDone  // ← diferente nombre en Java
    }))
  }
})
```

### 3. Frontend recibe datos transformados
```ts
// Tipado automático
interface Task {
  id: string
  title: string
  completed: boolean
}

const tasks = await $fetch<Task[]>('/api/tasks')
```

## Rutas BFF actuales

| Ruta | Método | Descripción | Java Backend |
|------|--------|-------------|--------------|
| `/api/info` | GET | Info del sistema | `GET /api/auth/profile` |
| `/api/tasks` | GET | Lista de tareas | `GET /api/tasks` |
| `/api/users/[id]` | GET | Usuario por ID | `GET /api/users/:id` |
| `/api/auth/login` | POST | Autenticación | `POST /api/auth/login` |
| `/api/auth/logout` | POST | Logout | - |

## Configuración

### Desarrollo

1. **Nuxt**:
```bash
npm run dev  # http://localhost:3000
```

2. **Java/Spring** (en otra terminal):
```bash
# Ejemplo con Maven
mvn spring-boot:run

# Ejemplo con Gradle
gradle bootRun

# Debe estar en http://localhost:8080
```

3. **Frontend en Nuxt**:
   - Abre http://localhost:3000/api-demo
   - Prueba GET /api/tasks (consultará Java en 8080)

### Variables de entorno

En `.env`:
```
JAVA_BACKEND_URL=http://localhost:8080
```

En `.env.production`:
```
JAVA_BACKEND_URL=https://api.tudominio.com
```

## Ventajas

✅ **Sin CORS** — frontend habla con Nuxt (mismo origen)
✅ **Transformación** — adaptar datos Java al formato frontend
✅ **Auth centralizada** — tokens en httpOnly cookies (seguro)
✅ **Rate limiting** — proteger backend Java
✅ **Logging** — auditar todas las requests
✅ **TypeScript** — tipado compartido frontend-BFF

## Desventajas

❌ 1 servidor más (Nuxt BFF)
❌ Deploy más complejo (necesita Node.js)
❌ Si Java backend ya tiene CORS configurado, posible overhead

## Cuándo usar BFF

**SÍ usarlo si:**
- Frontend es Nuxt, backend es Java/Spring
- Necesitas transformar datos
- Quieres centralizar auth
- Quieres evitar CORS

**NO si:**
- Frontend consume API Java directamente (ya está CORS configurado)
- Es SPA puro sin backend Nuxt

## Testing del BFF

En `pages/api-demo.vue` hay buttons para:
1. Consultar `/api/info`
2. Consultar `/api/tasks`
3. Consultar `/api/users/:id`
4. Login a través de `/api/auth/login`

Si Java backend no está disponible, devuelve mock data automáticamente (ver consola).

## Próximos pasos

1. Monta un Java/Spring backend simple (GET /api/tasks, POST /api/auth/login)
2. Cambia `JAVA_BACKEND_URL` en `.env` al URL real
3. Prueba en http://localhost:3000/api-demo
4. Los datos deben venir del Java backend
