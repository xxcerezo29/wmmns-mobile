import { useAuthStore } from "@/stores/auth";
import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import('../views/WelcomePage.vue'),
    meta: { guest: true },
  },
  {
    path: "/login",
    component: () => import("../layouts/GuestLayout.vue"),
    meta: { guest: true },
    children: [
      {
        path: "",
        component: () => import("../views/Auth/Login.vue"),
      },
    ],
  },
  {
    path: "/auth",
    component: () => import("../layouts/AuthLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        component: () => import("../views/HomePage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "schedule",
        component: () => import("../views/SchedulePage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "route",
        component: () => import("../views/RoutePage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "map",
        component: () =>import('../views/MapPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'profile',
        component: () => import('../views/ProfilePage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/driver/:scheduleId',
    component: () => import('../layouts/MapLayout.vue'),
    children: [
      {
        path: '',
        component: () =>import('../views/DriverMapPage.vue'),
        meta: { requiresAuth: true },
      }
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/register",
    component: () => import("../views/Auth/Register.vue"),
    meta: { guest: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.token) {
    await authStore.checkAuth();
  }

  const isAuthenticated = !!authStore.user;

  if(to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated){
    next('/login');
  }else if(to.matched.some(record=> record.meta.guest)&& isAuthenticated){
    next('/auth');
  }else{
    next();
  }
});

export default router;
