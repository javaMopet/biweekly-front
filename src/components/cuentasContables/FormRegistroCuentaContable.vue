<template>
  <div class="my-card" style="width: 400px">
    <q-card-section
      class="row justify-between items-center dialog-title q-px-md"
    >
      <div class="text-subtitle1 text-accent-light">{{ actionName }}</div>
      <div class="">
        <q-btn
          icon="close"
          v-close-popup
          class="dialog__title--closeButton"
          round
        ></q-btn>
      </div>
    </q-card-section>
    <q-card-section class="">
      <q-form @submit="saveItem" class="q-gutter-md">
        <div class="q-gutter-md">
          <div>
            <div class="row inline fit">
              <div class="col q-mr-md">
                <q-select
                  v-model="editedFormItem.tipoAfectacion"
                  :options="tiposAfectacionOptions"
                  label="Tipo de Afectación"
                  option-label="nombre"
                  option-value="id"
                  lazy-rules
                  :rules="[
                    (val) =>
                      !!val ||
                      'Favor de ingresar el tipo de afectación de la cuenta contable'
                  ]"
                  outlined
                  color="secondary"
                  dense
                />
              </div>
              <div class="col">
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
          </div>
          <div class="">
            <CuentaContableSelect
              v-model="editedFormItem.padre"
              :subnivel="1"
              :tipo-afectacion="editedFormItem.tipoAfectacion"
              input-label="Padre"
              :readonly="isReadonly"
              :disable="isPadreDefault"
            ></CuentaContableSelect>
          </div>
          <div class="col">
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
                  (!!val && val.length >= 6) || 'Please use maximum 5 character'
              ]"
              :readonly="isReadonly"
              outlined
              color="secondary"
              @blur="identificadorIngresado"
            />
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
        </div>
        <div align="right" class="q-gutter-sm">
          <q-btn
            label="Cancelar"
            v-close-popup
            color="negative-pastel"
            flat
            class="q-ml-sm"
          />
          <q-btn
            :label="lblSubmit"
            type="submit"
            color="primary-button"
            :disable="isError"
          />
        </div>
      </q-form>
    </q-card-section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CuentaContableSelect from '../formComponents/CuentaContableSelect.vue'
import { api } from 'src/boot/axios'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { logErrorMessages } from '@vue/apollo-util'
import { useCuentaContableStore } from 'src/stores/common/useCuentaContableStore'

/**
 * composables
 */
const notificacion = useNotificacion()
const cuentaContableStore = useCuentaContableStore()

const {
  onDoneCreateCuentaContable,
  onErrorCreateCuentaContable,
  onDoneUpdateCuentaContable,
  onErrorUpdateCuentaContable
} = cuentaContableStore

/**
 * state
 */
const formItem = ref({
  id: undefined,
  nombre: '',
  subnivel: 0,
  padre: null,
  tipoAfectacion: ''
})

const tiposAfectacionOptions = ref([
  { id: 'C', nombre: 'Cargo' },
  { id: 'A', nombre: 'Abono' }
])

const isError = ref(false)

/**
 * props
 */
const props = defineProps({
  editedItem: {
    type: Object,
    required: false,
    default: () => {
      return null
    }
  },
  isPadreDefault: {
    type: Boolean,
    required: true,
    default: false
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
    return !!props.editedItem ? props.editedItem : formItem.value
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
  console.dir(editedFormItem.value)
  const input = {
    ...editedFormItem.value,
    tipoAfectacion: editedFormItem.value.tipoAfectacion,
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
    cuentaContableStore.createCuentaContable(input)
  } else {
    cuentaContableStore.updateCuentaContable(id, input)
  }
}

/**
 * GRAPHQL
 */
// const {
//   mutate: insertCuentaContable,
//   onDone: onDoneInsertCuentaContable,
//   onError: onErrorInsertCuentaContable
// } = useMutation(CUENTA_CONTABLE_CREATE)

// const {
//   mutate: updateCuentaContable,
//   onDone: onDoneUpdateCuentaContable,
//   onError: onErrorUpdateCuentaContable
// } = useMutation(CUENTA_CONTABLE_UPDATE)

onDoneCreateCuentaContable(({ data }) => {
  if (!!data) {
    notificacion.mostrarNotificacionPositiva('Cuenta Contable creada.', 1200)
    emit('cuentaContableSaved')
  }
})
onErrorCreateCuentaContable((error) => {
  notificacion.mostrarNotificacionNegativa(
    'Ocurrió un error al intentar crear la cuenta contable',
    1200
  )
})

onDoneUpdateCuentaContable(({ data }) => {
  if (!!data) {
    notificacion.mostrarNotificacionPositiva(
      'Cuenta Contable actualizada.',
      1200
    )
    emit('cuentaContableUpdated')
  }
})
onErrorUpdateCuentaContable((error) => {
  notificacion.mostrarNotificacionNegativa(
    'Ocurrió un error al intentar actualizar la cuenta contable',
    1200
  )
})

function identificadorIngresado(evt) {
  const value = evt.target.value
  console.log('value', value)
  console.log('value', value.length)
  if (value.length === 6) {
    console.log('recuperando....')
    api
      .get(`/cuentas_contable/${value}`)
      .then(({ data }) => {
        console.log('response', data)
        if (!!data) {
          notificacion.mostrarNotificacionNegativa(
            'Ya existe una cuenta con el id ingresado',
            600
          )
          isError.value = true
        } else {
          isError.value = false
        }
      })
      .catch((error) => {
        if (error.message.includes('404')) {
          isError.value = false
        } else {
          console.log('error', error.message)
          notificacion.mostrarNotificacionNegativa(
            'Surgió un error con la cuenta contable',
            1000
          )
          isError.value = true
        }
      })
  }
}
</script>

<style lang="sass" scoped>
.my-input
  max-width: 250px
</style>
