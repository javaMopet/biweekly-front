import { useMutation } from '@vue/apollo-composable'
import {
  USER_DELETE,
  USER_REGISTER,
  USER_UPDATE,
  USER_MENU_UPDATE,
  USER_ADD_ROLE,
  USER_REMOVE_ROLE
} from 'src/graphql/operations/users'
import { useUsuarioStore } from 'src/stores/admin/useUsuarioStore'

export function useUserService() {
  const usuarioStore = useUsuarioStore()

  const {
    mutate: userRegister,
    onDone: onDoneUserRegister,
    onError: onErrorUserRegister
  } = useMutation(USER_REGISTER)

  const {
    mutate: userUpdate,
    onDone: onDoneUserUpdate,
    onError: onErrorUserUpdate
  } = useMutation(USER_UPDATE)

  const {
    mutate: userDelete,
    onDone: onDoneUserDelete,
    onError: onErrorUserDelete
  } = useMutation(USER_DELETE)

  const {
    mutate: userMenuUpdate,
    onDone: onDoneUserMenuUpdate,
    onError: onErrorUserMenuUpdate
  } = useMutation(USER_MENU_UPDATE)

  const {
    mutate: userAddRole,
    onDone: onDoneUserAddRole,
    onError: onErrorUserAddRole
  } = useMutation(USER_ADD_ROLE)

  onDoneUserMenuUpdate(({ data }) => {
    console.log('data:', data)
    const user = data.userMenuUpdate.user

    console.log('user.id:', user.id)

    const menus = user.menus
    console.log('menus:', menus)
  })

  onDoneUserAddRole(({ data }) => {
    console.log('data:', data)
    const user = data.userAddRole.user
    usuarioStore.changeUserIsAdmin(user.id, true)
  })

  const {
    mutate: userRemoveRole,
    onDone: onDoneUserRemoveRole,
    onError: onErrorUserRemoveRole
  } = useMutation(USER_REMOVE_ROLE)

  onDoneUserRemoveRole(({ data }) => {
    console.log('data:', data.userRemoveRole.user)
    const user = data.userRemoveRole.user
    usuarioStore.changeUserIsAdmin(user.id, false)
  })

  return {
    userRegister,
    onDoneUserRegister,
    onErrorUserRegister,
    userUpdate,
    onDoneUserUpdate,
    userDelete,
    onDoneUserDelete,
    onErrorUserDelete,
    onErrorUserUpdate,
    userMenuUpdate,
    onDoneUserMenuUpdate,
    onErrorUserMenuUpdate,
    userAddRole,
    onDoneUserAddRole,
    onErrorUserAddRole,
    userRemoveRole,
    onDoneUserRemoveRole,
    onErrorUserRemoveRole
  }
}
