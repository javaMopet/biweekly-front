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
          <div class="reset-card-message">
            Enviaremos un mensaje a la cuenta de correo para reestablecer tu
            contraseña.
          </div>
          <div class="column">
            <q-btn label="CONTINUAR" type="submit" color="primary-button" />
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

/**
 * composables
 */
const route = useRoute()

const sessionService = useSessionService()
const router = useRouter()

onMounted(() => {
  console.log('route.params.reset_password_token:', route.query)
})

/**
 * state
 */
const email = ref('')
/**
 * methods
 */
function sendPasswordReset() {
  console.log('sendig request reset password')
  sessionService.userSendPasswordReset({
    email: email.value,
    redirectUrl: 'http://localhost:9001/resetPassword'
  })
}
sessionService.onDoneUserSendPasswordReset(({ data }) => {
  console.log('data:', data)
  router.push('/forgotPasswordSended')
})
sessionService.onErrorUserSendPasswordReset((error) => {
  console.log('error:', error)
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
