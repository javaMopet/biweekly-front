<template>
  <q-card class="my-card" style="width: 400px">
    <q-card-section class="bg-primary text-secondary">
      Nueva CuentaContable
    </q-card-section>

    <q-card-section class="">
      <div class="q-gutter-md">
        <div>
          <q-input
            v-model="formItem.id"
            type="text"
            label="Id"
            dense
            maxlength="4"
          />
        </div>
        <div>
          <q-input v-model="formItem.nombre" type="text" label="Nombre" dense />
        </div>
        <div>
          <q-input
            v-model="formItem.subnivel"
            type="number"
            label="Subnivel"
            dense
          />
        </div>
        <div>
          <q-input
            v-model="formItem.padre"
            type="text"
            label="Cuenta Padre"
            dense
          />
        </div>

        <div>
          <q-select
            v-model="formItem.tipoAfectacion"
            :options="tiposAfectacionOptions"
            label="Tipo de Afectación"
            option-label="nombre"
            option-value="id"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-gutter-sm" align="right">
      <q-btn color="primary" label="Cancelar" v-close-popup outline />
      <q-btn color="primary" icon="check" label="Guardar" @click="saveItem" />
    </q-card-section>
  </q-card>

  <teleport to="body">
    <q-dialog v-model="show_icon_picker">
      <q-card
        class="my-card"
        style="max-height: 65vh; max-width: 60vw; width: 900px"
      >
        <q-card-section>
          <IconPicker
            @onClose="cancelIconPicker"
            @onIconSelected="onIconSelected"
          ></IconPicker>
        </q-card-section>
      </q-card>
    </q-dialog>
  </teleport>
</template>

<script setup>
import { useLazyQuery } from '@vue/apollo-composable'
import { ref, onMounted } from 'vue'

import IconPicker from '/src/components/IconPicker.vue'
/**
 * state
 */
const formItem = ref({
  id: '',
  nombre: '',
  subnivel: 0,
  padre: ''
})

const tiposAfectacionOptions = ref([
  { id: 'C', nombre: 'Cargo' },
  { id: 'A', nombre: 'Abono' }
])

const tiposCuentaContableOptions = ref([])
const cuentasContablesOptions = ref([])
/**
 * onMounted
 */
onMounted(() => {
  // cargarTiposCuentaContable()
  // cargarCuentasContables()
})

// const {
//   load: cargarTiposCuentaContable,
//   onResult: onResultTiposCuentaContable
// } = useLazyQuery(LISTA_TIPOS_CATEGORIA)
// const { load: cargarCuentasContables, onResult: onResultCuentasContables } =
//   useLazyQuery(LISTA_CUENTAS_CONTABLES)

// onResultTiposCuentaContable(({ data }) => {
//   if (!!data) {
//     console.log('data', data.listaTiposCuentaContable)
//     tiposCuentaContableOptions.value = data.listaTiposCuentaContable
//   }
// })

// onResultCuentasContables(({ data }) => {
//   if (!!data) {
//     console.log('data', data)
//     cuentasContablesOptions.value = data.listaCuentasContables
//   }
// })

function saveItem() {
  console.log('save item')
}

/**
 * icon picker
 */
const show_icon_picker = ref(false)
function cancelIconPicker() {
  show_icon_picker.value = false
}
function selectIcon() {
  show_icon_picker.value = true
}
function onIconSelected(value) {
  console.log('IconoSeleccionado', value)
  formItem.value.icono = value
  show_icon_picker.value = false
}
</script>

<style lang="sass" scoped>
.my-input
  max-width: 250px
</style>
