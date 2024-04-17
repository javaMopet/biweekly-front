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
    path: '/forgotPassword',
    component: () => import('src/pages/ForgotPassword.vue')
  },
  {
    path: '/forgotPasswordSended',
    component: () => import('src/pages/ForgotPasswordSended.vue')
  },
  {
    path: '/resetPassword',
    component: () => import('src/pages/ResetPassword.vue')
  },
  {
    path: '/resetPasswordSuccess',
    component: () => import('src/pages/ResetPasswordSuccess.vue')
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/HomePage.vue') },
      // { path: '', component: () => import('src/pages/HomeMainPage.vue') },
      {
        path: '/movimientos',
        component: () => import('src/pages/main/MovimientosPage.vue'),
        meta: {
          permission: 'movimientos'
        }
      },
      {
        path: '/cuentas',
        component: () => import('src/pages/admin/CuentasPage.vue'),
        meta: {
          permission: 'cuentas'
        }
      },
      {
        path: '/cuentas/:id',
        name: 'cuenta',
        component: () => import('src/pages/admin/CuentaPage.vue'),
        meta: {
          permission: 'cuentas'
        }
      },
      {
        path: '/tarjetas_credito',
        component: () => import('src/pages/main/TarjetasCreditoPage.vue'),
        meta: {
          permission: 'tarjetas_credito'
        }
      },
      {
        path: '/tarjetas_credito/:id',
        name: 'tarjetaCredito',
        component: () => import('src/pages/main/TarjetaCreditoPage.vue'),
        meta: {
          permission: 'tarjetas_credito'
        }
      },
      {
        path: '/system_options',
        component: () => import('src/pages/admin/SystemOptionsPage.vue'),
        meta: {
          permission: 'system_options'
        }
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
        component: () => import('src/pages/admin/CategoriasPage.vue'),
        meta: {
          permission: 'categorias'
        }
      },

      {
        path: 'bancos',
        component: () => import('src/pages/admin/BancosPage.vue'),
        meta: {
          permission: 'bancos'
        }
      },
      {
        path: 'cuentas_contables',
        component: () => import('src/pages/admin/CuentasContablesPage.vue'),
        meta: {
          permission: 'cuentas_contables'
        }
      },
      {
        path: 'usuarios',
        component: () => import('src/pages/admin/UsuariosPage.vue'),
        meta: {
          permission: 'usuarios'
        },
        children: [
          {
            path: 'menuConfig/:id',
            component: () => import('src/pages/admin/user/UserMenuConfig.vue'),
            name: 'usuarioMenuConfig',
            meta: {
              permission: 'usuarios'
            }
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
    path: '/403',
    component: () => import('src/pages/ErrorForbidden.vue')
  },
  {
    path: '/:catchAll(.*)*',
    // path: '/:notFound',
    component: () => import('pages/ErrorNotFound.vue')
    //redirect: '/'
  }
]

export default routes
