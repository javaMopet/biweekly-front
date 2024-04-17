<template>
  <div class="container column items-center q-pa-xl">
    <q-card class="reset-container">
      <q-card-section>
        <div class="text-h5">Contraseña actualizada</div>
      </q-card-section>
      <q-card-section>
        <div class="">Puede ingresar con su nueva contraseña</div>
        <q-separator spaced horizontal />
        <div class="text-subtitle2">Ingresa la nueva contraseña y guarda.</div>
      </q-card-section>
      <q-card-section> </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useSessionService } from 'src/composables/login/useSessionService'
import { useNotificacion } from 'src/composables/utils/useNotificacion'

/**
 * composables
 */
const route = useRoute()
const sessionService = useSessionService()
const { mostrarNotificacionNegativa } = useNotificacion()

onMounted(() => {
  console.log('route.params.reset_password_token:', route.query)
})

/**
 * state
 */
const password = ref('')
const passwordConfirmation = ref('')

/**
 * methods
 */
function savePassword() {
  console.log('saving password')
  sessionService.userUpdatePassword({
    password: password.value,
    passwordConfirmation: password.value,
    resetPasswordToken: route.query.reset_password_token
  })
}

sessionService.onDoneUserUpdatePassword(({ data }) => {
  console.log('data:', data)
  router.push('/resetPasswordSuccess')
})
sessionService.onErrorUserUpdatePassword((error) => {
  console.log('error:', error)
  mostrarNotificacionNegativa(
    'Ocurrió un error al intentar actualizar la contraseña',
    1900
  )
})
</script>

<style lang="scss" scoped>
.container {
  width: 100hv;
  align-self: center;
}
.reset-container {
  width: 500px;
}
</style>
