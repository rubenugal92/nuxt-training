# Nuxt 3 Demo — Vue 3 + Composition API + TypeScript + Pinia

## Estructura

```
app/
├── app.vue              # Raíz, layout global
├── pages/               # Auto-routing (cada archivo = ruta)
│   ├── index.vue       # /
│   ├── about.vue       # /about
│   ├── tasks.vue       # /tasks
│   └── api-demo.vue    # /api-demo
├── stores/             # Pinia (auto-importa con useXyz)
│   └── tasks.ts
├── composables/        # Lógica reutilizable (auto-importa)
│   └── utils.ts
└── server/
    └── api/            # Backend routes
        ├── info.ts     # GET /api/info
        └── users/[id].ts # GET /api/users/:id
```

## Conceptos Clave

### 1. Auto-Routing (zero config)
- Archivos en `pages/` se convierten en rutas
- `pages/index.vue` → `/`
- `pages/about.vue` → `/about`
- `pages/users/[id].vue` → `/users/:id`
- **Sin** React Router / Vue Router manual

### 2. Pinia Store (ya lo usas)
```ts
// app/stores/tasks.ts
export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref([...])
  const addTask = (title) => { ... }
  return { tasks, addTask }
})

// En cualquier componente:
const store = useTaskStore()
```
- Se auto-importa
- Reactivo sin boilerplate
- TypeScript nativo

### 3. Composables (igual que en Vue puro)
```ts
// app/composables/utils.ts
export const useFetch = (url) => { ... }

// En componentes:
const { data, loading } = useFetch('/api/info')
```
- Auto-importa `useFetch`, `useLocalStorage`, etc.
- Patrón igual al que ya conoces

### 4. Server API Routes (grande)
```ts
// server/api/info.ts
export default defineEventHandler(async (event) => {
  return { message: 'desde servidor' }
})

// Cliente:
const data = await $fetch('/api/info')
```
- **Sin CORS**
- Mismo repo, mismo deploy
- Acceso directo a DB desde aquí
- Middleware de auth/logging

### 5. $fetch (client + server)
```ts
// Funciona en cliente y servidor
const user = await $fetch('/api/users/1')

// Con tipos:
interface User { id: string; email: string }
const user = await $fetch<User>('/api/users/1')
```

### 6. useRoute() / useRouter()
```ts
const route = useRoute()
const router = useRouter()

// Navegar:
await router.push('/tasks')

// Params:
console.log(route.params.id)
```

## Para tu cliente: cuándo usar Nuxt

**Bueno:**
- App fullstack (UI + API juntos)
- SEO importante
- Contenido dinámico + estático (SSR + SSG)
- Equipos pequeños que usan Vue

**NO es ideal:**
- SPA puro (sin SSR) → usa Vite + Vue Router
- API externa completamente separada → Next.js mejor
- Equipos que no conocen Vue

## Cómo correr

```bash
cd test-nuxt
npm install
npm run dev
# → http://localhost:3000
```

## Pasos para aprender

1. ✅ Lee `pages/index.vue` — entiende routing
2. ✅ Toca `stores/tasks.ts` — modifica state y ve reactivity
3. ✅ Agrega tarea → prueba el store
4. ✅ Mira `api-demo.vue` → entiende `$fetch`
5. ✅ Modifica `/api/info.ts` → retorna otros datos
6. ✅ Crea `pages/test.vue` → será `/test` automático

## Diferencias con Vue + Vite puro

| Característica | Nuxt | Vue Puro |
|---|---|---|
| Routing | Automático (filesystem) | Manual |
| SSR | Incluido | Necesita config |
| API routes | Incluidas | Necesita Express/Fastify |
| Auto-imports | Sí (stores, composables) | No |
| Deploy | Vercel/Netlify/Node | Vercel/Netlify |

## Conclusión: Vale la pena para tu cliente?

✅ **SÍ si:** Necesita SEO, backend cercano, admin panel interno, e-commerce
❌ **NO si:** Es SOLO SPA, backend separado, equipo no Vue

Prueba 2-3 horas, mira qué tan cómodo te sientes. Si te gusta la colocalización servidor/cliente, Nuxt gana.
