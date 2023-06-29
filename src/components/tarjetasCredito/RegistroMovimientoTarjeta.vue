<template>
  <q-card class="my-card" style="width: 450px">
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
    <q-card-section class="q-mx-lg">
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div class="column">
          <div class="row input-label">Concepto:</div>
          <q-input
            autofocus
            color="secondary"
            v-model="editedFormItem.concepto"
            type="textarea"
            label="Concepto"
            rows="3"
            outlined
            dense
            lazy-rules
            :rules="[(val) => !!val || 'Favor de ingresar el concepto']"
          />
          <div class="row inline q-gutter-x-xs">
            <div class="col column">
              <div class="row input-label">Fecha de registro:</div>
              <DateInput
                v-model="editedFormItem.fecha"
                :rules="[(val) => !!val || 'Favor de ingresar la fecha']"
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

          <div class="row input-label">Categoría:</div>
          <CategoriaSelect
            v-model="editedFormItem.categoria"
            :rules="[(val) => !!val || 'Selecciona una categoría']"
          ></CategoriaSelect>
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
              v-model="editedFormItem.numero_msi"
              type="number"
              outlined
              dense
              style="width: 60px"
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

/**
 * composables
 */
const formato = useFormato()

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

function onSubmit() {
  console.log('onsubmit', editedFormItem.value)
  const isMsi = editedFormItem.value.isMsi
  const numero_msi = isMsi ? editedFormItem.value.numeroMsi : 0
  const input = {
    estadoRegistroTarjetaId: 1,
    cuentaId: props.cuentaId,
    categoriaId: parseInt(editedFormItem.value.categoria.id),
    importe: parseFloat(editedFormItem.value.importe), //convert
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
}
onDoneCreateRegistroTarjeta(({ data }) => {
  const item = data?.registroTarjetaCreate?.registroTarjeta
  console.log('item guardado', item)
  emit('registroCreated', item)
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
</script>

<style lang="scss" scoped></style>
