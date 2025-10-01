import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/E-Commerce-Frontend/',
  server: {
    proxy: {
      '/images': 'http://localhost:3000',
      '/api': 'http://localhost:3000'
    }
  }
})