import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import {
  USERS_LIST,
  USER_DELETE,
  USER_REGISTER,
  USER_UPDATE
} from 'src/graphql/operations/users'

export function useUserService() {
  const {
    load: loadUsers,
    onResult: onResulLoadUsers,
    onError: onErrorLoadUsers,
    refetch: refetchUsers
  } = useLazyQuery(USERS_LIST)

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

  function loadOrRefetchUsers() {
    loadUsers() || refetchUsers()
  }

  return {
    loadUsers,
    onResulLoadUsers,
    onErrorLoadUsers,
    userRegister,
    onDoneUserRegister,
    onErrorUserRegister,
    userUpdate,
    onDoneUserUpdate,
    userDelete,
    onDoneUserDelete,
    onErrorUserDelete,
    loadOrRefetchUsers
  }
}
