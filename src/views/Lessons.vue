<template>
  <div class="lessons-container">
    <div class="container">
      <h1>Available Classes</h1>
      
      <div class="search-section">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Search classes..." 
          v-model="searchQuery"
        >
        <select v-model="sortBy" class="sort-select">
          <option value="">Sort by...</option>
          <option value="subject">Subject</option>
          <option value="location">Location</option>
          <option value="price">Price</option>
          <option value="space">Availability</option>
        </select>
      </div>

      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">Error: {{ error }}</div>
      
      <div v-else class="lessons-grid">
        <div 
          v-for="lesson in filteredLessons" 
          :key="lesson._id" 
          class="lesson-card"
        >
          <h3>{{ lesson.subject }}</h3>
          <p><strong>Location:</strong> {{ lesson.location }}</p>
          <p><strong>Price:</strong> £{{ lesson.price }}</p>
          <p><strong>Available Spaces:</strong> {{ lesson.space }}</p>
          
          <button 
            @click="addToCart(lesson)"
            :disabled="lesson.space === 0"
            class="btn-add"
          >
            {{ lesson.space === 0 ? 'Fully Booked' : 'Add to Cart' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useMainStore } from '../stores'

export default {
  name: 'Lessons',
  setup() {
    const store = useMainStore()
    return { store }
  },
  data() {
    return {
      searchQuery: '',
      sortBy: '',
      sortOrder: 'asc'
    }
  },
  computed: {
    lessons() {
      return this.store.lessons
    },
    loading() {
      return this.store.loading
    },
    error() {
      return this.store.error
    },
    filteredLessons() {
      let filtered = this.store.searchLessons(this.searchQuery)
      return this.store.sortLessons(filtered, this.sortBy, this.sortOrder)
    }
  },
  methods: {
    addToCart(lesson) {
      const success = this.store.addToCart(lesson)
      if (!success) {
        alert('Sorry, no more spaces available!')
      }
    }
  },
  async mounted() {
    await this.store.fetchLessons()
  }
}
</script>

<style scoped>
.lessons-container {
  padding: 2rem 0;
}

.search-section {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
}

.search-input, .sort-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-input {
  flex: 1;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.lesson-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.lesson-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.btn-add {
  background: #27ae60;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
}

.btn-add:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}
</style>