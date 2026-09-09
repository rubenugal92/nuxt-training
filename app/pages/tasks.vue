<template>
  <div class="page">
    <div class="card">
      <h1>📋 Task Manager</h1>
      <p>Demo de Pinia store + Vue reactivity</p>

      <div class="stats">
        <div class="stat">
          <span class="stat-label">Pendientes</span>
          <span class="stat-value">{{ taskStore.pendingCount }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Completadas</span>
          <span class="stat-value">{{ taskStore.completedCount }}</span>
        </div>
      </div>

      <div class="input-group">
        <input
          v-model="newTask"
          type="text"
          placeholder="Nueva tarea..."
          @keyup.enter="addTask"
          class="input"
        />
        <button @click="addTask" class="btn btn-add">Agregar</button>
      </div>

      <div class="tasks-list">
        <div 
          v-for="task in taskStore.tasks"
          :key="task.id"
          :class="['task-item', { completed: task.completed }]"
        >
          <input
            type="checkbox"
            :checked="task.completed"
            @change="taskStore.toggleTask(task.id)"
            class="checkbox"
          />
          <span class="task-title">{{ task.title }}</span>
          <button
            @click="taskStore.deleteTask(task.id)"
            class="btn btn-delete"
          >
            ✕
          </button>
        </div>

        <div v-if="taskStore.tasks.length === 0" class="empty-state">
          <p>Sin tareas. ¡Añade una!</p>
        </div>
      </div>

      <div v-if="taskStore.completedCount > 0" class="clear-section">
        <button @click="taskStore.clearCompleted()" class="btn btn-clear">
          Limpiar completadas
        </button>
      </div>

      <div class="info-box">
        <h3>🔍 Cómo funciona:</h3>
        <ol>
          <li>El store está en <code>stores/tasks.ts</code></li>
          <li>Se auto-importa con <code>useTaskStore()</code></li>
          <li>Reactivo automático — cambios sin `dispatch` o `commit`</li>
          <li>Persiste en esta sesión (para BD, agrega un composable)</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from '~/stores/tasks'

const taskStore = useTaskStore()
const newTask = ref('')

const addTask = () => {
  if (newTask.value.trim()) {
    taskStore.addTask(newTask.value)
    newTask.value = ''
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

.stats {
  display: flex;
  gap: 2rem;
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.9rem;
  color: #999;
  text-transform: uppercase;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #667eea;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

.input {
  flex: 1;
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

.btn:hover {
  background: #764ba2;
}

.btn-add {
  padding: 0.75rem 1.5rem;
}

.tasks-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  transition: background 0.3s;
}

.task-item:hover {
  background: #f9f9f9;
}

.task-item.completed {
  opacity: 0.6;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: #999;
}

.checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.task-title {
  flex: 1;
}

.btn-delete {
  background: #ff6b6b;
  padding: 0.5rem 0.75rem;
}

.btn-delete:hover {
  background: #ff5252;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.clear-section {
  text-align: center;
  padding: 1rem 0;
}

.btn-clear {
  background: #ff9800;
}

.btn-clear:hover {
  background: #f57c00;
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

.info-box ol {
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