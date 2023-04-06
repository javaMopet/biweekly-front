<template>
  <q-card class="my-card" style="width: 400px">
    <q-card-section class="bg-primary text-white text-subtitle1">
      {{ actionName }}
      <!-- <pre>{{ props.editedItem }}</pre>
      <pre>{{ editedFormItem.tipoMovimientoId }}</pre> -->
      <!-- <pre>{{ editedFormItem }}</pre> -->
    </q-card-section>

    <q-card-section>
      <q-form @submit="saveItem" class="q-gutter-md">
        <div class="">
          <q-btn-toggle
            v-model="editedFormItem.tipoMovimientoId"
            rounded
            spread
            no-caps
            color="accent"
            toggle-color="accent-contrast"
            :options="tiposMovimientoOptions"
            @update:model-value="tipoMovimientoChange"
          />
        </div>
        <div>
          <!-- <q-btn-toggle
            name="tipoMovimiento"
            rounded
            unelevated
            spread
            no-caps
            v-model="editedFormItem.tipoMovimientoId"
            color="primary"
            toggle-color="accent-contrast"
            toggle-text-color="white"
            label="nombre"
            :options="tiposMovimientoOptions"
            @update:model-value="tipoMovimientoChange"
          /> -->
        </div>

        <div class="">
          <CategoriaSelect
            v-model="editedFormItem.detallesMovimiento[0].categoria"
            :tipoMovimientoId="editedFormItem.tipoMovimientoId"
          ></CategoriaSelect>
        </div>
        <div class="row">
          <div class="col q-px-md">
            <div class="col">
              <DateInput
                v-model="editedFormItem.date"
                lbl_field="Fecha"
              ></DateInput>
            </div>
          </div>
          <div class="col">
            <q-input
              v-model="editedFormItem.detallesMovimiento[0].importe"
              label="Importe"
              dense
              :rules="[(val) => !!val || 'Favor de ingresar el importe']"
              lazyRules
              filled
              mask="#.##"
              fill-mask
              reverse-fill-mask
              hint="Mask: #.00"
              input-class="text-right"
              clearable
            >
              <template #prepend> $ </template>
            </q-input>
          </div>
        </div>
        <div class="">
          <CuentaSelect
            v-model="editedFormItem.detallesMovimiento[1].cuenta"
          ></CuentaSelect>
        </div>

        <div>
          <q-input
            v-model="editedFormItem.observaciones"
            type="textarea"
            label="Obsevaciones"
            dense
            rows="3"
          />
        </div>
        <div class="col row justify-end q-gutter-x-md">
          <q-btn label="Cancelar" color="primary" flat v-close-popup dense />
          <q-btn :label="lblSubmit" dense type="submit" color="primary" />
        </div>
      </q-form>
    </q-card-section>
    <!-- <q-card-section class="q-gutter-sm" align="right">
      <q-btn color="primary" label="Cancelar" v-close-popup outline />
      <q-btn color="primary" label="Guardar" @click="saveItem" />
    </q-card-section> -->
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

import DateInput from '../formComponents/DateInput.vue'
import CategoriaSelect from '../formComponents/CategoriaSelect.vue'
import CuentaSelect from '../formComponents/CuentaSelect.vue'
import { useFormato } from 'src/composables/utils/useFormato'
import { DateTime } from 'luxon'
import { useSessionStore } from 'src/stores/sessionStore'
/**
 * composables
 */
const formato = useFormato()
const sessionStore = useSessionStore()
/**
 * state
 */

const defaultItem = {
  numero: null,
  estadoMovimientoId: parseInt(2),
  tipoMovimientoId: '1',
  fecha: null,
  date: formato.formatoFecha(new Date()),
  observaciones: '',
  userId: sessionStore.getUserId(),
  detallesMovimiento: [
    {
      importe: 0
    },
    {
      cuenta: null
    }
  ]
}
const formItem = ref({ ...defaultItem })
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
      : 'Nueva Movimiento'
  }
})
const lblSubmit = computed({
  get() {
    return !!editedFormItem.value.id ? 'Actualizar' : 'Guardar'
  }
})

/**
 * METHODS
 */

function tipoMovimientoChange(value) {
  // console.log('cambio en el tipo de movimiento', value)
  // editedFormItem.value.detallesMovimiento[0].categoria = null
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
function saveItem() {
  console.log('save item')
  const date = !!editedFormItem.value.date
    ? DateTime.fromFormat(editedFormItem.value.date, 'dd/MM/yyyy')
    : null

  const userId = sessionStore.getUserId()

  console.log('usuarioId', userId)

  const fecha = !!date ? date.toISODate() : null
  const detallesInput = JSON.parse(
    JSON.stringify(editedFormItem.value.detallesMovimiento)
  )
  const importe = parseFloat(detallesInput[0].importe)
  console.log('importe', importe)
  const input = {
    ...editedFormItem.value,
    detallesMovimiento: undefined,
    numero: 0,
    tipoMovimientoId: parseInt(editedFormItem.value.tipoMovimientoId),
    fecha,
    date: undefined,

    // cuentaContableId: parseInt(cuenta_contable_id),
    // tipoMovimientoId: parseInt(editedFormItem.value.tipoMovimientoId),

    __typename: undefined
  }

  // const input = JSON.parse(JSON.stringify(editedFormItem.value))
  // input.numero = 0
  // input.tipoMovimientoId = parseInt(editedFormItem.value.tipoMovimientoId)
  // input.fecha = date
  // input.date = undefined

  detallesInput.forEach((detalle) => {
    ;(detalle.importe = parseFloat(importe)),
      (detalle.categoriaId = !!detalle.categoria
        ? parseInt(detalle.categoria.id)
        : null)
    detalle.categoria = undefined
    ;(detalle.cuentaId = !!detalle.cuenta ? parseInt(detalle.cuenta.id) : null),
      (detalle.cuenta = undefined)
  })

  console.log('input...... ', input)
  console.log('detallesinput...... ', detallesInput)

  if (!editedFormItem.value.id) {
    console.log('guardando movimiento nueva', input)
    createMovimiento({
      input,
      detallesInput
    })
  } else {
    const id = editedFormItem.value.id
    console.log('actualizando movimiento', id, input)
    updateMovimiento({
      id,
      input
    })
  }
}

function registrarCuentaContable() {
  console.log('registrar una cuenta contable')
}
/**
 * GRAPHQL
 */
const options = ref({
  fetchPolicy: 'network-only'
})
const { onResult: onResultTiposMovimiento, result: resultTiposMovimiento } =
  useQuery(LISTA_TIPOS_MOVIMIENTO, null, options)

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
onErrorUpdateMovimiento((error) => {
  console.error(error)
})
</script>

<style lang="sass" scoped>
.my-input
  max-width: 250px
</style>
