import { createRouter, createWebHashHistory } from 'vue-router'
import Lessons from '../views/Lessons.vue'
import Cart from '../views/Cart.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/lessons'
  },
  {
    path: '/lessons',
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
  history: createWebHashHistory(),
  routes
})

export default router