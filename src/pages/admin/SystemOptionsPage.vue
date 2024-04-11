<template>
  <q-card class="my-card">
    <q-card-section>
      <q-toolbar class="bg-secondary text-white">
        <q-btn
          color="accent"
          dense
          label="Clear Pinia stores"
          @click="clearPinia"
          no-caps
        />
        <q-toolbar-title> Opciones </q-toolbar-title>
        <q-btn color="primary" label="Reload (F5)" @click="reload()" />
      </q-toolbar>
    </q-card-section>
    <q-card-section>
      <div class="text-h6">User session</div>
      <div class="text-subtitle2">
        {{ user.id }} - <span class="text-bold">{{ user.name }}</span>
      </div>
      <div class="text-subtitle2">
        Email: - <span class="text-bold">{{ user.email }}</span>
      </div>
      <div class="text-subtitle2">
        Is Admin: - <span class="text-bold">{{ user.isAdmin }}</span>
      </div>
      <div class="text-subtitle2">
        Can modify: - <span class="text-bold">{{ user.canModify }}</span>
      </div>

      <div class="text-h6">User instance</div>
      <div class="text-subtitle2">
        <span class="text-bold"
          >{{ user.instance.id }} - {{ user.instance.name }}</span
        >
      </div>
      <div class="text-subtitle2">
        Logo: <span class="text-bold">{{ user.instance.logoImage }}</span>
      </div>
    </q-card-section>
    <q-card-section> </q-card-section>
  </q-card>

  <!-- <pre>{{ user }}</pre> -->
</template>

<script setup>
import { getActivePinia } from 'pinia'
import { SessionStorage } from 'quasar'
import { useCuentaStore } from 'src/stores/common/useCuentaStore'

/**state */
const cuentaStore = useCuentaStore()
const user = JSON.parse(SessionStorage.getItem('current_user'))

function clearPinia() {
  console.log('Clearing pinia')
  getActivePinia()._s.forEach((store) => store.$reset())
  getActivePinia()._s.forEach((store) => store.$dispose())
}

function reload() {
  window.location.href = window.location.href
}
</script>

<style lang="scss" scoped></style>
