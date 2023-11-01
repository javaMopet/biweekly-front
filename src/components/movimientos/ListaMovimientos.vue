<template>
  <q-card
    class="my-card no-shadow no-border"
    flat
    style="width: 920px; min-width: 980px; height: 70%; min-height: 70%"
  >
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
    <q-card-section>
      <!-- <pre>{{ errors }}</pre> -->
      <q-table
        :rows="listaEncabezado"
        :columns="columns"
        row-key="name"
        :rows-per-page-options="[0]"
        hide-header
        dense
        separator="cell"
        style="height: 88px"
      >
        <template #top-row>
          <q-tr>
            <q-td></q-td>
            <q-td style="width: 150px"
              ><DateInput
                v-model="formItem.fecha"
                lbl_field="Fecha"
                :optional="false"
                :rango-fecha-inicio="categoria.fecha_inicio_formato"
                :rango-fecha-fin="categoria.fecha_fin_formato"
              ></DateInput
            ></q-td>
            <q-td style="width: 180px">
              <PriceInput
                v-model="formItem.importe"
                :autofocus="true"
                :is-error="errors.isPriceError"
              ></PriceInput
            ></q-td>
            <q-td>
              <CuentaSelect
                v-model="formItem.cuenta"
                :agregar="false"
                :filter-array="['1', '2']"
              ></CuentaSelect
            ></q-td>
            <q-td>
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
              colspan="3"
              style="
                border: 0px solid red;
                text-align: start;
                vertical-align: top;
                padding-top: 10px;
              "
            >
              <div class="row items-center">
                <q-icon
                  name="add_circle"
                  class="btn-add"
                  clickable
                  @click="addItem"
                >
                  <q-tooltip :offset="[10, 10]"> Add New </q-tooltip>
                </q-icon>
              </div></q-td
            >
          </q-tr>
        </template>
      </q-table>
      <q-table
        :rows="listaRegistros"
        :columns="columns"
        row-key="name"
        :rows-per-page-options="[0]"
        hide-pagination
        hide-header
        dense
        class="my-sticky-header-table"
        separator="cell"
      >
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

/**
 * composables
 */
const formato = useFormato()
const registrosCrud = useRegistrosCrud()
const notificacion = useNotificacion()

/**
 * state
 */
const categoria = ref({})
const listaEncabezado = ref([])
const listaRegistros = ref([])
const errorsList = ref([])
const defaultFormItem = {
  fecha: '10/10/2023',
  importe: '',
  cuenta: null,
  observaciones: ''
}
const formItem = ref({ ...defaultFormItem })
const errors = ref({
  isPriceError: false
})

const props = defineProps({
  cellData: {
    type: Object,
    required: true,
    default: () => {
      return {}
    }
  }
})

const emit = defineEmits(['registroCreated'])

onMounted(() => {})

const columns = [
  {
    name: 'estatus',
    label: '',
    field: '',
    sortable: true,
    align: 'left',
    style: 'width:20px'
  },
  {
    name: 'fecha',
    label: 'Fecha',
    field: (row) => formato.formatoFecha(row.fecha),
    sortable: true,
    align: 'center',
    style: 'width:150px'
  },
  {
    name: 'importe',
    label: 'Importe',
    field: (row) => row.importe,
    format: (val, row) => `${formato.toCurrency(parseFloat(val))}`,
    sortable: true,
    align: 'left',
    style: 'width:180px'
  },
  {
    name: 'cuenta',
    label: 'Cuenta',
    field: (row) => row.cuenta?.nombre || '',
    sortable: true,
    align: 'left'
  },
  {
    name: 'observaciones',
    label: 'Observaciones',
    field: (row) => row.observaciones,
    sortable: true,
    align: 'left'
  },
  {
    name: 'acciones',
    label: 'Acciones',
    field: '',
    sortable: false,
    align: 'center'
  }
]

function addItem(val) {
  const fecha = formItem.value.fecha
  const importe = formItem.value.importe
  const cuenta = formItem.value.cuenta

  const observaciones = formItem.value.observaciones
  const validar = true
  if (entradaValida()) {
    console.log('agreagndo .............')
    const row = {
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

function resetForm() {
  formItem.value = { ...defaultFormItem }
}

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
/**
 * Methods
 */
const row_to_insert = ref(null)

function saveItem(row) {
  if (isInputItemValid(row)) {
    console.log('categoria', categoria.value.tipoMovimiento.id)
    if (['1', '2'].includes(categoria.value.tipoMovimiento.id)) {
      const tipoAfectacion =
        categoria.value.tipoMovimiento.id === '1' ? 'A' : 'C'
      const importe =
        tipoAfectacion === 'C'
          ? parseFloat(row.importe) * -1
          : parseFloat(row.importe)
      const input = {
        categoriaId: row.categoriaId,
        estadoRegistroId: 2,
        tipoAfectacion,
        cuentaId: parseInt(row.cuenta.id),
        importe,
        fecha: formato.convertDateFromInputToIso(row.fecha),
        observaciones: row.observaciones
      }
      row_to_insert.value = row
      registrosCrud.createRegistro({ input })
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
  afterSaveItem('Ingreso', data.ingresoCreate)
})

function afterSaveItem(tipoRegistro, itemSaved) {
  row_to_insert.value.saved = true
  notificacion.mostrarNotificacionPositiva(`${tipoRegistro} guardado.`, 1000)
  emit('registroCreated', itemSaved)
}

registrosCrud.onErrorCreate((error) => {
  console.error(error)
})
function obtenerFechaISO(fecha_formato) {
  const date = !!fecha_formato
    ? DateTime.fromFormat(fecha_formato, 'dd/MM/yyyy')
    : null
  return date?.toISODate()
}
function updateItem(row) {
  registrosCrud.updateItem()
  row.saved = false
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
  load: cargaListaRegistros
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
      const importe =
        element.tipoAfectacion === 'C' ? element.importe * -1 : element.importe
      element.importe = importe.toString()
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

/**
 * Buscar movimientos de acuerdo a la categoria y perido ingresados como propiedades
 */
function buscarMovimientos() {
  cargaListaRegistros()
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
  height: 300px;
  z-index: 10;

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
</style>
