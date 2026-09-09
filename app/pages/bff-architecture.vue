<template>
  <div class="page">
    <div class="card">
      <h1>📐 Arquitectura BFF + Java Backend</h1>

      <section class="section">
        <h2>Flujo de datos</h2>
        <div class="flow-diagram">
          <div class="flow-step">
            <h3>1. Frontend (Vue 3)</h3>
            <p>pages/api-demo.vue</p>
            <code>await $fetch('/api/tasks')</code>
          </div>
          
          <div class="arrow">↓ (sin CORS)</div>

          <div class="flow-step">
            <h3>2. BFF (Nuxt Server)</h3>
            <p>server/api/tasks.ts</p>
            <code>fetch('http://localhost:8080/api/tasks')</code>
          </div>

          <div class="arrow">↓ (HTTP interno)</div>

          <div class="flow-step">
            <h3>3. Java/Spring Backend</h3>
            <p>http://localhost:8080</p>
            <code>GET /api/tasks</code>
          </div>

          <div class="arrow">↓</div>

          <div class="flow-step">
            <h3>4. Base de datos</h3>
            <p>PostgreSQL / MySQL / etc</p>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>Estructura de archivos</h2>
        <pre class="code-block">test-nuxt/
├── app/
│   ├── pages/
│   │   ├── api-demo.vue        ← Frontend consume BFF
│   │   ├── tasks.vue           ← Lista tareas (con Pinia)
│   │   └── ...
│   ├── server/
│   │   └── api/
│   │       ├── info.ts         ← GET /api/info
│   │       ├── tasks.ts        ← GET /api/tasks
│   │       ├── users/[id].ts   ← GET /api/users/:id
│   │       └── auth/
│   │           ├── login.ts    ← POST /api/auth/login
│   │           └── logout.ts   ← POST /api/auth/logout
│   └── utils/backend.ts        ← Config URLs Java backend</pre>
      </section>

      <section class="section">
        <h2>Configuración</h2>
        <p>En <code>.env</code>:</p>
        <pre class="code-block">JAVA_BACKEND_URL=http://localhost:8080</pre>
        
        <p>En <code>server/utils/backend.ts</code>:</p>
        <pre class="code-block">export const JAVA_BACKEND_URL = process.env.JAVA_BACKEND_URL || 'http://localhost:8080'

export const API_ENDPOINTS = {
  users: `${JAVA_BACKEND_URL}/api/users`,
  tasks: `${JAVA_BACKEND_URL}/api/tasks`,
  login: `${JAVA_BACKEND_URL}/api/auth/login`,
}</pre>
      </section>

      <section class="section">
        <h2>Ventajas del BFF</h2>
        <ul class="benefits">
          <li>✅ Sin CORS: Frontend habla con Nuxt (mismo origen)</li>
          <li>✅ Transformación: Adaptar datos Java al formato frontend</li>
          <li>✅ Auth centralizada: Tokens en httpOnly cookies</li>
          <li>✅ Rate limiting: Proteger backend Java</li>
          <li>✅ Logging: Auditar requests en un solo lugar</li>
          <li>✅ TypeScript: Tipos compartidos frontend-BFF</li>
        </ul>
      </section>

      <div class="info-box">
        <h3>💡 Resumen</h3>
        <p>BFF en Nuxt es ideal cuando tienes backend Java/Spring y necesitas transformar datos, centralizar auth y evitar CORS.</p>
        <p>Prueba <NuxtLink to="/api-demo">API Demo</NuxtLink> para ver el BFF consultando backend Java (mock).</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Empty
</script>

<style scoped>
.page { animation: fadeIn 0.5s ease-in; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.card { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
.card h1 { margin-top: 0; color: #667eea; }
.section { margin: 2rem 0; padding-bottom: 1.5rem; border-bottom: 1px solid #eee; }
.section:last-child { border-bottom: none; }
.section h2 { color: #764ba2; margin-top: 0; }
.flow-diagram { display: flex; flex-direction: column; gap: 1rem; margin: 1.5rem 0; }
.flow-step { background: #f0f4ff; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #667eea; }
.flow-step h3 { margin-top: 0; color: #667eea; }
.flow-step code { background: white; padding: 0.5rem 1rem; border-radius: 4px; display: block; margin-top: 0.5rem; font-size: 0.85rem; }
.arrow { text-align: center; color: #667eea; font-weight: bold; }
.code-block { background: #f5f5f5; padding: 1rem; border-radius: 6px; overflow-x: auto; font-size: 0.85rem; border-left: 4px solid #667eea; }
.benefits { list-style: none; padding: 0; }
.benefits li { padding: 0.5rem 0; }
.info-box { background: #f0f4ff; padding: 1.5rem; border-radius: 8px; margin-top: 2rem; }
.info-box h3 { margin-top: 0; color: #667eea; }
.info-box a { color: #667eea; text-decoration: none; }
.info-box a:hover { text-decoration: underline; }
</style>