import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref, reactive } from 'vue'
import { SessionStorage } from 'quasar'
// import { useRouter } from 'vue-router'

// const BASE_URL = "http://localhost:3000/";

export const useSessionStore = defineStore('session', () => {
  // const $router = useRouter()

  const defaultUser = {
    id: null,
    username: null,
    email: null
  }

  const auth_token = ref(null)
  const user = ref(null)

  const getAuthToken = () => {
    return auth_token.value
  }
  const getUserEmail = () => {
    return user.value?.email
  }
  const getUserId = () => {
    user.value = SessionStorage.getItem('user')
      ? SessionStorage.getItem('user')
      : null

    if (!!user.value && !!user.value.id) {
      return user.value?.id
    } else {
      // $router.push('/login')
      return null
    }
  }

  const isLoggetIn = () => {
    const loggedOut =
      auth_token.value == null || auth_token.value == JSON.stringify(null)
    return !loggedOut
  }

  /**
   * Actions
   */
  const registerUser = (payload) => {
    return new Promise((resolve, reject) => {
      api
        .post(`users`, payload)
        .then((response) => {
          console.log('register response', response)
          setUserInfo(response)
          resolve(response)
        })
        .catch((error) => {
          console.log(error.response.data.exception)
          reject(error)
        })
    })
  }

  const loginUser = (payload) => {
    return new Promise((resolve, reject) => {
      api
        .post('users/sign_in/', payload)
        .then((response) => {
          console.log('response.data', response)
          setUserInfoOnLogin(response)
          resolve(response)
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  }
  const logoutUser = async () => {
    const config = {
      headers: { authorization: auth_token }
    }
    return new Promise((resolve, reject) => {
      api
        .delete(`/users/sign_out`, config)
        .then((response) => {
          resetUserInfo()
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    }).then((response) => {
      console.log('Respondiendo en el logoutuser')
      console.log(response)
    })
  }

  // function loginUserWithToken({ commit }, payload) {
  //   const config = {
  //     headers: { authorization: payload.auth_token },
  //   };
  //   new Promise((resolve, reject) => {
  //     api
  //       .get(`${BASE_URL}member-data`, config)
  //       .then((response) => {
  //         setUserInforFromToken(response);
  //         resolve(response);
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });
  // }

  /**
   * mutations
   */
  function setUserInfoOnLogin(response) {
    // console.log('response data', response.data)
    if (response.data.message === 'You are logged in.') {
      // console.log('data', response.data)
      user.value = response.data.user
      auth_token.value = response.headers.authorization
      SessionStorage.set('auth_token', auth_token.value)
      SessionStorage.set('user', user.value)
      // console.log('headers', response.data.headers)
    }
  }

  function setUserInfo(response) {
    // console.log('set user Infor', response)
    // console.log('response data', response.data.status)
    if (response.data.status.code === 200) {
      // console.log('data', response.data.status.data)
      user.value = response.data.status.data
      SessionStorage.set('user', user.value)
      auth_token.value = response.headers.authorization
      SessionStorage.set('user', user.value)
      // api.defaults.headers.common["Authorization"] = auth_token.value;
    }
  }

  // function setUserInforFromToken(data) {
  //   user.value = data.data.user;
  //   auth_token.value = localStorage.getItem("auth_token");
  // }

  function resetUserInfo() {
    console.log('resetting info')
    user.value = null
    auth_token.value = null
    SessionStorage.remove('auth_token')
    SessionStorage.remove('user')
    api.defaults.headers.common['Authorization'] = null
  }

  return {
    getUserEmail,
    getAuthToken,
    getUserId,
    isLoggetIn,
    registerUser,
    loginUser,
    logoutUser
  }
})
