import { createRouter, createWebHistory } from 'vue-router'
import Lessons from '../views/Lessons.vue'
import Cart from '../views/Cart.vue'

const routes = [
  {
    path: '/',
    name: 'lessons',
    component: Lessons
  },
  {
    path: '/cart',
    name: 'cart',
    component: Cart
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router