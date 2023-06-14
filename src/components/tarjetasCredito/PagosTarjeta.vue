<template>
  <q-card class="my-card" style="width: 400px">
    <q-card-section class="bg-main-menu row inline fit q-py-sm justify-between">
      <div class="text-h6 text-accent-light">{{ cuenta.nombre }}</div>
      <div class="">
        <q-btn
          round
          flat
          dense
          icon="close"
          class="float-right"
          color="accent"
          v-close-popup
          vertical-top
        ></q-btn>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <span>Importe pagado:</span>
        <span>$ 19020.25</span>
      </div>
      <q-form @submit="generarPago" class="q-gutter-md">
        <div class="col column">
          <div class="row input-label">Cuenta:</div>
          <CuentaSelect v-model="cuenta_egreso"></CuentaSelect>
        </div>
        <div align="right">
          <q-btn
            label="Cancelar"
            color="primary"
            flat
            class="q-ml-sm"
            v-close-popup
          />
          <q-btn label="Pagar" type="submit" color="primary-button" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import CuentaSelect from '../formComponents/CuentaSelect.vue'

/**
 * state
 */
const cuenta_egreso = ref(null)
/**
 * props
 */
const props = defineProps({
  cuenta: {
    type: Object,
    required: true
  }
})
/**
 * funciones
 */
function generarPago() {
  console.log('Generando el pago de la tarjeta')
}
</script>

<style lang="scss" scoped></style>
