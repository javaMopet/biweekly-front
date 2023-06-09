<template>
  <q-card class="my-card" style="width: 25vw">
    <q-card-section class="bg-main-menu row inline fit q-py-sm justify-between">
      <div class="text-h6 text-accent-light">{{ actionName }}</div>
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
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div class="column">
          <div class="row input-label">Fecha de registro:</div>
          <DateInput v-model="formEditedItem.fecha"></DateInput>

          <div class="row input-label">Concepto:</div>
          <q-input
            v-model="formEditedItem.concepto"
            type="textarea"
            label="Concepto"
            rows="3"
            outlined
            dense
            :rules="[(val) => !!val || 'Favor de ingresar el concepto']"
          />

          <div class="row input-label">Importe:</div>
          <PriceInput
            label="Importe"
            v-model="formEditedItem.importe"
          ></PriceInput>

          <div class="row input-label">Categoría:</div>
          <CategoriaSelect
            v-model="formEditedItem.categoria"
            :tipoMovimientoId="tipoMovimientoId"
            @update:model-value="onChangeCategoria"
            :readonly="true"
            :rules="[(val) => !!val || 'Selecciona una categoría']"
          ></CategoriaSelect>
          <div class="row">
            <q-checkbox
              right-label
              v-model="formEditedItem.isMsi"
              label="Meses sin Intereses"
            />
          </div>
          <div
            v-if="formEditedItem.isMsi"
            class="row inline q-gutter-x-sm items-center"
          >
            <div class="input-label">Número de meses:</div>
            <q-input
              v-model="formEditedItem.numero_msi"
              type="number"
              outlined
              dense
              style="width: 60px"
            />
          </div>
          <div class="column q-py-md">
            <div align="right" class="q-gutter-x-sm">
              <q-btn label="Cancelar" flat class="q-ml-sm" v-close-popup />
              <q-btn :label="lblSubmit" type="submit" color="secondary" />
            </div>
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DateInput from '../formComponents/DateInput.vue'
import PriceInput from '../formComponents/PriceInput.vue'
import CategoriaSelect from '../formComponents/CategoriaSelect.vue'
import { DateTime } from 'luxon'
import { useFormato } from 'src/composables/utils/useFormato'

/**
 * composables
 */
const formato = useFormato()

const tipoMovimientoId = ref('2')
const formEditedItem = ref({ fecha: '10/05/2023' })

/**
 * onMounted
 */
onMounted(() => {
  const now = DateTime.now()
  const formatoFecha = formato.formatoFecha(now)
  console.log('fecha', formatoFecha)
  formEditedItem.value = {
    fecha: formatoFecha,
    concepto: '',
    importe: '',
    categoria: null,
    isMsi: false,
    numero_msi: 3
  }
})

// const formEditedItem = computed({
//   get() {
//     return {
//       fecha: '10/11/2023',
//       categoria: {}
//     }
//   },
//   set(value) {
//     formItem.value = value
//   }
// })

function onSubmit() {
  console.log('onsubmit')
}
function onChangeCategoria() {
  // console.log(
  //   'Cambio de categoria',
  //   editedFormItem.value.categoria
  //   // editedFormItem.value.detallesMovimiento[0].categoria
  // )
  // const categoria = editedFormItem.value.categoria
  // const importe = categoria?.importe || ''
  // console.log('importe', importe)
  // editedFormItem.value.registro.importe = importe.toString()
  // editedFormItem.value.cuenta = categoria?.cuenta
}
/**
 * computed
 */
const actionName = computed({
  get() {
    return 'Nuevo Registro'
  }
})
const lblSubmit = computed({
  get() {
    return 'Guardar'
  }
})
</script>

<style lang="scss" scoped></style>
