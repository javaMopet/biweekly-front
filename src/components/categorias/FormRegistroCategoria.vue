<template>
  <div class="my-card" style="width: 500px">
    <DialogTitle>{{ actionName }}</DialogTitle>
    <div class="q-pa-lg">
      <q-form @submit="saveItem" class="q-gutter-md">
        <div class="q-gutter-md">
          <q-btn-toggle
            v-model="editedFormItem.tipoMovimientoId"
            spread
            no-caps
            color="disable-button"
            text-color="gray-2"
            :toggle-color="active_color"
            toggle-text-color="toggle-text-button"
            :options="tipoMovimientoStore.tiposMovimientoCuenta"
            @update:model-value="onChangeTipoMovimiento"
            push
            glossy
            :disable="isEditing"
          />
          <div class="q-pt-md">
            <div class="row q-gutter-x-md items-start">
              <div
                class="col-auto bg-high-contrast clickable"
                @click="selectIcon"
              >
                <q-icon
                  color="accent-light"
                  :name="editedFormItem.icono || 'extension'"
                  class="size"
                  size="2em"
                />
              </div>
              <div class="col">
                <q-input
                  v-model="editedFormItem.nombre"
                  type="text"
                  label="* Nombre de categoría"
                  dense
                  outlined
                  color="positive"
                  autofocus
                  :rules="[(val) => !!val || 'Favor de ingresar el nombre']"
                  lazyRules
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-3 q-pr-md">
              <q-input
                outlined
                color="main-menu"
                v-model="editedFormItem.color"
                :rules="['anyColor']"
                class="my-input"
                dense
                input-style="color:white;width:10px"
              >
                <!-- style="min-width: 100%" -->
                <template #default>
                  <div
                    :style="{
                      backgroundColor: `${editedFormItem.color}`,
                      height: 40 + 'px',
                      width: 250 + 'px'
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
                      ref="ppproxy"
                    >
                      <q-color
                        v-model="editedFormItem.color"
                        no-footer
                        :palette="[
                          '#D9B801',
                          '#019A9D',
                          '#9c592d',
                          '#E8045A',
                          '#B2028A',
                          '#6d3ee6',
                          '#ffd04f',
                          '#227fd6',
                          '#1ad560',
                          '#e6763e',
                          '#45c5f7',
                          '#02c46a',
                          '#4a0f36',
                          '#fa75ce',
                          '#b9d422',
                          '#0f4d40'
                        ]"
                        default-view="palette"
                        class="my-picker"
                        @update:model-value="colorSelecionado"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-9">
              <q-input
                v-model="editedFormItem.descripcion"
                type="text"
                placeholder="* Descripción"
                dense
                outlined
                color="positive"
                :rules="[(val) => !!val || 'Favor de ingresar la descripción']"
                lazyRules
              />
            </div>
          </div>
          <div></div>
          <div class="row">
            <div class="col-5 q-pr-xs">
              <PriceInput
                currency-code="MNX"
                v-model="editedFormItem.importeDefault"
                label="Precio (opcional)"
              ></PriceInput>
            </div>
            <div class="col-7">
              <CuentaSelect
                v-model="editedFormItem.cuentaDefault"
                :opcional="true"
                :filter-array="['1', '2']"
                label="Cuenta Bancaria (opcional)"
                hint="Esta cuenta se tomará por defecto al agregar un movimiento"
              ></CuentaSelect>
            </div>
          </div>

          <div class="col">
            <CuentaContableSelect
              v-model="editedFormItem.cuentaContable"
              :subnivel="cuentaContableOptions.cuentaContableSubnivel"
              :clasificacion="cuentaContableOptions.clasificacion"
              :tipo-afectacion="cuentaContableOptions.tipoAfectacion"
              :is-alta="false"
              input-label="Cuenta Contable (opcional)"
            ></CuentaContableSelect>
          </div>
        </div>
        <div class="col row justify-end q-pt-lg q-gutter-lg">
          <q-btn
            label="Cancelar"
            flat
            v-close-popup
            class="q-ml-sm"
            color="negative"
            no-caps
            rounded
          />
          <q-btn
            :label="lblSubmit"
            type="submit"
            color="primary-button"
            no-caps
          />
        </div>
      </q-form>
    </div>
  </div>

  <Teleport to="#modal">
    <q-dialog
      v-model="show_icon_picker"
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <IconPicker
        v-model="editedFormItem.icono"
        @onClose="cancelIconPicker"
        @onIconSelected="onIconSelected"
      ></IconPicker>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import IconPicker from '/src/components/IconPicker.vue'
import CuentaSelect from '../formComponents/CuentaSelect.vue'
import PriceInput from '../formComponents/PriceInput.vue'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { SessionStorage } from 'quasar'
import { useCategoriaStore } from 'src/stores/common/categoriaStore'
import { useTipoMovimientoStore } from 'src/stores/common/useTipoMovimientoStore'
import { useCategoriasCrud } from 'src/composables/useCategoriasCrud'
import CuentaContableSelect from '../formComponents/CuentaContableSelect.vue'
import DialogTitle from '../formComponents/modal/DialogTitle.vue'

/**
 * composables
 */
const { mostrarNotificacionPositiva, mostrarNotificacionNegativa } =
  useNotificacion()
const tipoMovimientoStore = useTipoMovimientoStore()
const categoriaStore = useCategoriaStore()
const categoriaCrud = useCategoriasCrud()
/**
 * state
 */
const defaultItem = {
  id: null,
  nombre: null,
  icono: 'insert_emoticon',
  descripcion: null,
  color: '#019A9D',
  tipoMovimiento: null,
  tipoMovimientoId: '2',
  cuentaContable: null
}
const formItem = ref({ ...defaultItem })
const ppproxy = ref(null)

const cuentaContableOptions = ref({
  cuentaContableSubnivel: 0,
  clasificacion: '',
  tipoAfectacion: 'C'
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
const tiposMovimientoOptions = computed({
  get() {
    return (tiposMovimientoDao.listaTiposMovimiento.value ?? []).filter(
      (tipoMovimiento) => tipoMovimiento.id != '3'
    )
  }
})
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
      ? 'Actualizar Categoria'
      : 'Nueva Categoria'
  }
})
const isEditing = computed({
  get() {
    return !!editedFormItem.value.id
  }
})
const lblSubmit = computed({
  get() {
    return !!editedFormItem.value.id ? 'Actualizar' : 'Guardar'
  }
})
const color = new Map([
  ['1', 'ingreso-button'],
  ['2', 'egreso-button'],
  ['3', 'traspaso-button']
])

const active_color = computed({
  get() {
    return color.get(editedFormItem.value.tipoMovimientoId)
  }
})

/**
 * METHODS
 */

function onChangeTipoMovimiento(tipoMovimientoId) {
  console.log('cambio en el tipo de categoria', tipoMovimientoId)
  editedFormItem.value.cuentaContable = null
  obtenerCuentasContables(tipoMovimientoId)
}
function obtenerCuentasContables(tipoMovimientoId) {
  switch (tipoMovimientoId) {
    case '1': //Ingreso
      cuentaContableOptions.value.tipoAfectacion = 'A'
      break
    case '2': //Gasto
      cuentaContableOptions.value.tipoAfectacion = 'C'
      break
    case '3':
      break
    case '4': //Inversion
      cuentaContableOptions.value.tipoAfectacion = 'A'
      break
    default:
      break
  }
}
/**
 * Guardar o actualizar una categoría.
 */
function saveItem() {
  console.log('save item')
  const cuenta_contable_id = editedFormItem.value.cuentaContable?.id
  const cuentaDefaultId = editedFormItem.value.cuentaDefault?.id
  const userId = SessionStorage.getItem('current_user').id
  const input = {
    ...editedFormItem.value,
    cuentaContableId: parseInt(cuenta_contable_id),
    cuentaDefaultId: parseInt(cuentaDefaultId),
    tipoMovimientoId: parseInt(editedFormItem.value.tipoMovimientoId),
    importeDefault: parseFloat(editedFormItem.value.importeDefault ?? '0'),
    userId,
    orden: 1000,
    tipoMovimiento: undefined,
    cuentaContable: undefined,
    cuentaDefault: undefined,
    __typename: undefined
  }
  console.log('guardando item:', input)
  if (!editedFormItem.value.id) {
    categoriaCrud.categoriaCreate({ input })
  } else {
    const id = editedFormItem.value.id
    categoriaCrud.categoriaUpdate({ id, input })
  }
}

/**
 *
 */
categoriaCrud.onDoneCategoriaCreate(({ data }) => {
  if (!!data) {
    const itemSaved = data.categoriaCreate.categoria
    mostrarNotificacionPositiva(
      `Categoría "${itemSaved.nombre}" creada correctamente.`,
      1600
    )
    emit('categoriaSaved', itemSaved)
  }
})

categoriaCrud.onDoneCategoriaUpdate(({ data }) => {
  if (!!data) {
    const itemUpdated = data.categoriaUpdate.categoria
    mostrarNotificacionPositiva(
      `Categoría "${itemUpdated.nombre}" actualizada correctamente.`,
      1600
    )
    emit('categoriaUpdated', itemUpdated, props.editedIndex)
  }
})

categoriaCrud.onErrorCategoriaCreate((error) => {
  const nombreError = error.graphQLErrors[0]?.extensions?.nombre ?? null

  const errorString = !!nombreError
    ? 'No fue posible guardar la categoria. Ya existe una categoria con el nombre que intenta guardar'
    : 'No fue posible guardar la categoria. Favor de intentar nuevamente'

  mostrarNotificacionNegativa(errorString, 2100)
})

categoriaCrud.onErrorCategoriaUpdate((error) => {
  const nombreError = error.graphQLErrors[0]?.extensions?.nombre ?? null

  const errorString = !!nombreError
    ? 'No fue posible guardar la categoria. Ya existe una categoria con el nombre que intenta guardar'
    : 'No fue posible guardar la categoria. Favor de intentar nuevamente'

  mostrarNotificacionNegativa(errorString, 2100)
})

/**
 * onMounted
 */
onMounted(() => {
  obtenerCuentasContables(editedFormItem.value.tipoMovimientoId)
})

/**
 * GRAPHQL
 */
const options = ref({
  fetchPolicy: 'network-only'
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
function colorSelecionado(value) {
  ppproxy.value.hide()
}
</script>

<style lang="sass" scoped></style>
