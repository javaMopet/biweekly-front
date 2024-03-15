<template>
  <q-layout>
    <q-page-container class="">
      <q-page class="flex flex-center bg-color">
        <!-- v-bind:style="
            $q.screen.lt.sm
              ? { width: '85%' }
              : $q.screen.lt.md
              ? { width: '60%' }
              : $q.screen.lt.lg
              ? { width: '40%' }
              : { width: '25%' }
          " -->
        <q-card
          class="card-login"
          :style="$q.screen.lt.sm ? { width: '300px' } : { width: '380px' }"
        >
          <div class="">
            <div
              class="column full-width items-center text-h6 q-pt-lg text-dark"
            >
              <span class="text-blue-grey-8">Bienvenido</span>
              <span class="text-caption">Identifiquese antes de continuar</span>
            </div>
          </div>
          <q-separator spaced inset horizontal color="accent-light" />
          <q-card-section align="center">
            <q-form
              @submit.prevent="login"
              class="q-gutter-md q-py-xs q-px-lg"
              style="max-width: 95%; border: 0px solid yellow"
              fit
            >
              <!-- Estilo solo de la parte donde se digita el valor  -->
              <!-- input-style="border: 1px solid green" -->
              <div class="column fit items-start justify-start">
                <q-label class="text-primary">Usuario:</q-label>
                <q-input
                  v-model="form.email"
                  type="email"
                  label="Correo"
                  color="bg-blue-1"
                  input-class="text-secondary"
                  label-color="accent-light"
                  lazy-rules
                  outlined
                  :rules="[(val) => !!val || 'Correo es requerido']"
                  class="fit"
                >
                  <template v-slot:prepend>
                    <q-icon name="mail" class="text-blue-grey-7" />
                  </template>
                </q-input>
              </div>
              <div class="column fit items-start">
                <q-label class="text-primary">Contraseña:</q-label>
                <q-input
                  v-model="form.password"
                  type="password"
                  label="Contraseña"
                  color="bg-blue-1"
                  input-class="text-secondary"
                  label-color="accent-light"
                  lazy-rules
                  outlined=""
                  :rules="[(val) => !!val || 'Correo es requerido']"
                  class="fit"
                >
                  <!-- standout="bg-form-input-standout-dark" -->
                  <template v-slot:prepend>
                    <q-icon name="lock" class="text-blue-grey-7" />
                  </template>
                </q-input>
              </div>

              <div class="text-negative-pastel" v-if="invalidCredentials">
                El usuario y/o contraseña son incorrectos
              </div>
              <div class="column fit justify-center items-center">
                <q-btn
                  label="Entrar"
                  type="submit"
                  :loading="submitting"
                  push
                  color="primary-button"
                  class="text-bold fit"
                >
                  <template v-slot:loading>
                    <q-spinner-pie />
                  </template>
                </q-btn>
              </div>
            </q-form>
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
  const email = form.email.toString()
  const password = form.password.toString()
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

<style lang="scss" scoped>
.my-custom-toggle {
  border: 1px solid #027be3;
}
.bg-color {
  // background-color: #ffffff;
  // background-image: url('../../public/images/3968744.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background: url('/images/1.jpg') 0 / cover fixed;
  // -webkit-filter: blur(5px); /* Safari 6.0 - 9.0 */
  // filter: blur(5px);
  // background-color: $accent-light;
  z-index: 2 !important;
}
.card-login {
  box-shadow: 0 5px 70px -25px #643a29;
  background-color: white;
  // -webkit-filter: none !important; /* Safari 6.0 - 9.0 */
  // filter: none !important;
  z-index: 1 !important;
}

input {
  background-clip: text !important;
  -webkit-background-clip: text !important;
}
</style>
