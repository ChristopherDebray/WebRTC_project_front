import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import LoginPage from '@/views/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/call',
      name: 'call',
      component: HomePage,
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage,
    },
  ],
})

export default router
