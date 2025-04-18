<template>
  <div class="my-card" style="width: 630px; min-width: 630px">
    <DialogTitle>{{ actionName }}</DialogTitle>
    <div class="q-px-xl q-pb-lg">
      <!-- form-componente__body -->
      <q-form @submit="saveItem" class="q-gutter-y-md">
        <div class="q-py-lg">
          <q-btn-toggle
            v-model="editedFormItem.tipoMovimientoId"
            spread
            no-caps
            color="disable-button"
            text-color="gray-2"
            :toggle-color="active_color"
            toggle-text-color="toggle-text-button"
            :options="tipoMovimientoStore.listaTiposMovimiento"
            @update:model-value="onChangeTipoMovimiento"
            push
          />
        </div>
        <div class="" style="min-height: 60px">
          <SelectCuenta
            v-model="editedFormItem.cuenta"
            :readonly="cuentaReadOnly"
            :label="lblCuentaOrigen"
          ></SelectCuenta>
        </div>
        <div class="">
          <SelectCuenta
            v-if="isTraspaso"
            v-model="editedFormItem.cuentaDestino"
            label="Cuenta Destino"
            :readonly="isEditing"
            :filter-array="['1', '2']"
            :filter-id-array="filterIdArray"
            :rules="[(val) => !!val || 'Favor de ingresar la cuenta destino']"
            :autofocus="!autofocusCategoria"
          ></SelectCuenta>
        </div>
        <div>
          <CategoriaSelect
            v-if="!isTraspaso"
            v-model="editedFormItem.categoria"
            :tipo-afectacion="editedFormItem.tipoAfectacion"
            :is-cambiable="false"
            @update:model-value="onSelectCategoria"
            :rules="[(val) => !!val || 'Favor de ingresar la categoria']"
            :agregar="true"
            :autofocus="autofocusCategoria"
          ></CategoriaSelect>
        </div>
        <div class="row vertical-bottom" style="border: 0px solid red">
          <div class="col q-mr-sm">
            <PriceInput
              currency-code="MNX"
              v-model="editedFormItem.importe"
              :opcional="false"
              label="Importe traspaso:"
              :rules="[
                (val) =>
                  (!!val &&
                    val !== '0' &&
                    val !== '$0.00' &&
                    val !== '$NaN.undefined') ||
                  'Favor de ingresar un valor mayor a cero'
              ]"
            ></PriceInput>
          </div>
          <div class="col q-ml-sm">
            <DateInput
              v-model="editedFormItem.fecha"
              lbl_field="Fecha"
              :opcional="false"
              :rules="[(val) => !!val || 'Favor de ingresar la fecha']"
            ></DateInput>
          </div>
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
          <!-- <q-btn
            label="Cancelar"
            flat
            v-close-popup
            color="negative-pastel"
            push
            no-caps
          /> -->
          <q-btn
            :label="lblSubmit"
            type="submit"
            color="primary-button"
            push
            no-caps
            :loading="isSaving"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DateInput from '../formComponents/DateInput.vue'
import CategoriaSelect from '../formComponents/CategoriaSelect.vue'
import { useFormato } from 'src/composables/utils/useFormato'
import PriceInput from '../formComponents/PriceInput.vue'
import { useRegistrosCrud } from 'src/composables/useRegistrosCrud'
import { useTraspasosCrud } from 'src/composables/useTraspasosCrud'
import { SessionStorage } from 'quasar'
import { useTipoMovimientoStore } from 'src/stores/common/useTipoMovimientoStore'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import DialogTitle from '../formComponents/modal/DialogTitle.vue'
import SelectCuenta from '../formComponents/SelectCuenta.vue'

/**
 * composables
 */
const formato = useFormato()
const registrosCrud = useRegistrosCrud()
const traspasosCrud = useTraspasosCrud()
const tipoMovimientoStore = useTipoMovimientoStore()
const { mostrarNotificacionPositiva, mostrarNotificacionNegativa } =
  useNotificacion()

/**
 * state
 */
const defaultItem = {
  tipoMovimientoId: '1',
  tipoAfectacion: 'A',
  categoria: null,
  cuenta: null,
  estadoRegistroId: 2,
  importe: '500',
  fecha: formato.formatoFecha(new Date()),
  observaciones: ''
}

const cuentaReadOnly = ref(true)

const formItem = ref({ ...defaultItem })
// const cuentaDestino = ref(null)
const filterIdArray = ref([])

const isSaving = ref(false)

/**
 * onMounted
 */
onMounted(() => {
  if (!isEditing.value) {
    editedFormItem.value.fecha = props.fecha
      ? formato.convertDateFromIsoToInput(props.fecha)
      : formato.formatoFecha(new Date())
  } else {
    obtenerDatosTraspasoSiAplica()
  }

  filterIdArray.value.push(editedFormItem.value.cuenta.id.toString())
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
  },
  fecha: {
    type: String,
    required: false
  }
})
/**
 * emits
 */
const emit = defineEmits(['itemSaved', 'itemUpdated'])
/**
 * GRAPHQL
 */
// const options = ref({
//   fetchPolicy: 'network-only'
// })

registrosCrud.onDoneRegistroCreate(({ data }) => {
  mostrarNotificacionPositiva('El registro se creó correctamente.', 2100)
  const item = data.registroCreate.registro
  isSaving.value = false
  emit('itemSaved', item)
})

registrosCrud.onErrorRegistroCreate((error) => {
  isSaving.value = false
  mostrarNotificacionNegativa(
    `Surgió un error al intentar guardar el movimiento. ${error.message}`,
    2100
  )
})

traspasosCrud.onDoneTraspasoCreate(({ data }) => {
  const traspasoCreate = data.traspasoCreate.traspaso
  const traspasoDetalles = traspasoCreate.traspasoDetalles
  const traspasoDestino = traspasoDetalles.find(
    (det) => det.tipoCuentaTraspasoId === '2'
  )
  const importe = traspasoDestino.importe
  const cuentaDestinoNombre = traspasoDestino.cuenta.nombre
  isSaving.value = false
  mostrarNotificacionPositiva(
    `Se registro un traspaso por ${importe} a la cuenta ${cuentaDestinoNombre}`,
    2100
  )
  emit('itemSaved')
})

traspasosCrud.onErrorTraspasoCreate((error) => {
  isSaving.value = false
  mostrarNotificacionNegativa(
    `No fue posible generar el traspaso. Favor de verificar. ${error.message}`,
    2100
  )
})

registrosCrud.onDoneRegistroUpdate(({ data }) => {
  isSaving.value = false
  // console.log('Registro update', data)
  const item = data.registroUpdate.registro
  emit('itemUpdated', item)
})
registrosCrud.onErrorRegistroUpdate((error) => {
  isSaving.value = false
  mostrarNotificacionNegativa(
    `No es posible actualizar el movimiento con la información ingresada. Favor de verificar. ${error.message}`,
    2100
  )
})

traspasosCrud.onResultListaTraspasos(({ data }) => {
  console.log('data:', data)
  // const tipoCuentaTraspasoId =
  //   editedFormItem.value.traspasoDetalle.tipoCuentaTraspasoId
  // traspaso.value = data.listaTraspasos[0]
  // const detalleContrario = traspaso.value.traspasoDetalles.find((detalle) => {
  //   return detalle.tipoCuentaTraspasoId !== tipoCuentaTraspasoId
  // })
  // editedFormItem.value.cuentaDestino = detalleContrario.cuenta
  // editedFormItem.value.observaciones = traspaso.value.observaciones
})

/**
 * computed
 */
const editedFormItem = computed({
  get() {
    return props.editedItem || formItem.value
  },
  set(val) {
    formItem.value = val
  }
})

const actionName = computed({
  get() {
    return editedFormItem.value.id
      ? 'Actualizar Movimiento'
      : `Nuevo ${tipoMovimientoNombre.value}`
  }
})

const tipoMovimientoNombre = computed({
  get() {
    switch (editedFormItem.value.tipoMovimientoId) {
      case '1':
        return 'Ingreso'
      case '2':
        return 'Gasto'
      case '3':
        return 'Traspaso'
      default:
        return ''
    }
  }
})

const lblSubmit = computed({
  get() {
    return editedFormItem.value.id ? 'Actualizar' : 'Guardar'
  }
})
const isTraspaso = computed({
  get() {
    return editedFormItem.value.tipoMovimientoId === '3'
  }
})
const isEditing = computed({
  get() {
    return editedFormItem.value.id ? true : false
  }
})

const color = new Map([
  ['1', 'ingreso-button'],
  ['2', 'egreso-button'],
  ['3', 'traspaso-button']
])

const active_color = computed({
  get() {
    return color.get(editedFormItem.value.tipoMovimientoId)
  }
})

const lblCuentaOrigen = computed({
  get() {
    switch (editedFormItem.value.tipoMovimientoId) {
      case '3':
        return 'Cuenta Origen'
      default:
        return 'Cuenta Bancaria'
    }
  }
})

const autofocusCategoria = computed({
  get() {
    return editedFormItem.value.tipoMovimientoId !== '3'
  }
})

/**
 * METHODS
 */

function onChangeTipoMovimiento(value) {
  editedFormItem.value.tipoAfectacion = value === '2' ? 'C' : 'A'
  editedFormItem.value.categoria = null
  // console.dir(value)
}

function saveItem() {
  isSaving.value = true
  const currentUser = SessionStorage.getItem('current_user')
  const userId = currentUser.id
  const categoria = editedFormItem.value.categoria
  const importe = parseFloat(editedFormItem.value.importe)

  if (isTraspaso.value) {
    if (isEditing.value) {
      // Actualizacion de un traspaso
      const traspaso = JSON.parse(JSON.stringify(editedFormItem.value.traspaso))
      const id = traspaso.id
      const input = {
        ...traspaso,
        fecha: formato.convertDateFromInputToIso(editedFormItem.value.fecha),
        observaciones: editedFormItem.value.observaciones,
        __typename: undefined,
        traspasoDetalles: undefined
      }
      const inputDetalle = []
      // const inputDetalle = JSON.parse(JSON.stringify(traspaso.traspasoDetalles))

      // console.log('inputDetalle', inputDetalle)

      traspaso.traspasoDetalles.forEach((traspasoDetalle) => {
        let inputDet = {
          ...traspasoDetalle,
          importe,
          cuentaId: traspasoDetalle.cuenta.id,
          cuenta: undefined,
          __typename: undefined,
          registro: undefined
        }

        //   console.log('traspasoDetalle', traspasoDetalle)
        inputDetalle.push(inputDet)
      })

      console.log('Mandar actualizar traspaso', id, input, inputDetalle)

      traspasosCrud.traspasoUpdate({ id, input, inputDetalle })
    } else {
      // Se guarda un traspaso detalle
      const inputDetalle = []
      const input = {
        fecha: formato.convertDateFromInputToIso(editedFormItem.value.fecha),
        observaciones: editedFormItem.value.observaciones,
        userId
      }

      inputDetalle.push({
        cuentaId: parseInt(editedFormItem.value.cuenta.id),
        tipoCuentaTraspasoId: 1,
        importe: importe
      })
      inputDetalle.push({
        cuentaId: parseInt(editedFormItem.value.cuentaDestino.id),
        tipoCuentaTraspasoId: 2,
        importe
      })

      traspasosCrud.traspasoCreate({ input, inputDetalle })
    }
  } else {
    let tipoAfectacion = undefined
    let importe_real = undefined
    switch (categoria.tipoMovimientoId) {
      case '1':
        tipoAfectacion = 'A'
        importe_real = importe
        break
      case '2':
        tipoAfectacion = 'C'
        importe_real = importe * -1
        break
      default:
        break
    }
    // console.log('importe_real', importe_real)
    const input = {
      id: editedFormItem.value.id,
      tipoAfectacion,
      estadoRegistroId: 2,
      categoriaId: parseInt(editedFormItem.value.categoria.id),
      cuentaId: parseInt(editedFormItem.value.cuenta.id),
      importe: importe_real,
      fecha: formato.convertDateFromInputToIso(editedFormItem.value.fecha),
      observaciones: editedFormItem.value.observaciones,
      userId
    }
    // console.log('saveItem input:', input)
    if (editedFormItem.value.id) {
      registrosCrud.registroUpdate({
        id: editedFormItem.value.id,
        input
      })
    } else {
      registrosCrud.createRegistro({ input })
    }
  }
}

traspasosCrud.onDoneTraspasoUpdate(({ data }) => {
  console.log('data:', data)
  mostrarNotificacionPositiva('Traspaso actualizado', 2100)
  emit('itemUpdated')
})

traspasosCrud.onErrorTraspasoUpdate((error) => {
  // console.trace(error)
  mostrarNotificacionNegativa(
    `Ocurrió un error al intentar actualizar el movimiento. Favor de verificar. ${error.message}`,
    2100
  )
})

function onSelectCategoria(value) {
  if (!isEditing.value && !!value) {
    const importeDefault = value.importeDefault ?? 0
    // console.log('Nuevo registro categoria:', importeDefault)
    editedFormItem.value.importe =
      parseFloat(importeDefault) === 0 ? '' : importeDefault.toString()
    editedFormItem.value.concepto = value.descripcion
  }
}

// registrosCrud.onDoneUpdate(({ data }) => {
//   console.log('data', data)
//   emit('itemUpdated')
// })

function obtenerDatosTraspasoSiAplica() {
  // console.log('[ editedFormItem.value ] >', editedFormItem.value)

  if (editedFormItem.value.traspaso) {
    // const id = editedFormItem.value.traspasoDetalle.traspasoId
    // traspasosCrud.loadListaTraspasos(null, { id }, graphqlOptions)
    const cuentaOrigen = editedFormItem.value.traspaso.traspasoDetalles.find(
      (det) => det.tipoCuentaTraspasoId === '1'
    )
    const cuentaDestino = editedFormItem.value.traspaso.traspasoDetalles.find(
      (det) => det.tipoCuentaTraspasoId === '2'
    )
    // console.log('[ cuentaOrigen ] >', cuentaOrigen)
    // console.log('[ cuentaDestino ] >', cuentaDestino)
    editedFormItem.value.cuenta = cuentaOrigen.cuenta
    editedFormItem.value.cuentaDestino = cuentaDestino.cuenta
  }
}
</script>
