import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}

export const useTaskStore = defineStore('tasks', () => {
  // State
  const tasks = ref<Task[]>([
    { id: '1', title: 'Aprender Nuxt basics', completed: true, createdAt: new Date() },
    { id: '2', title: 'Entender routing automático', completed: true, createdAt: new Date() },
    { id: '3', title: 'Probar Pinia store', completed: false, createdAt: new Date() },
    { id: '4', title: 'Integrar API server', completed: false, createdAt: new Date() },
  ])

  // Computed
  const pendingCount = computed(() => 
    tasks.value.filter(t => !t.completed).length
  )

  const completedCount = computed(() => 
    tasks.value.filter(t => t.completed).length
  )

  // Actions
  const addTask = (title: string) => {
    tasks.value.push({
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date(),
    })
  }

  const toggleTask = (id: string) => {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.completed = !task.completed
    }
  }

  const deleteTask = (id: string) => {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  const clearCompleted = () => {
    tasks.value = tasks.value.filter(t => !t.completed)
  }

  return {
    tasks,
    pendingCount,
    completedCount,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
  }
})
