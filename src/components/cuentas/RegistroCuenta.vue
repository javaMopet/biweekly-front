<template>
  <q-card
    class="my-card"
    style="width: 450px; height: 560px; min-height: 560px"
  >
    <q-card-section class="row justify-between items-start dialog-title">
      <div class="dialog__title--name">{{ actionName }}</div>
      <div class="">
        <q-btn
          round
          icon="close"
          class="dialog__title--closeButton"
          v-close-popup
        ></q-btn>
      </div>
    </q-card-section>
    <q-card-section class="">
      <q-form @submit="saveItem" class="">
        <div class="q-gutter-xs">
          <div class="q-my-md" v-if="tiposCuentaOptions.length > 1">
            <q-btn-toggle
              v-model="editedFormItem.tipoCuenta.id"
              spread
              no-caps
              color="disable-button"
              text-color="gray-2"
              toggle-color="toggle-button"
              toggle-text-color="accent-light"
              :options="tiposCuentaOptions"
              @update:model-value="tipoCuentaUpdated"
              push
            />
          </div>
          <div class="column items-center">
            <div
              class="q-gutter-xs q-mt-xs"
              style="width: 85%; border: 0px solid red"
            >
              <div>
                <div class="row input-label items-center">
                  * {{ lbl_nombre }}
                </div>
                <q-input
                  v-model="editedFormItem.nombre"
                  type="text"
                  placeholder="Ingresa el nombre"
                  dense
                  outlined
                  color="positive"
                  autofocus
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Favor de ingresar el nombre de la Cuenta'
                  ]"
                />
              </div>
              <div v-if="isBancoRequerido">
                <div>
                  <div class="row input-label">Banco:</div>
                  <BancoSelect v-model="editedFormItem.banco"></BancoSelect>
                </div>
                <div class="row input-label">* Número de cuenta:</div>
                <q-input
                  v-model="editedFormItem.identificador"
                  type="text"
                  label="Terminación del número de cuenta"
                  outlined
                  color="positive"
                  dense
                  :rules="[
                    (val) =>
                      (!!val && val.length == 4) ||
                      'Favor de ingresar los últimos 4 dígitos de la cuenta'
                  ]"
                  mask="####"
                ></q-input>
              </div>

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
              <div class="column" v-if="isDiaCorteRequired">
                <div class="col-3 input-label">Día de corte:</div>
                <div class="">
                  <q-input
                    v-model="editedFormItem.diaCorte"
                    outlined
                    style="width: 100px"
                    type="number"
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
          <div align="right" class="q-gutter-x-sm q-mt-md">
            <q-btn
              label="Cancelar"
              v-close-popup
              color=""
              outline
              class="q-ml-sm"
              push
            />
            <q-btn
              :label="lblSubmit"
              type="submit"
              push
              color="primary-button"
            />
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
import BancoSelect from '../formComponents/BancoSelect.vue'

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
      ? 'Nueva tarjeta de crédito'
      : 'Nueva Cuenta'
  }
})
const lbl_nombre = computed({
  get() {
    return !!editedFormItem.value.tipoCuenta.id
      ? editedFormItem.value.tipoCuenta.id === '3'
        ? 'Nombre de la tarjeta:'
        : 'Nombre de la cuenta:'
      : ''
  }
})
const lblSubmit = computed({
  get() {
    return !!editedFormItem.value.id ? 'Actualizar' : 'Guardar'
  }
})

const isDiaCorteRequired = computed({
  get() {
    return editedFormItem.value.tipoCuenta.id === '3'
  }
})
const isBancoRequerido = computed({
  get() {
    return editedFormItem.value.tipoCuenta.id !== '2'
  }
})
const isCuentaBancariaRequerida = computed({
  get() {
    return editedFormItem.value.tipoCuenta.id === '1'
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
  const bancoId = !!editedFormItem.value.banco
    ? editedFormItem.value.banco.id
    : undefined
  const identificador = !!editedFormItem.value.identificador
    ? editedFormItem.value.identificador
    : ''
  const input = {
    ...editedFormItem.value,
    identificador,
    cuentaContableId: parseInt(cuenta_contable_id),
    cuentaContable: undefined,
    tipoCuentaId: parseInt(tipo_cuenta_id),
    bancoId,
    diaCorte: parseInt(editedFormItem.value.diaCorte),
    banco: undefined,
    tipoCuenta: undefined,
    __typename: undefined
  }
  if (!editedFormItem.value.id) {
    console.log('guardando cuenta nueva', input)
    input.saldo = parseFloat(0)
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
  console.log('tipo de cuenta actualizado', value)
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

<style lang="scss">
.input-label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: -0.025rem;
}
</style>
