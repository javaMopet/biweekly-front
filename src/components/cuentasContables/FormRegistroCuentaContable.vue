<template>
  <div class="my-card" style="width: 450px">
    <DialogTitle>{{ actionName }}</DialogTitle>
    <div class="main-content q-pt-md q-pb-md">
      <q-form
        @submit="saveItem"
        class="q-gutter-y-md q-mt-xs form-componente__body"
      >
        <div class="q-gutter-md">
          <div class="">
            <div class="row inline fit">
              <div class="col q-mr-md">
                <!-- <pre>{{ props.editedItem.tipoAfectacion }}</pre>
                <pre>{{ editedFormItem.tipoAfectacion }}</pre> -->
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
                  color="positive"
                  dense
                  :readonly="isReadonly"
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
                  color="positive"
                />
              </div>
            </div>
          </div>
          <div class="">
            <CuentaContableSelect
              v-model="editedFormItem.padre"
              :subnivel="1"
              :tipo-afectacion="editedFormItem.tipoAfectacion?.id ?? 'C'"
              input-label="Padre"
              :readonly="isReadonly"
              :disable="isPadreDefault"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Favor de ingresar el nombre de la Cuenta Contable'
              ]"
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
              color="positive"
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
              color="positive"
            />
          </div>
          <div></div>
        </div>
        <div align="right" class="q-gutter-x-md q-mt-lg">
          <q-btn
            label="Cancelar"
            v-close-popup
            color="negative"
            class="q-ml-sm"
            flat
            no-caps
            rounded
          />
          <q-btn
            :label="lblSubmit"
            type="submit"
            color="primary-button"
            :disable="isError"
          />
        </div>
      </q-form>
    </div>
    <!-- <q-card-section>
      <pre>{{ editedFormItem }}</pre>
    </q-card-section> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CuentaContableSelect from '../formComponents/CuentaContableSelect.vue'
import { api } from 'src/boot/axios'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
// import { useCuentaContableStore } from 'src/stores/common/useCuentaContableStore'
import { useCuentasContablesCrud } from 'src/composables/useCuentasContablesCrud'
import DialogTitle from '../formComponents/modal/DialogTitle.vue'

/**
 * composables
 */
const notificacion = useNotificacion()
const cuentasContablesCrud = useCuentasContablesCrud()
// const cuentaContableStore = useCuentaContableStore()

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
      ? 'Actualizar Cuenta Contable'
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
  const tipoAfectacion = props.editedItem.tipoAfectacion
  const taIndice = tiposAfectacionOptions.value.findIndex(
    (ta) => ta.id === tipoAfectacion
  )
  editedFormItem.value.tipoAfectacion = tiposAfectacionOptions.value[taIndice]
})

/**
 * METHODS
 */
function saveItem() {
  const id = editedFormItem.value.id
  const padreId = parseInt(editedFormItem.value.padre.id)
  const tipoAfectacion = editedFormItem.value.tipoAfectacion
  const input = {
    ...editedFormItem.value,
    tipoAfectacion: editedFormItem.value.tipoAfectacion.id,
    padreId,
    padre: undefined,
    action: undefined,
    tipo_afectacion: undefined,
    label: undefined,
    selectable: undefined,
    __typename: undefined
  }

  if (props.editedItem.action === 'add') {
    cuentasContablesCrud.cuentaContableCreate({ input })
  } else {
    cuentasContablesCrud.cuentaContableUpdate({ id, input })
  }
}

/**
 * GRAPHQL
 */
cuentasContablesCrud.onDoneCuentaContableCreate(({ data }) => {
  if (!!data) {
    notificacion.mostrarNotificacionPositiva('Cuenta Contable creada.', 1200)
    emit('cuentaContableSaved')
  }
})

cuentasContablesCrud.onDoneCuentaContableUpdate(({ data }) => {
  if (!!data) {
    notificacion.mostrarNotificacionPositiva(
      'Cuenta Contable actualizada correctamente.',
      1200
    )
    emit('cuentaContableUpdated')
  }
})

cuentasContablesCrud.onErrorCuentaContableCreate((error) => {
  notificacion.mostrarNotificacionNegativa(
    'Ocurrió un error al intentar crear la cuenta contable',
    1200
  )
})

cuentasContablesCrud.onErrorCuentaContableUpdate((error) => {
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
