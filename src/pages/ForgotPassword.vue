<template>
  <div class="container full-with column items-center q-pt-xl">
    <q-card class="reset-card">
      <q-card-section>
        <div class="text-h5">Recuperación de la cuenta</div>
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle1">
          Podemos ayudarte a restablecer tu contraseña. Primero ingresa tu
          cuenta de Email y sigue las instrucciones.
        </div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="sendPasswordReset" class="q-gutter-md">
          <q-input
            v-model="email"
            type="email"
            label="Email Address"
            :rules="[(val) => !!val || 'Ingresa la cuenta de Email']"
            outlined
          />
          <div class="text-negative" v-if="noEmailFound">
            La dirección de correo no existe. Verifica que la ingresaste
            corectamente
          </div>
          <div class="reset-card-message">
            Enviaremos un mensaje a la cuenta de correo para reestablecer tu
            contraseña.
          </div>
          <div class="column">
            <q-btn
              label="CONTINUAR"
              type="submit"
              color="primary-button"
              :loading="loadingSendPasswordReset"
            />
          </div>
          <div class="column items-center">
            <div class="row">
              ¿Ya tienes una cuenta? &nbsp;
              <router-link to="/login">Ingresa</router-link>
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useSessionService } from 'src/composables/login/useSessionService'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { useQuasar } from 'quasar'

/**
 * composables
 */
const route = useRoute()
const $q = useQuasar()
const sessionService = useSessionService()
const router = useRouter()
const { mostrarNotificacionNegativa } = useNotificacion()

onMounted(() => {
  console.log('route.params.reset_password_token:', route.query)
})

/**
 * state
 */
const email = ref('')
const noEmailFound = ref(false)
const loadingSendPasswordReset = ref(false)

/**
 * methods
 */
function sendPasswordReset() {
  noEmailFound.value = false
  loadingSendPasswordReset.value = true
  console.log('sendig request reset password')
  // const serverPath = $q.platform.baseUrl
  const serverPath = window.location.origin
  console.log('serverPath:', serverPath)
  sessionService.userSendPasswordReset({
    email: email.value,
    redirectUrl: `${serverPath}/resetPassword`
  })
}
sessionService.onDoneUserSendPasswordReset(({ data }) => {
  console.log('data:', data)
  router.push('/forgotPasswordSended')
})
sessionService.onErrorUserSendPasswordReset((error) => {
  console.log('error:', error)
  loadingSendPasswordReset.value = false
  if (error.toString().includes('User was not found')) {
    noEmailFound.value = true
  } else {
    mostrarNotificacionNegativa(
      'Ocurrió un error al intentar enviar la solicitud.',
      1900
    )
  }
})
</script>

<style lang="scss" scoped>
.reset-card {
  width: 500px;
}
.reset-card-message {
  font-size: 0.8rem;
  color: #888484 !important;
}
</style>
