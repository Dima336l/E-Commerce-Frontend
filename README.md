# After-School Classes E-Commerce - Frontend

> Vue.js 3 frontend application for booking after-school classes and activities

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://dima336l.github.io/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.3.4-brightgreen)](https://vuejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**Live Application:** [https://dima336l.github.io/](https://dima336l.github.io/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

---

## 🎯 Overview

A modern, responsive e-commerce platform built with Vue.js 3 for students and parents to browse and book after-school educational classes. Features include real-time search, smart filtering, shopping cart management, and seamless checkout experience.

**Course:** CST3144 - Full Stack Web Development  
**Student:** Dumitru (Dima336l)  
**Institution:** Middlesex University

---

## ✨ Features

### 🎓 Lessons Browsing
- **10+ Available Classes** across subjects (Math, English, Science, Art, Music)
- **Real-time Search** with backend integration and 300ms debouncing
- **Smart Filtering** by subject, location, price, and availability
- **Sort Options** - Ascending/Descending for all attributes
- **Dynamic Inventory** - Real-time space availability updates
- **Professional Images** for each lesson with Font Awesome fallbacks

### 🛒 Shopping Cart
- **Add/Remove Items** with instant feedback
- **Quantity Management** with inventory validation
- **Live Total Calculation** 
- **Persistent State** using Pinia store
- **Empty State Handling** with helpful messages

### 💳 Checkout System
- **Form Validation**
  - Name: Letters and spaces only (Regex: `/^[a-zA-Z\s]+$/`)
  - Phone: Numbers only (Regex: `/^[0-9]+$/`)
- **Real-time Validation** with error messages
- **Order Submission** via POST API
- **Success Confirmation** modal with order details
- **Inventory Update** after successful checkout

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first approach
- **Gradient Themes** - Professional purple/blue color scheme
- **Smooth Animations** - CSS3 transitions and transforms
- **Loading States** - User feedback during async operations
- **Error Handling** - Friendly error messages
- **Font Awesome Icons** - Professional iconography throughout

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Vue.js 3** | Frontend framework (Composition API) |
| **Pinia** | State management |
| **Vue Router** | Client-side routing (Hash mode for GitHub Pages) |
| **Vite** | Build tool and dev server |
| **Fetch API** | HTTP requests (Native, no Axios) |
| **Font Awesome** | Icon library |
| **CSS3** | Styling with gradients and animations |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 14.x or higher
- **npm** or **yarn**
- **Backend API** running (see [backend repo](https://github.com/Dima336l/E-Commerce-Backend))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dima336l/E-Commerce-Frontend.git
   cd E-Commerce-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint** (optional)
   
   The app automatically uses:
   - **Development:** `http://localhost:3000`
   - **Production:** `https://e-commerce-backend-w46y.onrender.com`
   
   To override, create `.env`:
   ```env
   VITE_API_URL=http://your-custom-backend-url
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   App runs at: `http://localhost:5173`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

Build output: `dist/` folder

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── vite.svg              # Favicon
├── src/
│   ├── components/           # Reusable components (future)
│   ├── router/
│   │   └── index.js         # Vue Router configuration
│   ├── stores/
│   │   └── index.js         # Pinia store (lessons, cart, API)
│   ├── views/
│   │   ├── Lessons.vue      # Main lessons page
│   │   └── Cart.vue         # Shopping cart & checkout
│   ├── App.vue              # Root component with navbar
│   ├── main.js              # Application entry point
│   └── config.js            # API configuration
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies
```

---

## 🔌 API Integration

The frontend communicates with the backend via native **Fetch API** (no libraries).

### Endpoints Used

| Method | Endpoint | Purpose | Implementation |
|--------|----------|---------|----------------|
| `GET` | `/lessons` | Fetch all lessons | `stores/index.js:25-66` |
| `GET` | `/search?q=query` | Search lessons | `stores/index.js:236-310` |
| `POST` | `/orders` | Submit order | `stores/index.js:148-207` |
| `PUT` | `/lessons/:id` | Update lesson space | `stores/index.js:209-232` |

### Example: Fetch Lessons

```javascript
async fetchLessons() {
  const response = await fetch(`${API_BASE_URL}/lessons`)
  const lessonsData = await response.json()
  this.lessons = lessonsData.map(lesson => ({
    ...lesson,
    id: lesson._id,
    icon: iconsMap[lesson.subject] || 'fas fa-graduation-cap'
  }))
}
```

### Search Implementation (Backend Integration)

**"Search as you type"** feature with 300ms debouncing:

```javascript
handleSearch() {
  clearTimeout(this.searchTimeout)
  this.searchTimeout = setTimeout(async () => {
    await this.store.searchLessonsBackend(this.searchQuery)
  }, 300)
}
```

---

## 🌐 Deployment

### GitHub Pages (Current)

**Live URL:** [https://dima336l.github.io/](https://dima336l.github.io/)

#### Deployment Process

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**
   ```bash
   # Using gh-pages (if configured)
   npm run deploy
   
   # Or manually
   git subtree push --prefix dist origin gh-pages
   ```

3. **GitHub Actions** (Automated)
   
   The repository uses GitHub Actions for automatic deployment:
   - Triggers on push to `main` branch
   - Builds the app
   - Deploys to `gh-pages` branch
   - See `.github/workflows/deploy.yml`

### Configuration Notes

- **Base URL:** Uses hash mode (`createWebHashHistory`) for GitHub Pages compatibility
- **API URL:** Automatically switches to production backend on build
- **CORS:** Backend configured to accept requests from `https://dima336l.github.io`

---

## 📸 Screenshots

### Lessons Page
![Lessons Page](docs/screenshots/lessons.png)
*Browse and search available classes with real-time filtering*

### Shopping Cart
![Shopping Cart](docs/screenshots/cart.png)
*Manage cart items and checkout with validation*

### Checkout Success
![Success Modal](docs/screenshots/success.png)
*Order confirmation with summary*

---

## 🎓 Key Features for Coursework

### Vue.js Requirements ✅
- ✅ Vue.js 3 framework (no React/Angular)
- ✅ v-for directive for rendering lessons
- ✅ v-on for event handling (click, input)
- ✅ v-model for two-way data binding
- ✅ Computed properties for reactive data
- ✅ Component-based architecture

### Functionality Requirements ✅
- ✅ Display 10+ lessons with all attributes
- ✅ Sort by subject/location/price/space (asc/desc)
- ✅ Add to cart with space validation
- ✅ Shopping cart with remove functionality
- ✅ Checkout with regex validation
- ✅ Search functionality (backend integration)
- ✅ Fetch API (no XMLHttpRequest/Axios)

### Bonus Features ✅
- ✅ **Search as you type** (+10% bonus marks)
- ✅ Professional UI/UX design
- ✅ Responsive mobile layout
- ✅ Loading states and error handling

---

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm start        # Alias for dev
```

### Code Style

- **Vue 3 Composition API** (with Options API for this project)
- **ESNext JavaScript**
- **Scoped CSS** in components
- **Async/Await** for API calls
- **ES6+ features**

### State Management (Pinia)

```javascript
// stores/index.js
export const useMainStore = defineStore('main', {
  state: () => ({
    lessons: [],
    cart: [],
    loading: false,
    error: null
  }),
  getters: {
    cartTotal: (state) => state.cart.reduce(...),
    cartItemCount: (state) => state.cart.reduce(...)
  },
  actions: {
    async fetchLessons() { ... },
    async submitOrder() { ... },
    addToCart() { ... }
  }
})
```

---

## 🐛 Troubleshooting

### Backend Connection Issues

**Problem:** Cannot connect to backend API  
**Solution:** 
1. Check backend is running on correct port
2. Verify `src/config.js` has correct API URL
3. Check CORS settings in backend
4. Check browser console for errors

### Build Issues

**Problem:** Build fails  
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### GitHub Pages 404

**Problem:** Routes return 404 on refresh  
**Solution:** Using hash mode routing (`createWebHashHistory`) solves this

---

## 📝 License

This project is part of university coursework for educational purposes.

**Course:** CST3144 - Full Stack Web Development  
**University:** Middlesex University  
**Academic Year:** 2024-25

---

## 🔗 Related Repositories

- **Backend API:** [E-Commerce-Backend](https://github.com/Dima336l/E-Commerce-Backend)
- **Live Demo:** [https://dima336l.github.io/](https://dima336l.github.io/)
- **Backend API:** [https://e-commerce-backend-w46y.onrender.com](https://e-commerce-backend-w46y.onrender.com)

---

## 📞 Contact

**Student:** Dumitru (Dima336l)  
**Course:** CST3144 Full Stack Development  
**Year:** 2024-25

---

## 🙏 Acknowledgments

- **Middlesex University** for the coursework specification
- **Vue.js Team** for the excellent framework
- **Font Awesome** for the icon library
- **Vite** for the blazing-fast build tool

---

**⭐ If you find this project helpful, please star the repository!**
