<template>
  <q-card class="my-card" style="width: 520px">
    <q-card-section
      class="bg-main-menu row inline fit q-py-sm justify-between items-center"
    >
      <div class="text-subtitle1 text-accent-light">{{ actionName }}</div>
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
      <!-- <pre>{{ editedFormItem }}</pre> -->
    </q-card-section>

    <q-card-section>
      <q-form @submit="saveItem" class="q-gutter-md">
        <div class="">
          <q-btn-toggle
            v-model="editedFormItem.tipoMovimientoId"
            spread
            no-caps
            color="disable-button"
            text-color="gray-2"
            toggle-color="positive"
            toggle-text-color="white"
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
            :tipo-afectacion="editedFormItem.tipoAfectacion"
            :is-cambiable="false"
            @update:model-value="onSelectCategoria"
          ></CategoriaSelect>
        </div>
        <div class="row">
          <div class="col q-mr-xs">
            <DateInput
              v-model="editedFormItem.fecha"
              lbl_field="Fecha"
              :opcional="false"
            ></DateInput>
          </div>
          <div class="col q-ml-xs">
            <PriceInput
              currency-code="MNX"
              v-model="editedFormItem.importe"
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
    <!-- <q-card-section>
      <pre>{{ editedFormItem }}</pre>
    </q-card-section> -->
  </q-card>
</template>

<script setup>
import { useQuery, useMutation } from '@vue/apollo-composable'
import { ref, computed, onMounted } from 'vue'
import { LISTA_TIPOS_MOVIMIENTO } from '/src/graphql/movimientos'
import { TRANSFERENCIA_CREATE } from 'src/graphql/transferencias'
import DateInput from '../formComponents/DateInput.vue'
import CategoriaSelect from '../formComponents/CategoriaSelect.vue'
import CuentaSelect from '../formComponents/CuentaSelect.vue'
import { useFormato } from 'src/composables/utils/useFormato'
import { DateTime } from 'luxon'
import PriceInput from '../formComponents/PriceInput.vue'
import { useRegistrosCrud } from 'src/composables/useRegistrosCrud'
/**
 * composables
 */
const formato = useFormato()
const registrosCrud = useRegistrosCrud()

/**
 * state
 */
const defaultItem = {
  tipoMovimientoId: '1',
  tipoAfectacion: 'A',
  categoria: null,
  cuenta: null,
  estadoRegistroId: 2,
  importe: '',
  fecha: formato.formatoFecha(new Date()),
  observaciones: ''
}

const formItem = ref({ ...defaultItem })
const tipoMovimiento = ref('1')
const cuentaOrigen = ref({})

/**
 * onMounted
 */
onMounted(() => {})

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
const emit = defineEmits(['itemSaved', 'itemUpdated'])
/**
 * GRAPHQL
 */
const options = ref({
  fetchPolicy: 'network-only'
})
const { onResult: onResultTiposMovimiento, result: resultTiposMovimiento } =
  useQuery(LISTA_TIPOS_MOVIMIENTO, null, options)

const {
  mutate: createTransferencia,
  onDone: onDoneCreateTransferencia,
  onError: onErrorCreateTransferencia
} = useMutation(TRANSFERENCIA_CREATE)

onDoneCreateTransferencia(({ data }) => {
  console.log('Egreso creado data', data)
})

onErrorCreateTransferencia((error) => {
  console.error(error)
})

registrosCrud.onDoneCreate(({ data }) => {
  console.log('REgistro created', data)
  const item = data.registroCreate.registro
  emit('itemSaved', item)
})
registrosCrud.onDoneUpdate(({ data }) => {
  console.log('Registro update', data)
  const item = data.registroUpdate.registro
  emit('itemUpdated', item)
})
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
    return !!props.editedItem.cuenta ? props.editedItem : formItem.value
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
  editedFormItem.value.tipoAfectacion = value === '2' ? 'C' : 'A'
  editedFormItem.value.categoria = null
}

function saveItem() {
  const importe = parseFloat(editedFormItem.value.importe)
  const tipoAfectacion = importe < 0 ? 'C' : 'A'
  const importeReal =
    editedFormItem.value.categoria.tipoMovimientoId === '1'
      ? importe
      : importe * -1
  const input = {
    id: editedFormItem.value.id,
    tipoAfectacion,
    estadoRegistroId: 2,
    categoriaId: parseInt(editedFormItem.value.categoria.id),
    cuentaId: parseInt(editedFormItem.value.cuenta.id),
    importe: importeReal,
    fecha: formato.convertDateFromInputToIso(editedFormItem.value.fecha),
    observaciones: editedFormItem.value.observaciones
  }
  console.log('saveItem input:', input)
  if (!!editedFormItem.value.id) {
    registrosCrud.updateItem({
      id: editedFormItem.value.id,
      input
    })
  } else {
    registrosCrud.createRegistro({ input })
  }
}

function onSelectCategoria(value) {
  if (!!value) {
    if (!props.editedItem.cuenta) {
      editedFormItem.value.cuenta = value.cuentaDefault
    }
    editedFormItem.value.importe =
      value.importeDefault === 0 ? '' : value.importeDefault.toString()
  }
}

registrosCrud.onDoneUpdate(({ data }) => {
  console.log('data', data)
  emit('itemUpdated')
})
</script>

<style lang="sass" scoped>
.my-input
  max-width: 250px
</style>
