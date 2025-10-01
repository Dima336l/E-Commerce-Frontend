<template>
  <div class="lessons-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h1 class="hero-title">
              <i class="fas fa-star text-warning me-3"></i>
              Premium After-School Classes
            </h1>
            <p class="hero-subtitle">
              Discover amazing learning opportunities for students of all ages. 
              Quality education programs designed to inspire and excel.
            </p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <div class="stats-card">
              <div class="stat-item">
                <div class="stat-number">{{ lessons.length }}</div>
                <div class="stat-label">Available Classes</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ cart.length }}</div>
                <div class="stat-label">In Your Cart</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="filters-section">
      <div class="container">
        <div class="filters-card">
          <div class="row g-3">
            <div class="col-lg-6">
              <div class="search-box">
                <i class="fas fa-search search-icon" v-if="!isSearching"></i>
                <i class="fas fa-spinner fa-spin search-icon" v-if="isSearching"></i>
                <input 
                  type="text" 
                  class="form-control search-input" 
                  placeholder="Search for classes, locations, or subjects..." 
                  v-model="searchQuery"
                  @input="handleSearch"
                  :disabled="isSearching"
                >
              </div>
            </div>
            <div class="col-lg-3">
              <select class="form-select sort-select" v-model="sortBy">
                <option value="">Sort by...</option>
                <option value="subject">📚 Subject</option>
                <option value="location">📍 Location</option>
                <option value="price">💰 Price</option>
                <option value="space">👥 Availability</option>
              </select>
            </div>
            <div class="col-lg-3">
              <select class="form-select sort-select" v-model="sortOrder">
                <option value="asc">⬆️ Ascending</option>
                <option value="desc">⬇️ Descending</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Classes Section -->
    <div class="classes-section">
      <div class="container">

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Loading amazing classes for you...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger alert-modern">
          <i class="fas fa-exclamation-triangle me-2"></i>
          {{ error }}
        </div>

        <!-- Classes Grid -->
        <div v-else class="classes-grid">
          <div 
            v-for="lesson in filteredLessons" 
            :key="lesson.id" 
            class="class-card-wrapper"
          >
            <div class="class-card">
              <!-- Card Header with Image -->
              <div class="card-header-custom">
                <div class="lesson-image-container">
                  <img 
                    :src="`${API_BASE_URL}/images/${lesson.image}`" 
                    :alt="`${lesson.subject} at ${lesson.location}`"
                    class="lesson-image"
                    @error="onImageError"
                  />
                  <div class="subject-icon-overlay">
                    <i :class="lesson.icon"></i>
                  </div>
                </div>
                <div class="availability-badge" :class="{ 'low-stock': lesson.space <= 2, 'out-of-stock': lesson.space === 0 }">
                  <i class="fas fa-users me-1"></i>
                  {{ lesson.space }} {{ lesson.space === 1 ? 'space' : 'spaces' }}
                </div>
              </div>

              <!-- Card Body -->
              <div class="card-body-custom">
                <h3 class="class-title">{{ lesson.subject }}</h3>
                
                <div class="class-details">
                  <div class="detail-item">
                    <i class="fas fa-map-marker-alt detail-icon"></i>
                    <span>{{ lesson.location }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-pound-sign detail-icon"></i>
                    <span class="price">£{{ lesson.price }}</span>
                  </div>
                </div>

                <!-- Action Button -->
                <button 
                  class="btn-add-to-cart" 
                  @click="addToCart(lesson)"
                  :disabled="lesson.space === 0"
                  :class="{ 'btn-disabled': lesson.space === 0 }"
                >
                  <i class="fas fa-cart-plus me-2"></i>
                  {{ lesson.space === 0 ? 'Fully Booked' : 'Add to Cart' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-if="!loading && filteredLessons.length === 0" class="no-results">
          <div class="no-results-content">
            <i class="fas fa-search no-results-icon"></i>
            <h3>No classes found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button class="btn btn-primary" @click="clearFilters">
              <i class="fas fa-refresh me-2"></i>
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useMainStore } from '../stores'
import { API_BASE_URL } from '../config.js'

export default {
  name: 'Lessons',
  setup() {
    const store = useMainStore()
    return { store, API_BASE_URL }
  },
  data() {
    return {
      searchQuery: '',
      sortBy: 'subject',
      sortOrder: 'asc',
      searchTimeout: null,
      isSearching: false
    }
  },
  computed: {
    lessons() {
      return this.store.lessons
    },
    cart() {
      return this.store.cart
    },
    loading() {
      return this.store.loading
    },
    error() {
      return this.store.error
    },
    filteredLessons() {
      // Since we're using backend search, just sort the lessons directly
      return this.store.sortLessons(this.lessons, this.sortBy, this.sortOrder)
    }
  },
  methods: {
    addToCart(lesson) {
      const success = this.store.addToCart(lesson)
      if (!success) {
        alert('Sorry, no more spaces available for this lesson!')
      }
    },
    handleSearch() {
      // Clear previous timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      
      // Set new timeout for search as you type with debouncing
      this.searchTimeout = setTimeout(async () => {
        this.isSearching = true
        try {
          await this.store.searchLessonsBackend(this.searchQuery)
        } catch (error) {
          console.error('Search error:', error)
        } finally {
          this.isSearching = false
        }
      }, 300) // 300ms debounce delay
    },
    onImageError(event) {
      // Fallback to icon if image fails to load
      event.target.style.display = 'none'
      event.target.nextElementSibling.style.display = 'flex'
    },
    async clearFilters() {
      this.searchQuery = ''
      this.sortBy = 'subject'
      this.sortOrder = 'asc'
      // Clear any pending search timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      // Fetch all lessons to reset the view
      await this.store.fetchLessons()
    }
  },
  async mounted() {
    await this.store.fetchLessons()
  }
}
</script>

<style scoped>
/* Container Styles */
.lessons-container {
  padding: 0;
}

/* Hero Section */
.hero-section {
  padding: 3rem 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 0 0 2rem 2rem;
  margin: -2rem -2rem 2rem -2rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a202c;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 0;
}

.stats-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-item {
  text-align: center;
  margin-bottom: 1rem;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #667eea;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

/* Filters Section */
.filters-section {
  margin-bottom: 3rem;
}

.filters-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  z-index: 5;
}

.search-input {
  padding-left: 3rem !important;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  height: 50px;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.search-input:focus {
  background: white;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.sort-select {
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  height: 50px;
  background: #f8fafc;
  font-weight: 500;
  transition: all 0.3s ease;
}

.sort-select:focus {
  background: white;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Classes Grid */
.classes-section {
  padding-bottom: 2rem;
}

.classes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.class-card-wrapper {
  display: flex;
}

.class-card {
  background: white;
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s ease;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.class-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.card-header-custom {
  position: relative;
  padding: 0;
  height: 200px;
  overflow: hidden;
  border-radius: 1rem 1rem 0 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.lesson-image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.lesson-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.subject-icon-overlay {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0.75rem;
  display: none; /* Hidden by default, shown on image error */
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #667eea;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.subject-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: white;
  backdrop-filter: blur(10px);
}

.availability-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.95);
  color: #1a202c;
  padding: 0.5rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.85rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.availability-badge.low-stock {
  background: rgba(251, 191, 36, 0.9);
  color: #92400e;
}

.availability-badge.out-of-stock {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

.card-body-custom {
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.class-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1.5rem;
  line-height: 1.3;
}

.class-details {
  margin-bottom: 2rem;
  flex: 1;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.detail-icon {
  width: 20px;
  color: #667eea;
  margin-right: 0.75rem;
}

.price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #10b981;
}

.btn-add-to-cart {
  width: 100%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 0.875rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-add-to-cart:hover:not(.btn-disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.btn-disabled {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  cursor: not-allowed;
  opacity: 0.7;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner p {
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 500;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 4rem 2rem;
}

.no-results-content {
  max-width: 400px;
  margin: 0 auto;
}

.no-results-icon {
  font-size: 4rem;
  color: #94a3b8;
  margin-bottom: 1.5rem;
}

.no-results h3 {
  color: #1a202c;
  margin-bottom: 1rem;
}

.no-results p {
  color: #64748b;
  margin-bottom: 2rem;
}

/* Alert Modern */
.alert-modern {
  border: none;
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
  font-weight: 500;
  box-shadow: 0 5px 20px rgba(239, 68, 68, 0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .classes-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .filters-card {
    padding: 1rem;
  }
  
  .stats-card {
    margin-top: 2rem;
  }
}

@media (max-width: 576px) {
  .hero-section {
    padding: 2rem 0;
  }
  
  .search-input, .sort-select {
    height: 45px;
    font-size: 0.9rem;
  }
  
  .class-card {
    border-radius: 1rem;
  }
  
  .card-body-custom {
    padding: 1.5rem;
  }
}
</style>