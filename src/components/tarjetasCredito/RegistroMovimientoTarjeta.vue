<template>
  <q-card class="my-card" style="width: 450px">
    <q-card-section
      class="row inline fit q-py-sm justify-between items-center dialog-title"
    >
      <div class="dialog__title--name">{{ actionName }}</div>
      <div class="">
        <q-btn
          round
          icon="close"
          class="dialog__title--closeButton"
          v-close-popup
          push
        ></q-btn>
      </div>
    </q-card-section>
    <q-card-section class="q-mx-lg">
      <q-form @submit="saveItem" class="q-gutter-md">
        <div class="column">
          <div class="row input-label">Categoría:</div>
          <CategoriaSelect
            v-model="editedFormItem.categoria"
            :rules="[(val) => !!val || 'Selecciona una categoría']"
            autofocus
            @update:model-value="onSelectCategoria"
          ></CategoriaSelect>

          <div class="row inline q-gutter-x-xs">
            <div class="col column">
              <div class="row input-label">Fecha de registro:</div>
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
              <div class="row input-label">Importe:</div>
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
            class="row inline q-gutter-x-sm items-center"
          >
            <div class="input-label">Número de meses:</div>
            <q-input
              v-model="editedFormItem.numeroMsi"
              type="number"
              outlined
              dense
              style="width: 60px"
            />
          </div>
          <div class="">
            <div class="row input-label">Observaciones:</div>
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
    </q-card-section>
    <q-card-section> </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DateInput from '../formComponents/DateInput.vue'
import PriceInput from '../formComponents/PriceInput.vue'
import CategoriaSelect from '../formComponents/CategoriaSelect.vue'
import { DateTime } from 'luxon'
import { useFormato } from 'src/composables/utils/useFormato'
import {
  CREATE_REGISTRO_TARJETA,
  UPDATE_REGISTRO_TARJETA
} from 'src/graphql/registrosTarjeta'
import { useMutation } from '@vue/apollo-composable'
import { useNotificacion } from 'src/composables/utils/useNotificacion'

/**
 * composables
 */
const formato = useFormato()
const notificacion = useNotificacion()

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
 * grapqhl
 */

const {
  mutate: createRegistroTarjeta,
  onDone: onDoneCreateRegistroTarjeta,
  onError: onErrorCreateRegistroTarjeta
} = useMutation(CREATE_REGISTRO_TARJETA)

const {
  mutate: updateRegistroTarjeta,
  onDone: onDoneUpdateRegistroTarjeta,
  onError: onErrorUpdateRegistroTarjeta
} = useMutation(UPDATE_REGISTRO_TARJETA)
/**
 * Guardar movimiento a tarjeta
 */
function saveItem() {
  console.log('onsubmit', editedFormItem.value)
  const isMsi = editedFormItem.value.isMsi
  const numero_msi = isMsi ? parseInt(editedFormItem.value.numeroMsi) : 0
  const importe = parseFloat(editedFormItem.value.importe) * -1
  if (importe > 0) {
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
      updateRegistroTarjeta({ id: editedFormItem.value.id, input })
    } else {
      createRegistroTarjeta({ input })
    }
  } else {
    notificacion.mostrarNotificacionNegativa(
      'Ingresar un importe mayo a cero.',
      200
    )
  }
}

onDoneCreateRegistroTarjeta(({ data }) => {
  const item = data?.registroTarjetaCreate?.registroTarjeta
  console.log('item guardado', item)
  emit('registroCreated', item)
})
onErrorCreateRegistroTarjeta((error) => {
  console.log('error', error)
  console.log('error', error.graphQLErrors[0].extensions)
})
onDoneUpdateRegistroTarjeta(({ data }) => {
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
function isFechaValida(val) {
  const date = DateTime.fromFormat(val, 'dd/MM/yyyy')
  return date.isValid
}

function onSelectCategoria(value) {
  if (!!value) {
    // if (!props.editedItem.cuenta) {
    //   editedFormItem.value.cuenta = value.cuentaDefault
    // }
    editedFormItem.value.importe =
      value.importeDefault === 0 ? '' : value.importeDefault.toString()
  }
}
</script>

<style lang="scss" scoped></style>
