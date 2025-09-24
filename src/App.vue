<template>
  <div id="app">
    <nav class="navbar">
      <div class="container">
        <router-link to="/" class="navbar-brand">
          <i class="fas fa-graduation-cap"></i>
          EduMarket
        </router-link>
        
        <div class="navbar-nav">
          <router-link to="/" class="nav-link">Classes</router-link>
          <button class="btn-cart" @click="$router.push('/cart')">
            Cart ({{ cart.length }})
          </button>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 EduMarket. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { useMainStore } from './stores'

export default {
  name: 'App',
  setup() {
    const store = useMainStore()
    return { store }
  },
  computed: {
    cart() {
      return this.store.cart
    }
  }
}
</script>

<style>
#app {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1a202c;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .navbar-brand {
    font-size: 1.2rem;
  }
  
  .navbar-nav {
    flex-direction: column;
    gap: 0.5rem;
  }
}

.navbar {
  background: #3498db;
  padding: 1rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
}

.btn-cart {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.main-content {
  min-height: 600px;
  padding: 2rem 0;
}

.footer {
  background: #34495e;
  color: white;
  padding: 1rem 0;
  text-align: center;
}
</style>