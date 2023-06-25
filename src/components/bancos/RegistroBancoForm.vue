<template>
  <q-card class="my-card" style="width: 450px">
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
    </q-card-section>
    <q-card-section class="">
      <q-form @submit="saveItem" class="">
        <div class="q-gutter-xs">
          <div class="column items-center">
            <div
              class="q-gutter-xs q-mt-xs"
              style="width: 85%; border: 0px solid red"
            >
              <div>
                <div class="row input-label">Nombre del banco:</div>
                <q-input
                  v-model="editedFormItem.nombre"
                  type="text"
                  label="Ingresa el nombre"
                  dense
                  filled
                  color="positive"
                  autofocus
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Favor de ingresar el nombre de la Banco'
                  ]"
                />
              </div>

              <div>
                <div class="row input-label">Imagen:</div>
                <q-input
                  v-model="editedFormItem.icono"
                  type="text"
                  label="Nombre de la imágen"
                  outlined
                  color="positive"
                  dense
                ></q-input>
              </div>
            </div>
          </div>
          <div align="right" class="q-gutter-x-sm q-mt-lg">
            <q-btn
              label="Cancelar"
              v-close-popup
              color=""
              flat
              class="q-ml-sm"
              dense
            />
            <q-btn
              :label="lblSubmit"
              type="submit"
              dense
              color="primary-button"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
    <q-card-section class="q-gutter-sm" align="right"> </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuery, useMutation } from '@vue/apollo-composable'
import { ref, reactive, computed, onMounted } from 'vue'
import { BANCO_CREATE, BANCO_UPDATE } from 'src/graphql/bancos'

/**
 * state
 */
const formItem = ref({
  nombre: '',
  identificador: '',
  bancoContable: null,
  tipoBanco: {
    id: '1'
  }
})

const bancoContableProps = reactive({
  subnivel: 0,
  tipoAfectacion: 'C',
  clasificacion: ''
})

/**
 * GRAPHQL
 */
const graphql_options = ref({
  fetchPolicy: 'network-only'
})

const {
  mutate: createBanco,
  onDone: onDoneCreateBanco,
  onError: onErrorCreateBanco
} = useMutation(BANCO_CREATE)
const {
  mutate: updateBanco,
  onDone: onDoneUpdateBanco,
  onError: onErrorUpdateBanco
} = useMutation(BANCO_UPDATE)

onDoneCreateBanco(({ data }) => {
  console.log('saved data...', data)
  if (!!data) {
    const itemSaved = data.bancoCreate.banco
    emit('itemSaved', itemSaved)
  }
})
onErrorCreateBanco((error) => {
  console.log(error)
  console.error(error)
})
onDoneUpdateBanco(({ data }) => {
  if (!!data) {
    console.log('updated data...', data)
    const itemUpdated = data.bancoUpdate.banco
    emit('itemUpdated', itemUpdated)
  }
})
onErrorUpdateBanco((error) => {
  console.error(error)
})

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
    return !!editedFormItem.value.id ? 'Actualizar Banco' : 'Nuevo Banco'
  }
})
const lblSubmit = computed({
  get() {
    return !!editedFormItem.value.id ? 'Actualizar' : 'Guardar'
  }
})

/**
 * onMounted
 */
onMounted(() => {})
/**
 * methods
 */
function saveItem() {
  console.log('save item', editedFormItem.value)
  const input = {
    ...editedFormItem.value,
    __typename: undefined
  }
  if (!editedFormItem.value.id) {
    console.log('guardando banco nueva', input)
    createBanco({
      input
    })
  } else {
    const id = editedFormItem.value.id
    console.log('actualizando banco', id, input)
    updateBanco({
      id,
      input
    })
  }
}
</script>

<style lang="scss">
.input-label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: -0.025rem;
}
</style>
