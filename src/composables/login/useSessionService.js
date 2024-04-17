import { useMutation } from '@vue/apollo-composable'
import { SessionStorage } from 'quasar'
import {
  LOGIN,
  LOGOUT,
  SEND_PASSWORD_RESET,
  UPDATE_PASSWORD_WITH_TOKEN
} from 'src/graphql/operations/login'
import { api } from 'src/boot/axios'

export function useSessionService() {
  /**
   * composable
   */

  /**
   * graphql
   */
  const {
    mutate: userLogin,
    onDone: onDoneUserLogin,
    onError: onErrorUserLogin
  } = useMutation(LOGIN)

  const {
    mutate: userLogout,
    onDone: onDoneUserLogout,
    onError: onErrorUserLogout
  } = useMutation(LOGOUT)

  const {
    mutate: userSendPasswordReset,
    onDone: onDoneUserSendPasswordReset,
    onError: onErrorUserSendPasswordReset
  } = useMutation(SEND_PASSWORD_RESET)

  const {
    mutate: userUpdatePassword,
    onDone: onDoneUserUpdatePassword,
    onError: onErrorUserUpdatePassword
  } = useMutation(UPDATE_PASSWORD_WITH_TOKEN)

  onDoneUserLogin(({ data }) => {
    setUserInfo(data.userLogin)
  })
  onErrorUserLogin((error) => {
    // console.log(error)
  })

  onDoneUserSendPasswordReset(({ data }) => {
    console.log('data:', data)
  })
  onErrorUserSendPasswordReset((error) => {
    console.log('error:', error)
  })
  onDoneUserUpdatePassword(({ data }) => {
    console.log('data:', data)
  })
  onErrorUserUpdatePassword((error) => {
    console.log('error:', error)
  })

  function setUserInfo(userLogin) {
    // if (response.data.status.code === 200) {
    // console.log('data', response.data.status.data)
    // user.value = response.data.status.data
    // SessionStorage.set('user', user.value)
    // auth_token.value = response.headers.authorization
    // SessionStorage.set('user', user.value)
    // api.defaults.headers.common["Authorization"] = auth_token.value;
    // }
    if (!!userLogin) {
      SessionStorage.set(
        'credentials',
        JSON.parse(JSON.stringify(userLogin.credentials))
      )
      SessionStorage.set(
        'current_user',
        JSON.parse(JSON.stringify(userLogin.authenticatable))
      )
    }
  }

  onDoneUserLogout((response) => {
    removeCredentials()
  })

  onErrorUserLogout((response) => {
    console.log('error al hacer el logout', response)
  })

  function removeCredentials() {
    console.log('removiento credenciales...')
    SessionStorage.remove('credentials')
    SessionStorage.remove('current_user')
    api.defaults.headers.common['Authorization'] = null
  }

  return {
    userLogin,
    onDoneUserLogin,
    onErrorUserLogin,
    userLogout,
    onDoneUserLogout,
    onErrorUserLogout,
    removeCredentials,
    userSendPasswordReset,
    onDoneUserSendPasswordReset,
    onErrorUserSendPasswordReset,
    userUpdatePassword,
    onDoneUserUpdatePassword,
    onErrorUserUpdatePassword
  }
}
