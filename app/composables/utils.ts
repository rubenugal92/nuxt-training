/**
 * Composable para manejo de fetch con loading, error, data
 * Se auto-importa en cualquier componente
 */
export const useCustomFetch = <T,>(url: string, options?: any) => {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetch = async () => {
    loading.value = true
    error.value = null

    try {
      data.value = await $fetch<T>(url, options)
    } catch (e: any) {
      error.value = e.message || 'Error en la petición'
      console.error('Fetch error:', e)
    } finally {
      loading.value = false
    }
  }

  // Auto-fetch al montar (opcional)
  const autoFetch = (shouldFetch = true) => {
    if (shouldFetch) {
      fetch()
    }
  }

  return {
    data,
    loading,
    error,
    fetch,
    autoFetch,
  }
}

/**
 * Composable para detectar si estamos en cliente o servidor
 */
export const useClientOnly = () => {
  const isClient = process.client
  const isServer = process.server

  return { isClient, isServer }
}

/**
 * Composable para manejo de estado local con persistencia
 */
export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const { isClient } = useClientOnly()

  const value = ref<T>(initialValue)

  // Cargar del localStorage al montar
  onMounted(() => {
    if (isClient) {
      const stored = localStorage.getItem(key)
      if (stored) {
        try {
          value.value = JSON.parse(stored)
        } catch (e) {
          console.error(`Error parsing localStorage[${key}]`, e)
        }
      }
    }
  })

  // Watch para guardar cambios
  watch(value, (newVal) => {
    if (isClient) {
      localStorage.setItem(key, JSON.stringify(newVal))
    }
  }, { deep: true })

  return value
}
