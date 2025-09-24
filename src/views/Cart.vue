<template>
  <div class="cart-container">
    <!-- Cart Header -->
    <div class="cart-header">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="cart-title">
              <i class="fas fa-shopping-cart me-3"></i>
              My Shopping Cart
            </h1>
            <p class="cart-subtitle" v-if="cart.length > 0">
              You have {{ cartItemCount }} {{ cartItemCount === 1 ? 'item' : 'items' }} in your cart
            </p>
          </div>
          <router-link to="/" class="btn btn-back">
            <i class="fas fa-arrow-left me-2"></i>
            Continue Shopping
          </router-link>
        </div>
      </div>
    </div>

    <div class="container cart-content">

      <!-- Empty Cart -->
      <div v-if="cart.length === 0" class="empty-cart">
        <div class="empty-cart-content">
          <div class="empty-cart-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <h3>Your cart is empty</h3>
          <p>Discover amazing learning opportunities and start building your educational journey!</p>
          <router-link to="/" class="btn btn-primary btn-lg">
            <i class="fas fa-graduation-cap me-2"></i>
            Explore Classes
          </router-link>
        </div>
      </div>

      <!-- Cart Items -->
      <div v-else>
        <div class="row g-4">
          <div class="col-lg-8">
            <div class="cart-items-card">
              <div class="cart-items-header">
                <h3>
                  <i class="fas fa-list me-2"></i>
                  Your Selected Classes
                </h3>
                <span class="items-count">{{ cart.length }} {{ cart.length === 1 ? 'class' : 'classes' }}</span>
              </div>
              
              <div class="cart-items-list">
                <div 
                  v-for="item in cart" 
                  :key="item.id" 
                  class="cart-item"
                >
                  <div class="cart-item-content">
                    <div class="item-icon">
                      <i :class="item.icon"></i>
                    </div>
                    
                    <div class="item-details">
                      <h4 class="item-title">{{ item.subject }}</h4>
                      <div class="item-info">
                        <span class="item-location">
                          <i class="fas fa-map-marker-alt"></i>
                          {{ item.location }}
                        </span>
                        <span class="item-quantity">
                          <i class="fas fa-users"></i>
                          {{ item.quantity }} {{ item.quantity === 1 ? 'space' : 'spaces' }}
                        </span>
                      </div>
                    </div>
                    
                    <div class="item-pricing">
                      <div class="unit-price">
                        £{{ item.price }} <span>per space</span>
                      </div>
                      <div class="total-price">
                        £{{ (item.price * item.quantity).toFixed(2) }}
                      </div>
                    </div>
                    
                    <button 
                      class="btn-remove"
                      @click="removeFromCart(item.id)"
                      title="Remove from cart"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Checkout Form -->
          <div class="col-lg-4">
            <div class="checkout-card">
              <div class="checkout-header">
                <h3>
                  <i class="fas fa-credit-card me-2"></i>
                  Checkout
                </h3>
              </div>
              
              <div class="checkout-body">
                <!-- Order Summary -->
                <div class="order-summary">
                  <h4>Order Summary</h4>
                  <div class="summary-line">
                    <span>Total Items:</span>
                    <span class="summary-value">{{ cartItemCount }}</span>
                  </div>
                  <div class="summary-line total-line">
                    <span>Total Price:</span>
                    <span class="total-amount">£{{ cartTotal.toFixed(2) }}</span>
                  </div>
                </div>

                <!-- Customer Information -->
                <form @submit.prevent="checkout" class="checkout-form">
                  <h4>Customer Information</h4>
                  
                  <div class="form-group">
                    <label for="customerName" class="form-label">
                      <i class="fas fa-user me-2"></i>Full Name *
                    </label>
                    <input 
                      type="text" 
                      class="form-control form-control-modern" 
                      id="customerName"
                      v-model="customerName"
                      :class="{ 'is-invalid': nameError }"
                      placeholder="Enter your full name"
                      required
                    >
                    <div v-if="nameError" class="error-message">
                      <i class="fas fa-exclamation-circle me-1"></i>
                      {{ nameError }}
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="customerPhone" class="form-label">
                      <i class="fas fa-phone me-2"></i>Phone Number *
                    </label>
                    <input 
                      type="text" 
                      class="form-control form-control-modern" 
                      id="customerPhone"
                      v-model="customerPhone"
                      :class="{ 'is-invalid': phoneError }"
                      placeholder="Enter your phone number"
                      required
                    >
                    <div v-if="phoneError" class="error-message">
                      <i class="fas fa-exclamation-circle me-1"></i>
                      {{ phoneError }}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    class="btn-checkout"
                    :disabled="!isFormValid || isSubmitting"
                    :class="{ 'btn-loading': isSubmitting }"
                  >
                    <i v-if="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                    <i v-else class="fas fa-credit-card me-2"></i>
                    {{ isSubmitting ? 'Processing Order...' : 'Place Order' }}
                  </button>
                </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="success-modal-overlay">
      <div class="success-modal">
        <div class="success-modal-content">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3>Order Confirmed!</h3>
          <p>Thank you for your order, <strong>{{ customerName }}</strong>!</p>
          <p>Your classes have been successfully booked.</p>
          <div class="order-details">
            <div class="detail-row">
              <span>Total Items:</span>
              <span>{{ cartItemCount }}</span>
            </div>
            <div class="detail-row">
              <span>Total Amount:</span>
              <span class="amount">£{{ cartTotal.toFixed(2) }}</span>
            </div>
          </div>
          <button type="button" class="btn btn-primary btn-lg" @click="closeSuccessModal">
            <i class="fas fa-graduation-cap me-2"></i>
            Continue Learning
          </button>
        </div>
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
      customerName: '',
      customerPhone: '',
      nameError: '',
      phoneError: '',
      isSubmitting: false,
      showSuccessModal: false
    }
  },
  computed: {
    cart() {
      return this.store.cart
    },
    cartTotal() {
      return this.store.cartTotal
    },
    cartItemCount() {
      return this.store.cartItemCount
    },
    isFormValid() {
      return this.customerName.trim() !== '' && 
             this.customerPhone.trim() !== '' && 
             this.nameError === '' && 
             this.phoneError === ''
    }
  },
  methods: {
    removeFromCart(lessonId) {
      this.store.removeFromCart(lessonId)
    },
    validateName() {
      const nameRegex = /^[a-zA-Z\s]+$/
      if (!nameRegex.test(this.customerName)) {
        this.nameError = 'Name must contain only letters and spaces'
        return false
      }
      this.nameError = ''
      return true
    },
    validatePhone() {
      const phoneRegex = /^[0-9]+$/
      if (!phoneRegex.test(this.customerPhone)) {
        this.phoneError = 'Phone must contain only numbers'
        return false
      }
      this.phoneError = ''
      return true
    },
    async checkout() {
      // Validate form
      const isNameValid = this.validateName()
      const isPhoneValid = this.validatePhone()
      
      if (!isNameValid || !isPhoneValid) {
        return
      }

      this.isSubmitting = true

      try {
        // Submit order through store
        const order = await this.store.submitOrder({
          name: this.customerName,
          phone: this.customerPhone
        })

        // Show success modal
        this.showSuccessModal = true
        
        // Clear form
        this.customerName = ''
        this.customerPhone = ''
        
      } catch (error) {
        console.error('Checkout error:', error)
        alert('There was an error processing your order. Please try again.')
      } finally {
        this.isSubmitting = false
      }
    },
    closeSuccessModal() {
      this.showSuccessModal = false
      this.$router.push('/')
    }
  },
  watch: {
    customerName() {
      if (this.customerName.trim() !== '') {
        this.validateName()
      }
    },
    customerPhone() {
      if (this.customerPhone.trim() !== '') {
        this.validatePhone()
      }
    }
  }
}
</script>

<style scoped>
/* Container Styles */
.cart-container {
  padding: 0;
}

/* Cart Header */
.cart-header {
  padding: 2rem 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 0 0 2rem 2rem;
  margin: -2rem -2rem 2rem -2rem;
}

.cart-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.cart-subtitle {
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 0;
}

.btn-back {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

/* Cart Content */
.cart-content {
  padding-bottom: 2rem;
}

/* Empty Cart */
.empty-cart {
  padding: 4rem 2rem;
  text-align: center;
}

.empty-cart-content {
  max-width: 500px;
  margin: 0 auto;
}

.empty-cart-icon {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: white;
  font-size: 3rem;
}

.empty-cart h3 {
  color: #1a202c;
  margin-bottom: 1rem;
  font-weight: 700;
}

.empty-cart p {
  color: #64748b;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

/* Cart Items Card */
.cart-items-card {
  background: white;
  border-radius: 1.25rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.cart-items-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-items-header h3 {
  margin: 0;
  font-weight: 700;
}

.items-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.cart-items-list {
  padding: 0;
}

/* Cart Item */
.cart-item {
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.cart-item:hover {
  background: #f8fafc;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-content {
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.item-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
}

.item-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.item-info {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #64748b;
}

.item-location, .item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-pricing {
  text-align: right;
  flex-shrink: 0;
}

.unit-price {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.unit-price span {
  font-size: 0.8rem;
}

.total-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #10b981;
}

.btn-remove {
  background: #ef4444;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.btn-remove:hover {
  background: #dc2626;
  transform: scale(1.1);
}

/* Checkout Card */
.checkout-card {
  background: white;
  border-radius: 1.25rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  position: sticky;
  top: 2rem;
}

.checkout-header {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 1.5rem 2rem;
}

.checkout-header h3 {
  margin: 0;
  font-weight: 700;
}

.checkout-body {
  padding: 2rem;
}

/* Order Summary */
.order-summary {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
}

.order-summary h4 {
  color: #1a202c;
  margin-bottom: 1rem;
  font-weight: 700;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: #64748b;
}

.summary-value {
  font-weight: 600;
  color: #1a202c;
}

.total-line {
  border-top: 2px solid #e2e8f0;
  padding-top: 0.75rem;
  margin-top: 1rem;
  margin-bottom: 0;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: 800;
  color: #10b981;
}

/* Checkout Form */
.checkout-form h4 {
  color: #1a202c;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
}

.form-control-modern {
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.form-control-modern:focus {
  background: white;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-control-modern.is-invalid {
  border-color: #ef4444;
  background: #fef2f2;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
}

.btn-checkout {
  width: 100%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 1rem 1.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-checkout:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.btn-checkout:disabled {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-loading {
  position: relative;
}

/* Success Modal */
.success-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  backdrop-filter: blur(5px);
}

.success-modal {
  background: white;
  border-radius: 1.5rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

.success-modal-content {
  padding: 3rem;
  text-align: center;
}

.success-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: white;
  font-size: 3rem;
  animation: successPulse 0.6s ease-out;
}

.success-modal h3 {
  color: #1a202c;
  margin-bottom: 1rem;
  font-weight: 800;
  font-size: 1.8rem;
}

.success-modal p {
  color: #64748b;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.order-details {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.detail-row:last-child {
  margin-bottom: 0;
  border-top: 2px solid #e2e8f0;
  padding-top: 0.5rem;
  font-weight: 700;
}

.amount {
  color: #10b981;
  font-size: 1.2rem;
  font-weight: 800;
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes successPulse {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .cart-header {
    text-align: center;
    padding: 1.5rem 0;
  }
  
  .cart-title {
    font-size: 1.5rem;
  }
  
  .btn-back {
    margin-top: 1rem;
  }
  
  .cart-item-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .item-pricing {
    text-align: left;
    width: 100%;
  }
  
  .checkout-card {
    margin-top: 2rem;
    position: static;
  }
}

@media (max-width: 576px) {
  .cart-items-header, .checkout-header {
    padding: 1rem 1.5rem;
  }
  
  .cart-item-content, .checkout-body {
    padding: 1rem 1.5rem;
  }
  
  .success-modal-content {
    padding: 2rem;
  }
  
  .success-icon {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
}
</style>