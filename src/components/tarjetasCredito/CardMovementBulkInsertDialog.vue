<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="jump-up"
    transition-hide="jump-down"
    noBackdropDismiss
    title="Categoría"
  >
    <q-card class="my-card" dense style="width: 85%; min-width: 85%">
      <q-inner-loading
        :showing="isLoading"
        label="Guardando... Por favor espere..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
        style="z-index: 500"
      />
      <DialogTitle
        >Tarjeta de crédito &nbsp;&nbsp;~ {{ cuenta.nombre }} ~</DialogTitle
      >
      <q-card-section style="max-height: 80vh; height: 60vh" class="scroll">
        <q-table
          :rows="listaRegistrosTarjeta"
          :columns="columns"
          :rows-per-page-options="[0]"
          row-key="consecutivo"
          separator="cell"
          dense
          selection="multiple"
          v-model:selected="registrosSelected"
          :selected-rows-label="getSelectedString"
          table-header-class="text-condensed bg-primary-light text-accent"
          no-data-label="No existen datos disponibles"
          hide-pagination
          class="my-sticky-header-table"
          :loading="loadingRows"
        >
          <template #top>
            <q-th
              class="text-left"
              style="width: 120px; min-width: 120px; max-width: 120px"
            >
              <div
                class="row justify-between items-center"
                style="border: 0px solid red; width: 100%"
                width="100%"
              >
                <q-btn
                  color="primary-button"
                  icon="add"
                  @click="addItem"
                  dense
                  glossy
                  push
                  class="small-button"
                >
                  <q-tooltip> Agregar Registro </q-tooltip>
                </q-btn>
                <q-btn
                  :disable="!isSelected"
                  label="Eliminar"
                  @click="eliminarSeleccionados"
                  color="negative"
                  dense
                />
              </div>
            </q-th>
          </template>
          <template #header-cell-categoria="props">
            <q-th :props="props" class="text-left">
              <div class="row justify-start items-center">
                <span class="q-pl-md q-pr-sm">{{ props.col.label }}</span>
                <q-btn
                  color="button-new"
                  icon="add"
                  label="Agregar"
                  @click="addItemCategoria(props)"
                  dense
                  class="small-button"
                  glossy
                  push
                  tabindex="100"
                >
                  <q-tooltip> Nueva Categoría </q-tooltip>
                </q-btn>
              </div>
            </q-th>
          </template>
          <!-- <template #body-cell-concepto="props">
          <q-td :props="props" :class="props.row.clase">
            {{ props.row.concepto }}
          </q-td>
        </template> -->
          <template #body-cell-fecha="props">
            <q-td :props="props">
              <DateInput
                v-model="props.row.fecha"
                :fecha-inicio="fecha_inicio"
                :fecha-fin="fecha_fin"
                :agregar="true"
                @focus="focusDate(props)"
                :autofocus="props.row.autofocus"
                :tabindex="props.row.tabindex + 1"
              ></DateInput>
            </q-td>
          </template>
          <template #body-cell-concepto="props">
            <q-td :props="props">
              <q-input
                v-model="props.row.concepto"
                :class="props.row.clase"
                dense
                lazy-rules
                outlined
                color="primary-button"
                bg-color="blue-1"
                label-color="input-label"
                style="width: 100%"
                :tabindex="props.row.tabindex + 2"
              ></q-input>
            </q-td>
          </template>
          <template #body-cell-importe="props">
            <q-td :props="props">
              <PriceInput
                v-model="props.row.importe"
                label="Importe"
                :tabindex="props.row.tabindex + 3"
              ></PriceInput>
            </q-td>
          </template>
          <template #body-cell-categoria="props">
            <q-td :props="props">
              <CategoriaSelect
                v-model="props.row.categoria"
                :tipo-afectacion="props.row.tipoAfectacion"
                :agregar="false"
                :clearable="false"
                :tabindex="props.row.tabindex + 4"
              ></CategoriaSelect>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions class="q-pa-xs">
        <div class="row justify-between items-center full-width text-accent">
          <div class="col-9 q-pl-xl">
            <table style="border: 0px solid red">
              <tbody>
                <tr>
                  <td>Importe Total:</td>
                  <td class="summary__value">
                    {{ toCurrency(sumatoriaImporte) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-3 q-py-md">
            <div class="row justify-center">
              <q-btn flat label="Cancelar" v-close-popup class="q-mr-lg" />
              <q-btn
                label="Guardar"
                color="primary-button"
                @click="saveItems"
              />
            </div>
          </div>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
/**
 * imports
 */
import { ref, computed, onMounted } from 'vue'
import CategoriaSelect from '../formComponents/CategoriaSelect.vue'
import { useFormato } from 'src/composables/utils/useFormato'
import DateInput from '../formComponents/DateInput.vue'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import DialogTitle from '../formComponents/modal/DialogTitle.vue'
import { useRegistrosTarjetaCrud } from 'src/composables/useRegistrosTarjetaCrud'
import PriceInput from '../formComponents/PriceInput.vue'
import { Dialog, useDialogPluginComponent, useQuasar } from 'quasar'
import RegistroCategoriaDialog from '../categorias/RegistroCategoriaDialog.vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

/**
 * state
 */

const registrosSelected = ref([])
const listaRegistrosTarjeta = ref([])
const fecha_inicio = ref('01/01/1900')
const fecha_fin = ref('01/01/1900')
const isLoading = ref(false)
const loadingRows = ref(false)

const tipoMovimientoId = ref('2')
const editedCategoriaParam = ref({ tipoMovimientoId: tipoMovimientoId.value })
/**
 * composables
 */
const formato = useFormato()

const { mostrarNotificacionPositiva, mostrarNotificacionNegativa } =
  useNotificacion()

const { toCurrency } = useFormato()
const registrosTarjetaCrud = useRegistrosTarjetaCrud()
const $q = useQuasar()

/**
 * defProperties
 */
const props = defineProps({
  cuenta: {
    type: Object,
    required: true,
    default: () => {
      return {}
    }
  },
  fecha_desde: {
    type: String,
    required: true,
    default: () => {
      return null
    }
  },
  fecha_hasta: {
    type: String,
    required: true,
    default: () => {
      return null
    }
  }
})
onMounted(() => {
  let desde = formato.formatoFechaFromISO(props.fecha_desde)
  let hasta = formato.formatoFechaFromISO(props.fecha_hasta)
  fecha_inicio.value = desde
  fecha_fin.value = hasta
  listaRegistrosTarjeta.value
  let autofocus = true
  let tabindex = 0
  for (let i = 0; i < 25; i++) {
    let fecha = ''
    if (i == 0) {
      fecha = desde
    }
    tabindex = i * 4
    listaRegistrosTarjeta.value.push({
      id: undefined,
      fecha: fecha,
      consecutivo: i + 1,
      concepto: '',
      importe: '',
      categoria: {
        id: 0,
        nombre: ''
      },
      tipoAfectacion: 'C',
      clase: '',
      autofocus,
      tabindex
    })
    autofocus = false
  }
})
/**
 * emits
 */
defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

// const emit = defineEmits(['categoriaSaved', 'categoriaUpdated'])
const { dialogRef, onDialogHide, onDialogOK, _onDialogCancel } =
  useDialogPluginComponent()

/**
 * computed
 */
const listaGuardar = computed({
  get() {
    return listaRegistrosTarjeta.value.filter((item) => {
      return (
        !!item.fecha &&
        !!item.importe &&
        !!item.categoria.id &&
        item.categoria?.id !== 0 &&
        item.importe != 0
      )
    })
  }
})

const sumatoriaImporte = computed({
  get() {
    return listaRegistrosTarjeta.value.reduce((accumulator, registro) => {
      return accumulator + parseFloat(registro.importe)
    }, 0)
  }
})

function saveItems() {
  try {
    const containsErrors = validarMovimientos()
    if (!containsErrors) {
      const message = `Se van a guardar ${listaGuardar.value.length} registros. ¿Desea continuar?`
      $q.dialog({
        title: 'Confirmar',
        style: 'width:500px',
        message,
        ok: {
          push: true,
          color: 'positive',
          label: 'Continuar'
        },
        cancel: {
          push: true,
          color: 'negative',
          flat: true,
          label: 'cancelar'
        },
        persistent: true
      })
        .onOk(() => {
          onConfirmarGuardar(listaGuardar)
        })
        .onCancel(() => {})
        .onDismiss(() => {})
    }
  } catch (error) {
    console.error('Error al guardar los items:', error)
    console.log('error.message:', error.message)
    toast(`${error.message}`, {
      theme: 'auto',
      type: 'error',
      dangerouslyHTMLString: true,
      autoClose: 2000
    })
  }
  // console.log('lista_registros_tarjeta:', lista_registros_tarjeta)
  // registrosTarjetaCrud.registroTarjetaMultipleCreate({
  //   input: lista_registros_tarjeta
  // })
}
function onConfirmarGuardar() {
  const lista_registros_tarjeta = []
  listaGuardar.value.forEach((item) => {
    const registro = {
      estadoRegistroTarjetaId: 1, //pendiente
      tipoAfectacion: item.tipoAfectacion,
      cuentaId: props.cuenta.id,
      categoriaId: item.categoria.id,
      importe: item.importe * -1,
      fecha: formato.convertDateFromInputToIso(item.fecha),
      concepto: item.concepto
    }
    lista_registros_tarjeta.push(registro)
  })

  console.table(listaGuardar.value)
  isLoading.value = true
  console.log('lista_registros_tarjeta:', lista_registros_tarjeta)
  registrosTarjetaCrud.registroTarjetaMultipleCreate({
    input: lista_registros_tarjeta
  })
}

function addItem() {
  const item = {
    id: undefined,
    fecha: '',
    consecutivo: listaRegistrosTarjeta.value.length + 1,
    concepto: '',
    importe: '',
    categoria: {
      id: 0,
      nombre: ''
    },
    tipoAfectacion: 'C',
    clase: ''
  }
  listaRegistrosTarjeta.value.push(item)
}

registrosTarjetaCrud.onDoneRegistroTarjetaMultipleCreate(({ data }) => {
  if (data) {
    console.log('data:', data)
    const registrosTarjeta = data.registroTarjetaMultipleCreate.registrosTarjeta
    if (registrosTarjeta) {
      const cuenta_id = registrosTarjeta[0].cuenta.id
      isLoading.value = false
      // emit('itemsSaved', cuenta_id)
      mostrarNotificacionPositiva(
        'Se guardaron los registros correctamente',
        900
      )
      onDialogOK(cuenta_id)
    }
  }
})

registrosTarjetaCrud.onErrorRegistroTarjetaMultipleCreate((error) => {
  console.error(error)
  isLoading.value = false
  mostrarNotificacionNegativa(
    'No fue posible posible guardar los registro, revisar consola',
    900
  )
})

/**
 * Funcion utilizada para validar los movimiento al momento de guardar
 */
function validarMovimientos() {
  console.log('listaGuardar:', listaGuardar.value)
  console.log('listaGuardar.length:', listaGuardar.value.length)
  if (listaGuardar.value.length <= 0) {
    throw new Error('No hay registros para guardar')
  }

  console.log('listaGuardar:', listaGuardar)
}

/**
 * Funcion utilizada para eliminar varios movimientos seleccionados
 */
function eliminarSeleccionados() {
  // console.log('eliminar seleccionados', registrosSelected.value)
  registrosSelected.value.forEach((item) => {
    var index = listaRegistrosTarjeta.value.indexOf(item)
    if (index !== -1) {
      listaRegistrosTarjeta.value.splice(index, 1)
    }
  })
  registrosSelected.value.length = 0
}

/**
 * computed
 */
const isSelected = computed({
  get() {
    return registrosSelected.value.length > 0
  }
})

const columns = [
  // { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
  {
    name: 'consecutivo',
    label: 'No.',
    field: 'consecutivo',
    sortable: true,
    align: 'center',
    filter: true,
    style: 'width:55px',
    headerStyle: 'width:55px'
  },
  {
    name: 'fecha',
    label: 'Fecha',
    field: 'fecha',
    sortable: true,
    align: 'center',
    filter: false,
    style: 'width:150px;min-width: 150px;max-width: 150px',
    headerStyle: 'width: 150px;min-width: 150px;max-width: 150px'
  },
  {
    name: 'concepto',
    label: 'Observaciones',
    field: 'concepto',
    sortable: true,
    align: 'left',
    filter: true
  },
  {
    name: 'importe',
    label: 'Importe',
    field: 'importe',
    align: 'right',
    // format: (val, row) => `${formato.toCurrency(parseFloat(val))}`,
    style: 'width:160px; min-width: 160px; max-width: 160px',
    headerStyle: 'width:160px; min-width: 160px; max-width: 160px'
  },
  {
    name: 'categoria',
    label: 'Categoria',
    field: 'categoria',
    sortable: false,
    filter: false,
    align: 'left',
    style: 'width:400px;max-width:400px',
    headerStyle: 'width:400px;max-width:400px'
  }
]

const importe_seleccionado = computed({
  get() {
    return registrosSelected.value.reduce((accumulator, registro) => {
      return accumulator + parseFloat(registro.importe)
    }, 0)
  }
})

function getSelectedString() {
  return registrosSelected.value.length === 0
    ? ''
    : `${registrosSelected.value.length} registro${
        registrosSelected.value.length > 1 ? 's' : ''
      } seleccionados - Importe: ${formato.toCurrency(
        importe_seleccionado.value
      )} `
}
function addItemCategoria(_props_row) {
  editedCategoriaParam.value = {
    tipoMovimientoId: tipoMovimientoId.value,
    cuentaContable: null,
    cuentaDefault: null,
    icono: 'insert_emoticon',
    color: '#019A9D'
  }
  // showRegistroCategoria.value = true
  openRegistroCategoriaDialog(editedCategoriaParam.value)
}
function openRegistroCategoriaDialog(itemToAddOrUpdate) {
  console.log('itemToAddOrUpdate:', itemToAddOrUpdate)
  Dialog.create({
    component: RegistroCategoriaDialog,
    parent: this,
    componentProps: {
      editedItem: itemToAddOrUpdate
    },
    onOk: (payload) => {
      // categoriaSaved(itemSaved)
      console.log('categoriaSaved', payload)
      // mostrarNotificacion(payload.operacion, payload.item)
      // categoriasCrud.refetchListaCategorias()
    },
    onCancel: () => {
      console.log("'Cancel clicked'")
    }
  })
}

function focusDate(props) {
  const rowIndex = props.rowIndex
  // const columnIndex = props.colIndex
  const item = listaRegistrosTarjeta.value[rowIndex - 1]
  if (!!item && !props.row.fecha) {
    props.row.fecha = item.fecha
  }
}
</script>

<style lang="scss" scoped>
.btn-close {
  &:hover {
    color: $accent-light !important;
    transition: all ease-in 0.15s;
  }
}
.fade-enter-from {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}
.fade-enter-active {
  transition: all 0.5s ease-in;
}
.fade-leave-from {
  opacity: 1;
}
.fade-leave-to {
  opacity: 0;
}
.fade-leave-active {
  transition: all 0.5s ease-out;
}

.registro-abono {
  color: $negative-pastel !important;
  font-weight: 500;
}

.my-sticky-header-table {
  /* height or max-height is important */
  height: 100%;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: $main-background;
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:first-child th {
    top: 0;
  }

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }

  /* prevent scrolling behind sticky top row on focus */
  tbody {
    /* height of all previous header rows */
    scroll-margin-top: 48px;
  }
}
.summary__value {
  font-family: 'Roboto Slab';
  font-size: 0.8rem;
  width: 100px;
  text-align: right;
  font-weight: bold;
}
</style>
