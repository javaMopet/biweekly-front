<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="text-h5">Bienvenido</div>
      <div class="text-subtitle2">{{ username }} ({{ email }})</div>
    </q-card-section>
    <q-card-section>
      Inicia seleccionando una opción en el menú de la izquierda. Test
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { SessionStorage } from 'quasar'

const email = ref('')
const username = ref('')

onMounted(() => {
  const current_user = JSON.parse(SessionStorage.getItem('current_user'))
  email.value = current_user.email
  username.value = current_user.name
})
</script>
