import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { ref, reactive } from "vue";
import { SessionStorage } from "quasar";

// const BASE_URL = "http://localhost:3000/";

export const useSessionStore = defineStore("session", () => {
  const defaultUser = {
    id: null,
    username: null,
    email: null,
  };

  const auth_token = ref(null);
  const user = ref(null);

  const getAuthToken = () => {
    return auth_token.value;
  };
  const getUserEmail = () => {
    return user.value?.email;
  };
  const getUserId = () => {
    return user.value?.id;
  };

  const isLoggetIn = () => {
    const loggedOut =
      auth_token.value == null || auth_token.value == JSON.stringify(null);
    return !loggedOut;
  };

  /**
   * Actions
   */
  const registerUser = (payload) => {
    return new Promise((resolve, reject) => {
      api
        .post(`${BASE_URL}users`, payload)
        .then((response) => {
          setUserInfo(response);
          resolve(response);
        })
        .catch((error) => {
          console.log(error.response.data.exception);
          reject(error);
        });
    });
  };

  const loginUser = (payload) => {
    return new Promise((resolve, reject) => {
      api
        .post("users/sign_in/", payload)
        .then((response) => {
          console.log("response.data", response.data);
          setUserInfo(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const logoutUser = () => {
    const config = {
      headers: { authorization: auth_token },
    };
    return new Promise((resolve, reject) => {
      api
        .delete(`/users/sign_out`, config)
        .then((response) => {
          resetUserInfo();
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

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

  function setUserInfo(response) {
    user.value = response.data.user;
    auth_token.value = response.headers.authorization;
    // api.defaults.headers.common["Authorization"] = auth_token.value;
    SessionStorage.set("auth_token", auth_token.value);
    SessionStorage.set("user", user.value);
  }

  // function setUserInforFromToken(data) {
  //   user.value = data.data.user;
  //   auth_token.value = localStorage.getItem("auth_token");
  // }

  function resetUserInfo() {
    user.value = null;
    auth_token.value = null;
    SessionStorage.remove("auth_token");
    SessionStorage.remove("user");
    api.defaults.headers.common["Authorization"] = null;
  }

  return {
    getUserEmail,
    getAuthToken,
    getUserId,
    isLoggetIn,
    registerUser,
    loginUser,
    logoutUser,
  };
});
