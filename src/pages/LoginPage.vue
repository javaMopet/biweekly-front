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
          class="card-login q-py-md"
          :style="$q.screen.lt.sm ? { width: '300px' } : { width: '400px' }"
        >
          <div class="">
            <div class="column full-width items-center text-h6 q-pt-lg">
              <!-- <span class="text-weight-bold q-py-sm text-blue-grey-3"
                >Bienvenido
              </span> -->
              <!-- <span class="text-caption">Identifiquese antes de continuar</span> -->
              <q-icon name="account_circle" size="100px" />
            </div>
            <div class="row justify-center">
              <span>Login to your account</span>
            </div>
          </div>
          <!-- <q-separator spaced inset horizontal color="accent-light" /> -->
          <q-card-section align="center">
            <q-form
              @submit.prevent="login"
              class="q-gutter-lg q-pa-lg"
              style="max-width: 95%; border: 0px solid yellow"
              fit
            >
              <!-- Estilo solo de la parte donde se digita el valor  -->
              <!-- input-style="border: 1px solid green" -->

              <q-input
                v-model="form.email"
                type="email"
                label="Usuario o Email"
                label-color="input-label"
                bg-color="blue-1"
                color="blue-gray-10"
                lazy-rules
                outlined
                :rules="[(val) => !!val || 'Correo es requerido']"
                class="fit"
              >
                <template v-slot:prepend>
                  <q-icon name="mail" class="text-blue-grey-5" />
                </template>
              </q-input>

              <q-input
                v-model="form.password"
                :type="isPwd ? 'password' : 'text'"
                label="Contraseña"
                label-color="input-label"
                color="blue-10"
                lazy-rules
                bg-color="blue-1"
                outlined
                :rules="[(val) => !!val || 'Correo es requerido']"
                class="fit"
              >
                <!-- standout="bg-form-input-standout-dark" -->
                <template v-slot:prepend>
                  <q-icon name="lock" class="text-blue-grey-5" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <div class="text-red-3" v-if="invalidCredentials">
                El usuario y/o contraseña son incorrectos
              </div>
              <div class="column fit justify-center items-center">
                <q-btn
                  label="Entrar"
                  type="submit"
                  :loading="submitting"
                  push
                  color="toggle-button"
                  text-color="toggle-text-button"
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { useSessionService } from 'src/composables/login/useSessionService'
import { toast } from 'vue3-toastify'

/**
 * composables
 */
const $q = useQuasar()
const router = useRouter()
const { mostrarNotificacionNegativa } = useNotificacion()
const sessionService = useSessionService()

/**
 * state
 */
const form = reactive({
  email: '',
  password: ''
})

const invalidCredentials = ref(false)
const submitting = ref(false)
const isPwd = ref(true)

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
  sessionService.userLogin({
    email: form.email.toString(),
    password: form.password.toString()
  })
}

sessionService.onDoneUserLogin(({ data }) => {
  submitting.value = false
  router.push('/home')
})

sessionService.onErrorUserLogin((response) => {
  console.log(
    '%csrc/pages/LoginPage.vue:158 response',
    'color: #007acc;',
    response
  )
  let message = ''
  let error = false

  if (response.toString().includes('Failed to fetch')) {
    message = 'Error de comunicación con servidor de datos'
    error = true
  } else if (response.toString().includes('Received status code 500')) {
    message = 'Error(500) originado en el servidor de datos, verificar.'
    error = true
  }

  if (error) {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 10000,
      theme: 'dark'
    })
  } else {
    invalidCredentials.value = true
  }
  submitting.value = false
})

function resetUserInfo() {
  SessionStorage.remove('credentials')
  SessionStorage.remove('current_user')
  api.defaults.headers.common['Authorization'] = null
}
</script>

<style lang="scss" scoped>
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
  background-color: lighten($color: $dark, $amount: 5);
  opacity: 0.9;
  z-index: 1 !important;
  // background-color: white;
  // -webkit-filter: none !important; /* Safari 6.0 - 9.0 */
  // filter: none !important;
}
</style>
