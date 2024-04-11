import { useMutation } from '@vue/apollo-composable'
import {
  USER_DELETE,
  USER_REGISTER,
  USER_UPDATE
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

  return {
    userRegister,
    onDoneUserRegister,
    onErrorUserRegister,
    userUpdate,
    onDoneUserUpdate,
    userDelete,
    onDoneUserDelete,
    onErrorUserDelete,
    onErrorUserUpdate
  }
}
