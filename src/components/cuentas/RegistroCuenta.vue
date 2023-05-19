<template>
  <q-card class="my-card" style="width: 550px">
    <!-- <pre>{{ editedFormItem }}</pre> -->
    <q-card-section class="bg-primary text-accent-contrast">
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
      <div class="text-subtitle1 text-accent-contrast">{{ actionName }}</div>
    </q-card-section>

    <q-card-section class="">
      <q-form @submit="saveItem" class="q-gutter-md">
        <div class="q-gutter-md">
          <div class="" v-if="tiposCuentaOptions.length > 1">
            <q-btn-toggle
              v-model="editedFormItem.tipoCuenta.id"
              spread
              no-caps
              color="primary"
              toggle-color="accent"
              toggle-text-color="accent-contrast"
              :options="tiposCuentaOptions"
              @update:model-value="tipoCuentaUpdated"
              push
              glossy
            />
          </div>
          <div class="column items-center" style="border: 0px solid red">
            <div
              class="q-gutter-lg q-mt-md"
              style="width: 70%; border: 0px solid red"
            >
              <div>
                <q-input
                  v-model="editedFormItem.nombre"
                  type="text"
                  label="Nombre"
                  dense
                  outlined
                  color="secondary"
                  autofocus
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Favor de ingresar el nombre de la Cuenta'
                  ]"
                />
              </div>
              <div class="">
                <CuentaContableSelect
                  v-model="editedFormItem.cuentaContable"
                  :subnivel="cuentaContableProps.subnivel"
                  :clasificacion="cuentaContableProps.clasificacion"
                  :tipo-afectacion="cuentaContableProps.tipoAfectacion"
                ></CuentaContableSelect>
              </div>
              <div>
                <q-input
                  v-model="editedFormItem.descripcion"
                  type="text"
                  label="Descripcion"
                  dense
                  outlined
                  color="secondary"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Favor de ingresar la descripción de la Cuenta'
                  ]"
                />
              </div>
            </div>
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
import { useQuery, useMutation } from '@vue/apollo-composable'
import { ref, reactive, computed, onMounted } from 'vue'
import {
  CUENTA_CREATE,
  CUENTA_UPDATE,
  LISTA_TIPOS_CUENTA
} from 'src/graphql/cuentas'
import CuentaContableSelect from '../formComponents/CuentaContableSelect.vue'

/**
 * state
 */
const formItem = ref({
  nombre: '',
  descripcion: '',
  cuentaContable: null,
  tipoCuenta: {
    id: '1'
  }
})

const cuentaContableProps = reactive({
  subnivel: 0,
  tipoAfectacion: 'C',
  clasificacion: ''
})

/**
 * GRAPHQL
 */
const graphql_options = ref({
  fetchPolicy: 'network-only'
})
const { result: resultTiposCuenta, onError: onErrorTiposCuenta } = useQuery(
  LISTA_TIPOS_CUENTA,
  null,
  graphql_options
)

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

onErrorTiposCuenta((error) => {
  console.error(error)
})
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
const tiposCuentaOptions = computed({
  get() {
    return editedFormItem.value.tipoCuenta.id === '3'
      ? resultTiposCuenta.value?.listaTiposCuenta.filter(
          (tipoCuenta) => tipoCuenta.id === editedFormItem.value.tipoCuenta.id
        ) ?? []
      : resultTiposCuenta.value?.listaTiposCuenta.filter(
          (tipoCuenta) => tipoCuenta.id != '3'
        ) ?? []
  }
})
const editedFormItem = computed({
  get() {
    return !!props.editedItem ? props.editedItem : formItem.value
  },
  set(val) {
    formItem.value = val
  }
})
const actionName = computed({
  get() {
    return !!editedFormItem.value.id
      ? 'Actualizar la Cuenta'
      : editedFormItem.value.tipoCuenta.id === '3'
      ? 'Nueva tarjeta'
      : 'Nueva Cuenta'
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
  obtenerCuentasContables(editedFormItem.value.tipoCuenta.id.toString())
})
/**
 * methods
 */
function saveItem() {
  console.log('save item')
  const cuenta_contable_id = editedFormItem.value.cuentaContable.id
  const tipo_cuenta_id = editedFormItem.value.tipoCuenta.id
  const input = {
    ...editedFormItem.value,
    cuentaContableId: parseInt(cuenta_contable_id),
    cuentaContable: undefined,
    tipoCuentaId: parseInt(tipo_cuenta_id),
    tipoCuenta: undefined,
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
function tipoCuentaUpdated(value) {
  obtenerCuentasContables(value)
}
function obtenerCuentasContables(value) {
  console.log('tipo ade cuenta acutalizado', value)
  switch (value) {
    case '1':
      cuentaContableProps.tipoAfectacion = 'C'
      cuentaContableProps.clasificacion = '112'
      break
    case '2':
      cuentaContableProps.tipoAfectacion = 'C'
      cuentaContableProps.clasificacion = '11100'
      break
    case '3':
      cuentaContableProps.tipoAfectacion = 'A'
      cuentaContableProps.clasificacion = '212'
      break
    default:
      break
  }
}
</script>

<style lang="sass" scoped>
.my-input
  max-width: 250px
</style>
