<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="text-h4">Bienvenido al Sistema de Ingresos y Egresos</div>
    </q-card-section>
    <q-card-section>
      <div class="text-h6">
        <span class="text-weight-bold">{{ username }}</span> ({{ email }})
      </div>
    </q-card-section>
    <q-card-section class="text-blue-grey-4">
      Inicia seleccionando una opción en el menú de la izquierda.
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { SessionStorage } from 'quasar'

const email = ref('')
const username = ref('')

onMounted(() => {
  const current_user = SessionStorage.getItem('current_user')
  email.value = current_user.email
  username.value = current_user.name
})
</script>
