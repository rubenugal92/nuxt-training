<template>
  <div class="page">
    <div class="card">
      <h1>Acerca de Nuxt</h1>
      
      <section class="section">
        <h2>¿Por qué Nuxt?</h2>
        <ul>
          <li><strong>DX increíble:</strong> Convenciones claras, menos boilerplate</li>
          <li><strong>SSR + SSG:</strong> SEO listo, performance optimizada</li>
          <li><strong>API integrada:</strong> Backend en el mismo repo</li>
          <li><strong>TypeScript nativo:</strong> Sin config compleja</li>
          <li><strong>Ecosistema Vue:</strong> Composables, pinia, vue-router automático</li>
        </ul>
      </section>

      <section class="section">
        <h2>Cuándo es buena idea:</h2>
        <ul>
          <li>Apps web fullstack (frontend + backend cercano)</li>
          <li>Contenido con SEO requerido (blogs, e-commerce)</li>
          <li>Teams pequeños a medianos</li>
          <li>Proyectos que crecen rápido</li>
        </ul>
      </section>

      <section class="section">
        <h2>Cuándo NO es ideal:</h2>
        <ul>
          <li>Aplicaciones que son SOLO cliente (SPA puro) → mejor Next.js o Vite + Vue Router</li>
          <li>API REST completamente separada</li>
          <li>Equipos que no conocen Vue</li>
        </ul>
      </section>

      <section class="section">
        <h2>Counter Demo (Composable)</h2>
        <div class="demo-box">
          <p>Contador: <strong>{{ count }}</strong></p>
          <button @click="increment" class="btn">+</button>
          <button @click="decrement" class="btn">-</button>
          <button @click="reset" class="btn btn-reset">Reset</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Composable custom — reutilizable en cualquier página
const useCounter = () => {
  const count = ref(0)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = 0
  
  return { count, increment, decrement, reset }
}

const { count, increment, decrement, reset } = useCounter()
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

.section ul {
  list-style: none;
  padding: 0;
}

.section li {
  padding: 0.5rem 0;
  line-height: 1.6;
}

.section li strong {
  color: #667eea;
}

.demo-box {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  margin-top: 1rem;
}

.demo-box p {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
}

.btn {
  padding: 0.5rem 1rem;
  margin: 0.25rem;
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

.btn-reset {
  background: #999;
}

.btn-reset:hover {
  background: #666;
}
</style>