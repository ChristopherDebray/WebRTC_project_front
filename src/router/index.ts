import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import LoginPage from '@/views/LoginPage.vue'
import CallPage from '@/views/CallPage.vue'
import { useSocketStore } from '@/stores/socket'

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

router.beforeEach((to, from, next) => {
  const socketStore = useSocketStore() // Now Pinia is available
  const isAuthenticated = socketStore.userName !== null

  if (!isAuthenticated && to.name !== 'login') {
    next({ name: 'login' })
  } else if (isAuthenticated && to.name === 'login') {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
