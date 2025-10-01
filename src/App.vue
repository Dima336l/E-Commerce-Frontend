<template>
  <div id="app">
    <!-- Enhanced Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark shadow-lg">
      <div class="container">
        <router-link to="/lessons" class="navbar-brand d-flex align-items-center">
          <div class="brand-icon me-2">
            <i class="fas fa-graduation-cap"></i>
          </div>
          <div>
            <div class="brand-title">EduMarket</div>
            <div class="brand-subtitle">After School Classes</div>
          </div>
        </router-link>
        
        <div class="navbar-nav ms-auto d-flex align-items-center">
          <router-link to="/lessons" class="nav-link me-3">
            <i class="fas fa-home me-1"></i>
            Classes
          </router-link>
          
          <button 
            class="btn btn-cart position-relative me-2" 
            @click="toggleCart"
            :class="{ 'btn-cart-active': cart.length > 0 }"
          >
            <i class="fas fa-shopping-cart me-2"></i>
            My Cart
            <span v-if="cart.length > 0" class="cart-badge">
              {{ cart.length }}
            </span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="footer mt-5">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h5>EduMarket</h5>
            <p class="text-muted">Connecting students with quality after-school education programs.</p>
          </div>
          <div class="col-md-6 text-md-end">
            <p class="text-muted mb-0">© 2024 EduMarket. All rights reserved.</p>
          </div>
        </div>
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
  },
  methods: {
    toggleCart() {
      this.$router.push('/cart')
    }
  }
}
</script>

<style>
/* Global Styles */
#app {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1a202c;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Navigation Styles */
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 0;
}

.navbar-brand {
  text-decoration: none !important;
  color: white !important;
}

.brand-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  backdrop-filter: blur(10px);
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: white;
}

.brand-subtitle {
  font-size: 0.85rem;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 500;
  padding: 0.5rem 1rem !important;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white !important;
}

/* Cart Button */
.btn-cart {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.btn-cart:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn-cart-active {
  background: #10b981;
  border-color: #059669;
  animation: pulse 2s infinite;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border: 2px solid white;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Main Content */
.main-content {
  min-height: calc(100vh - 200px);
  background: rgba(255, 255, 255, 0.95);
  margin: 2rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Footer */
.footer {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 2rem 0;
  margin-top: 0 !important;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer h5 {
  color: white;
  font-weight: 700;
}

/* Global Components */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

/* Form Controls */
.form-control, .form-select {
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  padding: 0.6rem 1rem;
}

.form-control:focus, .form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-content {
    margin: 1rem;
    border-radius: 15px;
  }
  
  .brand-title {
    font-size: 1.2rem;
  }
  
  .brand-subtitle {
    font-size: 0.75rem;
  }
}
</style>