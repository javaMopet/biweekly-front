<template>
  <q-card class="my-card" style="width: 400px">
    <q-card-section class="bg-primary text-accent-light">
      Nueva Categoria
      <!-- <pre>{{ editedIndex }}</pre>
      <pre>{{ editedItem }}</pre> -->
      <!-- <pre>{{ tiposCategoriaOptions }}</pre> -->
      <!-- <pre>{{ editedFormItem.tipoCategoriaId }}</pre> -->
    </q-card-section>

    <q-card-section class="">
      <div class="q-gutter-md">
        <div class="">
          <q-btn-toggle
            name="tipoCategoria"
            push
            spread
            glossy
            rounded
            v-model="editedFormItem.tipoCategoriaId"
            color="grey-5"
            toggle-color="primary"
            label="nombre"
            :options="tiposCategoriaOptions"
            @update:model-value="tipoCategoriaChange"
          />
        </div>
        <div>
          <q-input
            v-model="editedFormItem.nombre"
            type="text"
            label="Nombre"
            dense
          />
        </div>
        <div>
          <q-input
            v-model="editedFormItem.descripcion"
            type="text"
            label="Descripcion"
            dense
          />
        </div>
        <div class="row inline q-gutter-sm">
          <q-input
            class="col"
            v-model="editedFormItem.icono"
            type="text"
            dense
            outlined
            maxlength="20"
            :rules="[(val) => !!val || 'Icono requerido']"
            lazyRules
          />

          <div>
            <q-btn @click="selectIcon" color="dark">
              <q-icon
                color="gray"
                :name="formItem.icono || 'extension'"
                class="size"
                size="2.5em"
              />
            </q-btn>
          </div>
        </div>

        <div class="q-pa-md">
          <div class="q-gutter-md row items-start">
            <div
              class="col"
              style=""
              :style="{
                backgroundColor: `${editedFormItem.color}`,
                height: 55 + 'px'
              }"
            >
              &nbsp;
            </div>
            <q-input
              filled
              v-model="editedFormItem.color"
              :rules="['anyColor']"
              hint="Selecciona un color para la categoría"
              class="my-input"
            >
              <template v-slot:append>
                <q-icon name="colorize" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-color
                      v-model="editedFormItem.color"
                      no-header
                      no-footer
                      default-view="palette"
                      class="my-picker"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <!-- <div>
          <q-select
            v-model="editedFormItem.tipoCategoria"
            :options="tiposCategoriaOptions"
            label="Tipo Categoria"
            option-label="nombre"
            option-value="id"
          />
        </div> -->
        <div>
          <q-select
            v-model="editedFormItem.cuentaContable"
            :options="cuentasContablesOptions"
            label="Cuenta Contable"
            option-label="nombreCompleto"
            option-value="id"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-gutter-sm" align="right">
      <q-btn color="primary" label="Cancelar" v-close-popup outline />
      <q-btn color="primary" icon="check" label="Guardar" @click="saveItem" />
    </q-card-section>
  </q-card>

  <Teleport to="#modal">
    <q-dialog v-model="show_icon_picker">
      <q-card
        class="my-card"
        style="max-height: 65vh; max-width: 60vw; width: 900px"
      >
        <q-card-section>
          <IconPicker
            v-model="editedFormItem.icon"
            @onClose="cancelIconPicker"
            @onIconSelected="onIconSelected"
          ></IconPicker>
        </q-card-section>
      </q-card>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { useQuery, useLazyQuery, useMutation } from '@vue/apollo-composable'
import { ref, computed, onMounted } from 'vue'
import {
  LISTA_TIPOS_CATEGORIA,
  CATEGORIA_CREATE,
  CATEGORIA_UPDATE
} from '/src/graphql/categorias'
import { LISTA_CUENTAS_CONTABLES } from '/src/graphql/cuentasContableGql'
import IconPicker from '/src/components/IconPicker.vue'
/**
 * state
 */
const defaultItem = {
  id: null,
  nombre: null,
  icono: null,
  descripcion: null,
  color: null,
  tipoCategoria: null,
  tipoCategoriaId: '1',
  cuentaContable: null
}
const formItem = ref({ ...defaultItem })
// const tiposCategoriaOptions = ref([])
const cuentasContablesOptions = ref([])
/**
 * onMounted
 */
onMounted(() => {
  console.log('tipoCategoriaId', editedFormItem.value.tipoCategoriaId)
  // cargarTiposCategoria()
  cargarCuentasContables(null, {
    subnivel: 0,
    clasificacion: '5'
  })
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
const emit = defineEmits(['categoriaSaved', 'categoriaUpdated'])
/**
 * computed
 */
const tiposCategoriaOptions = computed({
  get() {
    return resultTiposCategoria.value?.listaTiposCategoria ?? []
  }
})
const editedFormItem = computed({
  get() {
    return !!props.editedItem.id ? props.editedItem : formItem.value
  },
  set(val) {
    formItem.value = val
  }
})
const actionName = computed({
  get() {
    return !!editedFormItem.value.id
      ? 'Actualizar la Cuenta Contable'
      : 'Nueva Cuenta Contable'
  }
})
const lblSubmit = computed({
  get() {
    return !!editedFormItem.value.id ? 'Actualizar' : 'Guardar'
  }
})

/**
 * METHODS
 */

function tipoCategoriaChange(value) {
  console.log('cambio en el tipo de categoria', value)
  editedFormItem.value.cuentaContable = null
  if (value === '1') {
    console.log('cargarcuentas de ingreso')
    cargarCuentasContables(null, {
      subnivel: 0,
      clasificacion: '4'
    })
  } else if (value === '2') {
    console.log('cargarcuentas de egreso')
    cargarCuentasContables(null, {
      subnivel: 0,
      clasificacion: '5'
    })
  } else {
    console.log('cargar todas las cuentas ')
    cargarCuentasContables(null, {
      subnivel: 0,
      clasificacion: ''
    })
  }
}
function saveItem() {
  console.log('save item')
  const cuenta_contable_id = editedFormItem.value.cuentaContable.id
  const input = {
    ...editedFormItem.value,
    cuentaContableId: parseInt(cuenta_contable_id),
    tipoCategoriaId: parseInt(editedFormItem.value.tipoCategoriaId),
    tipoCategoria: undefined,
    cuentaContable: undefined,
    __typename: undefined
  }
  if (!editedFormItem.value.id) {
    console.log('guardando categoria nueva', input)
    createCategoria({
      input
    })
  } else {
    const id = editedFormItem.value.id
    console.log('actualizando categoria', id, input)
    updateCategoria({
      id,
      input
    })
  }
}

/**
 * GRAPHQL
 */
const options = ref({
  fetchPolicy: 'network-only'
})
const { onResult: onResultTiposCategoria, result: resultTiposCategoria } =
  useQuery(LISTA_TIPOS_CATEGORIA, null, options)

const { load: cargarCuentasContables, onResult: onResultCuentasContables } =
  useLazyQuery(LISTA_CUENTAS_CONTABLES)

// onResultTiposCategoria(({ data }) => {
//   if (!!data) {
//     console.log('data', data.listaTiposCategoria)
//     tiposCategoriaOptions.value = data.listaTiposCategoria
//   }
// })

onResultCuentasContables(({ data }) => {
  if (!!data) {
    console.log('data', data)
    cuentasContablesOptions.value = JSON.parse(
      JSON.stringify(data.listaCuentasContables)
    )
  }
})
const {
  mutate: createCategoria,
  onDone: onDoneCreateCategoria,
  onError: onErrorCreateCategoria
} = useMutation(CATEGORIA_CREATE)
const {
  mutate: updateCategoria,
  onDone: onDoneUpdateCategoria,
  onError: onErrorUpdateCategoria
} = useMutation(CATEGORIA_UPDATE)

onDoneCreateCategoria(({ data }) => {
  console.log('saved data...', data)
  if (!!data) {
    const itemSaved = data.categoriaCreate.categoria
    emit('categoriaSaved', itemSaved)
  }
})
onErrorCreateCategoria((error) => {
  console.log(error)
  console.error(error)
})
onDoneUpdateCategoria(({ data }) => {
  if (!!data) {
    console.log('updated data...', data)
    const itemUpdated = data.categoriaUpdate.categoria
    emit('categoriaUpdated', itemUpdated)
  }
})
onErrorUpdateCategoria((error) => {
  console.error(error)
})

/**
 * icon picker
 */
const show_icon_picker = ref(false)
function cancelIconPicker() {
  show_icon_picker.value = false
}
function selectIcon() {
  show_icon_picker.value = true
}
function onIconSelected(value) {
  console.log('IconoSeleccionado', value)
  formItem.value.icono = value
  show_icon_picker.value = false
}
</script>

<style lang="sass" scoped>
.my-input
  max-width: 250px
</style>
