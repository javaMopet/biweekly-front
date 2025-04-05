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
    console.log('data:', data)
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

  function setUserInfo(userLogin, instance) {
    if (!!userLogin) {
      SessionStorage.set(
        'current_instance',
        JSON.parse(JSON.stringify(instance))
      )
      // const credentials = JSON.parse(JSON.stringify(userLogin.credentials))
      SessionStorage.set(
        'credentials',
        JSON.parse(JSON.stringify(userLogin.credentials))
      )
      SessionStorage.set(
        'current_user',
        JSON.parse(JSON.stringify(userLogin.authenticatable))
      )
      // console.log('credentials:', credentials)
      // api.defaults.headers.common['access_token'] = credentials.accessToken
      // api.defaults.headers.common['client'] = credentials.client
      // api.defaults.headers.common['uid'] = credentials.uid
    }
  }

  onDoneUserLogout((response) => {
    removeCredentials()
  })

  onErrorUserLogout((response) => {
    console.log('error al hacer el logout', response)
  })

  function removeCredentials() {
    SessionStorage.remove('credentials')
    SessionStorage.remove('current_user')
    SessionStorage.remove('current_instance')
    api.defaults.headers.common['Authorization'] = null
    api.defaults.headers.common['access_token'] = null
    api.defaults.headers.common['client'] = null
    api.defaults.headers.common['uid'] = null
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
    onErrorUserUpdatePassword,
    setUserInfo
  }
}
