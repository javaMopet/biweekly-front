<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="text-h5">Bienvenido</div>
      <div class="text-subtitle2">{{ user.name }}</div>
    </q-card-section>
    <q-card-section>
      Inicia seleccionando una opción en el menú de la izquierda.
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { SessionStorage } from 'quasar'

const user = SessionStorage.getItem('user')

const username = ref('')

onMounted(() => {
  console.log(user)
  username.value = user.name
})
</script>
