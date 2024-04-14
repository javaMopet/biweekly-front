import LoginPage from 'src/pages/LoginPage.vue'

const routes = [
  {
    path: '',
    redirect: '/home'
  },
  // {
  //   path: '/index.html',
  //   redirect: '/home'
  // },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/HomePage.vue') },
      // { path: '', component: () => import('src/pages/HomeMainPage.vue') },
      {
        path: '/movimientos',
        component: () => import('src/pages/main/MovimientosPage.vue')
      },
      {
        path: '/cuentas',
        component: () => import('src/pages/admin/CuentasPage.vue')
      },
      {
        path: '/cuentas/:id',
        name: 'cuenta',
        component: () => import('src/pages/admin/CuentaPage.vue')
      },
      {
        path: '/tarjetas_credito',
        component: () => import('src/pages/main/TarjetasCreditoPage.vue')
      },
      {
        path: '/tarjetas_credito/:id',
        name: 'tarjetaCredito',
        component: () => import('src/pages/main/TarjetaCreditoPage.vue')
      },
      {
        path: '/system_options',
        component: () => import('src/pages/admin/SystemOptionsPage.vue')
      },
      {
        path: 'catalogos',
        component: () => import('pages/CatalogosPage.vue')
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
        path: 'bancos',
        component: () => import('src/pages/admin/BancosPage.vue')
      },
      {
        path: 'cuentas_contables',
        component: () => import('src/pages/admin/CuentasContablesPage.vue')
      },
      {
        path: 'usuarios',
        component: () => import('src/pages/admin/UsuariosPage.vue'),
        children: [
          {
            path: 'menuConfig/:id',
            component: () => import('src/pages/admin/user/UserMenuConfig.vue'),
            name: 'usuarioMenuConfig'
          }
        ]
      },
      {
        path: 'carousel_cards',
        component: () => import('src/pages/admin/CarouselPage.vue')
      }

      // Always leave this as last one,
      // but you can also remove it
    ]
  },
  {
    path: '/:catchAll(.*)*',
    // path: '/:notFound',
    component: () => import('pages/ErrorNotFound.vue')
    //redirect: '/'
  }
]

export default routes
