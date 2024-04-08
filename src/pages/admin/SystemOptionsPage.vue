<template>
  <div>Opciones</div>
  <q-btn color="primary" icon="check" label="clear" @click="clearPinia" />
  <q-btn color="primary" icon="check" label="OK" @click="onClick" />
  <pre>{{ cuentaStore.listaCuentas }}</pre>
</template>

<script setup>
import { getActivePinia } from 'pinia'
import { useCuentaStore } from 'src/stores/common/useCuentaStore'

const cuentaStore = useCuentaStore()

function clearPinia() {
  console.log('Clearing pinia')
  getActivePinia()._s.forEach((store) => store.$reset())
  getActivePinia()._s.forEach((store) => store.$dispose())
}

function onClick() {
  window.location.href = window.location.href
}
</script>

<style lang="scss" scoped></style>
