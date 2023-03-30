<template>
  <q-card class="my-card" style="width: 400px">
    <q-card-section class="bg-primary text-accent-light">
      {{ actionName }}
      <!-- <pre>{{ editedIndex }}</pre> -->
      <!-- <pre>{{ editedItem }}</pre> -->
    </q-card-section>

    <q-card-section class="">
      <q-form @submit="saveItem" class="q-gutter-md">
        <div class="q-gutter-md">
          <div>
            <q-input
              v-model="editedFormItem.nombre"
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
              v-model="editedFormItem.descripcion"
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
              v-model="editedFormItem.cuentaContable"
              :options="cuentasContablesOptions"
              label="Cuenta Contable"
              option-label="nombreCompleto"
              option-value="id"
              lazy-rules
              :rules="[selectValidation]"
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
          <q-btn :label="lblSubmit" type="submit" color="positive" />
        </div>
      </q-form>
    </q-card-section>
    <q-card-section class="q-gutter-sm" align="right"> </q-card-section>
  </q-card>
</template>

<script setup>
import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue'
import { LISTA_CUENTAS_CONTABLES } from 'src/graphql/cuentasContableGql'
import { CUENTA_CREATE, CUENTA_UPDATE } from 'src/graphql/cuentas'

/**
 * state
 */
const formItem = ref({
  nombre: '',
  descripcion: '',
  cuentaContable: ''
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
  },
  editedIndex: {
    type: Number,
    required: false,
    default: -1
  }
})
/**
 * emits
 */
const emit = defineEmits(['cuentaSaved', 'cuentaUpdated'])
/**
 * computed
 */
const editedFormItem = computed({
  get() {
    return !!props.editedItem.id ? props.editedItem : formItem.value
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
const lblSubmit = computed({
  get() {
    return !!editedFormItem.value.id ? 'Actualizar' : 'Guardar'
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
  const cuenta_contable_id = editedFormItem.value.cuentaContable.id
  const input = {
    ...editedFormItem.value,
    cuentaContableId: parseInt(cuenta_contable_id),
    cuentaContable: undefined,
    __typename: undefined
  }
  if (!editedFormItem.value.id) {
    console.log('guardando cuenta nueva', input)
    createCuenta({
      input
    })
  } else {
    const id = editedFormItem.value.id
    console.log('actualizando cuenta', id, input)
    updateCuenta({
      id,
      input
    })
  }
}
const selectValidation = (val) => {
  if (!val) {
    return `Favor de seleccionar un valor.`
  }
}

/**
 * GRAPHQL
 */

const {
  mutate: createCuenta,
  onDone: onDoneCreateCuenta,
  onError: onErrorCreateCuenta
} = useMutation(CUENTA_CREATE)
const {
  mutate: updateCuenta,
  onDone: onDoneUpdateCuenta,
  onError: onErrorUpdateCuenta
} = useMutation(CUENTA_UPDATE)

const {
  load: cargarCuentasContables,
  onResult: onResultCuentasContables,
  onError: onErrorCuentasContables
} = useLazyQuery(LISTA_CUENTAS_CONTABLES)

onResultCuentasContables(({ data }) => {
  if (!!data) {
    cuentasContablesOptions.value = data.listaCuentasContables
  }
})
onErrorCuentasContables((response) => {
  if (!!response) {
    console.log('data', response)
  }
})
onDoneCreateCuenta(({ data }) => {
  console.log('saved data...', data)
  if (!!data) {
    const itemSaved = data.cuentaCreate.cuenta
    emit('cuentaSaved', itemSaved)
  }
})
onErrorCreateCuenta((error) => {
  console.log(error)
  console.error(error)
})
onDoneUpdateCuenta(({ data }) => {
  if (!!data) {
    console.log('updated data...', data)
    const itemUpdated = data.cuentaUpdate.cuenta
    emit('cuentaUpdated', itemUpdated)
  }
})
onErrorUpdateCuenta((error) => {
  console.error(error)
})
</script>

<style lang="sass" scoped>
.my-input
  max-width: 250px
</style>
