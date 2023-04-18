<template>
  <q-card class="my-card" style="width: 520px">
    <q-card-section class="bg-primary text-accent-light text-subtitle1">
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
      <div class="text-subtitle1 text-accent-light">{{ actionName }}</div>
      <!-- <pre>{{ editedFormItem.detallesMovimiento[0] }}</pre> -->
    </q-card-section>

    <q-card-section>
      <q-form @submit="saveItem" class="q-gutter-md">
        <div class="">
          <q-btn-toggle
            v-model="tipoMovimiento"
            spread
            no-caps
            color="primary"
            toggle-color="accent"
            toggle-text-color="accent-contrast"
            :options="tiposMovimientoOptions"
            @update:model-value="onChangeTipoMovimiento"
            push
            glossy
          />
        </div>
        <div></div>

        <div class="">
          <CuentaSelect
            v-if="isTransferencia"
            v-model="cuentaOrigen"
            label="Cuenta Origen"
          ></CuentaSelect>
          <CategoriaSelect
            v-else
            v-model="editedFormItem.categoria"
            :tipoMovimientoId="tipoMovimiento"
            @update:model-value="onChangeCategoria"
          ></CategoriaSelect>
        </div>
        <div class="row">
          <div class="col">
            <DateInput
              v-model="editedFormItem.registro.date"
              lbl_field="Fecha"
              :opcional="false"
            ></DateInput>
          </div>
          <div class="col">
            <PriceInput
              currency-code="MNX"
              v-model="editedFormItem.registro.importe"
              :opcional="false"
            ></PriceInput>
          </div>
        </div>
        <div class="">
          <CuentaSelect v-model="editedFormItem.cuenta"></CuentaSelect>
        </div>

        <div>
          <q-input
            v-model="editedFormItem.observaciones"
            type="textarea"
            label="Obsevaciones"
            dense
            rows="3"
            outlined
            color="secondary"
          />
        </div>
        <div class="col row justify-end q-gutter-x-md">
          <q-btn label="Cancelar" color="negative" flat v-close-popup dense />
          <q-btn :label="lblSubmit" dense type="submit" color="positive" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuery, useMutation } from '@vue/apollo-composable'
import { ref, computed, onMounted } from 'vue'
import {
  LISTA_TIPOS_MOVIMIENTO,
  MOVIMIENTO_CREATE,
  MOVIMIENTO_UPDATE
} from '/src/graphql/movimientos'
import { INGRESO_CREATE } from 'src/graphql/ingresos'
import { EGRESO_CREATE } from 'src/graphql/egresos'
import { TRANSFERENCIA_CREATE } from 'src/graphql/transferencias'

import DateInput from '../formComponents/DateInput.vue'
import CategoriaSelect from '../formComponents/CategoriaSelect.vue'
import CuentaSelect from '../formComponents/CuentaSelect.vue'
import { useFormato } from 'src/composables/utils/useFormato'
import { DateTime } from 'luxon'
import { useSessionStore } from 'src/stores/sessionStore'
import PriceInput from '../formComponents/PriceInput.vue'
/**
 * composables
 */
const formato = useFormato()
const sessionStore = useSessionStore()
/**
 * state
 */

// const defaultItem = {
//   numero: null,
//   estadoMovimientoId: parseInt(2),
//   tipoMovimientoId: '1',
//   fecha: null,
//   date: formato.formatoFecha(new Date()),
//   observaciones: '',
//   userId: sessionStore.getUserId(),
//   detallesMovimiento: [
//     {
//       importe: ''
//     },
//     {
//       cuenta: null
//     }
//   ]
// }
const defaultItem = {
  categoria: {},
  cuenta: {},
  registro: {
    estadoRegistroId: 2,
    importe: '',
    fecha: '',
    date: formato.formatoFecha(new Date())
  },
  observaciones: ''
}

const formItem = ref({ ...defaultItem })
const tipoMovimiento = ref('1')
const cuentaOrigen = ref({})
const cuentasContablesOptions = ref([])
const categoria = ref(null)

/**
 * onMounted
 */
onMounted(() => {
  // console.log('tipoMovimientoId', editedFormItem.value.tipoMovimientoId)
  // cargarTiposMovimiento()
  // cargarCuentasContables(null, {
  //   subnivel: 0,
  //   clasificacion: '5'
  // })
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
const emit = defineEmits(['movimientoSaved', 'movimientoUpdated'])
/**
 * computed
 */
const tiposMovimientoOptions = computed({
  get() {
    return resultTiposMovimiento.value?.listaTiposMovimiento ?? []
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
      ? 'Actualizar Movimiento'
      : 'Nuevo Movimiento'
  }
})
const lblSubmit = computed({
  get() {
    return !!editedFormItem.value.id ? 'Actualizar' : 'Guardar'
  }
})
const isTransferencia = computed({
  get() {
    return tipoMovimiento.value === '3'
  }
})

/**
 * METHODS
 */

function onChangeTipoMovimiento(value) {
  console.log('onChange tipo de movimiento:', value)
  // if (value === '1') {
  //   console.log('Cargar categorias de ingreso')
  //   // categorias
  //   cargarCuentasContables(null, {
  //     subnivel: 0,
  //     clasificacion: '4'
  //   })
  // } else if (value === '2') {
  //   console.log('Cargar categorias de egreso')
  //   cargarCuentasContables(null, {
  //     subnivel: 0,
  //     clasificacion: '5'
  //   })
  // } else {
  //   console.log('cargar todas las cuentas ')
  //   cargarCuentasContables(null, {
  //     subnivel: 0,
  //     clasificacion: ''
  //   })
  // }
}
function formByTipoMovimiento(tipoMovimientoId) {
  switch (tipoMovimientoId) {
    case value:
      break

    default:
      break
  }
}
// function saveItem() {
//   console.log('save item')

//   const userId = sessionStore.getUserId()

//   console.log('usuarioId', userId)

//   const detallesInput = JSON.parse(
//     JSON.stringify(editedFormItem.value.detallesMovimiento)
//   )
//   const importe = parseFloat(detallesInput[0].importe)
//   console.log('importe', importe)
//   const input = {
//     ...editedFormItem.value,
//     detallesMovimiento: undefined,
//     numero: 0,
//     tipoMovimientoId: parseInt(editedFormItem.value.tipoMovimientoId),
//     fecha,
//     date: undefined,

//     // cuentaContableId: parseInt(cuenta_contable_id),
//     // tipoMovimientoId: parseInt(editedFormItem.value.tipoMovimientoId),

//     __typename: undefined
//   }

//   // const input = JSON.parse(JSON.stringify(editedFormItem.value))
//   // input.numero = 0
//   // input.tipoMovimientoId = parseInt(editedFormItem.value.tipoMovimientoId)
//   // input.fecha = date
//   // input.date = undefined

//   detallesInput.forEach((detalle) => {
//     ;(detalle.importe = parseFloat(importe)),
//       (detalle.categoriaId = !!detalle.categoria
//         ? parseInt(detalle.categoria.id)
//         : null)
//     detalle.categoria = undefined
//     ;(detalle.cuentaId = !!detalle.cuenta ? parseInt(detalle.cuenta.id) : null),
//       (detalle.cuenta = undefined)
//   })

//   console.log('input...... ', input)
//   console.log('detallesinput...... ', detallesInput)

//   if (!editedFormItem.value.id) {
//     console.log('guardando movimiento nueva', input)
//     createMovimiento({
//       input,
//       detallesInput
//     })
//   } else {
//     const id = editedFormItem.value.id
//     console.log('actualizando movimiento', id, input)
//     updateMovimiento({
//       id,
//       input
//     })
//   }
// }

function saveItem() {
  const input = {
    ...editedFormItem.value,
    categoriaId: parseInt(editedFormItem.value.categoria.id),
    categoria: undefined,
    cuentaId: parseInt(editedFormItem.value.cuenta.id),
    cuenta: undefined,
    registro: {
      importe: parseFloat(editedFormItem.value.registro.importe),
      fecha: obtenerFechaISO()
    },
    date: undefined,
    tipoMovimientoId: undefined
  }
  console.log('saveItem input:', input)
  console.log('saveItem tipoMovimiento:', tipoMovimiento.value)
  switch (tipoMovimiento.value) {
    case '1':
      console.log('guardando ingreso')
      createIngreso({ input })
      break
    case '2':
      console.log('guardando ingreso')
      createEgreso({ input })
      break
    case '3':
      console.log('guardando transferencia')
      createTransferencia({ input })
      break

    default:
      break
  }
}
function obtenerFechaISO() {
  console.log('Obteniendo fecha:', editedFormItem.value.registro.date)
  const date = !!editedFormItem.value.registro.date
    ? DateTime.fromFormat(editedFormItem.value.registro.date, 'dd/MM/yyyy')
    : null
  const fecha = date?.toISODate()
  console.log('fecha regresada', fecha)
  return fecha
}

function registrarCuentaContable() {
  console.log('registrar una cuenta contable')
}
function onChangeCategoria() {
  console.log(
    'Cambio de categoria',
    editedFormItem.value.categoria
    // editedFormItem.value.detallesMovimiento[0].categoria
  )
  const categoria = editedFormItem.value.categoria
  const importe = categoria?.importe || ''
  console.log('importe', importe)
  editedFormItem.value.registro.importe = importe.toString()
  editedFormItem.value.cuenta = categoria?.cuenta
}
/**
 * GRAPHQL
 */
const options = ref({
  fetchPolicy: 'network-only'
})
const { onResult: onResultTiposMovimiento, result: resultTiposMovimiento } =
  useQuery(LISTA_TIPOS_MOVIMIENTO, null, options)

const {
  mutate: createIngreso,
  onDone: onDoneCreateIngreso,
  onError: onErrorCreateIngreso
} = useMutation(INGRESO_CREATE)
const {
  mutate: createEgreso,
  onDone: onDoneCreateEgreso,
  onError: onErrorCreateEgreso
} = useMutation(EGRESO_CREATE)
const {
  mutate: createTransferencia,
  onDone: onDoneCreateTransferencia,
  onError: onErrorCreateTransferencia
} = useMutation(TRANSFERENCIA_CREATE)

// const { load: cargarCuentasContables, onResult: onResultCuentasContables } =
//   useLazyQuery(LISTA_CUENTAS_CONTABLES)

// onResultTiposMovimiento(({ data }) => {
//   if (!!data) {
//     console.log('data', data.listaTiposMovimiento)
//     tiposMovimientoOptions.value = data.listaTiposMovimiento
//   }
// })

// onResultCuentasContables(({ data }) => {
//   if (!!data) {
//     console.log('data', data)
//     cuentasContablesOptions.value = JSON.parse(
//       JSON.stringify(data.listaCuentasContables)
//     )
//   }
// })
const {
  mutate: createMovimiento,
  onDone: onDoneCreateMovimiento,
  onError: onErrorCreateMovimiento
} = useMutation(MOVIMIENTO_CREATE)
const {
  mutate: updateMovimiento,
  onDone: onDoneUpdateMovimiento,
  onError: onErrorUpdateMovimiento
} = useMutation(MOVIMIENTO_UPDATE)

onDoneCreateMovimiento(({ data }) => {
  console.log('saved data...', data)
  if (!!data) {
    const itemSaved = data.movimientoCreate.movimiento
    emit('movimientoSaved', itemSaved)
  }
})
onErrorCreateMovimiento((error) => {
  console.error(error)
})
onDoneUpdateMovimiento(({ data }) => {
  if (!!data) {
    console.log('updated data...', data)
    const itemUpdated = data.movimientoUpdate.movimiento
    emit('movimientoUpdated', itemUpdated)
  }
})
onDoneCreateIngreso(({ data }) => {
  console.log('Ingreso creado data', data)
})
onDoneCreateEgreso(({ data }) => {
  console.log('Egreso creado data', data)
})
onDoneCreateTransferencia(({ data }) => {
  console.log('Egreso creado data', data)
})
onErrorUpdateMovimiento((error) => {
  console.error(error)
})
onErrorCreateIngreso((error) => {
  console.error(error)
})
onErrorCreateEgreso((error) => {
  console.error(error)
})
onErrorCreateTransferencia((error) => {
  console.error(error)
})
</script>

<style lang="sass" scoped>
.my-input
  max-width: 250px
</style>
