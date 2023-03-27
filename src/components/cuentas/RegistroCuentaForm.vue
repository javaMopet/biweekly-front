<template>
  <q-card class="my-card" style="width: 400px">
    <q-card-section class="bg-primary text-secondary">
      Nueva Cuenta
    </q-card-section>

    <q-card-section class="">
      <div class="q-gutter-md">
        <div>
          <q-input v-model="formItem.nombre" type="text" label="Nombre" dense />
        </div>
        <div>
          <q-input
            v-model="formItem.descripcion"
            type="text"
            label="Descripcion"
            dense
          />
        </div>
        <div>
          <q-select
            v-model="formItem.cuenta_contable"
            :options="cuentasContablesOptions"
            label="Cuenta Contable"
            option-label="nombreCompleto"
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
import { LISTA_CUENTAS_CONTABLES } from 'src/graphql/cuentasContableGql'
/**
 * state
 */
const formItem = ref({
  nombre: '',
  icono: '',
  descripcion: '',
  color: ''
})
const tiposCuentaOptions = ref([])
const cuentasContablesOptions = ref([])
/**
 * onMounted
 */
onMounted(() => {
  // cargarTiposCuenta()
  cargarCuentasContables(null, {
    subnivel: 0
  })
})

// const { load: cargarTiposCuenta, onResult: onResultTiposCuenta } = useLazyQuery(
//   LISTA_TIPOS_CATEGORIA
// )
const {
  load: cargarCuentasContables,
  onResult: onResultCuentasContables,
  onError: onErrorCuentasContables
} = useLazyQuery(LISTA_CUENTAS_CONTABLES)

// onResultTiposCuenta(({ data }) => {
//   if (!!data) {
//     console.log('data', data.listaTiposCuenta)
//     tiposCuentaOptions.value = data.listaTiposCuenta
//   }
// })

onResultCuentasContables(({ data }) => {
  if (!!data) {
    console.log('data', data)
    cuentasContablesOptions.value = data.listaCuentasContables
  }
})
onErrorCuentasContables((response) => {
  if (!!response) {
    console.log('data', response)
  }
})

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
