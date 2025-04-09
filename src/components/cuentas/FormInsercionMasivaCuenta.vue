<template>
  <div class="my-card" style="width: 90%; min-width: 90%; max-width: 90%">
    <q-inner-loading
      :showing="isLoading"
      label="Saving... Please wait..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
      style="z-index: 500"
    />
    <DialogTitle>Cuenta &nbsp;&nbsp;~ {{ cuenta.nombre }} ~</DialogTitle>
    <div class="main-content q-py-lg">
      <div class="q-pa-lg cuenta-content">
        <q-toolbar class="q-gutter-x-md">
          <div class="row items-center q-gutter-x-md"></div>
          <q-toolbar-title> </q-toolbar-title>
          <q-btn
            color="negative"
            :disable="!isSelected"
            icon="las la-trash-alt"
            label="Eliminar"
            @click="eliminarSeleccionados"
            dense
          />
        </q-toolbar>
        <q-page-sticky
          position="top"
          style="z-index: 100; width: 600px"
          :offset="[508, 68]"
          expand
        >
          <!-- <transition name="fade">
            <div
              class="row bg-pink-1"
              v-if="errorsList.length > 0"
              style="width: 600px"
            >
              <div class="column">
                <div class="row q-gutter-x-md q-pl-sm q-pt-sm justify-between">
                  <div class="row inline items-center q-gutter-x-md">
                    <q-icon name="warning" size="1.5rem" color="negative" />
                    <span class="text-subtitle2 text-dark"
                      >El formulario contiene errores:</span
                    >
                  </div>
                  <q-btn
                    class="q-mr-xs"
                    color="more-button"
                    icon="close"
                    dense
                    round
                    flat
                    @click="closeErrors"
                  />
                </div>
                <q-list>
                  <q-item
                    :inset-level="0.5"
                    dense
                    v-for="error in errorsList"
                    :key="error.code"
                    class="col"
                    style="width: 600px"
                  >
                    <q-item-section
                      avatar
                      dense
                      style="min-width: 25px !important; width: 25px !important"
                    >
                      <q-icon color="primary" name="arrow_right" />
                    </q-item-section>
                    <q-item-section class="text-subtitle2 row inline">
                      <div class="row inline">
                        <span class="q-mr-md" v-if="error.numero_linea"
                          >Línea: {{ error.numero_linea }}</span
                        ><span class="errors__item--message">{{
                          error.message
                        }}</span>
                      </div></q-item-section
                    >
                  </q-item>
                </q-list>
              </div>
            </div>
          </transition> -->
        </q-page-sticky>
        <q-card-section style="max-height: 60vh; height: 60vh" class="scroll">
          <q-table
            :rows="listaRegistros"
            :columns="columns"
            :rows-per-page-options="[0]"
            row-key="consecutivo"
            dense
            separator="cell"
            selection="multiple"
            v-model:selected="registrosSelected"
            :selected-rows-label="getSelectedString"
            table-header-class="text-accent text-condensed bg-primary-light"
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
              </q-th>
            </template>
            <template #header-cell-categoria="props">
              <q-th :props="props" class="text-left">
                <div class="">
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
            <template #body-cell-fecha="props">
              <q-td :props="props">
                <DateInput
                  v-model="props.row.fecha"
                  :fecha-inicio="fecha_inicio"
                  :fecha-fin="fecha_fin"
                  :agregar="true"
                  @focus="focusDate(props)"
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
                ></q-input>
              </q-td>
            </template>
            <template #body-cell-importe="props">
              <q-td :props="props">
                <PriceInput
                  v-model="props.row.importe"
                  label="Importe"
                ></PriceInput>
              </q-td>
            </template>
            <template #body-cell-categoria="props">
              <q-td :props="props">
                <div class="column col">
                  <div>
                    <TipoMovimientoSelect
                      v-model="props.row.tipoMovimiento"
                      :tipo-afectacion="props.row.tipo_afectacion"
                      @categoriaSaved="categoriaSaved"
                    ></TipoMovimientoSelect>
                  </div>
                  <!-- <transition name="fade">
                    <div class="requerido" v-if="!props.row.isValid">
                      <div class="requerido__message">
                        <q-icon
                          name="las la-exclamation-triangle"
                          size="16px"
                        />
                        Requerido
                      </div>
                    </div>
                  </transition> -->
                </div>
              </q-td>
            </template>
            <!-- <template #body-cell-importe="props">
              <q-td :props="props">
                <span
                  :class="[
                    props.row.importe > 0
                      ? 'importe_positivo'
                      : 'importe_negativo'
                  ]"
                >
                  {{ formato.toCurrency(parseFloat(props.row.importe)) }}
                </span>
              </q-td>
            </template> -->
            <!-- <template #bottom-row>
          <q-tr>
            <q-td class="text-bold" colspan="4">Total Movimientos:</q-td>
            <q-td align="right" class="text-bold">
              {{ formato.toCurrency(sumatoriaMovimientos) }}</q-td
            >
          </q-tr>
        </template> -->
          </q-table>
        </q-card-section>
        <q-card-actions style="border: 0px solid red">
          <div
            class="row justify-between items-center full-width"
            style="border: 0px solid green"
          >
            <div class="" style="border: 0px solid red">
              <span class="text-bold text-primary"> Importe Total:</span>
              <span class="q-pl-md text-secondary text-bold">{{
                formato.toCurrency(sumatoriaMovimientos)
              }}</span>
            </div>
            <div class="row q-gutter-x-lg">
              <q-btn
                flat
                label="Cancelar"
                v-close-popup
                no-caps
                color="negative"
                rounded
              />
              <q-btn
                label="Guardar"
                color="primary-button"
                @click="saveItems"
                no-caps
              />
            </div>
          </div>
        </q-card-actions>
      </div>
    </div>
  </div>
  <Teleport to="#modal">
    <q-dialog
      v-model="showRegistroCategoria"
      persistent
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <FormRegistroCategoria
        :edited-item="editedCategoriaParam"
        @categoriaSaved="categoriaSaved"
      ></FormRegistroCategoria>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFormato } from 'src/composables/utils/useFormato'
import { DateTime } from 'luxon'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import DateInput from '../formComponents/DateInput.vue'
import TipoMovimientoSelect from '../formComponents/TipoMovimientoSelect.vue'
import { SessionStorage, useQuasar } from 'quasar'
import { useRegistrosCrud } from 'src/composables/useRegistrosCrud'
import DialogTitle from '../formComponents/modal/DialogTitle.vue'
import PriceInput from '../formComponents/PriceInput.vue'
import FormRegistroCategoria from '../categorias/FormRegistroCategoria.vue'

/**
 * Composables
 */
const notificacion = useNotificacion()
const registrosCrud = useRegistrosCrud()
const $q = useQuasar()
/**
 * state
 */
const registrosSelected = ref([])
const listaRegistros = ref([])
const errorsList = ref([])
const fecha_inicio = ref('01/01/1900')
const fecha_fin = ref('01/01/1900')
const isLoading = ref(false)
const loadingRows = ref(false)
const showRegistroCategoria = ref(false)
const tipoMovimientoId = ref('2')
const editedCategoriaParam = ref({ tipoMovimientoId: tipoMovimientoId.value })

/**
 * composables
 */
const formato = useFormato()

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
/**
 * onMounted
 */
onMounted(() => {
  let desde = formato.formatoFechaFromISO(props.fecha_desde)
  let hasta = formato.formatoFechaFromISO(props.fecha_hasta)
  // console.log('desde', desde)
  fecha_inicio.value = desde
  fecha_fin.value = hasta
  for (let i = 0; i < 15; i++) {
    let fecha = ''
    if (i == 0) {
      fecha = desde
    }
    listaRegistros.value.push({
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
      clase: ''
    })
  }
})
/**
 * emits
 */
const emit = defineEmits(['itemsSaved'])

function getSelectedString() {
  return registrosSelected.value.length === 0
    ? ''
    : `${registrosSelected.value.length} registro${
        registrosSelected.value.length > 1 ? 's' : ''
      } seleccionados. Importe: ${formato.toCurrency(
        importe_seleccionado.value
      )} `
}

function addItem() {
  const item = {
    id: undefined,
    fecha: '',
    consecutivo: listaRegistros.value.length + 1,
    concepto: '',
    importe: '',
    categoria: {
      id: 0,
      nombre: ''
    },
    tipoAfectacion: 'C',
    clase: ''
  }
  listaRegistros.value.push(item)
}

function obtenerRegistros() {
  var registrosInput = []
  var opciones = ['1', '2']
  const user = SessionStorage.getItem('current_user')
  listaGuardar.value.forEach((item) => {
    if (opciones.indexOf(item.tipoMovimiento.tipoMovimientoId) !== -1) {
      const fecha = fechaFromFormat(item.fecha)
      registrosInput.push({
        estadoRegistroId: 2, //cerrado
        tipoAfectacion: obtenerTipoAfectacionCategoria(
          item.tipoMovimiento.tipoMovimientoId
        ),
        cuentaId: props.cuenta.id,
        categoriaId: item.tipoMovimiento.value.id,
        importe: parseFloat(item.importe),
        fecha: fecha.toISODate(),
        observaciones: item.concepto,
        userId: user.id
      })
    }
  })
  console.log('registrosInput:', registrosInput)
  return registrosInput
}

function fechaFromFormat(fecha) {
  return DateTime.fromFormat(fecha, 'dd/MM/yyyy').isValid
    ? DateTime.fromFormat(fecha, 'dd/MM/yyyy')
    : DateTime.fromFormat(fecha, 'dd-MM-yyyy')
}

function obtenerTipoAfectacionCategoria(tipoMovimientoId) {
  return tipoMovimientoId === '1' ? 'A' : 'C'
}

function obtenerTraspasos() {
  var traspasosInput = []
  listaGuardar.value.forEach((item) => {
    const fecha = DateTime.fromFormat(item.fecha, 'dd/MM/yyyy')
    const user = SessionStorage.getItem('current_user')

    if (item.tipoMovimiento.tipoMovimientoId === '3') {
      traspasosInput.push({
        fecha,
        observaciones: 'Traspaso entre cuentas',
        userId: user.id,
        traspasoDetalles: [
          {
            cuentaId: parseInt(item.tipoMovimiento.value.id),
            tipoCuentaTraspasoId: 1,
            importe: item.importe * -1
          },
          {
            cuentaId: parseInt(props.cuenta.id),
            tipoCuentaTraspasoId: 2,
            importe: item.importe
          }
        ]
      })
    }
  })
  return traspasosInput
}

function saveItems() {
  const containsErrors = validarMovimientos()
  if (containsErrors) {
    // setTimeout(() => {
    //   errorItems.value = []
    // }, 6000)
  } else {
    console.log('guardando items.....')
    // var lista_registros_tarjeta = []
    const listaGuardar = listaRegistros.value.filter((item) => {
      return (
        !!item.fecha && !!item.importe && !!item.categoria && item.importe != 0
      )
    })

    const message = `Se van a guardar ${listaGuardar.length} registros. ¿Desea continuar?`
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
}
function onConfirmarGuardar(listaGuardar) {
  const lista_registros_tarjeta = []
  listaGuardar.forEach((item) => {
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

  isLoading.value = true
  var registrosInput = obtenerRegistros()
  var traspasosInput = obtenerTraspasos()
  saveItemsAfterValidate(registrosInput, traspasosInput)
}

function saveItemsAfterValidate(registrosInput, traspasosInput) {
  isLoading.value = true
  registrosCrud.importarRegistros({
    registrosInput,
    traspasosInput
  })
}
registrosCrud.onDoneImportarRegistros(({ _data }) => {
  afterSaveItems()
})

function afterSaveItems() {
  notificacion.mostrarNotificacionPositiva(
    'Los movimientos se guardaron correctamente.',
    1700
  )
  emit('itemsSaved')
}

registrosCrud.onErrorImportarRegistros((error) => {
  isLoading.value = false
  notificacion.mostrarNotificacionNegativa(
    'Ocurrió un error el intentar guardar los movimientos',
    1500
  )
  console.log('Ocurrió un error')
  console.table('error', error.graphQLErrors[0])
  console.table('error', error.graphQLErrors[0].extensions)
})

function validarMovimientos() {
  console.log('validandoMovimientos....')
  errorsList.value.length = 0

  console.log('listaGuardar.value:', listaGuardar.value)
  if (listaGuardar.value.length <= 0) {
    addError(0, 0, 'No hay registros por guardar')
  }
  listaGuardar.value.forEach((item) => {
    if (item.tipoMovimiento) {
      const tipoMovimiento = item.tipoMovimiento
      if (!tipoMovimiento.value) {
        addError(1, item.consecutivo, 'Seleccionar cuenta destino.')
        item.isValid = false
      } else {
        item.isValid = true
      }
    } else {
      addError(1, item.consecutivo, 'Seleccionar una categoria.')
      item.isValid = false
    }
  })
  return errorsList.value.length > 0
  // , 4000
  // })
}

function addError(code, numero_linea, message) {
  errorsList.value.push({
    code,
    numero_linea,
    message
  })
}

function eliminarSeleccionados() {
  registrosSelected.value.forEach((item) => {
    var index = listaRegistros.value.indexOf(item)
    if (index !== -1) {
      listaRegistros.value.splice(index, 1)
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

const sumatoriaMovimientos = computed({
  get() {
    return listaGuardar.value.reduce((accumulator, registro) => {
      return accumulator + parseFloat(registro.importe)
    }, 0)
  }
})
const importe_seleccionado = computed({
  get() {
    return registrosSelected.value.reduce((accumulator, registro) => {
      return accumulator + parseFloat(registro.importe)
    }, 0)
  }
})
const listaGuardar = computed({
  get() {
    return listaRegistros.value.filter((item) => {
      return (
        !!item.fecha && !!item.importe && !!item.categoria && item.importe != 0
      )
    })
  }
})

const columns = [
  // { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
  {
    name: 'consecutivo',
    label: 'No.',
    field: 'consecutivo',
    sortable: true,
    align: 'left',
    filter: false,
    headerStyle: 'width:40px;max-width:40px'
  },
  {
    name: 'fecha',
    label: 'Fecha',
    field: 'fecha',
    sortable: true,
    align: 'left',
    filter: false,
    headerStyle: 'width:150px;max-width:150px',
    style: 'width:150px;max-width:150px'
  },
  {
    name: 'concepto',
    label: 'Concepto',
    field: 'concepto',
    sortable: true,
    align: 'left',
    filter: true
    // headerStyle: 'width:250px;max-width:250px',
    // style: 'width:250px;max-width:250px'
  },
  {
    name: 'importe',
    label: 'Importe',
    field: 'importe',
    sortable: true,
    align: 'right',
    headerStyle: 'width:160px;max-width:160px',
    style: 'width:160px;max-width:160px'
  },
  {
    name: 'categoria',
    label: 'Categoria',
    field: 'categoria',
    sortable: false,
    align: 'center',
    headerStyle: 'width:400px;max-width:400px',
    style: 'width:400px;max-width:400px'
  }
]
// function closeErrors() {
//   errorsList.value.length = 0
// }
function categoriaSaved() {
  console.log('La categoria fue guardada correctamente')
}

function focusDate(props) {
  const rowIndex = props.rowIndex
  const _columnIndex = props.colIndex
  const item = listaRegistros.value[rowIndex - 1]
  if (item && !props.row.fecha) {
    props.row.fecha = item.fecha
  }
}
function addItemCategoria(_props_row) {
  editedCategoriaParam.value = {
    tipoMovimientoId: tipoMovimientoId.value,
    cuentaContable: null,
    cuentaDefault: null,
    icono: 'insert_emoticon',
    color: '#019A9D'
  }
  showRegistroCategoria.value = true
}
</script>

<style lang="scss">
.btn-close {
  &:hover {
    color: $accent-light !important;
    transition: all ease-in 0.15s;
  }
}

.importe_negativo {
  color: red;
}
.importe_positivo {
  color: green;
}
.errors__item--message {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: -0.025rem;
  color: $negative-pastel;
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
.requerido {
  position: absolute;
  top: 5px;
  right: 20px;
  width: 20px;
  z-index: 50;
  &__message {
    font-size: 0.7rem !important ;
    background: rgb(243, 195, 195);
    color: #ff0000;
    position: fixed;
    top: 1;
    left: 1;
    padding: 3px;
    border: 3px solid red;
    border-style: double;
    border-radius: 5px;
    box-shadow:
      rgba(165, 138, 138, 0.76) 5px 14px 28px,
      rgba(145, 109, 109, 0.74) 5px 10px 10px;
  }
}
</style>
