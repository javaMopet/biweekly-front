<template>
  <q-card class="my-card">
    <q-card-section>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-list bordered>
          <q-item clickable v-ripple>
            <q-item-section>
              <DateInput v-model="formEditedItem.fecha"></DateInput>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-input
                v-model="formEditedItem.concepto"
                type="textarea"
                label="Concepto"
                rows="2"
              />
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <CategoriaSelect
                v-model="formEditedItem.categoria"
                :tipoMovimientoId="tipoMovimientoId"
                @update:model-value="onChangeCategoria"
                :readonly="true"
              ></CategoriaSelect>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <PriceInput v-model="formEditedItem.importe"></PriceInput>
            </q-item-section>
          </q-item>
        </q-list>
        <div align="right">
          <q-btn
            label="Cancelar"
            color="primary"
            flat
            class="q-ml-sm"
            v-close-popup
          />
          <q-btn label="Submit" type="submit" color="primary" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import DateInput from '../formComponents/DateInput.vue'
import PriceInput from '../formComponents/PriceInput.vue'
import CategoriaSelect from '../formComponents/CategoriaSelect.vue'

const tipoMovimientoId = ref('2')
const formEditedItem = ref({ fecha: '10/05/2023' })

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
</script>

<style lang="scss" scoped></style>
