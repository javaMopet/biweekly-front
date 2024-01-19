<template>
  <div
    class="my-card bg-main-background"
    style="width: 1200px; min-width: 1200px; overflow: hidden"
  >
    <DialogTitle
      ><div class="row items-center" style="border: 0px solid red">
        <q-avatar
          size="38px"
          font-size="23px"
          text-color="white"
          :icon="categoria.icono"
          :style="`background-color: ${categoria.color} !important`"
        />
        <div class="dialog__title--name">
          {{ categoria.nombre }}
        </div>
      </div></DialogTitle
    >

    <div class="main-content q-py-lg">
      <div class="cuenta-content">
        <!-- <transition name="fade">
          <div class="errors-message bg-pink-1" v-if="!isErrors">
            <div class="row">
              <div class="col-1">
                <div
                  class="row justify-center items-start q-pt-md"
                  style="height: 100%"
                >
                  <q-icon name="warning" size="3rem" color="negative" />
                </div>
              </div>
              <div class="col-10">
                <div class="q-py-sm">
                  <q-linear-progress
                    query
                    rounded
                    color="primary-light"
                    class="q-mt-sm"
                    size="8px"
                    stripe
                  />
                  <div
                    class="row items-center q-gutter-x-lg"
                    style="border: 0px solid red"
                  >
                    <span class="errors-message__title"
                      >El formulario contiene los siguientes errores:</span
                    >
                  </div>
                </div>
                <q-list dense>
                  <q-item
                    dense
                    v-for="item in errorItems"
                    :key="item.id"
                    class="errors-message__item"
                  >
                    {{
                      !item.numeroLinea ? '' : `No. Línea ${item.numeroLinea}`
                    }}
                    -> {{ item.message }}
                  </q-item>
                </q-list>
              </div>
              <div class="col">
                <div class="column items-end">
                  <q-btn
                    color="primary"
                    icon="close"
                    dense
                    flat
                    class="errors-message__closeBtn"
                    @click="closeErrors"
                  />
                </div>
              </div>
            </div>
          </div>
        </transition> -->
        <q-card-section>
          <div class="row q-gutter-md text-primary">
            <span class="">Periodo:</span
            ><span class="tarjeta__resumen-valor text-bold">{{
              periodoFormato
            }}</span>
          </div>
        </q-card-section>
        <div
          style="max-height: 65vh; height: 65vh; border: 0px solid red"
          class="scroll"
        >
          <q-table
            :rows="listaRegistros"
            :columns="columns"
            row-key="id"
            :rows-per-page-options="[0]"
            hide-pagination
            dense
            bordered
            class="my-sticky-header-table"
            separator="horizontal"
            selection="multiple"
            v-model:selected="selectedItems"
            no-data-label="No hay registros para esta categoria y periodo"
          >
            <template #top>
              <q-td class="full-width">
                <q-toolbar>
                  <q-btn
                    no-caps
                    icon="las la-trash-alt"
                    color="negative-pastel"
                    label="Eliminar"
                    @click="deleteSelectedItems"
                    :disable="!isSelected"
                    dense
                  />
                  <q-toolbar-title></q-toolbar-title>

                  <!--  -->
                  <div
                    v-if="isEditing"
                    class="row q-gutter-x-md items-center actualizando-class"
                  >
                    <span
                      :class="{
                        'bg-accent-light': isEditing,
                        'actualizando-class': true
                      }"
                    >
                      Actualizando ...</span
                    >
                    <q-btn
                      color="negative-pastel"
                      icon="las la-ban"
                      no-caps
                      label="Cancelar"
                      @click="cancelEditItem"
                      dense
                    />
                  </div>
                </q-toolbar>
              </q-td>
            </template>
            <template #header-cell-fecha="props">
              <q-th :props="props" class="bg-white"
                ><DateInput
                  v-model="formItem.fecha"
                  lbl_field="Fecha"
                  :optional="false"
                  :rango-fecha-inicio="categoria.fecha_inicio_formato"
                  :rango-fecha-fin="categoria.fecha_fin_formato"
                ></DateInput
              ></q-th>
            </template>
            <template #header-cell-importe="props">
              <q-th :props="props">
                <!-- Precio -->
                <!-- :is-error="errors.isPriceError" -->
                <PriceInput
                  v-model="formItem.importe"
                  :autofocus="true"
                  :is-error="errors.isPriceError"
                  ref="inputPrecio"
                ></PriceInput>
              </q-th>
            </template>
            <template #header-cell-cuenta="props">
              <q-th :props="props">
                <CuentaSelect
                  v-model="formItem.cuenta"
                  :agregar="false"
                  :filter-array="['1', '2']"
                ></CuentaSelect>
              </q-th>
            </template>
            <template #header-cell-observaciones="props">
              <q-th :props="props">
                <q-input
                  v-model="formItem.observaciones"
                  type="textarea"
                  label="observaciones"
                  dense
                  outlined
                  color="secondary"
                  rows="1"
                  lazy-rules
                />
              </q-th>
            </template>
            <template #header-cell-acciones="props">
              <q-th :props="props">
                <div class="row justify-start">
                  <q-btn
                    v-if="!editingItem"
                    color="primary"
                    label="Agregar"
                    @click="saveItem"
                    no-caps
                    rounded
                    dense
                  />

                  <q-btn
                    v-else
                    class="button-save"
                    icon="save"
                    @click="saveItem"
                    flat
                  >
                    <q-tooltip :offset="[10, 10]"> Actualizar </q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="editingItem"
                    class="button-cancel"
                    icon="las la-ban"
                    @click="cancelEditItem(props)"
                    flat
                  >
                    <q-tooltip :offset="[10, 10]"> Cancelar </q-tooltip></q-btn
                  >
                </div>
              </q-th>
            </template>
            <template v-slot:body-cell-acciones="props">
              <q-td :props="props">
                <q-btn
                  :disable="isEditing"
                  class="button-edit"
                  @click="editItem(props)"
                  icon="las la-edit"
                  no-caps
                  dense
                  flat
                >
                  <!-- icon="las la-edit" -->
                  <q-tooltip
                    v-if="!isEditing"
                    :offset="[10, 10]"
                    transition-duration="900"
                  >
                    Editar
                  </q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
        <q-card-actions vertical>
          <div class="row q-pl-lg q-gutter-x-md">
            <span class="text-condensed text-primary">
              Importe total registros:</span
            >
            <span class="text-bold">
              {{ formato.toCurrency(sumatoriaRegistros) }}</span
            >
          </div>
          <div class="row inline justify-between items-center fit q-pa-md">
            <div class=""></div>
          </div>
        </q-card-actions>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import DateInput from '../formComponents/DateInput.vue'
import { DateTime } from 'luxon'
import { LISTA_REGISTROS } from 'src/graphql/registros'
import { CATEGORIA_BY_ID } from 'src/graphql/categorias'
import PriceInput from '../formComponents/PriceInput.vue'
import { useFormato } from 'src/composables/utils/useFormato'
import CuentaSelect from '../formComponents/CuentaSelect.vue'
import { useRegistrosCrud } from 'src/composables/useRegistrosCrud'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { SessionStorage, useQuasar } from 'quasar'
import DialogTitle from '../formComponents/modal/DialogTitle.vue'
import { toast } from 'vue3-toastify'

/**
 * composables
 */
const formato = useFormato()
const registrosCrud = useRegistrosCrud()
const {
  mostrarNotificacionPositiva,
  mostrarNotificacionNegativa,
  mostrarNotificacionInformativa
} = useNotificacion()
const $q = useQuasar()

/**
 * state
 */
const categoria = ref({})
const inputPrecio = ref()
const errorItems = ref([])
const listaEncabezado = ref([])
const listaRegistros = ref([])
const errorsList = ref([])
const defaultFormItem = {
  fecha: '',
  importe: '',
  cuenta: null,
  observaciones: ''
}
const formItem = ref({ ...defaultFormItem })
const errors = ref({
  isPriceError: false
})
const selectedItems = ref([])
const editingItem = ref(null)

const props = defineProps({
  cellData: {
    type: Object,
    required: true,
    default: () => {
      return {}
    }
  }
})

const emit = defineEmits(['registroCreated', 'registroUpdated'])

onMounted(() => {
  inicializarFormulario()
})

const columns = [
  {
    name: 'fecha',
    label: 'Fecha',
    field: 'fecha',
    format: (val) => DateTime.fromISO(val).toFormat('dd-MM-yyyy'),
    sortable: false,
    align: 'center',
    headerStyle: 'width:13%'
  },
  {
    name: 'importe',
    label: 'Importe',
    field: (row) => row.importe,
    format: (val, row) => `${obtenerFormatoImporte(val)}`,
    sortable: false,
    align: 'right',
    headerStyle: 'width:15%;max-width:15%;min-width:15%'
  },
  {
    name: 'cuenta',
    label: 'Cuenta',
    field: (row) => row.cuenta?.nombre || '',
    sortable: false,
    align: 'left',
    headerStyle: 'width: 30%;max-width:30%;min-width:30%'
  },
  {
    name: 'observaciones',
    label: 'Observaciones',
    field: (row) => row.observaciones,
    sortable: false,
    align: 'left',
    style: 'text-wrap: wrap; min-width:40%;max-width:40%',
    headerStyle: 'width:32%',
    style: 'text-wrap: wrap'
  },
  {
    name: 'acciones',
    label: 'Acciones',
    field: '',
    sortable: false,
    align: 'center',
    headerStyle: 'width: 8%;text-wrap: wrap',
    style: 'text-wrap: wrap'
  }
]

function editItem(props) {
  const rowIndex = props.rowIndex
  const row = props.row
  editingItem.value = {
    rowIndex,
    row
  }

  console.log(row.categoria.tipoMovimientoId)
  const importe =
    row.categoria.tipoMovimientoId === '2'
      ? parseFloat(row.importe) * -1
      : parseFloat(row.importe)

  const fecha = formato.convertDateFromIsoToInput(row.fecha)

  formItem.value = {
    fecha,
    importe: importe.toString(),
    cuenta: row.cuenta,
    observaciones: row.observaciones
  }
  console.log('estableciendo formItem', formItem.value)
}

function entradaNoValida() {
  // errors.value.isPriceError = false
  const importe = parseFloat(formItem.value.importe)
  errors.value.isPriceError = false
  errors.value.isPriceError = !importe || importe === 0

  console.log(errors.value.isPriceError)

  // if (!importe || importe === 0) {
  //   errors.value.isPriceError = !errors.value.isPriceError
  // setTimeout(() => {
  //   errors.value.isPriceError = false
  // }, 2500)
  // mostrarNotificacionNegativa('', 1200, 'top')
  // toast.error('Favor de ingresar el precio !', {
  //   autoClose: 1800
  // }) // ToastOptions
  // }
  const cuentaBancariaId = formItem.value.cuenta?.id || null
  errors.value.isCuentaError = !cuentaBancariaId
  // if (!cuentaBancariaId) {
  //   errors.value.is
  // mostrarNotificacionNegativa(
  //   '',
  //   1200,
  //   'top'
  // )
  // toast.error('Favor de ingresar la cuenta bancaria!', {
  //   autoClose: 2800
  // }) // ToastOptions
  // }
  return errors.value.isPriceError || errors.value.isCuentaError
}

function cancelEditItem() {
  editingItem.value = null
  formItem.value = { ...defaultFormItem }
  inicializarFecha()
}

function inicializarFormulario() {
  formItem.value = { ...defaultFormItem }
  inicializarFecha()

  let importe = categoria.value.importeDefault?.toString() ?? ''
  importe = importe === 0 || importe === '0' ? '' : importe

  formItem.value.importe = importe
  formItem.value.cuenta = categoria.value.cuentaDefault
  formItem.value.observaciones = categoria.value.descripcion
}

function deleteSelectedItems() {
  console.log('Eliminacion....')
  console.dir(selectedItems.value)
  console.table(selectedItems.value)

  const message = `Va a eliminar permanentemente ${selectedItems.value.length} registros. ¿Está seguro que desea continuar con la eliminación?`
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
      confirmarEliminarSelectedItems()
    })
    .onCancel(() => {})
    .onDismiss(() => {})
}
function confirmarEliminarSelectedItems() {
  const ids = selectedItems.value.map((selected) => selected.id)
  console.log(ids.toString())
  registrosCrud.registrosDelete({ ids: ids.toString() })
}

registrosCrud.onErrorRegistrosDelete((error) => {
  console.trace(error)
})
registrosCrud.onDoneRegistrosDelete(({ data }) => {
  console.log('data', data)
  mostrarNotificacionPositiva('los registros se eliminaron correctamente')
  selectedItems.value = []
  reloadListaRegistros()
})

function inicializarFecha() {
  console.log('fecha_inicio', props.cellData.fecha_inicio)
  formItem.value.fecha = formato.convertDateFromIsoToInput(
    props.cellData.fecha_inicio
  )
}
/**
 * Methods
 */

function saveItem() {
  if (!entradaNoValida()) {
    if (['1', '2'].includes(categoria.value.tipoMovimiento.id)) {
      const tipoAfectacion =
        categoria.value.tipoMovimiento.id === '1' ? 'A' : 'C'
      const importe =
        tipoAfectacion === 'C'
          ? parseFloat(formItem.value.importe) * -1
          : parseFloat(formItem.value.importe)
      const input = {
        id: editingItem.value?.row.id ?? undefined,
        categoriaId: categoria.value.id,
        estadoRegistroId: 2,
        tipoAfectacion,
        cuentaId: parseInt(formItem.value.cuenta.id),
        importe,
        fecha: formato.convertDateFromInputToIso(formItem.value.fecha),
        observaciones: formItem.value.observaciones,
        userId: SessionStorage.getItem('user').id
      }
      if (!!editingItem.value) {
        const id = editingItem.value.row.id
        console.dir(id)
        registrosCrud.registroUpdate({ id, input })
      } else {
        registrosCrud.createRegistro({ input })
      }
    }
  } else {
    console.log('Existen errores de validacion')
  }
}

function isInputItemValid(row) {
  console.log('row', row)
  errorsList.value.length = 0
  if (!row.fecha) {
    addError(1, 'Favor de ingresar la fecha del registro')
  }
  if (!(row.importe !== 0)) {
    addError(2, 'Ingresar un importe mayo a cero')
  }
  if (!row.cuenta) {
    addError(3, 'Favor de seleccionar una cuenta de gasto')
  }
  return errorsList.value.length <= 0
}
function addError(code, message) {
  errorsList.value.push({
    code,
    message
  })
}

registrosCrud.onDoneRegistroCreate(({ data }) => {
  console.log('data', data)
  const itemSaved = data.registroCreate.registro
  afterSaveItem('Ingreso', itemSaved)
})

registrosCrud.onDoneRegistroUpdate(({ data }) => {
  console.log('data', data)
  const itemUpdated = data.registroUpdate.registro
  afterUpdateItem('Ingreso', itemUpdated)
})

function afterSaveItem(tipoRegistro, itemSaved) {
  console.log('item saved')
  // row_to_insert.value.saved = true
  listaRegistros.value.push(itemSaved)
  mostrarNotificacionPositiva(`El registro se guardado correctamente.`, 1500)
  emit('registroCreated', itemSaved)
  inicializarFormulario()
}
function afterUpdateItem(itemUpdated) {
  // const rowIndex = editingItem.value.rowIndex
  // listaRegistros.value[rowIndex] = itemUpdated
  mostrarNotificacionPositiva(`El registro se actualizó correctamente.`, 1500)
  reloadListaRegistros()
  emit('registroUpdated', itemUpdated)
  editingItem.value = null
  inicializarFormulario()
}

registrosCrud.onErrorRegistroCreate((error) => {
  console.trace(error)
  console.log('error', error.graphQLErrors[0])
  console.log('error', error.graphQLErrors[0]?.extensions)
  console.table('error', error.graphQLErrors[0]?.extensions.problems)
})
function obtenerFechaISO(fecha_formato) {
  const date = !!fecha_formato
    ? DateTime.fromFormat(fecha_formato, 'dd/MM/yyyy')
    : null
  return date?.toISODate()
}

function deleteItem(item) {
  console.log('item', item.row)
  console.log('item index', item.rowIndex)

  if (!!item.row.saved) {
    console.log('el registro esta guardado')
    confirmarEliminacion(item)
  } else {
    listaRegistros.value.splice(item.rowIndex, 1)
  }
}
function confirmarEliminacion(item) {
  item.row
}

function validarPrecio(value) {
  // console.log('validar precio', value)
}
function obtenerFormatoImporte(val) {
  return formato.toCurrency(
    parseFloat(categoria.value.tipoMovimiento.id === '2' ? val * -1 : val)
  )
}
/**
 * graphql
 */
const graphql_options = ref({
  fetchPolicy: 'network-only'
})

const { onError: onErrorCategoriaById, onResult: onResultCategoriaById } =
  useQuery(
    CATEGORIA_BY_ID,
    {
      id: props.cellData.categoriaId
    },
    graphql_options
  )

const {
  onError: onErrorListaRegistros,
  onResult: onResultListaRegistros,
  load: loadListaRegistros,
  refetch: reloadListaRegistros
} = useLazyQuery(
  LISTA_REGISTROS,
  {
    cuentaId: null,
    categoriaId: props.cellData.categoriaId,
    fechaInicio: props.cellData.fecha_inicio,
    fechaFin: props.cellData.fecha_fin
  },
  graphql_options
)

onResultListaRegistros(({ data }) => {
  console.log('data registros', data.obtenerRegistros)
  if (data.obtenerRegistros.length > 0) {
    listaRegistros.value = JSON.parse(JSON.stringify(data.obtenerRegistros))
    listaRegistros.value.forEach((element) => {
      // element.fecha = formato.convertDateFromIsoToInput(element.fecha)
      element.importe = element.importe.toString()
      element.saved = true
    })
  }
})

onResultCategoriaById(({ data }) => {
  // console.log('data', data)
  categoria.value = data.categoriaById
  console.dir(categoria.value)
  buscarMovimientos()
  inicializarFormulario()
})

onErrorListaRegistros((error) => {
  console.error('error', error)
})

onErrorCategoriaById((error) => {
  console.error('error', error)
})

/**
 * computed
 */
const periodoFormato = computed({
  get() {
    return `Del: ${formato.convertDateFromIsoToInput(
      props.cellData.fecha_inicio
    )} Al: ${formato.convertDateFromIsoToInput(props.cellData.fecha_fin)}`
  }
})

const isErrors = computed({
  get() {
    return errorItems.value.length > 0
  }
})
// const importeValido = ref(true)

const isImporteValido = (importeValido) => {
  return importeValido
}
const isCuentaValida = (cuentaValida) => {
  return cuentaValida
}

const isEditing = computed({
  get() {
    return !!editingItem.value
  }
})

// const listaRegistros = computed({
//   get() {
//     const listaRetorno =
//       props.categoria.tipo_movimiento_id === '1'
//         ? resultListaIngresos.value?.obtenerIngresos ?? []
//         : resultListaEgresos.value?.obtenerEgresos ?? []

//     listaRetorno.forEach((element) => {
//       element.registro.fecha_formato = formato.formatoFechaFromISO(
//         element.registro.fecha
//       )
//       element.registro.date = DateTime.fromISO(element.registro.fecha)
//       element.saved = true
//     })
//     return listaRetorno
//   }
// })
// const listaEgresos = computed({
//   get() {
//     return resultListaEgresos.value?.obtenerEgresos ?? []
//   }
// })
const isSelected = computed({
  get() {
    return selectedItems.value.length > 0
  }
})
/**
 * Obtener la sumatoria de registros
 */
const sumatoriaRegistros = computed({
  get() {
    return listaRegistros.value.reduce((accumulator, registro) => {
      return (
        accumulator +
        parseFloat(
          categoria.value.tipoMovimiento.id === '2'
            ? registro.importe * -1
            : registro.importe
        )
      )
    }, 0)
  }
})
/**
 * Buscar movimientos de acuerdo a la categoria y perido ingresados como propiedades
 */
function buscarMovimientos() {
  loadListaRegistros()
}
</script>

<style lang="scss" scoped>
.tarjeta__resumen-valor {
  font-size: 0.8rem;
}

.myClass {
  &:hover {
    background-color: white;
  }
}
.errors__list--subtitle {
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: -0.025rem;
}
/**
* transition fade
 */
.fade-enter-from {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}
.fade-enter-active {
  transition: all 2s ease;
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

.my-sticky-header-table {
  /* height or max-height is important */
  height: 100%;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    // background-color: $main-background;
    background: rgb(248, 248, 248) !important;
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:first-child th {
    top: 0;
  }
  tbody tr {
    &.q-tr {
      // background: $primary;
      position: fixed;
      z-index: 1;
    }
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

.actualizando-class {
  padding: 6px 25px;
  color: $dark;
  border: 0px solid $dark;
  border-radius: 5px;
  & span {
    // animation: blink 3s linear infinite;
  }
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
