<template>
  <div class="my-card" style="width: 450px; min-width: 450px">
    <DialogTitle>{{ actionName }}</DialogTitle>
    <div class="main-content q-pt-md" style="border: 0px solid red">
      <q-form
        @submit="saveItem"
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
              ></DateInput>
            </div>
            <div class="col column">
              <PriceInput
                label="Importe"
                v-model="editedFormItem.importe"
                :rules="[
                  (val) => !!val || 'Favor de ingresar un importe válido'
                ]"
              ></PriceInput>
            </div>
          </div>

          <div class="row">
            <q-checkbox
              color="secondary"
              right-label
              v-model="editedFormItem.isMsi"
              label="Meses sin Intereses"
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
              <q-btn :label="lblSubmit" type="submit" color="primary-button" />
            </div>
          </div>
        </div>
      </q-form>
      <!-- <pre>{{ props.fecha }}</pre> -->
    </div>
    <q-card-section> </q-card-section>
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
 * Guardar movimiento a tarjeta
 */
function saveItem() {
  console.log('onsubmit', editedFormItem.value)
  const isMsi = editedFormItem.value.isMsi
  const numero_msi = isMsi ? parseInt(editedFormItem.value.numeroMsi) : 0
  const importe = parseFloat(editedFormItem.value.importe) * -1 || 0
  console.log('importe', importe)
  if (importe !== 0) {
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
    console.log('item guardando...', input)
    if (!!editedFormItem.value.id) {
      registrosTarjetaCrud.registroTarjetaUpdate({
        id: editedFormItem.value.id,
        input
      })
    } else {
      registrosTarjetaCrud.createRegistroTarjeta({ input })
    }
  } else {
    notificacion.mostrarNotificacionNegativa(
      'Ingresar un importe mayo a cero.',
      200
    )
  }
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
    return 'Guardar'
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

const isEditing = computed({
  get() {
    return !!props.registroEditedItem?.id
  }
})

function isFechaValida(val) {
  const date = DateTime.fromFormat(val, 'dd/MM/yyyy')
  return date.isValid
}

function onSelectCategoria(value) {
  if (!isEditing.value && !!value) {
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
