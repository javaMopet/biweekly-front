<template>
  <div class="my-card" style="width: 400px; min-width: 400px">
    <div class="row justify-between items-center dialog-title q-px-md">
      <div class="text-subtitle1 text-accent-light">{{ actionName }}</div>
      <div class="dialog-closebutton">
        <q-btn
          icon="close"
          v-close-popup
          class="dialog__title--closeButton"
          round
        ></q-btn>
      </div>
    </div>
    <div class="q-pa-sm">
      <q-form @submit="saveItem" class="">
        <div class="q-gutter-xs">
          <div class="column items-center">
            <div
              class="q-gutter-xs q-mt-xs"
              style="width: 85%; border: 0px solid red"
            >
              <div>
                <div class="row input-label items-center">
                  <span style="color: red">*</span>&nbsp;Nombre del banco:
                </div>
                <q-input
                  v-model="editedFormItem.nombre"
                  type="text"
                  dense
                  color="positive"
                  autofocus
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Favor de ingresar el nombre de la Banco'
                  ]"
                  flat
                  placeholder="Ingresa el nombre"
                />
              </div>

              <div>
                <div class="row input-label">Imagen:</div>
                <q-input
                  v-model="editedFormItem.icono"
                  type="text"
                  placeholder="Ingresa Nombre de imágen"
                  color="positive"
                  dense
                  flat
                ></q-input>
              </div>
            </div>
          </div>
          <div align="right" class="q-gutter-x-sm q-mt-lg">
            <q-btn
              label="Cancelar"
              v-close-popup
              color="negative"
              class="q-ml-sm"
              flat
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
    </div>
    <q-card-section class="q-gutter-sm" align="right"> </q-card-section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBancosCrud } from 'src/composables/useBancosCrud'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { useBancoStore } from 'src/stores/common/useBancoStore'

/**
 * composable
 */

const bancosCrud = useBancosCrud()
const notificacion = useNotificacion()
const bancoStore = useBancoStore()
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
onMounted(() => {
  console.table(bancoStore.listaBancos)
})
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
    bancosCrud.createBanco({
      input
    })
  } else {
    const id = editedFormItem.value.id
    console.log('actualizando banco', id, input)
    bancosCrud.updateBanco({
      id,
      input
    })
  }
}
/**
 * GRAPHQL
 */

bancosCrud.onDoneCreateBanco(({ data }) => {
  console.log('saved data...', data)
  if (!!data) {
    const itemSaved = data.bancoCreate.banco
    mostrarNotificacion('guardó', itemSaved)
    emit('itemSaved', itemSaved)
    /**
     *
     */
  }
})
bancosCrud.onDoneUpdateBanco(({ data }) => {
  console.log('data updated', data)
  if (!!data) {
    const itemUpdated = data.bancoUpdate.banco
    emit('itemUpdated', itemUpdated)
    /**
     *
     */
    mostrarNotificacion('actualizó', itemUpdated)
  }
})

function mostrarNotificacion(action, banco) {
  notificacion.mostrarNotificacionPositiva(
    `El banco "${banco.nombre}" se ${action} correctamente`,
    1500
  )
}

bancosCrud.onErrorCreateBanco((error) => {
  console.log(error)
  console.error(error)
})

bancosCrud.onErrorUpdateBanco((error) => {
  console.error(error)
})
</script>

<style lang="scss">
.input-label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: -0.025rem;
}
</style>
