import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
// import { isMobile } from '@/App.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: isMobile()
      ? () => import('@/components/mobile/MobileHome.vue')
      : () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/edit',
    name: 'EditProfile',
    component: () => import('@/components/EditProfile.vue'),
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('../views/Events.vue')
  },
  {
    path: '/publish',
    name: 'Publish',
    component: () => import('../views/Publish.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*', 
    redirect: '/'
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  // Cool, better than createWebHistory.
  routes
})

export function isMobile() {
  return window.innerWidth <= 576;
}

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router 