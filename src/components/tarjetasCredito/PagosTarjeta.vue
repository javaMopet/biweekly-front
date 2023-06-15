<template>
  <q-card class="my-card" style="width: 500px">
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
      <q-form @submit="generarPago" class="q-gutter-xs">
        <!-- <div class="column">
          <q-carousel
            v-model="formItem.cuenta_egreso"
            transition-prev="jump-right"
            transition-next="jump-left"
            swipeable
            animated
            control-color="purple"
            prev-icon="arrow_left"
            next-icon="arrow_right"
            navigation-icon="radio_button_unchecked"
            navigation
            padding
            arrows
            height="140px"
            class="text-dark shadow-1 rounded-borders"
          >
            <q-carousel-slide name="style" class="column no-wrap flex-center">
              <q-card class="my-card">
                <q-card-section avatar>
                  <q-avatar
                    size="50px"
                    font-size="52px"
                    color="teal"
                    text-color="white"
                    icon="directions"
                  />
                </q-card-section>
                <q-card-section right>
                  <div class="text-h6">Nómina HPM</div>
                  <div class="text-subtitle2">$1,500</div>
                </q-card-section>
              </q-card>
            </q-carousel-slide>
            <q-carousel-slide name="tv" class="column no-wrap flex-center">
              <q-icon name="live_tv" size="56px" />
              <div class="q-mt-md text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
              </div>
            </q-carousel-slide>
          </q-carousel>
        </div> -->
        <transition name="fade">
          <div class="row bg-pink-1" v-if="isNotPagable">
            <div class="column">
              <div class="row q-gutter-x-md q-pl-sm q-pt-sm">
                <q-icon name="warning" size="1.5rem" color="negative" />
                <span class="text-caption text-dark"
                  >No se ha realizado el cierre del periodo anterior:</span
                >
              </div>
              <q-list dense>
                <q-item :inset-level="0.5" dense>
                  <q-item-section
                    avatar
                    dense
                    style="min-width: 25px !important; width: 25px !important"
                  >
                    <q-icon color="primary" name="arrow_right" />
                  </q-item-section>
                  <q-item-section class="text-subtitle2"
                    >Saldo pendiente por un monto de
                    {{
                      formato.toCurrency(props.saldoPeriodoAnterior)
                    }}</q-item-section
                  >
                </q-item>
              </q-list>
            </div>
          </div>
        </transition>
        <q-separator spaced horizontal v-if="isNotPagable" />
        <div class="row q-mt-lg">
          <div class="col column q-mr-sm">
            <div class="row input-label">Fecha de pago:</div>
            <DateInput
              v-model="formItem.fecha"
              label="Introduce una fecha válida"
            ></DateInput>
          </div>
          <div class="col column q-ml-sm">
            <div class="row input-label">Saldo del periodo:</div>
            <PriceInput
              v-model="formItem.saldo_periodo"
              :readonly="true"
            ></PriceInput>
          </div>
        </div>
        <div class="column">
          <div class="row input-label">Cuenta de egreso:</div>
          <CuentaSelect
            v-model="formItem.cuenta_egreso"
            :rules="[(val) => !!val || 'Favor de ingresar la cuenta de egreso']"
          ></CuentaSelect>
        </div>
        <div align="right">
          <q-btn
            label="Cancelar"
            color="primary"
            flat
            class="q-ml-sm"
            v-close-popup
          />
          <q-btn
            label="Pagar"
            type="submit"
            color="primary-button"
            :disable="isNotPagable"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CuentaSelect from '../formComponents/CuentaSelect.vue'
import DateInput from '../formComponents/DateInput.vue'
import PriceInput from '../formComponents/PriceInput.vue'
import { useFormato } from 'src/composables/utils/useFormato'
/**
 * composables
 */
const formato = useFormato()
/**
 * state
 */
const formItem = ref({
  fecha: '13/06/2023',
  cuenta_egreso: null,
  saldo_periodo: ''
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
 * onMounted
 */
onMounted(() => {
  formItem.value.saldo_periodo = props.sumaMovimientos.toString()
})
/**
 * funciones
 */
function generarPago() {
  console.log('Generando el pago de la tarjeta')
}
/**
 * computed
 */
const isNotPagable = computed({
  get() {
    return props.saldoPeriodoAnterior > 0
  }
})
</script>

<style lang="scss" scoped></style>
