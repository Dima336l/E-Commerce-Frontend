# E-Commerce Frontend

Vue.js frontend for after-school classes e-commerce application with modern design and full functionality.

## Features

- **Modern Vue.js 3**: Composition API and reactive state management
- **Vue Router**: Client-side routing for seamless navigation
- **Pinia Store**: Centralized state management for lessons and cart
- **Responsive Design**: Mobile-first approach with fluid layouts
- **Real-time Search**: Live filtering across lesson attributes
- **Shopping Cart**: Add/remove items with inventory tracking
- **Form Validation**: Client-side validation with pattern matching
- **API Integration**: RESTful API communication with backend
- **Modern UI/UX**: Animations, gradients, and interactive elements

## Getting Started

### Prerequisites
- Node.js (v14+)
- Running backend API (http://localhost:3000)

### Installation

```bash
npm install
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Alternative commands
npm run start
npm run serve
```

### Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Features Overview

### Lessons Page
- Display all available classes in responsive grid
- Real-time search across subject, location, and price
- Sort by subject, location, price, or availability
- Add to cart functionality with inventory management
- Loading states and error handling

### Shopping Cart
- View selected items with total calculation
- Remove items from cart
- Checkout form with validation (name: letters only, phone: numbers only)
- Order submission to backend API
- Success/error handling

### Navigation
- Modern navigation bar with gradient design
- Cart counter showing number of items
- Responsive mobile menu
- Router-based navigation

## API Integration

The frontend communicates with the backend API:
- `GET /lessons` - Fetch all available lessons
- `POST /orders` - Submit checkout orders
- Real-time inventory updates

## Styling & Design

- **Modern Design**: Gradient backgrounds and clean aesthetics
- **FontAwesome Icons**: Professional iconography
- **Google Fonts (Inter)**: Clean typography
- **CSS3 Animations**: Smooth transitions and hover effects
- **Mobile Responsive**: Optimized for all screen sizes
- **Color Scheme**: Professional blue/purple gradients

## Project Structure

```
src/
├── views/          # Page components
│   ├── Lessons.vue # Main lessons listing
│   └── Cart.vue    # Shopping cart and checkout
├── stores/         # Pinia state management
│   └── index.js    # Main store with lessons and cart
├── router/         # Vue Router configuration
│   └── index.js    # Route definitions
├── App.vue         # Root component with layout
└── main.js         # Application entry point
```

## Development Notes

- Uses Vite for fast development and building
- ESNext JavaScript with Vue 3 Composition API
