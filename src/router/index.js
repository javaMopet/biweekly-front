import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { SessionStorage } from 'quasar'
import { usePermissionService } from 'src/composables/admin/usePermissionService'
// import { api } from 'boot/axios'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  // const createHistory = process.env.SERVER
  //   ? createMemoryHistory
  //   : process.env.VUE_ROUTER_MODE === 'history'
  //   ? createWebHistory
  //   : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createWebHistory() //createHistory(process.env.VUE_ROUTER_BASE)
  })

  const permissionService = usePermissionService()

  Router.beforeEach((to /* , from */) => {
    // console.log('to an from ', to, from)
    const publicPages = [
      '/login',
      '/403',
      '/',
      '/resetPassword',
      '/resetPasswordSuccess',
      '/forgotPassword',
      '/forgotPasswordSended'
    ]

    const authRequired = !publicPages.includes(to.path)

    if (authRequired) {
      const currentInstance = SessionStorage.getItem('current_instance')
      const credentials = SessionStorage.getItem('credentials')
      const currentUser = SessionStorage.getItem('current_user')

      if (!currentInstance || !credentials || !currentUser) {
        console.warn('no credentials, no current_user')
        return { path: '/login' }
      }
      // Validará las rutas que asi se definan si no tenemos un problema con las rutas que no se
      // ponen como menú del usuario
      if (to.meta?.permission && !permissionService.can(to.meta.permission)) {
        return { path: '/403' }
      }
    }
  })

  return Router
})
