<template>
  <q-layout>
    <q-page-container class="">
      <q-page class="flex flex-center bg-color">
        <q-card
          class="bg-dark text-accent card-login"
          v-bind:style="
            $q.screen.lt.sm || $q.screen.lt.md
              ? { width: '70%' }
              : { width: '35%' }
          "
        >
          <q-card-section>
            <div
              class="row inline full-width justify-center text-h4 q-pt-lg text-accent-light"
            >
              Iniciar Sesión
            </div>
          </q-card-section>
          <q-card-section style="border: 0px solid red" align="center">
            <q-form
              @submit.prevent="login"
              class="q-gutter-md q-pa-lg"
              style="max-width: 350px; border: 0px solid yellow"
              fit
            >
              <q-input
                v-model="form.email"
                label="Correo"
                input-class="grey"
                class="text-accent-light"
                label-color="accent-light"
                lazy-rules
                type="email"
                dark
                outlined
                :rules="[(val) => !!val || 'Correo es requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="mail" />
                </template>
              </q-input>

              <q-input
                type="password"
                dark
                v-model="form.password"
                label="Contraseña"
                input-class="grey"
                label-color="accent-light"
                class="border-accent"
                lazy-rules
                :rules="[(val) => !!val || 'Contraseña es requerida']"
                outlined
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
              <div class="row justify-center">
                <q-btn
                  :label="btnLabel"
                  type="submit"
                  outline
                  color="secondary"
                  class="text-bold"
                />
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

const loginAction = ref('one')

/**
 * computed
 */
const btnLabel = computed(() =>
  loginAction.value == 'one' ? 'Entrar' : 'Registrar'
)
const isRegistration = computed(() =>
  loginAction.value == 'two' ? true : false
)

/**
 * onMounted
 */
onMounted(() => {
  resetUserInfo()
})

function login() {
  const email = form.email.toString()
  const password = form.password.toString()
  sessionService.userLogin({
    email,
    password
  })
}

sessionService.onDoneUserLogin(({ data }) => {
  console.log('mandando al home')
  router.push('/home')
})
sessionService.onErrorUserLogin((response) => {
  // console.log(response)
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

<style lang="scss">
.my-custom-toggle {
  border: 1px solid #027be3;
}
.bg-color {
  // background-color: #ffffff;
  // background-image: url('../../public/images/3968744.jpg');
  // background-repeat: no-repeat;
  // background-size: cover;
  background: url('/images/1.jpg') 0 / cover fixed;
  // -webkit-filter: blur(5px); /* Safari 6.0 - 9.0 */
  // filter: blur(5px);
  z-index: 2 !important;
}
.card-login {
  box-shadow: 0 5px 70px -25px #f69068;
  opacity: 0.9;
  // -webkit-filter: none !important; /* Safari 6.0 - 9.0 */
  // filter: none !important;
  z-index: 1 !important;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  color: rgb(170, 27, 27) !important;
  -webkit-text-fill-color: rgb(223, 169, 169) !important;
  -webkit-box-shadow: 0 0 0 1000px darken($color: $dark, $amount: 1) inset !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
}
</style>
