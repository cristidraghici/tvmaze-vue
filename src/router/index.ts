import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/show/:id',
      name: 'show',
      props: true,
      component: () => import('@/views/ShowDetailsView.vue')
    },
    {
      path: '/:catchAll(.*)',
      redirect: () => {
        return '/'
      }
    }
  ]
})

export default router
