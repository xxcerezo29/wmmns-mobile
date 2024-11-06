import { useAuthStore } from "@/stores/auth";
import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("../views/WelcomePage.vue"),
    meta: { guest: true },
  },
  {
    path: "/login",
    component: () => import("../layouts/GuestLayout.vue"),
    meta: { guest: true },
    children: [
      {
        path: "",
        name: "login",
        component: () => import("../views/Auth/Login.vue"),
      },
    ],
  },
  {
    path: "/forgot-password",
    component: () => import("../layouts/GuestLayout.vue"),
    meta: { guest: true },
    children: [
      {
        path: "",
        component: () => import("../views/Auth/ForgotPassword.vue"),
      },
    ],
  },
  {
    path: "/reset-password",
    component: () => import("../layouts/GuestLayout.vue"),
    meta: { guest: true },
    children: [
      {
        path: ":email/:type",
        name: "reset-password",
        component: () => import("../views/Auth/ResetPassword.vue"),
      },
    ],
  },
  {
    path: "/auth",
    component: () => import("../layouts/AuthLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "home",
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
        component: () => import("../views/MapPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "profile",
        component: () => import("../views/ProfilePage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "complaints",
        component: () => import("../views/ComplaintsPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "complaints/view/:complaintId",
        component: () => import("../views/ComplaintViewPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "complaints/file-a-compplaints",
        component: () => import("../views/FileComplaintPage.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/driver/:scheduleId",
    component: () => import("../layouts/MapLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../views/DriverMapPage.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/verify",
    component: () => import("../views/Auth/VerifyEmail.vue"),
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
  const isEmailVerified = !!authStore.user?.email_verified_at;

  // Handle routes requiring authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next("/login");
    } else if (!isEmailVerified && to.path !== "/verify") {
      next("/verify");
    } else {
      next(); // Allow access to authenticated routes
    }
  }
  // Handle guest routes
  else if (to.matched.some((record) => record.meta.guest)) {
    if (isAuthenticated && isEmailVerified) {
      next("/auth/home"); // Redirect authenticated users with verified email to home
    } else {
      next(); // Allow access to guest routes like login
    }
  }
  // Default case
  else {
    next();
  }
});

export default router;
