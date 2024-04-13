import { useMutation } from '@vue/apollo-composable'
import {
  USER_DELETE,
  USER_REGISTER,
  USER_UPDATE,
  USER_MENU_UPDATE
} from 'src/graphql/operations/users'

export function useUserService() {
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

  onDoneUserMenuUpdate(({ data }) => {
    console.log('data:', data)
    const user = data.userMenuUpdate.user

    console.log('user.id:', user.id)

    const menus = user.menus
    console.log('menus:', menus)
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
    onErrorUserMenuUpdate
  }
}
