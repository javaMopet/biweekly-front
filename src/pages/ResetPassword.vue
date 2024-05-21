<template>
  <div class="container column items-center q-pa-xl">
    <q-card class="reset-container">
      <q-card-section>
        <div class="text-h5">Reestablecer contraseña</div>
      </q-card-section>
      <q-card-section>
        <div class="">
          Hemos recibido una solicitud para reestablecer tu contraseña.
        </div>
        <!-- <q-separator spaced horizontal /> -->
        <div class="text-subtitle2">Ingresa la nueva contraseña y guarda.</div>
      </q-card-section>
      <q-card-section>
        <div class="">
          <q-form @submit="savePassword" class="q-gutter-md" @reset="irALogin">
            <q-input
              v-model="password"
              type="password"
              label="Nueva contraseña"
              filled
              :rules="[(val) => !!val || 'Campo requerido.']"
            />
            <q-input
              v-model="passwordConfirmation"
              type="password"
              label="Confirma tu nueva contraseña "
              filled
              :rules="[(val) => !!val || 'Campo requerido.']"
            />
            <div class="column justify-center q-gutter-md">
              <q-btn label="Guardar" type="submit" color="primary-button" />
            </div>
            <div class="column justify-center q-gutter-md">
              <q-btn label="CANCELAR" type="reset" color="pink-4" />
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
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
const router = useRouter()
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
function irALogin() {
  router.push('/login')
}
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
