import { useMutation } from '@vue/apollo-composable'
import { SessionStorage } from 'quasar'
import { LOGIN, LOGOUT } from 'src/graphql/opertations/login'
import { api } from 'src/boot/axios'

export function userSessionService() {
  /**
   * composable
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

  onDoneUserLogin(({ data }) => {
    setUserInfo(data.userLogin)
  })
  onErrorUserLogin((error) => {
    console.log(error)
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
      SessionStorage.set('credentials', JSON.stringify(userLogin.credentials))
      SessionStorage.set(
        'current_user',
        JSON.stringify(userLogin.authenticatable)
      )
    }
  }

  onDoneUserLogout((response) => {
    removeCredentials()
  })

  onErrorUserLogout((response) => {})

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
    onErrorUserLogout
  }
}
