<template>
  <div class="cart-container">
    <div class="container">
      <h1>Shopping Cart</h1>
      
      <div v-if="cart.length === 0" class="empty-cart">
        <p>Your cart is empty</p>
        <router-link to="/" class="btn btn-primary">Browse Classes</router-link>
      </div>
      
      <div v-else>
        <div class="cart-items">
          <div v-for="(item, index) in cart" :key="index" class="cart-item">
            <h3>{{ item.subject }}</h3>
            <p>{{ item.location }}</p>
            <p><strong>£{{ item.price }}</strong></p>
            <button @click="removeFromCart(index)" class="btn-remove">Remove</button>
          </div>
        </div>
        
        <div class="cart-summary">
          <h3>Total: £{{ totalAmount }}</h3>
        </div>
        
        <div class="checkout-form">
          <h3>Checkout</h3>
          <form @submit.prevent="submitOrder">
            <div class="form-group">
              <label>Name (letters only):</label>
              <input 
                type="text" 
                v-model="orderForm.name" 
                pattern="[A-Za-z\s]+"
                required 
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label>Phone (numbers only):</label>
              <input 
                type="text" 
                v-model="orderForm.phone" 
                pattern="[0-9]+"
                required 
                class="form-input"
              >
            </div>
            
            <button type="submit" class="btn btn-success">Place Order</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useMainStore } from '../stores'

export default {
  name: 'Cart',
  setup() {
    const store = useMainStore()
    return { store }
  },
  data() {
    return {
      orderForm: {
        name: '',
        phone: ''
      }
    }
  },
  computed: {
    cart() {
      return this.store.cart
    },
    totalAmount() {
      return this.cart.reduce((total, item) => total + item.price, 0)
    }
  },
  methods: {
    removeFromCart(index) {
      this.store.removeFromCart(index)
    },
    
    async submitOrder() {
      try {
        const orderData = {
          name: this.orderForm.name,
          phone: this.orderForm.phone,
          lessons: this.cart.map(item => ({
            lessonId: item._id,
            quantity: 1
          }))
        }
        
        const response = await fetch('http://localhost:3000/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        })
        
        if (!response.ok) {
          throw new Error('Failed to place order')
        }
        
        const result = await response.json()
        alert('Order placed successfully!')
        this.store.clearCart()
        this.orderForm.name = ''
        this.orderForm.phone = ''
        console.log('Order result:', result)
        
      } catch (error) {
        alert('Error placing order: ' + error.message)
        console.error('Order error:', error)
      }
    }
  }
}
</script>

<style scoped>
.cart-container {
  padding: 2rem 0;
}

.empty-cart {
  text-align: center;
  padding: 3rem;
}

.cart-items {
  margin-bottom: 2rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: white;
}

.cart-item h3 {
  margin: 0;
  color: #2c3e50;
}

.btn-remove {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.cart-summary {
  text-align: right;
  margin-bottom: 2rem;
  font-size: 1.2rem;
}

.checkout-form {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-success {
  background: #27ae60;
  color: white;
  width: 100%;
  margin-top: 1rem;
}
</style>