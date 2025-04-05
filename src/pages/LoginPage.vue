<template>
  <div class="fullscreen bg-color" style="border: 0px solid red">
    <div class="row float-left q-pa-xl">
      <div class="text-h5 main-logo column items-center">
        <q-icon name="savings" size="40px" color="secondary" />
        <span>Biweekly Cash</span>
        <span class="text-caption">application</span>
      </div>
    </div>
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
      class="fixed-center card-login q-pa-sm"
      :style="$q.screen.lt.sm ? { width: '350px' } : { width: '380px' }"
    >
      <q-card-section>
        <div class="column full-width items-center text-h6 q-pt-sm login_image">
          <q-icon name="account_circle" size="130px" />
        </div>
        <!-- account_circle -->
        <!-- fa-solid fa-circle-user -->
        <!-- fa-regular fa-circle-user -->
        <div class="row justify-center">
          <span class="text-accent-light"
            >Ingresa con tu cuenta de correo y contraseña</span
          >
        </div>
      </q-card-section>
      <q-card-section align="center">
        <div class="q-px-md">
          <q-form
            @submit.prevent="login"
            style="border: 0px solid yellow"
            class="q-gutter-md"
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
            <q-input
              v-model="form.dominio"
              type="text"
              label="Dominio"
              label-color="input-label"
              bg-color="blue-1"
              color="blue-gray-10"
              lazy-rules
              outlined
              :rules="[(val) => !!val || 'El dominio es requerido']"
            >
              <template v-slot:prepend>
                <q-icon name="app_registration" class="text-blue-grey-5" />
              </template>
            </q-input>
            <div>
              <div
                class="row full-width justify-end"
                style="padding: 0px; border-spacing: 0px"
              >
                <router-link to="/forgotPassword" class="link_forgot-password"
                  >¿Olvidaste tu contraseña?</router-link
                >
              </div>
            </div>
            <div class="column fit justify-center items-center q-gutter-y-md">
              <q-btn
                label="Login"
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
              <q-separator spaced inset horizontal color="white" />
            </div>
          </q-form>
        </div>
      </q-card-section>
      <div
        class="text-blue-grey-4"
        style="border: 0px solid red; text-align: right"
      >
        v 1 . 2 . 1
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { useQuasar, SessionStorage } from 'quasar'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { useSessionService } from 'src/composables/login/useSessionService'
import { toast } from 'vue3-toastify'
import { getActivePinia } from 'pinia'

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
  sessionService.userLogin({
    email: form.email.toString(),
    password: form.password.toString()
  })
}

sessionService.onDoneUserLogin(({ data }) => {
  let instances = data.userLogin.authenticatable.instances
  let instance = instances.find((instance) => instance.dominio === form.dominio)
  if (!instance) {
    mostrarNotificacionNegativa(
      'El dominio no existe o no está asociado a tu cuenta. Favor de verificar.'
    )
    submitting.value = false
    return
  }

  sessionService.setUserInfo(data.userLogin, instance)
  router.push('/home')
})

sessionService.onErrorUserLogin((response) => {
  // console.log(
  //   '%csrc/pages/LoginPage.vue:158 response',
  //   'color: #007acc;',
  //   response
  // )
  let message = ''
  let error = false
  // console.log(response)
  if (response.toString().includes('NetworkError when')) {
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
      theme: 'dark',
      pauseOnFocusLoss: false
    })
  } else {
    // toast.error('El usuario o la contraseña son incorrectos', {
    //   position: toast.POSITION.TOP_CENTER,
    //   autoClose: 5000,
    //   theme: 'dark',
    //   pauseOnFocusLoss: false,
    //   style: 'width: 450px',
    //   autoClose: false,
    //   transition: 'slide'
    // })
    $q.notify({
      message:
        'El usuario o la contraseña son incorrectos. Favor de verificar.',
      position: 'center',
      type: 'negative',
      timeout: 1300
    })
  }
  submitting.value = false
})

function resetUserInfo() {
  SessionStorage.remove('credentials')
  SessionStorage.remove('current_user')
  SessionStorage.remove('current_instance')
  api.defaults.headers.common['Authorization'] = null
  // console.log('Clearing pinia')
  getActivePinia()._s.forEach((store) => store.$reset())
  getActivePinia()._s.forEach((store) => store.$dispose())
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
  // background-color: lighten($color: $dark, $amount: 5);
  background-color: scale-color($dark, $lightness: 5%);
  opacity: 0.9;
  z-index: 1 !important;
  // background-color: white;
  // -webkit-filter: none !important; /* Safari 6.0 - 9.0 */
  // filter: none !important;
}

.link_forgot-password {
  color: rgb(192, 248, 229);
}
// .login_image {
//   color: darken($color: $dark, $amount: 2);
//   opacity: 0.95;
//   transform: translateY(-120px);
//   height: 100px !important;
// }
.main-logo {
  // font-family: 'DM Sans', sans-serif;
  font-family: 'REM', sans-serif;
  font-weight: bold;
}
</style>
