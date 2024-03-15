<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md shadow-2 my_card" bordered>
          <q-card-section class="text-center">
            <div class="text-grey-9 text-h5 text-weight-bold">Sign in</div>
            <div class="text-grey-8">Sign in below to access your account</div>
          </q-card-section>
          <q-card-section>
            <q-input
              dense
              outlined
              v-model="authenticable.email"
              label="Email Address"
            ></q-input>
            <q-input
              dense
              outlined
              class="q-mt-md"
              v-model="authenticable.password"
              type="password"
              label="Password"
            ></q-input>
          </q-card-section>
          <q-card-section>
            <q-btn
              style="border-radius: 8px"
              color="dark"
              rounded
              size="md"
              label="Sign in"
              no-caps
              class="full-width"
            ></q-btn>
          </q-card-section>
          <q-card-section class="text-center q-pt-none">
            <div class="text-grey-8">
              Don't have an account yet?
              <a
                href="#"
                class="text-dark text-weight-bold"
                style="text-decoration: none"
                >Sign up.</a
              >
            </div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar, SessionStorage } from 'quasar'
import { ref, reactive, computed, onMounted } from 'vue'
// import { useSessionStore } from 'src/stores/sessionStore'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
// import { LOGIN } from 'src/graphql/opertations/login'
// import { useMutation } from '@vue/apollo-composable'
import { userSessionService } from 'src/composables/login/useSessionService'

/**
 * composables
 */
const $q = useQuasar()
const router = useRouter()
const { mostrarNotificacionNegativa } = useNotificacion()
const sessionService = userSessionService()

/**
 * GRAPHQL
 */
// const {
//   mutate: userLogin,
//   onDone: onDoneUserLogin,
//   onError: onErrorUserLogin
// } = useMutation(LOGIN)

/**
 * state
 */
const form = reactive({
  name: '',
  email: 'horaciopenamendoza@gmail.com',
  password: '',
  password_confirmation: ''
})

const invalidCredentials = ref(false)
const submitting = ref(false)
const authenticable = ref({})

/**
 * computed
 */

/**
 * onMounted
 */
onMounted(() => {
  resetUserInfo()
})

function login() {
  submitting.value = true
  invalidCredentials.value = false
  const email = authenticable.value.email
  const password = authenticable.value.password
  sessionService.userLogin({
    email,
    password
  })
}

sessionService.onDoneUserLogin(({ data }) => {
  console.log('mandando al home')
  submitting.value = false
  router.push('/home')
})
sessionService.onErrorUserLogin((response) => {
  submitting.value = false
  invalidCredentials.value = true
})

// function login() {
//     const payload = {
//       user: {
//         email: form.email,
//         password: form.password
//       }
//     }
//     const promise = sessionStore.loginUser(payload)
//     promise.then(
//       (result) => {
//         // console.log('Resultado correcto', result)
//         router.push('/home')
//       },
//       (error) => {
//         console.error('error', error)
//         console.log(error)
//         if (error.toString().includes('Request failed with status code 401')) {
//           mostrarNotificacionNegativa('Usuario y/o password incorrectos', 2100)
//         } else {
//           mostrarNotificacionNegativa(
//             'Ocurrió un error al intentar iniciar sesión',
//             2100
//           )
//         }
//       }
//     )
// }

function showNotification(error) {
  $q.notify({
    type: 'negative',
    message: error
  })
}
function resetUserInfo() {
  // auth_token.value = null
  SessionStorage.remove('auth_token')
  SessionStorage.remove('user')
  api.defaults.headers.common['Authorization'] = null
}
</script>
