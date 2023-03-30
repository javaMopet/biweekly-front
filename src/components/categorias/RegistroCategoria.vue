<template>
  <q-card class="my-card" style="width: 400px">
    <q-card-section class="bg-primary text-accent-light text-subtitle1">
      {{ actionName }}
      <!-- <pre>{{ editedIndex }}</pre>
      <pre>{{ editedItem }}</pre> -->
      <!-- <pre>{{ tiposCategoriaOptions }}</pre> -->
      <!-- <pre>{{ editedFormItem.tipoCategoriaId }}</pre> -->
      <!-- <pre>{{ editedFormItem.icono }}</pre> -->
    </q-card-section>

    <q-card-section class="">
      <q-form @submit="saveItem" class="q-gutter-md">
        <div class="q-gutter-md">
          <div class="">
            <q-btn-toggle
              name="tipoCategoria"
              push
              spread
              v-model="editedFormItem.tipoCategoriaId"
              color="primary"
              toggle-color="accent-contrast"
              toggle-text-color="white"
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
              autofocus
              :rules="[(val) => !!val || 'Favor de ingresar el nombre']"
              lazyRules
            />
          </div>
          <div>
            <q-input
              v-model="editedFormItem.descripcion"
              type="text"
              label="Descripcion"
              dense
              :rules="[(val) => !!val || 'Favor de ingresar la descripción']"
              lazyRules
            />
          </div>
          <div class="row">
            <div class="col">
              <q-input
                class="col"
                v-model="editedFormItem.icono"
                type="text"
                dense
                outlined
                maxlength="30"
                :rules="[(val) => !!val || 'Icono requerido']"
                lazyRules
              />
            </div>
            <div class="col-auto q-ml-md">
              <q-btn @click="selectIcon" color="primary">
                <q-icon
                  color="gray"
                  :name="formItem.icono || 'extension'"
                  class="size"
                  size="2.5em"
                />
              </q-btn>
            </div>
          </div>
          <div>
            <div style="border: 0px solid red">
              <q-input
                filled
                v-model="editedFormItem.color"
                :rules="['anyColor']"
                hint="Selecciona un color para la categoría"
                class="my-input"
                style="min-width: 100%"
              >
                <template #before>
                  <div
                    :style="{
                      backgroundColor: `${editedFormItem.color}`,
                      height: 55 + 'px',
                      width: 55 + 'px'
                    }"
                  >
                    &nbsp;
                  </div>
                </template>
                <template v-slot:append>
                  <q-icon name="colorize" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-color
                        v-model="editedFormItem.color"
                        no-footer
                        :palette="[
                          '#019A9D',
                          '#D9B801',
                          '#E8045A',
                          '#B2028A',
                          '#2A0449',
                          '#019A9D'
                        ]"
                        default-view="palette"
                        class="my-picker"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div>
            <div class="row q-gutter-x-md">
              <div class="col">
                <q-select
                  v-model="editedFormItem.cuentaContable"
                  :options="cuentasContablesOptions"
                  label="Cuenta Contable"
                  option-label="nombreCompleto"
                  option-value="id"
                  :rules="[(val) => !!val || 'Icono requerido']"
                  lazyRules
                />
              </div>
              <div
                class="col-auto row items-center justify-center"
                style="border: 0px solid green"
              >
                <q-btn
                  color="accent-contrast"
                  icon="add"
                  @click="registrarCuentaContable"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col row justify-end">
          <q-btn
            label="Cancelar"
            color="primary"
            flat
            v-close-popup
            class="q-ml-sm"
          />
          <q-btn :label="lblSubmit" type="submit" color="primary" />
        </div>
      </q-form>
    </q-card-section>
    <!-- <q-card-section class="q-gutter-sm" align="right">
      <q-btn color="primary" label="Cancelar" v-close-popup outline />
      <q-btn color="primary" label="Guardar" @click="saveItem" />
    </q-card-section> -->
  </q-card>

  <Teleport to="#modal">
    <q-dialog v-model="show_icon_picker">
      <q-card
        class="my-card"
        style="max-height: 65vh; max-width: 60vw; width: 900px"
      >
        <q-card-section>
          <IconPicker
            v-model="editedFormItem.icono"
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
import RegistroCuentaContable from '../cuentasContables/RegistroCuentaContable.vue'
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
      ? 'Actualizar Categoria'
      : 'Nueva Categoria'
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

function registrarCuentaContable() {
  console.log('registrar una cuenta contable')
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
  editedFormItem.value.icono = value
  show_icon_picker.value = false
}
</script>

<style lang="sass" scoped>
.my-input
  max-width: 250px
</style>
