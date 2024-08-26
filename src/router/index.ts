import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/auth'
  },
  {
    path: '/login',
    component: () => import('../layouts/GuestLayout.vue'),
    meta: { guest: true },
    children: [
      {
        path: '',
        component: () => import('../views/Auth/Login.vue')
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('../layouts/AuthLayout.vue'),
    // meta: { requiresAuth: true }
    children: [
      {
        path: '',
        component: () => import('../views/HomePage.vue'),
        // meta: { requiresAuth: true }
      },
      {
        path: 'schedule',
        component: () => import('../views/SchedulePage.vue'),
        // meta: { requiresAuth: true }
      },
      {
        path: 'route',
        component: () => import('../views/RoutePage.vue'),
        // meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/register',
    component: () => import('../views/Auth/Register.vue'),
    meta: { guest: true}
  },
  // {
  //   path: '/home',
  //   component: () => import('../views/Home.vue'),
  //   // meta: { requiresAuth: true }
  // },
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async(to, from, next) => {
  const authStore = useAuthStore();
  if(authStore.token === null){
    await authStore.checkAuth();
  }
  if(to.matched.some((record) => record.meta.requiresAuth)){
    if(!authStore.user){
      next('/login');
    }else{
      next();
    }
  }else if(to.matched.some(record => record.meta.guest)){
    console.log(authStore.user)
    if(authStore.user){
      next('/home');
    }else{
      next();
    }
  }else{
    next();
  }
  
});

export default router
