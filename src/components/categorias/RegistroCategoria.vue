<template>
  <q-card class="my-card" style="width: 500px">
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
      <q-form @submit="saveItem" class="q-gutter-md">
        <div class="q-gutter-md">
          <q-btn-toggle
            v-model="editedFormItem.tipoMovimientoId"
            spread
            no-caps
            color="disable-button"
            text-color="gray-2"
            toggle-color="positive"
            toggle-text-color="white"
            :options="tiposMovimientoOptions"
            @update:model-value="onChangeTipoMovimiento"
            push
            glossy
          />
          <div class="q-pt-md">
            <div class="row q-gutter-x-md">
              <div class="col-auto">
                <q-btn @click="selectIcon" color="primary">
                  <q-icon
                    color="gray"
                    :name="editedFormItem.icono || 'extension'"
                    class="size"
                    size="2.5em"
                  />
                </q-btn>
              </div>
              <div class="col">
                <q-input
                  v-model="editedFormItem.nombre"
                  type="text"
                  label="Nombre"
                  dense
                  outlined
                  color="secondary"
                  autofocus
                  :rules="[(val) => !!val || 'Favor de ingresar el nombre']"
                  lazyRules
                />
              </div>
            </div>
          </div>
          <div>
            <q-input
              v-model="editedFormItem.descripcion"
              type="text"
              label="Descripcion"
              dense
              outlined
              color="secondary"
              :rules="[(val) => !!val || 'Favor de ingresar la descripción']"
              lazyRules
            />
          </div>
          <div></div>
          <div>
            <div class="col">
              <CuentaContableSelect
                v-model="editedFormItem.cuentaContable"
                :subnivel="cuentaContableOptions.cuentaContableSubnivel"
                :clasificacion="cuentaContableOptions.clasificacion"
                :tipo-afectacion="cuentaContableOptions.tipoAfectacion"
              ></CuentaContableSelect>
            </div>
          </div>
          <div class="">
            <div class="row" style="border: 0px solid red">
              <div class="col q-mr-xs">
                <q-input
                  outlined
                  color="secondary"
                  v-model="editedFormItem.color"
                  :rules="['anyColor']"
                  class="my-input"
                  style="min-width: 100%"
                  dense
                >
                  <template #before>
                    <div
                      :style="{
                        backgroundColor: `${editedFormItem.color}`,
                        height: 40 + 'px',
                        width: 40 + 'px'
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
                            '#019A9D',
                            '#D9B801',
                            '#E8045A',
                            '#B2028A',
                            '#2A0449',
                            '#019A9D',
                            '#1ad560'
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
              <div class="col q-ml-xs">
                <PriceInput
                  currency-code="MNX"
                  v-model="editedFormItem.importeDefault"
                ></PriceInput>
              </div>
            </div>
          </div>
          <div class="">
            <CuentaSelect
              v-model="editedFormItem.cuentaDefault"
              :opcional="true"
              label="Cuenta Bancaria por Defecto"
              hint="Esta cuenta se tomará por defecto al agregar un movimiento"
            ></CuentaSelect>
          </div>
        </div>
        <div class="col row justify-end q-pt-lg">
          <q-btn label="Cancelar" flat v-close-popup class="q-ml-sm" />
          <q-btn :label="lblSubmit" type="submit" color="primary-button" />
        </div>
      </q-form>
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
import { useQuery, useMutation } from '@vue/apollo-composable'
import { ref, computed, onMounted } from 'vue'
import { CATEGORIA_CREATE, CATEGORIA_UPDATE } from '/src/graphql/categorias'
import { LISTA_TIPOS_MOVIMIENTO } from 'src/graphql/movimientos'
import IconPicker from '/src/components/IconPicker.vue'
import CuentaContableSelect from '../formComponents/CuentaContableSelect.vue'
import CuentaSelect from '../formComponents/CuentaSelect.vue'
import PriceInput from '../formComponents/PriceInput.vue'
import { useNotificacion } from 'src/composables/utils/useNotificacion'

/**
 * composables
 */
const notificacion = useNotificacion()
/**
 * state
 */
const defaultItem = {
  id: null,
  nombre: null,
  icono: 'insert_emoticon',
  descripcion: null,
  color: '#019a9d',
  tipoMovimiento: null,
  tipoMovimientoId: '2',
  cuentaContable: null
}
const formItem = ref({ ...defaultItem })
// const cuentaContableSubnivel = ref(0)
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
    return (resultTipoMovimiento.value?.listaTiposMovimiento ?? []).filter(
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
const lblSubmit = computed({
  get() {
    return !!editedFormItem.value.id ? 'Actualizar' : 'Guardar'
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
function saveItem() {
  console.log('save item')
  const cuenta_contable_id = editedFormItem.value.cuentaContable?.id
  const cuentaDefaultId = editedFormItem.value.cuentaDefault?.id
  const input = {
    ...editedFormItem.value,
    cuentaContableId: parseInt(cuenta_contable_id),
    cuentaDefaultId: parseInt(cuentaDefaultId),
    tipoMovimientoId: parseInt(editedFormItem.value.tipoMovimientoId),
    importeDefault: parseFloat(editedFormItem.value.importeDefault ?? '0'),
    orden: 1000,
    tipoMovimiento: undefined,
    cuentaContable: undefined,
    cuentaDefault: undefined,
    __typename: undefined
  }
  console.log('guardando item:', input)
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
const { onResult: onResultTipoMovimiento, result: resultTipoMovimiento } =
  useQuery(LISTA_TIPOS_MOVIMIENTO, null, options)

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
    notificacion.mostrarNotificacionPositiva('Categoría creada correctamente.')
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
    emit('categoriaUpdated', itemUpdated, props.editedIndex)
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
function colorSelecionado(value) {
  ppproxy.value.hide()
}
</script>

<style lang="sass" scoped>
.my-input
  max-width: 250px
</style>
