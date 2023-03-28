<template>
  <q-card class="my-card" style="width: 400px">
    <q-card-section class="bg-primary text-secondary">
      {{ actionName }}
      <!-- <pre>{{ editedFormItem }}</pre> -->
      <pre>{{ props.editedItem }}</pre>
    </q-card-section>

    <q-card-section class="">
      <q-form @submit="saveItem" class="q-gutter-md">
        <div class="q-gutter-md">
          <div>
            <q-input
              v-model="editedFormItem.id"
              type="text"
              label="Id"
              dense
              maxlength="5"
              mask="#####"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Favor de ingresar el Id'
              ]"
            />
          </div>
          <div>
            <q-input
              v-model="editedFormItem.nombre"
              type="text"
              label="Nombre"
              dense
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Favor de ingresar el nombre de la Cuenta Contable'
              ]"
            />
          </div>
          <div class="row">
            <div class="col">
              <q-input
                v-model="editedFormItem.subnivel"
                type="text"
                label="Subnivel"
                dense
                readonly
              />
            </div>
            <div class="col">
              <q-input
                v-model="editedFormItem.padre_id"
                type="text"
                label="Cuenta Padre"
                dense
                readonly
              />
            </div>
          </div>

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
            />
          </div>
        </div>
        <div align="right">
          <q-btn
            label="Cancelar"
            v-close-popup
            color="primary"
            flat
            class="q-ml-sm"
          />
          <q-btn :label="lblSubmit" type="submit" color="primary" />
        </div>
      </q-form>
    </q-card-section>
    <!-- <q-card-section class="q-gutter-sm" align="right">
      <q-btn color="primary" label="Cancelar" v-close-popup outline />
      <q-btn color="primary" icon="check" label="Guardar" @click="saveItem" />
    </q-card-section> -->
  </q-card>
</template>

<script setup>
// import { useLazyQuery } from '@vue/apollo-composable'
import { ref, defineProps, computed, onMounted } from 'vue'

import { CUENTA_CONTABLE_CREATE } from 'src/graphql/cuentasContableGql'
import { useMutation } from '@vue/apollo-composable'

// import IconPicker from '/src/components/IconPicker.vue'
/**
 * state
 */
const formItem = ref({
  id: '',
  nombre: '',
  subnivel: 0,
  padre: '',
  tipo_afectacion: ''
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
  const input = { ...editedFormItem.value, action: undefined }

  console.log('save item', input)
  if (props.editedItem.action === 'add') {
    insertCuentaContable({ input })
  } else {
    // updateCuentaContable({ id, input })
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

onDoneInsertCuentaContable(({ data }) => {
  if (!!data) {
    console.log('data', data)
  }
})
onErrorInsertCuentaContable((error) => {
  console.error(error)
})
</script>

<style lang="sass" scoped>
.my-input
  max-width: 250px
</style>
