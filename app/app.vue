<template>
  <div class="app">
    <nav class="navbar">
      <div class="nav-container">
        <h1>🚀 Nuxt Demo</h1>
        <ul class="nav-links">
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/about">Acerca de</NuxtLink></li>
          <li><NuxtLink to="/bff-architecture">BFF</NuxtLink></li>
          <li><NuxtLink to="/api-demo">API Demo</NuxtLink></li>
        </ul>
      </div>
    </nav>
    
    <main class="container">
      <NuxtPage />
    </main>

    <footer class="footer">
      <p>Nuxt 3 · Vue 3 Composition API · Auto-routing</p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #333;
}

.navbar {
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar h1 {
  color: white;
  margin: 0;
  font-size: 1.5rem;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
}

.nav-links a:hover {
  opacity: 0.7;
}

.container {
  flex: 1;
  max-width: 1200px;
  margin: 2rem auto;
  width: 100%;
  padding: 0 2rem;
}

.footer {
  text-align: center;
  padding: 2rem;
  color: white;
  background: rgba(0, 0, 0, 0.1);
  margin-top: auto;
}
</style>
