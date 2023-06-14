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
        <span>Periodo:</span>
        <span>{{ saldoPeriodoAnterior }}</span>
      </div>
      <div class="row">
        <span>Importe pagado:</span>
        <span>{{ props.sumaMovimientos }}</span>
      </div>
      <q-separator spaced inset horizontal />
      <q-form @submit="generarPago" class="q-gutter-xs">
        <div class="col column">
          <div class="row input-label">Fecha de pago:</div>
          <DateInput
            v-model="formItem.fecha"
            label="Introduce una fecha válida"
          ></DateInput>
        </div>
        <div class="col column">
          <div class="row input-label">Cuenta:</div>
          <CuentaSelect v-model="formItem.cuenta_egreso"></CuentaSelect>
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
import DateInput from '../formComponents/DateInput.vue'

/**
 * state
 */
const formItem = ref({
  fecha: '13/06/2023'
})
/**
 * props
 */
const props = defineProps({
  cuenta: {
    type: Object,
    required: true
  },
  saldoPeriodoAnterior: {
    type: Number,
    required: true
  },
  sumaMovimientos: {
    type: Number,
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
