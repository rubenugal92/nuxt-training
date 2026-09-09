# Nuxt vs tu Stack Actual

## Ya usas Vue 3 + Composition API + TypeScript + Pinia

### Lo que NO cambia:
- **Composables** — igual sintaxis `useXyz()`
- **Pinia stores** — mismo código, mismo patrón
- **TypeScript** — full support nativo
- **Composition API** — `ref`, `computed`, `watch` igual

### Lo que Nuxt AGREGA (sin quitar nada):

#### 1. Auto-routing sin config
```
Hoy:
├── src/router/index.ts (confuso, mantenimiento)
├── src/views/Dashboard.vue
└── src/views/Profile.vue
↓
Nuxt:
├── pages/index.vue      // ← / automático
├── pages/dashboard.vue  // ← /dashboard automático
└── pages/profile.vue    // ← /profile automático
```

#### 2. Server API en el repo
```
Hoy:
├── frontend/ (Vite + Vue)
└── backend/ (Express/Node) ← OTRO REPO

Nuxt:
├── app/ (frontend)
└── server/api/ (backend) ← MISMO REPO, mismo deploy
```

#### 3. Sin CORS
```ts
// Frontend
const user = await $fetch('/api/users/1') // ✅ Same origin

// Backend (server/api/users/[id].ts)
export default defineEventHandler(async (event) => {
  const user = await db.users.findById(id)
  return user
})
```

#### 4. Auto-imports
```ts
// Hoy: imports manuales
import { useTaskStore } from '@/stores/tasks'
import { useFetch } from '@/composables/utils'

// Nuxt: auto-importa ambos
const store = useTaskStore()  // ✅
const { data } = useFetch()   // ✅
```

#### 5. SSR + SSG (opcional)
```bash
# Dev
npm run dev → http://localhost:3000 (SSR)

# Build
npm run build
npm run preview → SSR en producción

# O estatica:
npm run generate → /dist/ con HTML estático
```

## Ventajas reales para TU cliente

### ✅ Menor complejidad ops
```
Hoy:
- Vite (frontend) → build, deploy
- Express (backend) → build, deploy
- CORS config
- Env vars en 2 lugares

Nuxt:
- 1 build
- 1 deploy
- Sin CORS
- 1 .env
```

### ✅ Mismo equipo
```
// pages/tasks.vue (Frontend)
const tasks = await $fetch('/api/tasks')

// server/api/tasks.ts (Backend)
export default defineEventHandler(async () => {
  return await db.tasks.getAll()
})

// Frontend dev puede tocar backend
```

### ✅ TypeScript compartido
```ts
// types/index.ts
export interface Task {
  id: string
  title: string
  completed: boolean
}

// pages/tasks.vue
const tasks = await $fetch<Task[]>('/api/tasks') // ✅ Tipado

// server/api/tasks.ts
const tasks: Task[] = await db.getTasks() // ✅ Mismo tipo
```

## Gotchas (por qué algunos evitan Nuxt)

### 1. SSR por defecto es lento si no lo planeas
- Componentes no pueden acceder a `window` sin cuidado
- `useClientOnly()` para evitar
- Preload de datos en servidor

### 2. Deploy es más complejo que SPA estática
- Vite SPA → Netlify/Vercel/S3 en 30s
- Nuxt SSR → necesita Node.js server

### 3. Si usas solo SPA mode (sin SSR)
- ¿Por qué no Vite + Vue Router puro?
- Pierdes beneficios de Nuxt

## Mi veredicto para tu cliente

**Usa Nuxt SI:**
- Necesita SEO (blog, e-commerce, landing)
- Quiere backend cerca del frontend (admin panel)
- Equipo es pequeño (1-3 devs)
- Presupuesto permite Node.js server

**NO uses Nuxt si:**
- Es SOLO frontend SPA puro
- Backend está en otro repo (Java, Go, Python)
- Necesita deploy ultra-simple (Netlify static)
- Equipo grande con frontend/backend separados

## Próximos pasos

1. Corre `npm run dev` en test-nuxt
2. Juega con páginas/store/api 2-3 horas
3. Lee `/server/api/info.ts` + `/app/pages/api-demo.vue`
4. Toca `/app/stores/tasks.ts` y ve cómo cambia UI
5. Decide.
