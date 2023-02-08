const routes = [
  {
    path: "",
    component: () => import("pages/LoginPage.vue"),
  },
  {
    path: "/login",
    component: () => import("pages/LoginPage.vue"),
  },
  {
    path: "/main",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "/main/usuarios",
        component: () => import("pages/UsuariosPage.vue"),
      },
      {
        path: "/main/catalogos",
        component: () => import("pages/CatalogosPage.vue"),
        children: [
          {
            path: "/main/catalogos/cuentas",
            component: () => import("pages/CuentasPage.vue"),
          },
        ],
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
