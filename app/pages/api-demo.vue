<template>
  <div class="page">
    <div class="card">
      <h1>🔌 BFF Integration (Backend For Frontend)</h1>
      <p>Nuxt actúa como BFF consultando backend Java/Spring</p>

      <div class="architecture-box">
        <h3>Arquitectura:</h3>
        <pre>Frontend (Nuxt)
  ↓ (sin CORS)
BFF (server/api/)
  ↓ (HTTP interno)
Java/Spring Backend
  ↓
Base de datos</pre>
      </div>

      <section class="section">
        <h2>GET /api/info</h2>
        <p>Consulta profile desde backend Java</p>
        <button @click="fetchInfo" class="btn" :disabled="loading">
          {{ loading ? 'Cargando...' : 'Cargar' }}
        </button>

        <div v-if="info" class="response-box">
          <div v-if="info.success" class="success">
            <strong>✅ Éxito</strong>
            <pre>{{ JSON.stringify(info, null, 2) }}</pre>
          </div>
          <div v-else class="warning">
            <strong>⚠️ Backend Java no disponible</strong>
            <p>{{ info.message }}</p>
            <pre>{{ JSON.stringify(info.mockData, null, 2) }}</pre>
          </div>
        </div>

        <div v-if="error" class="error-box">
          ❌ {{ error }}
        </div>
      </section>

      <section class="section">
        <h2>GET /api/tasks</h2>
        <p>Lista de tareas desde backend Java</p>
        <button @click="fetchTasks" class="btn" :disabled="loading">
          {{ loading ? 'Cargando...' : 'Cargar Tareas' }}
        </button>

        <div v-if="tasks" class="response-box">
          <div v-if="tasks.success" class="success">
            <strong>✅ {{ tasks.count }} tareas</strong>
            <ul class="tasks-preview">
              <li v-for="task in tasks.data" :key="task.id">
                <input type="checkbox" :checked="task.completed" />
                {{ task.title }}
              </li>
            </ul>
          </div>
          <div v-else class="warning">
            <pre>{{ JSON.stringify(tasks, null, 2) }}</pre>
          </div>
        </div>
          <div v-if="errorTask" class="error-box">
          ❌ {{ errorTask }}
        </div>
        
      </section>

      <section class="section">
        <h2>GET /api/users/[id]</h2>
        <div class="input-group">
          <input
            v-model="userId"
            type="number"
            placeholder="ID usuario..."
            min="1"
            class="input"
          />
          <button @click="fetchUser" class="btn" :disabled="loading">
            {{ loading ? 'Cargando...' : 'Buscar' }}
          </button>
        </div>

        <div v-if="user" class="response-box">
          <pre>{{ JSON.stringify(user, null, 2) }}</pre>
        </div>

        <div v-if="userError" class="error-box">
          ❌ {{ userError }}
        </div>
      </section>

      <section class="section">
        <h2>POST /api/auth/login</h2>
        <p>Autentica con backend Java y guarda token en cookie httpOnly</p>
        <div class="form-group">
          <input
            v-model="email"
            type="email"
            placeholder="email@example.com"
            class="input"
          />
          <input
            v-model="password"
            type="password"
            placeholder="password"
            class="input"
          />
          <button @click="login" class="btn" :disabled="loading">
            {{ loading ? 'Autenticando...' : 'Login' }}
          </button>
        </div>

        <div v-if="loginResponse" class="response-box">
          <div v-if="loginResponse.success" class="success">
            <strong>✅ Login exitoso</strong>
            <pre>{{ JSON.stringify(loginResponse, null, 2) }}</pre>
            <button @click="logout" class="btn btn-logout">Logout</button>
          </div>
        </div>
      </section>

      <div class="info-box">
        <h3>💡 Cómo funciona BFF en Nuxt:</h3>
        <ol>
          <li><strong>Frontend:</strong> Llama a <code>/api/tasks</code> (mismo origen)</li>
          <li><strong>BFF (server/api/tasks.ts):</strong> Consulta <code>http://localhost:8080/api/tasks</code></li>
          <li><strong>Backend Java:</strong> Responde con datos</li>
          <li><strong>BFF:</strong> Transforma/enriquece datos</li>
          <li><strong>Frontend:</strong> Recibe datos tipados</li>
        </ol>
        
        <h4>Ventajas:</h4>
        <ul>
          <li>✅ Sin CORS (frontend → BFF es mismo origen)</li>
          <li>✅ Auth/tokens en servidor (httpOnly cookies)</li>
          <li>✅ Transformación de datos centralizada</li>
          <li>✅ Tipado compartido frontend-BFF (TypeScript)</li>
          <li>✅ Rate limiting, logging, validación en BFF</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
  source: string
}

interface TasksResponse {
  success: boolean
  data: Task[]
  count: number
  note?: string
}

interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
  source: string
  fetchedAt?: string
}

interface InfoResponse {
  success: boolean
  message: string
  user?: any
  app?: any
  mockData?: any
}

interface LoginResponse {
  success: boolean
  user?: { id: string; email: string; name: string }
  message: string
}

const info = ref<InfoResponse | null>(null)
const tasks = ref<TasksResponse | null>(null)
const user = ref<User | null>(null)
const loginResponse = ref<LoginResponse | null>(null)

const userId = ref(1)
const email = ref('user@example.com')
const password = ref('password123')
const loading = ref(false)
const error = ref('')
const errorTask = ref('')
const userError = ref('')

const fetchInfo = async () => {
  loading.value = true
  error.value = ''

  try {
    info.value = await $fetch('/api/info')
  } catch (e) {
    error.value = 'Error cargando info'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const fetchTasks = async () => {
  loading.value = true

  try {
    tasks.value = await $fetch('/api/tasks')
  } catch (e) {
    errorTask.value = 'Error cargando tareas'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const fetchUser = async () => {
  loading.value = true
  userError.value = ''

  try {
    user.value = await $fetch(`/api/users/${userId.value}`)
  } catch (e) {
    userError.value = 'Error cargando usuario'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const login = async () => {
  loading.value = true

  try {
    loginResponse.value = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const logout = async () => {
  loading.value = true

  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    loginResponse.value = null
    email.value = 'user@example.com'
    password.value = 'password123'
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card h1 {
  margin-top: 0;
  color: #667eea;
}

.architecture-box {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  border-left: 4px solid #667eea;
}

.architecture-box pre {
  margin: 1rem 0 0 0;
  font-size: 0.85rem;
  line-height: 1.6;
}

.section {
  margin: 2rem 0;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.section:last-child {
  border-bottom: none;
}

.section h2 {
  color: #764ba2;
  margin-top: 0;
}

.input-group,
.form-group {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.input {
  padding: 0.75rem;
  border: 2px solid #eee;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.input:focus {
  outline: none;
  border-color: #667eea;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  background: #667eea;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.btn:hover:not(:disabled) {
  background: #764ba2;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-logout {
  background: #ff9800;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-logout:hover {
  background: #f57c00;
}

.response-box {
  margin-top: 1rem;
}

.success,
.warning {
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.success {
  background: #e8f5e9;
  border-left: 4px solid #4caf50;
}

.success pre {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.85rem;
}

.warning {
  background: #fff3e0;
  border-left: 4px solid #ff9800;
}

.warning pre {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.error-box {
  background: #ffebee;
  border-left: 4px solid #ff6b6b;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
  color: #c62828;
}

.tasks-preview {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
}

.tasks-preview li {
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tasks-preview input {
  cursor: pointer;
}

.info-box {
  background: #f0f4ff;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.info-box h3 {
  margin-top: 0;
  color: #667eea;
}

.info-box h4 {
  color: #764ba2;
  margin-top: 1.5rem;
}

.info-box ol,
.info-box ul {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.info-box li {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.info-box code {
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}
</style>

<style scoped>
.page {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card h1 {
  margin-top: 0;
  color: #667eea;
}

.section {
  margin: 2rem 0;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.section:last-child {
  border-bottom: none;
}

.section h2 {
  color: #764ba2;
  margin-top: 0;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.input {
  padding: 0.75rem;
  border: 2px solid #eee;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.input:focus {
  outline: none;
  border-color: #667eea;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  background: #667eea;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.btn:hover:not(:disabled) {
  background: #764ba2;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.response-box {
  background: #f5f5f5;
  border-left: 4px solid #667eea;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
}

.response-box pre {
  margin: 0;
  overflow-x: auto;
  font-size: 0.9rem;
  line-height: 1.4;
}

.error-box {
  background: #ffebee;
  border-left: 4px solid #ff6b6b;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
  color: #c62828;
}

.info-box {
  background: #f0f4ff;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.info-box h3 {
  margin-top: 0;
  color: #667eea;
}

.info-box ul {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.info-box li {
  margin: 0.5rem 0;
  line-height: 1.6;
}
</style>