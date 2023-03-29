<template>
  <q-card class="my-card" style="width: 400px">
    <q-card-section class="bg-primary text-accent-light">
      {{ actionName }}
    </q-card-section>

    <q-card-section class="">
      <q-form @submit.prevent="saveItem" class="q-gutter-md">
        <div class="q-gutter-md">
          <div>
            <q-input
              v-model="formItem.nombre"
              type="text"
              label="Nombre"
              dense
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Favor de ingresar el nombre de la Cuenta'
              ]"
            />
          </div>
          <div>
            <q-input
              v-model="formItem.descripcion"
              type="text"
              label="Descripcion"
              dense
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Favor de ingresar la descripción de la Cuenta'
              ]"
            />
          </div>
          <div>
            <q-select
              v-model="formItem.cuentaContable"
              :options="cuentasContablesOptions"
              label="Cuenta Contable"
              option-label="nombreCompleto"
              option-value="id"
              lazy-rules
              :rules="[
                (val) =>
                  (!!val && val.length > 0) ||
                  'Favor de seleccionar la Cuenta Contable'
              ]"
            />
          </div>
        </div>
        <div align="right" class="q-gutter-x-sm">
          <q-btn
            label="Cancelar"
            v-close-popup
            color="negative"
            flat
            class="q-ml-sm"
          />
          <q-btn label="Submit" type="submit" color="positive" />
        </div>
      </q-form>
    </q-card-section>
    <q-card-section class="q-gutter-sm" align="right"> </q-card-section>
  </q-card>
</template>

<script setup>
import { useLazyQuery } from '@vue/apollo-composable'
import { ref, computed, defineProps, onMounted } from 'vue'
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

const cuentasContablesOptions = ref([])
/**
 * props
 */
const props = defineProps({
  editedItem: {
    type: Object,
    required: false,
    default: () => {
      return {
        id: null
      }
    }
  }
})
/**
 * computed
 */
const editedFormItem = computed({
  get() {
    return props.editedItem
  },
  set(val) {
    formItem.value = val
  }
})
const actionName = computed({
  get() {
    return !!editedFormItem.value.id
      ? 'Actualizar la Cuenta Contable'
      : 'Nueva Cuenta Contable'
  }
})

/**
 * onMounted
 */
onMounted(() => {
  // cargarTiposCuenta()
  cargarCuentasContables(null, {
    subnivel: 0,
    clasificacion: '112'
  })
})
/**
 * methods
 */
function saveItem() {
  console.log('save item')
}

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
</script>

<style lang="sass" scoped>
.my-input
  max-width: 250px
</style>
