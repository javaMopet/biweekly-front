<template>
  <q-layout>
    <q-page-container class="">
      <q-page class="flex flex-center bg-color">
        <q-card
          class="bg-primary text-accent card-login"
          v-bind:style="
            $q.screen.lt.sm || $q.screen.lt.md
              ? { width: '80%' }
              : { width: '30%' }
          "
        >
          <q-card-section>
            <div
              class="row inline full-width justify-center text-h4 q-pt-lg text-accent-light"
            >
              Iniciar Sesión
            </div>
          </q-card-section>
          <q-card-section class="q-pt-xl">
            <q-btn-toggle
              icon="login"
              v-model="loginAction"
              class="my-custom-toggle"
              spread
              toggle-color="primary-button"
              toggle-text-color="white"
              text-color="grey-6"
              :options="[
                { label: 'Entrar', value: 'one' },
                { label: 'Registrar', value: 'two' }
              ]"
              padding="0.8rem"
              push
              style="border: 0px solid !important"
            />
          </q-card-section>
          <q-card-section style="border: 0px solid red" align="center">
            <q-form
              @submit.prevent="submitForm"
              class="q-gutter-md q-pa-lg"
              style="max-width: 300px; border: 0px solid yellow"
              fit
            >
              <q-input
                v-if="isRegistration"
                v-model="form.name"
                lazy-rules
                type="text"
                label="Nombre Completo"
                dark
              >
                <template v-slot:prepend>
                  <q-icon name="badge" />
                </template>
              </q-input>
              <q-input
                v-model="form.email"
                label="Correo"
                input-class="grey"
                class="text-accent-light"
                label-color="accent-light"
                lazy-rules
                type="email"
                dark
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
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
              <q-input
                v-if="isRegistration"
                type="password"
                input-class="text-accent"
                v-model="form.password_confirmation"
                label="Confirmación Contraseña"
                lazy-rules
                dark
                :rules="[(val) => !!val || 'Contraseña es requerida']"
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
import { useSessionStore } from 'src/stores/sessionStore'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

const username = ref(null)
const password = ref(null)
const returnUrl = ref(null)

const $q = useQuasar()

const router = useRouter()

const sessionStore = useSessionStore()

/**
 * state
 */
const form = reactive({
  name: 'Horacio Peña Mendoza',
  email: 'hpenam@uaemex.mx',
  password: 'Pqt:72i_9,0c',
  password_confirmation: 'Pqt:72i_9,0c'
})
const loginAction = ref('one')
// const btnLabel = ref("Entrar");

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

function submitForm() {
  if (isRegistration.value) {
    const payload = {
      user: {
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation
      }
    }
    const promise = sessionStore.registerUser(payload)
    promise.then(
      (result) => {
        console.log('terminó la instruccion')
        console.log('resultado', result)
        console.log(result.data.id)
        router.push('/home')
        // $q.notify({
        //   type: "positive",
        //   message: `Se registro correctamente el usuario`,
        //   timeout: 1500,
        // });
      },
      (e) => {
        console.log('Ocurrió un error al intentar registrar el usuario.', e)

        console.error(e)
      }
    )
  } else {
    const payload = {
      user: {
        email: form.email,
        password: form.password
      }
    }
    const promise = sessionStore.loginUser(payload)
    promise.then(
      (result) => {
        console.log('result', result)
        router.push('/home')
      },
      (error) => {
        console.error('error', error)
      }
    )
  }
}

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
</style>
