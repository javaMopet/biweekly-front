<template>
  <div class="container full-with column items-center q-pt-xl">
    <q-card class="reset-card" style="min-width: 600px">
      <q-card-section>
        <div class="text-h5">Link de recuperación de contraseña enviado.</div>
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle1">
          <span class="text-bold text-subtitle2"
            >Revisa tu cuenta de correo y sigue las instrucciones.</span
          >
          <br /><br />
          <span class="text-subtitle1"
            >Si no visualizas el correo verifica en tu carpeta de Spam.</span
          >
        </div>
      </q-card-section>
      <q-card-section>
        Regresar a
        <router-link to="/login">iniciar sesión</router-link>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
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
// const email = ref('')

/**
 * methods
 */
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
