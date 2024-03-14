import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import { USERS_LIST, USER_REGISTER } from 'src/graphql/opertations/users'

export function useUserService() {
  const {
    load: loadUsers,
    onResult: onResulLoadUsers,
    onError: onErrorLoadUsers
  } = useLazyQuery(USERS_LIST)

  const {
    mutate: userRegister,
    onDone: onDoneUserRegister,
    onError: onErrorUserRegister
  } = useMutation(USER_REGISTER)

  return {
    loadUsers,
    onResulLoadUsers,
    onErrorLoadUsers,
    userRegister,
    onDoneUserRegister,
    onErrorUserRegister
  }
}
