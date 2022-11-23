import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { ref, reactive } from "vue";

const BASE_URL = "http://localhost:3000/";

export const useSessionStore = defineStore("session", () => {
  const auth_token = ref(null);
  const user = reactive({
    id: null,
    username: null,
    email: null,
  });

  const getAuthToken = () => {
    return auth_token.value;
  };
  const getUserEmail = () => {
    return user?.email;
  };
  const getUserId = () => {
    return user?.id;
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
    console.log("registrando:", payload);
    return new Promise((resolve, reject) => {
      api
        .post(`${BASE_URL}users`, payload)
        .then((response) => {
          setUserInfo(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const loginUser = ({ commit }, payload) => {
    return new Promise((resolve, reject) => {
      api
        .get(`${BASE_URL}users/sign_in`, payload)
        .then((response) => {
          setUserInfo(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const logoutUser = ({ commit }) => {
    const config = {
      headers: { authorization: auth_token },
    };
    new Promise((resolve, reject) => {
      axios
        .delete(`${BASE_URL}users/sign_out`, config)
        .then(() => {
          resetUserInfo();
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  function loginUserWithToken({ commit }, payload) {
    const config = {
      headers: { authorization: payload.auth_token },
    };
    new Promise((resolve, reject) => {
      axios
        .get(`${BASE_URL}member-data`, config)
        .then((response) => {
          setUserInforFromToken(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * mutations
   */

  function setUserInfo(data) {
    console.log("data after save user:", data);
    // user = data.data.user;
    // auth_token.value = data.headers.authorization;
    // axios.defaults.header.common["Authorization"] = data.header.authorization;
    // localStorage.setItem("auth_token", data.headers.authorization);
  }
  function setUserInforFromToken(data) {
    user = data.data.user;
    auth_token.value = localStorage.getItem("auth_token");
  }

  function resetUserInfo() {
    user = {
      id: null,
      username: null,
      email: null,
    };
    auth_token.value = null;
    localStorage.removeItem("auth_token");
    axios.defaults.headers.common["Authorization"] = null;
  }

  return {
    getUserEmail,
    getAuthToken,
    getUserId,
    isLoggetIn,
    registerUser,
    loginUser,
    logoutUser,
    loginUserWithToken,
  };
});
