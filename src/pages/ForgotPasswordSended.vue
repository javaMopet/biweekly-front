<template>
  <div class="container full-with column items-center q-pt-xl">
    <q-card class="reset-card">
      <q-card-section>
        <div class="text-h5">Correo enviado.</div>
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle1">
          Enviamos un correo con el link de recuperación de su cuenta
        </div>
      </q-card-section>
      <q-card-section> </q-card-section>
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
