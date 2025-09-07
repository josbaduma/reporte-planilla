import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import { auth } from "../../firebase";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/planilla",
    name: "Planilla",
    component: () => import("../views/Planilla.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/archivados",
    name: "Archivados",
    component: () => import("../views/PlanillaArchive.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/",
    redirect: "/planilla",
    meta: { requiresAuth: true },
  },
  {
    path: "/empleado/:id",
    name: "Empleado",
    component: () => import("../views/Empleado.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Compatibilidad con Firebase v9+
import { onAuthStateChanged } from "firebase/auth";

router.beforeEach((to, from, next) => {
  const rutaProtegida = to.matched.some((record) => record.meta.requiresAuth);

  if (rutaProtegida && store.state.usuario === null) {
    let unsubscribe = onAuthStateChanged(auth, (usuario) => {
      unsubscribe(); // Detener el listener después de la primera llamada
      if (!usuario) {
        next({ path: "/login" });
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

export default router;
