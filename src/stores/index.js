import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    lessons: [],
    cart: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchLessons() {
      this.loading = true
      try {
        const response = await fetch('http://localhost:3000/lessons')
        if (!response.ok) throw new Error('Failed to fetch lessons')
        this.lessons = await response.json()
        console.log('✅ Lessons fetched successfully:', this.lessons.length, 'lessons')
      } catch (error) {
        this.error = error.message
        console.error('❌ Error fetching lessons:', error)
      } finally {
        this.loading = false
      }
    },

    addToCart(lesson) {
      if (lesson.space > 0) {
        this.cart.push({ ...lesson, quantity: 1 })
        lesson.space--
        return true
      }
      return false
    },

    removeFromCart(index) {
      const item = this.cart[index]
      if (item) {
        const lesson = this.lessons.find(l => l._id === item._id)
        if (lesson) lesson.space++
        this.cart.splice(index, 1)
      }
    },

    clearCart() {
      this.cart = []
    },

    searchLessons(query) {
      if (!query) return this.lessons
      return this.lessons.filter(lesson =>
        lesson.subject.toLowerCase().includes(query.toLowerCase()) ||
        lesson.location.toLowerCase().includes(query.toLowerCase()) ||
        lesson.price.toString().includes(query)
      )
    },

    sortLessons(lessons, sortBy, order) {
      if (!sortBy) return lessons
      return [...lessons].sort((a, b) => {
        const aVal = a[sortBy]
        const bVal = b[sortBy]
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        return order === 'desc' ? -comparison : comparison
      })
    }
  }
})