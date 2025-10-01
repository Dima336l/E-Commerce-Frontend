import { defineStore } from 'pinia'
import { API_BASE_URL } from '../config'

export const useMainStore = defineStore('main', {
  state: () => ({
    lessons: [],
    cart: [],
    loading: false,
    error: null
  }),

  getters: {
    cartTotal: (state) => {
      return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    cartItemCount: (state) => {
      return state.cart.reduce((total, item) => total + item.quantity, 0)
    },
    availableLessons: (state) => {
      return state.lessons.filter(lesson => lesson.space > 0)
    }
  },

  actions: {
    async fetchLessons() {
      this.loading = true
      this.error = null
      
      try {
        console.log('🔄 Fetching lessons from backend...')
        const response = await fetch(`${API_BASE_URL}/lessons`)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const lessonsData = await response.json()
        console.log('✅ Lessons fetched successfully:', lessonsData.length, 'lessons')
        
        // Transform backend data to include icons
        const iconsMap = {
          'Mathematics': 'fas fa-calculator',
          'English Literature': 'fas fa-book',
          'Science': 'fas fa-flask',
          'Art': 'fas fa-palette',
          'Music': 'fas fa-music'
        }
        
        this.lessons = lessonsData.map(lesson => ({
          ...lesson,
          id: lesson._id, // MongoDB uses _id
          icon: iconsMap[lesson.subject] || 'fas fa-graduation-cap'
        }))
        
      } catch (error) {
        console.error('❌ Error fetching lessons:', error)
        this.error = error.message || 'Failed to fetch lessons from server'
        
        // Fallback to show connection error with helpful message
        if (error.message.includes('fetch')) {
          this.error = `Cannot connect to server. Make sure the backend is running on ${API_BASE_URL}`
        }
      } finally {
        this.loading = false
      }
    },

    addToCart(lesson) {
      if (lesson.space <= 0) {
        return false
      }

      // Find if lesson already exists in cart
      const existingItem = this.cart.find(item => item.id === lesson.id)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        this.cart.push({
          ...lesson,
          quantity: 1
        })
      }

      // Reduce available space
      const lessonInStore = this.lessons.find(l => l.id === lesson.id)
      if (lessonInStore) {
        lessonInStore.space -= 1
      }

      return true
    },

    removeFromCart(lessonId) {
      const cartItemIndex = this.cart.findIndex(item => item.id === lessonId)
      
      if (cartItemIndex === -1) return

      const cartItem = this.cart[cartItemIndex]
      
      // Restore space to lesson
      const lesson = this.lessons.find(l => l.id === lessonId)
      if (lesson) {
        lesson.space += cartItem.quantity
      }

      // Remove item from cart
      this.cart.splice(cartItemIndex, 1)
    },

    updateCartItemQuantity(lessonId, newQuantity) {
      const cartItem = this.cart.find(item => item.id === lessonId)
      const lesson = this.lessons.find(l => l.id === lessonId)
      
      if (!cartItem || !lesson) return

      const difference = newQuantity - cartItem.quantity

      // Check if we have enough space
      if (difference > 0 && lesson.space < difference) {
        return false
      }

      // Update quantities
      cartItem.quantity = newQuantity
      lesson.space -= difference

      // Remove item if quantity is 0
      if (newQuantity <= 0) {
        this.removeFromCart(lessonId)
      }

      return true
    },

    clearCart() {
      // Restore all spaces
      this.cart.forEach(cartItem => {
        const lesson = this.lessons.find(l => l.id === cartItem.id)
        if (lesson) {
          lesson.space += cartItem.quantity
        }
      })

      this.cart = []
    },

    async submitOrder(orderData) {
      this.loading = true
      this.error = null

      try {
        console.log('🔄 Submitting order to backend...')
        
        // Prepare order data for backend
        const orderPayload = {
          name: orderData.name,
          phone: orderData.phone,
          lessons: this.cart.map(item => ({
            lessonId: item._id || item.id, // Use MongoDB _id
            quantity: item.quantity
          }))
        }

        const response = await fetch(`${API_BASE_URL}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderPayload)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        console.log('✅ Order submitted successfully:', result.orderId)

        // Update lesson spaces in local state
        for (const cartItem of this.cart) {
          const lesson = this.lessons.find(l => l.id === cartItem.id || l._id === cartItem.id)
          if (lesson) {
            // Update space via PUT API
            await this.updateLessonSpace(lesson._id || lesson.id, lesson.space - cartItem.quantity)
          }
        }

        // Clear cart after successful order
        this.cart = []
        
        return result
      } catch (error) {
        console.error('❌ Error submitting order:', error)
        this.error = error.message || 'Failed to submit order'
        
        // Provide helpful error messages
        if (error.message.includes('fetch')) {
          this.error = 'Cannot connect to server. Please check your connection.'
        }
        
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateLessonSpace(lessonId, newSpace) {
      try {
        const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ space: newSpace })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to update lesson')
        }

        const result = await response.json()
        console.log('✅ Lesson space updated:', result.lesson.subject, 'now has', result.lesson.space, 'spaces')
        
        return result.lesson
      } catch (error) {
        console.error('❌ Error updating lesson space:', error)
        // Don't throw here to avoid breaking the order flow
      }
    },

    // Search functionality - Backend search for "search as you type"
    async searchLessonsBackend(query) {
      if (!query) {
        // If no query, fetch all lessons without loading state
        this.error = null
        
        try {
          console.log('🔄 Fetching all lessons from backend...')
          const response = await fetch(`${API_BASE_URL}/lessons`)
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
          
          const lessonsData = await response.json()
          console.log('✅ All lessons fetched successfully:', lessonsData.length, 'lessons')
          
          // Transform backend data to include icons
          const iconsMap = {
            'Mathematics': 'fas fa-calculator',
            'English Literature': 'fas fa-book',
            'Science': 'fas fa-flask',
            'Art': 'fas fa-palette',
            'Music': 'fas fa-music'
          }
          
          this.lessons = lessonsData.map(lesson => ({
            ...lesson,
            icon: iconsMap[lesson.subject] || 'fas fa-book'
          }))
          
          return this.lessons
          
        } catch (error) {
          console.error('❌ Failed to fetch lessons:', error)
          this.error = `Failed to fetch lessons: ${error.message}`
          return []
        }
      }

      this.error = null
      
      try {
        console.log('🔍 Searching lessons on backend...', query)
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const searchResponse = await response.json()
        console.log('✅ Search response:', searchResponse)
        
        // Extract lessons from the response object
        const lessonsData = searchResponse.results || searchResponse
        console.log('✅ Search results:', lessonsData.length, 'lessons found')
        
        // Transform backend data to include icons
        const iconsMap = {
          'Mathematics': 'fas fa-calculator',
          'English Literature': 'fas fa-book',
          'Science': 'fas fa-flask',
          'Art': 'fas fa-palette',
          'Music': 'fas fa-music'
        }
        
        this.lessons = lessonsData.map(lesson => ({
          ...lesson,
          icon: iconsMap[lesson.subject] || 'fas fa-book'
        }))
        
        return this.lessons
        
      } catch (error) {
        console.error('❌ Search failed:', error)
        this.error = `Search failed: ${error.message}`
        return []
      }
    },

    // Frontend search functionality (fallback)
    searchLessons(query) {
      if (!query) return this.lessons

      const searchQuery = query.toLowerCase()
      return this.lessons.filter(lesson =>
        lesson.subject.toLowerCase().includes(searchQuery) ||
        lesson.location.toLowerCase().includes(searchQuery) ||
        lesson.price.toString().includes(searchQuery) ||
        lesson.space.toString().includes(searchQuery)
      )
    },

    // Sort functionality
    sortLessons(lessons, sortBy, sortOrder = 'asc') {
      const sorted = [...lessons].sort((a, b) => {
        let aVal = a[sortBy]
        let bVal = b[sortBy]

        // Convert to numbers for price and space
        if (sortBy === 'price' || sortBy === 'space') {
          aVal = Number(aVal)
          bVal = Number(bVal)
        } else {
          aVal = String(aVal).toLowerCase()
          bVal = String(bVal).toLowerCase()
        }

        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })

      return sorted
    }
  }
})