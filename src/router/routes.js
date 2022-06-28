const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        name: "home",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "/leitor",
        name: "leitor",
        component: () => import("pages/LeitorPage.vue"),
        meta: { leitor: true },
      },
      {
        path: "/login",
        name: "login",
        component: () => import("pages/LoginPage.vue"),
      },
      {
        path: "/lista",
        name: "lista",
        component: () => import("pages/ListaPage.vue"),
        meta: { requerLogin: true },
      },
      {
        path: "/admin",
        name: "admin",
        component: () => import("pages/AdminPage.vue"),
        meta: { requerLogin: true },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
