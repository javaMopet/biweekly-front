<template>
  <q-card class="my-card" style="width: 400px">
    <q-card-section class="bg-primary">
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
      <!-- <pre>{{ editedFormItem }}</pre> -->
    </q-card-section>

    <q-card-section class="">
      <q-form @submit="saveItem" class="q-gutter-md">
        <div class="q-gutter-md">
          <div class="">
            <CuentaContableSelect
              v-model="editedFormItem.padre"
              tipo-afectacion="C"
              input-label="Padre"
              :readonly="isReadonly"
            ></CuentaContableSelect>
          </div>
          <div class="row">
            <div class="col q-mr-xs">
              <q-input
                v-model="editedFormItem.id"
                type="text"
                label="Id"
                placeholder="Favor de ingresar el Id"
                dense
                maxlength="6"
                min
                mask="######"
                lazy-rules
                :rules="[
                  (val) => !!val || 'Favor de ingresar el Id',
                  (val) =>
                    (!!val && val.length >= 6) ||
                    'Please use maximum 5 character'
                ]"
                :readonly="isReadonly"
                outlined
                color="secondary"
              />
            </div>
            <div class="col q-ml-xs">
              <q-input
                v-model="editedFormItem.subnivel"
                type="text"
                label="Subnivel"
                dense
                readonly
                outlined
                color="secondary"
              />
            </div>
          </div>
          <div>
            <q-input
              v-model="editedFormItem.nombre"
              type="text"
              label="Nombre"
              dense
              lazy-rules
              autofocus
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Favor de ingresar el nombre de la Cuenta Contable'
              ]"
              outlined
              color="secondary"
            />
          </div>
          <div></div>
          <div>
            <q-select
              v-model="editedFormItem.tipoAfectacion"
              :options="tiposAfectacionOptions"
              label="Tipo de Afectación"
              option-label="nombre"
              option-value="id"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Favor de ingresar el tipo de afectación de la cuenta contable'
              ]"
              outlined
              color="secondary"
              dense
            />
          </div>
        </div>
        <div align="right" class="q-gutter-sm">
          <q-btn
            label="Cancelar"
            v-close-popup
            color="secondary"
            flat
            class="q-ml-sm"
          />
          <q-btn :label="lblSubmit" type="submit" color="primary" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
// import { useLazyQuery } from '@vue/apollo-composable'
import { ref, computed, onMounted } from 'vue'

import {
  CUENTA_CONTABLE_CREATE,
  CUENTA_CONTABLE_UPDATE
} from 'src/graphql/cuentasContableGql'
import { useMutation } from '@vue/apollo-composable'
import CuentaContableSelect from '../formComponents/CuentaContableSelect.vue'

// import IconPicker from '/src/components/IconPicker.vue'
/**
 * state
 */
const formItem = ref({
  id: '',
  nombre: '',
  subnivel: 0,
  padre: '',
  tipoAfectacion: ''
})

const tiposAfectacionOptions = ref(['Cargo', 'Abono'])

const tiposCuentaContableOptions = ref([])
const cuentasContablesOptions = ref([])
/**
 * props
 */
const props = defineProps({
  editedItem: {
    type: Object,
    required: false,
    default: () => {
      return {
        id: null,
        nombre: null
      }
    }
  }
})
/**
 * emits
 */
const emit = defineEmits(['cuentaContableSaved', 'cuentaContableUpdated'])
/**
 * computed
 */
const editedFormItem = computed({
  get() {
    return props.editedItem
  },
  set(val) {
    formItem.value = val
  }
})
const actionName = computed({
  get() {
    return props.editedItem.action === 'edit'
      ? 'Actualizar la Cuenta Contable'
      : 'Nueva Cuenta Contable'
  }
})
const lblSubmit = computed({
  get() {
    return props.editedItem.action === 'edit' ? 'Actualizar' : 'Guardar'
  }
})

const isReadonly = computed({
  get() {
    return props.editedItem.action === 'edit' ? true : false
  }
})

/**
 * onMounted
 */
onMounted(() => {
  // cargarTiposCuentaContable()
  // cargarCuentasContables()
})

/**
 * METHODS
 */
function saveItem() {
  const id = editedFormItem.value.id
  const padreId = parseInt(editedFormItem.value.padre.id)
  const input = {
    ...editedFormItem.value,
    padreId,
    padre: undefined,
    action: undefined,
    tipo_afectacion: undefined,
    label: undefined,
    selectable: undefined,
    __typename: undefined
  }

  console.log('save item', input)
  if (props.editedItem.action === 'add') {
    insertCuentaContable({ input })
  } else {
    updateCuentaContable({ id, input })
  }
}

/**
 * GRAPHQL
 */
const {
  mutate: insertCuentaContable,
  onDone: onDoneInsertCuentaContable,
  onError: onErrorInsertCuentaContable
} = useMutation(CUENTA_CONTABLE_CREATE)

const {
  mutate: updateCuentaContable,
  onDone: onDoneUpdateCuentaContable,
  onError: onErrorUpdateCuentaContable
} = useMutation(CUENTA_CONTABLE_UPDATE)

onDoneInsertCuentaContable(({ data }) => {
  if (!!data) {
    const item = data.cuentaContableCreate.cuentaContable
    const itemSaved = {
      ...item,
      label: `${item.id} - ${item.nombre}`
    }
    console.log('data', itemSaved)
    emit('cuentaContableSaved', itemSaved)
  }
})
onErrorInsertCuentaContable((error) => {
  console.error(error)
})
onDoneUpdateCuentaContable(({ data }) => {
  if (!!data) {
    console.log('data', data)
    const item = data.cuentaContableUpdate.cuentaContable
    const itemUpdated = {
      ...item,
      label: `${item.id} - ${item.nombre}`
    }
    console.log('data', itemUpdated)
    emit('cuentaContableUpdated', itemUpdated)
  }
})
onErrorUpdateCuentaContable((error) => {
  console.error(error)
})
</script>

<style lang="sass" scoped>
.my-input
  max-width: 250px
</style>
