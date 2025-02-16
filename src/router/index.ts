import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import LoginPage from '@/views/LoginPage.vue'
import CallPage from '@/views/CallPage.vue'

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
      component: CallPage,
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage,
    },
  ],
})

export default router
