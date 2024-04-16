import { SessionStorage } from 'quasar'

export function usePermissionService() {
  const can = (permiso) => {
    if (getCurrentUser().isAdmin) {
      return true
    } else {
      return getUserRutaMenus().includes(permiso)
    }
  }

  // Se podría obtener la lista de menús del usuario desde el backend
  // por ahora se obtendra del usuario en el SessionStorage
  const getUserMenus = () => {
    return getCurrentUser().menus
  }
  const getUserRutaMenus = () => {
    return getCurrentUser().menus.map((menu) => menu.ruta)
  }

  const getCurrentUser = () => {
    return JSON.parse(SessionStorage.getItem('current_user'))
  }

  return {
    can,
    getUserMenus,
    getCurrentUser
  }
}
