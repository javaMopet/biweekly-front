<template>
  <q-card class="my-card" style="width: 40vw">
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
    <q-card-section class="">
      <q-form @submit="saveItem" class="q-gutter-md">
        <div class="q-gutter-md">
          <div class="" v-if="tiposCuentaOptions.length > 1">
            <q-btn-toggle
              v-model="editedFormItem.tipoCuenta.id"
              spread
              no-caps
              color="grey-4"
              text-color="grey-7"
              toggle-color="green-4"
              toggle-text-color="white"
              :options="tiposCuentaOptions"
              @update:model-value="tipoCuentaUpdated"
              push
              glossy
            />
          </div>
          <div class="column items-center q-gutter-y-md">
            <div
              class="q-gutter-xs q-mt-xs"
              style="width: 70%; border: 0px solid red"
            >
              <div>
                <div class="row item-label">Nombre de la tarjeta:</div>
                <q-input
                  v-model="editedFormItem.nombre"
                  type="text"
                  label="Ingresa el nombre"
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
              <div>
                <div class="row item-label">Número de cuenta:</div>
                <q-input
                  v-model="editedFormItem.identificador"
                  type="text"
                  label="Terminación del número de cuenta"
                  outlined
                  dense
                  :rules="[
                    (val) =>
                      (!!val && val.length == 4) ||
                      'Favor de ingresar los últimos 4 dígitos de la cuenta'
                  ]"
                  mask="####"
                ></q-input>
                <div class="">
                  <div class="row input-label">Cuenta Contable:</div>
                  <CuentaContableSelect
                    v-model="editedFormItem.cuentaContable"
                    :subnivel="cuentaContableProps.subnivel"
                    :clasificacion="cuentaContableProps.clasificacion"
                    :tipo-afectacion="cuentaContableProps.tipoAfectacion"
                    :rules="[(val) => !!val || 'Required']"
                    :is-alta="false"
                    input-label="Seleccione una Cuenta Contable"
                  ></CuentaContableSelect>
                </div>
              </div>
              <div class="row inline items-center q-gutter-x-md fit">
                <div class="col-3 input-label">Día de corte:</div>
                <div class="">
                  <q-input
                    v-model="editedFormItem.diaCorte"
                    type="number"
                    label="Ingresa un día del mes"
                    dense
                    lazy-rules
                    :rules="[
                      (val) =>
                        (!!val && val > 0 && val <= 31) ||
                        'Ingresa un día del mes válido'
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
              color=""
              flat
              class="q-ml-sm"
              dense
            />
            <q-btn :label="lblSubmit" type="submit" dense color="green-4" />
          </div>
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
  identificador: '',
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
  console.log('save item', editedFormItem.value)
  const cuenta_contable_id = editedFormItem.value.cuentaContable.id
  const tipo_cuenta_id = editedFormItem.value.tipoCuenta.id
  const input = {
    ...editedFormItem.value,
    cuentaContableId: parseInt(cuenta_contable_id),
    cuentaContable: undefined,
    tipoCuentaId: parseInt(tipo_cuenta_id),
    diaCorte: parseInt(editedFormItem.value.diaCorte),
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

<style lang="scss" scoped>
.input-label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: -0.025rem;
}
</style>
