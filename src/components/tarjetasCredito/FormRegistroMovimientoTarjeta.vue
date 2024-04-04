<template>
  <div class="my-card" style="width: 450px; min-width: 450px">
    <DialogTitle>{{ actionName }}</DialogTitle>
    <div class="main-content q-pt-md" style="border: 0px solid red">
      <q-form
        @submit="saveUpdateItem"
        class="q-gutter-y-md q-mt-xs form-componente__body"
      >
        <div style="border: 0px solid red">
          <CategoriaSelect
            v-model="editedFormItem.categoria"
            :rules="[(val) => !!val || 'Selecciona una categoría']"
            autofocus
            @update:model-value="onSelectCategoria"
          ></CategoriaSelect>

          <div class="row inline q-gutter-x-xs">
            <div class="col column">
              <DateInput
                v-model="editedFormItem.fecha"
                :rules="[
                  (val) =>
                    (!!val && isFechaValida(val)) ||
                    'Favor de ingresar una fecha correcta'
                ]"
                :readonly="isComponentNotUpdatable"
              ></DateInput>
            </div>
            <div class="col column">
              <PriceInput
                label="Importe"
                v-model="editedFormItem.importe"
                :opcional="false"
                :rules="[
                  (val) =>
                    (!!val &&
                      val !== '0' &&
                      val !== '$0.00' &&
                      val !== '$NaN.undefined') ||
                    'Favor de ingresar un valor mayor a cero'
                ]"
                :readonly="isComponentNotUpdatable"
              ></PriceInput>
            </div>
          </div>

          <div class="row">
            <q-checkbox
              color="secondary"
              right-label
              v-model="editedFormItem.isMsi"
              label="Meses sin Intereses"
              :disable="isComponentNotUpdatable"
            />
          </div>
          <div
            v-if="editedFormItem.isMsi"
            class="row q-gutter-x-sm items-center justify-center"
          >
            <div class="input-label">Número de meses:</div>
            <div class="">
              <q-input
                v-model="editedFormItem.numeroMsi"
                type="number"
                outlined
                dense
                style="width: 90px"
                lazy-rules
                :rules="[(val) => (!!val && val > 1) || 'Requerido']"
                :disable="isComponentNotUpdatable"
              />
            </div>
          </div>
          <div class="">
            <q-input
              color="secondary"
              v-model="editedFormItem.concepto"
              type="textarea"
              label="Observaciones"
              rows="2"
              outlined
              dense
            />
          </div>
          <div class="column q-py-md">
            <div align="right" class="q-gutter-x-sm">
              <q-btn label="Cancelar" flat class="q-ml-sm" v-close-popup />
              <q-btn :label="lblSubmit" type="submit" color="primary-button" :loading="registrosTarjetaCrud.loadingRegistroTarjetaCreate"/>
            </div>
          </div>
        </div>
      </q-form>
      <!-- <pre>{{ props.fecha }}</pre> -->
    </div>
    <!-- <q-card-section>
      <pre>Editing Action: {{ isEditionAction }} </pre>
      <pre>Registro abierto: {{ isRegisterOpen }}</pre>
      <pre>Actualizar componente: {{ !isComponentNotUpdatable }}</pre>
      <pre>{{ editedFormItem.estadoRegistroTarjeta }}</pre>
      <pre>{{ props.registroEditedItem?.estadoRegistroTarjeta }}</pre>
      <pre>{{
        props.registroEditedItem?.estadoRegistroTarjeta?.id === '1'
      }}</pre>
    </q-card-section> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DateInput from '../formComponents/DateInput.vue'
import PriceInput from '../formComponents/PriceInput.vue'
import CategoriaSelect from '../formComponents/CategoriaSelect.vue'
import { DateTime } from 'luxon'
import { useFormato } from 'src/composables/utils/useFormato'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { useRegistrosTarjetaCrud } from 'src/composables/useRegistrosTarjetaCrud'
import DialogTitle from '../formComponents/modal/DialogTitle.vue'

/**
 * composables
 */
const formato = useFormato()
const notificacion = useNotificacion()
const registrosTarjetaCrud = useRegistrosTarjetaCrud()

const { mostrarNotificacionPositiva, mostrarNotificacionNegativa } =
  useNotificacion()

/**
 * state
 */
const tipoMovimientoId = ref('2')
const formItem = ref({ fecha: '10/05/2023' })
/**
 * onMounted
 */
onMounted(() => {
  if (!!editedFormItem.value.id) {
    console.log('is edicion')
  } else {
    const now = DateTime.now()
    const formatoFecha = formato.formatoFecha(now)
    console.log('fecha', formatoFecha)
    formItem.value = {
      fecha: formatoFecha,
      concepto: '',
      importe: '',
      categoria: null,
      isMsi: false,
      numero_msi: 3
    }
    editedFormItem.value.fecha = !!props.fecha
      ? formato.convertDateFromIsoToInput(props.fecha)
      : formato.formatoFecha(new Date())
  }
})

/**
 * props
 */
const props = defineProps({
  registroEditedItem: {
    type: Object,
    required: false,
    default: () => {
      return {
        id: null
      }
    }
  },
  cuentaId: {
    type: Number,
    required: true
  },
  fecha: {
    type: String,
    required: false
  }
})
/**
 * emits
 */
const emit = defineEmits(['registroCreated', 'registroUpdated'])

/**
 * Guardar o actualizar movimiento a tarjeta
 */
function saveUpdateItem() {
  if (isEditionAction.value) {
    updateItem()
  } else {
    saveNewItem()
  }

  console.log('onsubmit', editedFormItem.value)
  const isMsi = editedFormItem.value.isMsi
  const numero_msi = isMsi ? parseInt(editedFormItem.value.numeroMsi) : 0
  const importe = parseFloat(editedFormItem.value.importe) * -1 || 0
  console.log('importe', importe)

  const tipoAfectacion = importe >= 0 ? 'A' : 'C'
  const input = {
    estadoRegistroTarjetaId: 1,
    cuentaId: props.cuentaId,
    tipoAfectacion,
    categoriaId: parseInt(editedFormItem.value.categoria.id),
    importe: importe,
    fecha: formato.convertDateFromInputToIso(editedFormItem.value.fecha), //convert
    concepto: editedFormItem.value.concepto,
    isMsi,
    numeroMsi: numero_msi
  }
}

function updateItem() {
  let input = getInputToUpdate()

  registrosTarjetaCrud.registroTarjetaUpdate({
    id: props.registroEditedItem.id,
    input
  })
}
function getInputToUpdate() {
  if (isRegisterOpen.value) {
    const input = { ...editedFormItem.value }
    return input
  } else {
    const input = {
      id: editedFormItem.value.id,
      categoriaId: parseInt(editedFormItem.value.categoria.id),
      concepto: editedFormItem.value.concepto
    }
    return input
  }
}

function saveNewItem() {
  const input = getInputToCreate()
  console.log(
    '%csrc/components/tarjetasCredito/FormRegistroMovimientoTarjeta.vue:239 input',
    'color: #007acc;',
    input
  )
  registrosTarjetaCrud.createRegistroTarjeta({ input })
}
function getInputToCreate() {
  const isMsi = editedFormItem.value.isMsi
  const importe = parseFloat(editedFormItem.value.importe) * -1 || 0
  const tipoAfectacion = importe >= 0 ? 'A' : 'C'

  const input = {
    ...editedFormItem.value,
    categoriaId: editedFormItem.value.categoria.id,
    estadoRegistroTarjetaId: '1',
    cuentaId: props.cuentaId,
    importe,
    fecha: formato.convertDateFromInputToIso(editedFormItem.value.fecha),
    concepto: editedFormItem.value.concepto,
    numeroMsi: isMsi ? parseInt(editedFormItem.value.numeroMsi) : 0,
    tipoAfectacion,
    numero_msi: undefined,
    categoria: undefined
  }

  return input
}

registrosTarjetaCrud.onDoneRegistroTarjetaCreate(({ data }) => {
  const item = data?.registroTarjetaCreate?.registroTarjeta
  console.log('item guardado', item)
  emit('registroCreated', item)
})

registrosTarjetaCrud.onErrorRegistroTarjetaCreate((error) => {
  console.trace(error)
  // console.log('error', error)
  // console.log('error', error.graphQLErrors[0].extensions)
})

registrosTarjetaCrud.onDoneRegistroTarjetaUpdate(({ data }) => {
  const item = data?.registroTarjetaUpdate?.registroTarjeta
  console.log('item guardado', item)
  emit('registroUpdated', item)
})
/**
 * computed
 */
const actionName = computed({
  get() {
    return 'Nuevo Registro'
  }
})
const lblSubmit = computed({
  get() {
    return editedFormItem.value?.id ? 'Actualizar' : 'Guardar'
  }
})
const editedFormItem = computed({
  get() {
    return !!props.registroEditedItem?.id
      ? props.registroEditedItem
      : formItem.value
  },
  set(val) {
    formItem.value = val
  }
})
const isEditionAction = computed({
  get() {
    return !!props.registroEditedItem?.id
  }
})
const isRegisterOpen = computed({
  get() {
    return (
      !isEditionAction.value ||
      props.registroEditedItem?.estadoRegistroTarjeta?.id === '1'
    )
  }
})

const isComponentNotUpdatable = computed({
  get() {
    return isEditionAction.value && !isRegisterOpen.value //|| !isEditionAction.value
  }
})
/**
 * Methods
 */
/**
 *
 * @param {*} val
 */
function isFechaValida(val) {
  const date = DateTime.fromFormat(val, 'dd/MM/yyyy')
  return date.isValid
}

/**
 * Al seleccionar una categoria se toma el importe y las observaciones por default,
 * sin embargo si estamos en actualización no debe tomar dichos valores.
 * @param {*} value - Valor de la categoria seleccionada.
 */
function onSelectCategoria(value) {
  console.log(
    '%csrc/components/tarjetasCredito/FormRegistroMovimientoTarjeta.vue:295 value',
    'color: #007acc;',
    value
  )
  if (!isEditionAction.value && !!value) {
    console.log('Nuevo registros tarjeta categoria:', value)
    editedFormItem.value.importe =
      parseFloat(value.importeDefault) === 0
        ? ''
        : value.importeDefault.toString()
    editedFormItem.value.concepto = value.descripcion
  }
}
</script>

<style lang="scss" scoped></style>
