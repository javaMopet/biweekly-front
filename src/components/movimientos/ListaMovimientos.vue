<template>
  <q-card
    class="my-card no-shadow no-border bg-main-background"
    flat
    style="width: 1100px; min-width: 1100px; overflow: hidden"
  >
    <!-- <pre>{{ categoria }}</pre> -->
    <q-card-section class="row justify-between items-start dialog-title">
      <div class="row">
        <q-avatar
          size="38px"
          font-size="23px"
          text-color="white"
          :icon="categoria.icono"
          :style="`background-color: ${categoria.color} !important;transform: translateY(-5px)`"
        />
        <div class="dialog__title--name">
          {{ categoria.nombre }}
        </div>
      </div>
      <div class="dialog-closebutton">
        <q-btn
          icon="close"
          v-close-popup
          push
          class="dialog__title--closeButton"
          round
          glossy
        ></q-btn>
      </div>
    </q-card-section>

    <transition name="fade">
      <div class="row bg-pink-1" v-if="errorsList.length > 0">
        <div class="column">
          <div class="row q-gutter-x-md q-pl-sm q-pt-sm">
            <q-icon name="warning" size="1.5rem" color="negative" />
            <span class="text-caption text-dark"
              >Los datos ingresados contienen errores:</span
            >
          </div>
          <q-list dense>
            <q-item
              :inset-level="0.5"
              dense
              v-for="error in errorsList"
              :key="error.code"
            >
              <q-item-section
                avatar
                dense
                style="min-width: 25px !important; width: 25px !important"
              >
                <q-icon color="primary" name="arrow_right" />
              </q-item-section>
              <q-item-section class="errors__list--subtitle">{{
                error.message
              }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </transition>
    <!-- <q-toolbar class="q-pl-lg q-mt-md" style="border: 0px solid red">
      <q-btn
        v-if="isSelected"
        no-caps
        label="Eliminar"
        icon="las la-trash-alt"
        color="negative-pastel"
        outline
        @click="deleteSelectedItems"
      />
    </q-toolbar> -->
    <q-card-section>
      <q-card
        class="my-card"
        style="height: 100%; border: 0px solid red; padding: 0px !important"
        flat
        dense
      >
        <q-card-section style="max-height: 70vh; height: 70vh" class="scroll">
          <q-table
            :rows="listaRegistros"
            :columns="columns"
            row-key="id"
            :rows-per-page-options="[0]"
            hide-pagination
            dense
            class="my-sticky-header-table"
            separator="cell"
            selection="multiple"
            v-model:selected="selectedItems"
            no-data-label="No hay registros para esta categoria y periodo"
          >
            <template #top>
              <q-th fit style="width: 100%">
                <q-toolbar class="">
                  <div class="column" style="width: 80px">
                    <span class="tarjeta__resumen-etiqueta">Periodo:</span
                    ><span class="tarjeta__resumen-valor"
                      >Del:
                      {{
                        formato.convertDateFromIsoToInput(
                          props.cellData.fecha_inicio
                        )
                      }}
                      Al:
                      {{
                        formato.convertDateFromIsoToInput(
                          props.cellData.fecha_fin
                        )
                      }}</span
                    >
                  </div>
                  <q-toolbar-title> </q-toolbar-title>
                </q-toolbar>
                <q-toolbar
                  class="row items-between"
                  style="width: 100%; padding: 0px !important"
                >
                  <q-btn
                    v-if="isSelected"
                    no-caps
                    icon="las la-trash-alt"
                    color="negative-pastel"
                    @click="deleteSelectedItems"
                  />
                  <q-toolbar-title></q-toolbar-title>
                  <span
                    v-if="isEditing"
                    :class="{
                      'bg-accent-light': isEditing,
                      'text-primary': true
                    }"
                    style="padding-top: 10px; padding-bottom: 10px; width: 30%"
                  >
                    Actualizando ...</span
                  >

                  <!-- <q-btn
                    v-if="isEditing"
                    no-caps
                    label="Actualizar"
                    icon="update"
                    color="negative-pastel"
                    @click="deleteSelectedItems"
                  /> -->
                </q-toolbar>
              </q-th>
              <q-th :class="{ 'bg-accent-light': isEditing }">
                <q-td style="min-width: 32px; max-width: 32px"></q-td>
                <q-td style="width: 135px"
                  ><DateInput
                    v-model="formItem.fecha"
                    lbl_field="Fecha"
                    :optional="false"
                    :rango-fecha-inicio="categoria.fecha_inicio_formato"
                    :rango-fecha-fin="categoria.fecha_fin_formato"
                  ></DateInput
                ></q-td>
                <q-td style="width: 160px">
                  <PriceInput
                    v-model="formItem.importe"
                    :autofocus="true"
                    :is-error="errors.isPriceError"
                  ></PriceInput>
                </q-td>
                <q-td style="width: 200px; max-width: 200px; min-width: 200px">
                  <CuentaSelect
                    v-model="formItem.cuenta"
                    :agregar="false"
                    :filter-array="['1', '2']"
                  ></CuentaSelect
                ></q-td>
                <q-td style="min-width: 412px; width: 412px">
                  <q-input
                    v-model="formItem.observaciones"
                    type="textarea"
                    label="observaciones"
                    dense
                    outlined
                    color="secondary"
                    rows="1"
                    lazy-rules
                /></q-td>
                <q-td
                  style="vertical-align: middle; border: 0px solid red"
                  align="center"
                >
                  <q-btn
                    v-if="!editingItem"
                    class="button-new"
                    icon="add_circle"
                    @click="saveItem"
                    flat
                  >
                    <!-- icon="las la-plus-square" -->
                    <q-tooltip
                      :offset="[-35, -65]"
                      class="bg-accent"
                      transition-duration="900"
                    >
                      Guardar Nuevo
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    v-else
                    class="button-save"
                    icon="save"
                    @click="saveItem"
                    flat
                  >
                    <!-- icon="las la-save" -->
                    <q-tooltip :offset="[10, 10]" class="bg-accent">
                      Actualizar
                    </q-tooltip>
                  </q-btn>

                  <q-btn
                    v-if="editingItem"
                    class="button-cancel"
                    icon="las la-ban"
                    @click="cancelEditItem(props)"
                    flat
                  >
                    <q-tooltip :offset="[10, 10]" class="bg-accent">
                      Cancelar
                    </q-tooltip></q-btn
                  >
                </q-td>
                <!-- </q-tr> -->
              </q-th>
            </template>
            <template v-slot:body-cell-acciones="props">
              <q-td :props="props">
                <q-btn
                  v-if="!editingItem"
                  class="button-edit"
                  icon="edit"
                  @click="editItem(props)"
                  dense
                  flat
                >
                  <!-- icon="las la-edit" -->
                  <q-tooltip :offset="[10, 10]" class="bg-accent">
                    Editar
                  </q-tooltip>
                </q-btn>
              </q-td>
            </template>
            <!-- <template #no-data>No se han agregado datos</template> -->
          </q-table>
        </q-card-section>
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
      </q-card>
    </q-card-section>
  </q-card>
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

/**
 * composables
 */
const formato = useFormato()
const registrosCrud = useRegistrosCrud()
const notificacion = useNotificacion()
const $q = useQuasar()

/**
 * state
 */
const categoria = ref({})
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
  setFechaInicial()
})

const columns = [
  {
    name: 'fecha',
    label: 'Fecha',
    field: 'fecha',
    sortable: true,
    align: 'center',
    // style: 'min-width:140px'
    style: 'width:15%',
    headerStyle: 'width: 15%'
  },
  {
    name: 'importe',
    label: 'Importe',
    field: (row) => row.importe,
    format: (val, row) => `${obtenerFormatoImporte(val)}`,
    sortable: true,
    align: 'right',
    // style: 'min-width:160px'
    style: 'width:15%',
    headerStyle: 'width: 15%'
  },
  {
    name: 'cuenta',
    label: 'Cuenta',
    field: (row) => row.cuenta?.nombre || '',
    sortable: true,
    align: 'left',
    // style: 'min-width:200px'
    style: 'width:20%',
    headerStyle: 'width: 20%'
  },
  {
    name: 'observaciones',
    label: 'Observaciones',
    field: (row) => row.observaciones,
    sortable: true,
    align: 'left',
    style: 'text-wrap: wrap; min-width:40%;max-width:40%',
    headerStyle: 'width:40%'
    // style: 'min-width:200px;max-width:200px;text-wrap: wrap'
  },
  {
    name: 'acciones',
    label: 'Acciones',
    field: '',
    sortable: false,
    align: 'center',
    // style: 'width:80px;min-width:80px;max-width:80px'
    style: 'width:15%;min-width:10%'
  }
]

function addItem(val) {
  const fecha = formItem.value.fecha
  const importe = formItem.value.importe
  const cuenta = formItem.value.cuenta

  const observaciones = formItem.value.observaciones
  const validar = true
  if (entradaValida()) {
    const row = {
      identifier: listaRegistros.value.length,
      categoriaId: props.cellData.categoriaId,
      cuentaValida: true,
      estadoRegistroId: 1,
      importe: importe,
      fecha,
      cuenta,
      observaciones
    }
    listaRegistros.value.push(row)

    // resetForm()
    console.table(listaRegistros.value)
  }
}

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
  formItem.value = {
    fecha: row.fecha,
    importe: importe.toString(),
    cuenta: row.cuenta,
    observaciones: row.observaciones
  }
}

function entradaValida() {
  errors.value.isPriceError = false
  const importe = parseFloat(formItem.value.importe)
  if (!importe || importe === 0) {
    errors.value.isPriceError = true
    setTimeout(() => {
      errors.value.isPriceError = false
    }, 2500)
  }

  return !errors.value.isPriceError
}

function cancelEditItem() {
  editingItem.value = null
  formItem.value = { ...defaultFormItem }
  setFechaInicial()
}

function resetForm() {
  formItem.value = { ...defaultFormItem }
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
  notificacion.mostrarNotificacionPositiva(
    'los registros se eliminaron correctamente'
  )
  selectedItems.value = []
  reloadListaRegistros()
})

function obtenerFechaDefault() {
  const fechaInicio = DateTime.fromISO(props.cellData.fecha_inicio)
  const fechaFin = DateTime.fromISO(props.cellData.fecha_fin)
  const now = DateTime.now()
  const diff1 = now.diff(fechaInicio, ['days'])
  const diff2 = fechaFin.diff(now, ['days'])
  let fecha = null
  if (diff1 > 0 && diff2 > 0) {
    fecha = formato.dateNowToInput()
  } else {
    fecha = formato.convertDateTimeToInput(fechaInicio)
  }
  return fecha
}

function setFechaInicial() {
  console.log('fecha_inicio', props.cellData.fecha_inicio)
  formItem.value.fecha = formato.convertDateFromIsoToInput(
    props.cellData.fecha_inicio
  )
}
/**
 * Methods
 */
const row_to_insert = ref(null)

/**
 *
 *
 */
function saveItem() {
  if (entradaValida()) {
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

registrosCrud.onDoneCreate(({ data }) => {
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
  notificacion.mostrarNotificacionPositiva(
    `El registro se guardado correctamente.`,
    1500
  )
  emit('registroCreated', itemSaved)
  resetForm()
}
function afterUpdateItem(itemUpdated) {
  // const rowIndex = editingItem.value.rowIndex
  // listaRegistros.value[rowIndex] = itemUpdated
  notificacion.mostrarNotificacionPositiva(
    `El registro se actualizó correctamente.`,
    1500
  )
  reloadListaRegistros()
  emit('registroUpdated', itemUpdated)
  editingItem.value = null
  resetForm()
}

registrosCrud.onErrorCreate((error) => {
  console.log('error', error.graphQLErrors[0])
  console.log('error', error.graphQLErrors[0].extensions)
  console.table('error', error.graphQLErrors[0].extensions.problems)
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

const {
  result: resultCategoria,
  onError: onErrorCategoriaById,
  onResult: onResultCategoriaById
} = useQuery(
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
      element.fecha = formato.convertDateFromIsoToInput(element.fecha)
      // const importe =
      //   element.tipoAfectacion === 'C' ? element.importe * -1 : element.importe
      element.importe = element.importe.toString()
      element.saved = true
    })
  }
})

onResultCategoriaById(({ data }) => {
  // console.log('data', data)
  categoria.value = data.categoriaById
  buscarMovimientos()
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
    background-color: $main-background;
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
</style>
