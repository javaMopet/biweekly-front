import { route } from 'quasar/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory
} from 'vue-router'
import routes from './routes'
import { SessionStorage } from 'quasar'
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
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createWebHistory() //createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from) => {
    // console.log('to an from ', to, from)
    const publicPages = ['/login', '/403', '/']
    const authRequired = !publicPages.includes(to.path)

    if (authRequired) {
      if (
        !SessionStorage.getItem('credentials') ||
        !SessionStorage.getItem('current_user')
      ) {
        return '/login'
      }
    }
  })

  return Router
})
