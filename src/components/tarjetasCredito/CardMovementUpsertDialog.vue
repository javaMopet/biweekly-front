<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="jump-up"
    transition-hide="jump-down"
    noBackdropDismiss
  >
    <q-card style="min-width: 400px; max-width: 90vw">
      <DialogTitle>{{ actionName }}</DialogTitle>
      <div class="main-content q-pt-md q-pb-md" style="border: 0px solid red">
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
              tipo-afectacion="C"
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
                <q-btn
                  label="Cancelar"
                  flat
                  class="q-ml-sm"
                  color="negative "
                  v-close-popup
                />
                <q-btn
                  :label="lblSubmit"
                  type="submit"
                  color="primary-button"
                  :loading="loadingSubmit"
                />
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
    </q-card>
  </q-dialog>
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
import { useDialogPluginComponent } from 'quasar'

/**
 * composables
 */
const formato = useFormato()
const registrosTarjetaCrud = useRegistrosTarjetaCrud()

const { mostrarNotificacionPositiva, mostrarNotificacionNegativa } =
  useNotificacion()
/**
 * state
 */
const formItem = ref({ fecha: '10/05/2023' })
const loadingSubmit = ref(false)
/**
 * onMounted
 */
onMounted(() => {
  if (editedFormItem.value.id) {
    // console.log('is edicion')
  } else {
    const now = DateTime.now()
    const formatoFecha = formato.formatoFecha(now)
    // console.log('fecha', formatoFecha)
    formItem.value = {
      fecha: formatoFecha,
      concepto: '',
      importe: '',
      categoria: null,
      isMsi: false,
      numero_msi: 3
    }
    editedFormItem.value.fecha = props.fecha
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
    type: String,
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
defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

// const emit = defineEmits(['categoriaSaved', 'categoriaUpdated'])
const { dialogRef, onDialogHide, onDialogOK, _onDialogCancel } =
  useDialogPluginComponent()
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

/**
 * Guardar o actualizar movimiento a tarjeta
 */
function saveUpdateItem() {
  loadingSubmit.value = true
  if (isEditionAction.value) {
    updateItem()
  } else {
    saveNewItem()
  }
}

function saveNewItem() {
  const input = getInputToCreate()
  registrosTarjetaCrud.createRegistroTarjeta({ input })
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
    const importe = parseFloat(editedFormItem.value.importe) * -1 || 0
    const input = {
      ...editedFormItem.value,
      categoriaId: editedFormItem.value.categoria.id,
      importe,
      fecha: formato.convertDateFromInputToIso(editedFormItem.value.fecha),
      abono: undefined,
      cargo: undefined,
      importeMensual: undefined,
      isPago: undefined,
      estadoRegistroTarjeta: undefined,
      cuenta: undefined,
      categoria: undefined,
      __typename: undefined
    }
    return input
  } else {
    // Register is closed
    const input = {
      id: editedFormItem.value.id,
      categoriaId: parseInt(editedFormItem.value.categoria.id),
      concepto: editedFormItem.value.concepto
    }
    console.log('[ input ] >', input)
    return input
  }
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
  loadingSubmit.value = false
  mostrarNotificacionPositiva(
    `Registro con importe ${item.importe}, guardado correctamente`,
    1900
  )
  onDialogOK(item)
})

registrosTarjetaCrud.onDoneRegistroTarjetaUpdate(({ data }) => {
  const item = data?.registroTarjetaUpdate?.registroTarjeta
  // console.log('item guardado', item)
  // emit('registroUpdated', item)
  loadingSubmit.value = false
  mostrarNotificacionPositiva(
    `Registro con importe ${item.importe}, actualizado correctamente`,
    1900
  )
  onDialogOK(item)
})

registrosTarjetaCrud.onErrorRegistroTarjetaCreate((error) => {
  loadingSubmit.value = false
  // console.trace(error)
  mostrarNotificacionNegativa(
    `Ocurrió un error al intengar guardar el registro. ${error.message}`,
    1900
  )
})

registrosTarjetaCrud.onErrorRegistroTarjetaUpdate((error) => {
  loadingSubmit.value = false
  mostrarNotificacionNegativa('No fue posible actualizar el registro', 1900)
  console.error(error)
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
    return props.registroEditedItem?.id
      ? props.registroEditedItem
      : formItem.value
  },
  set(val) {
    formItem.value = val
  }
})
const isEditionAction = computed({
  get() {
    return props.registroEditedItem?.id ? true : false
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
  if (!isEditionAction.value && !!value) {
    // console.log('Cambio de categoria, importe y concepto')
    editedFormItem.value.importe =
      parseFloat(value.importeDefault) === 0
        ? ''
        : value.importeDefault.toString()
    editedFormItem.value.concepto = value.descripcion
  }
}
</script>

<style lang="scss" scoped></style>
