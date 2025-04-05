<template>
  <div class="my-card" style="width: 400px; min-width: 400px">
    <DialogTitle>{{ actionName }}</DialogTitle>
    <div class="q-pa-md">
      <q-form @submit="saveItem" class="">
        <div class="q-gutter-xs">
          <div class="column items-center">
            <div
              class="q-gutter-xs q-mt-xs"
              style="width: 85%; border: 0px solid red"
            >
              <div>
                <q-input
                  v-model="editedFormItem.name"
                  type="text"
                  dense
                  color="positive"
                  autofocus
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Favor de ingresar el nombre de la Instance'
                  ]"
                  label="* Nombre de la instancia"
                  outlined
                />
              </div>
              <div>
                <q-input
                  v-model="editedFormItem.dominio"
                  type="text"
                  dense
                  color="positive"
                  autofocus
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Favor de ingresar el nombre del dominio'
                  ]"
                  label="* Nombre del dominio de la instancia"
                  outlined
                />
              </div>
              <div>
                <q-input
                  v-model="editedFormItem.logoImage"
                  type="text"
                  label="Imágen del logo "
                  color="positive"
                  dense
                  outlined
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Favor de ingresar la URL de la imágen del logo'
                  ]"
                ></q-input>
              </div>
            </div>
          </div>
          <div align="right" class="q-gutter-x-md q-mt-lg">
            <q-btn
              label="Cancelar"
              v-close-popup
              color="negative"
              class="q-ml-sm"
              no-caps
              flat
              rounded
            />
            <q-btn
              :label="lblSubmit"
              type="submit"
              color="primary-button"
              no-caps
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
// import { useInstancesCrud } from 'src/composables/useInstancesCrud'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
// import { useInstanceStore } from 'src/stores/common/useInstanceStore'
import DialogTitle from 'src/components/formComponents/modal/DialogTitle.vue'
import { useInstanceService } from 'src/composables/admin/useInstanceService'

/**
 * composable
 */

// const instancesCrud = useInstancesCrud()
const instanceService = useInstanceService()
const { mostrarNotificacionNegativa, mostrarNotificacionPositiva } =
  useNotificacion()
// const instanceStore = useInstanceStore()

/**
 * state
 */
const formItem = ref({
  name: '',
  logoImage: ''
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
    return !!editedFormItem.value.id
      ? 'Actualizar Instancia'
      : 'Nueva Instancia'
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
  // console.table(instanceStore.listaInstances)
})
/**
 * methods
 */
function saveItem() {
  const input = {
    ...editedFormItem.value,
    __typename: undefined
  }
  console.log('input:', input)
  if (!editedFormItem.value.id) {
    instanceService.createInstance({
      input
    })
  } else {
    const id = editedFormItem.value.id
    instanceService.updateInstance({
      id,
      input
    })
  }
}
/**
 * GRAPHQL
 */

instanceService.onDoneInstanceCreate(({ data }) => {
  console.log('saved data...', data)
  if (!!data) {
    const itemSaved = data.instanceCreate.instance
    mostrarNotificacion('guardó', itemSaved)
    emit('itemSaved', itemSaved)
    /**
     *
     */
  }
})
instanceService.onDoneInstanceUpdate(({ data }) => {
  console.log('data updated', data)
  if (!!data) {
    const itemUpdated = data.instanceUpdate.instance
    emit('itemUpdated', itemUpdated)
    /**
     *
     */
    mostrarNotificacion('actualizó', itemUpdated)
  }
})

function mostrarNotificacion(action, instance) {
  mostrarNotificacionPositiva(
    `La instancia "${instance.name}" se ${action} correctamente`,
    1500
  )
}

instanceService.onErrorInstanceCreate((error) => {
  mostrarNotificacionNegativa(
    `Surgió un error al intentar crear el instance.`,
    1500
  )
})

instanceService.onErrorInstanceUpdate((error) => {
  // console.error(error)
  mostrarNotificacionNegativa(
    'Ocurrió un error al intentar actualizar el instance.',
    1900
  )
})
</script>

<style lang="scss">
.input-label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: -0.025rem;
}
</style>
