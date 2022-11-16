import Vue from "vue";
import VueRouter from "vue-router";
import { auth } from "../../firebase";
import store from '../store'

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () =>
      import("../views/Login.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/planilla",
    name: "Planilla",
    component: () =>
      import("../views/Planilla.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/archivados",
    name: "Archivados",
    component: () =>
      import("../views/PlanillaArchive.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    redirect: '/planilla',
    meta: { requiresAuth: true },
  },
  {
    path: "/empleado/:id",
    name: "Empleado",
    component: () =>
      import("../views/Empleado.vue"),
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const rutaProtegida = to.matched.some(record => record.meta.requiresAuth)
  if (rutaProtegida && store.state.usuario === null) {
    const usuario = auth.currentUser;
    if (!usuario) {
      next({ path: '/login' });
    } else {
      next();
    }
  } else {
    next();
  }
})

export default router;
