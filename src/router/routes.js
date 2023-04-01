const routes = [
  {
    path: '',
    component: () => import('pages/LoginPage.vue')
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue')
  },

  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/HomePage.vue') },
      {
        path: '/movimientos',
        component: () => import('src/pages/main/MovimientosPage.vue')
      },
      {
        path: '/system_options',
        component: () => import('src/pages/admin/SystemOptionsPage.vue')
      },
      {
        path: 'usuarios',
        component: () => import('pages/UsuariosPage.vue')
      },
      {
        path: 'catalogos',
        component: () => import('pages/CatalogosPage.vue'),
        children: [
          {
            path: '/main/catalogos/cuentas',
            component: () => import('pages/CuentasPage.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'categorias',
        component: () => import('src/pages/admin/CategoriasPage.vue')
      },
      {
        path: 'cuentas',
        component: () => import('src/pages/admin/CuentasPage.vue')
      },
      {
        path: 'cuentas_contables',
        component: () => import('src/pages/admin/CuentasContablesPage.vue')
      }

      // Always leave this as last one,
      // but you can also remove it
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
