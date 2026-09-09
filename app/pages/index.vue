<template>
  <div class="page">
    <div class="card welcome-card">
      <h1>Bienvenido a Nuxt 3 🎉</h1>
      <p>Esta es una demostración de los conceptos clave de Nuxt.</p>
    </div>

    <div class="concepts-grid">
      <div class="concept-card">
        <h3>📁 Auto-Routing</h3>
        <p>Las páginas en <code>pages/</code> se convierten automáticamente en rutas.</p>
        <small>Pages → Routes (sin config manual)</small>
      </div>

      <div class="concept-card">
        <h3>⚡ SSR Ready</h3>
        <p>Render en servidor por defecto. Hydración automática en cliente.</p>
        <small>Server + Client en harmony</small>
      </div>

      <div class="concept-card">
        <h3>🔗 API Routes</h3>
        <p>API endpoints en <code>server/api/</code>. Integración perfecta.</p>
        <small>Backend en el mismo proyecto</small>
      </div>

      <div class="concept-card">
        <h3>🎯 Composables</h3>
        <p>Funciones reutilizables con <code>useXyz</code>. Composition API nativa.</p>
        <small>Lógica limpia y modular</small>
      </div>

      <div class="concept-card">
        <h3>📦 Pinia Store</h3>
        <p>State management simple y elegante. Vue 3 compatible.</p>
        <small>Reactividad + TypeScript</small>
      </div>

      <div class="concept-card">
        <h3>🎨 Middleware</h3>
        <p>Ejecuta lógica antes de cambiar de página.</p>
        <small>Auth, analytics, validación</small>
      </div>
    </div>

    <div class="card action-card">
      <h2>Explora las demo:</h2>
      <ul class="action-list">
        <li><NuxtLink to="/tasks">→ Tasks (Store + Composables)</NuxtLink></li>
        <li><NuxtLink to="/api-demo">→ API Integration</NuxtLink></li>
        <li><NuxtLink to="/about">→ About Page</NuxtLink></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// Empty script setup block
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
  margin-bottom: 2rem;
}

.welcome-card h1 {
  margin-top: 0;
  color: #667eea;
  font-size: 2.5rem;
}

.welcome-card p {
  font-size: 1.1rem;
  color: #666;
}

.concepts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.concept-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.concept-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.concept-card h3 {
  margin-top: 0;
  color: #667eea;
}

.concept-card code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.concept-card small {
  color: #999;
  display: block;
  margin-top: 0.5rem;
}

.action-card h2 {
  margin-top: 0;
  color: #667eea;
}

.action-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
}

.action-list li {
  margin: 0.8rem 0;
}

.action-list a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.action-list a:hover {
  color: #764ba2;
  text-decoration: underline;
}
</style>