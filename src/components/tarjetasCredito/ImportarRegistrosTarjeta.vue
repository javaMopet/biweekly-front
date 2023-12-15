<template>
  <q-card class="my-card" dense style="width: 85%; min-width: 85%">
    <q-inner-loading
      :showing="isLoading"
      label="Saving... Please wait..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
      style="z-index: 500"
    />
    <DialogTitle
      >Tarjeta de crédito &nbsp;&nbsp;~ {{ cuenta.nombre }} ~</DialogTitle
    >
    <q-card-section>
      <q-toolbar class="q-gutter-x-md">
        <div class="row q-pr-lg justify-between">
          <div class="column">
            <div class="load__file-text text-condensed">
              Selecciona un archivo en formato Excel:
            </div>
            <q-file
              v-model="archivoExcel"
              label="Carga archivo Excel"
              accept=".xlsx,.xls"
              @input="updateFile"
              dense
              style="width: 450px"
              max-files="1"
              outlined
              label-color="accent"
              clearable
              @clear="fileClear"
            >
              <template #prepend>
                <q-icon color="primary" name="cloud_upload" />
              </template>
              <template #before>
                <q-img src="/icons/excel2.png" width="24px" />
              </template>
            </q-file>
          </div>
        </div>
        <q-separator vertical></q-separator>
        <div class="row items-center q-gutter-x-md">
          <div class="column">
            <span class="form-input__label"> Desde:</span>
            <DateInput
              v-model="fecha_inicio"
              lbl_field="Fecha"
              :opcional="false"
              style="width: 140px"
            ></DateInput>
          </div>
          <div class="column">
            <span class="form-input__label">Hasta:</span>
            <DateInput
              v-model="fecha_fin"
              lbl_field="Fecha"
              :opcional="false"
              style="width: 140px"
            ></DateInput>
          </div>
        </div>
        <q-toolbar-title></q-toolbar-title>
        <q-btn
          :disable="!isSelected"
          label="Eliminar"
          @click="eliminarSeleccionados"
          outline
          color="negative"
        />
      </q-toolbar>

      <transition name="fade">
        <div class="errors-message bg-pink-1" v-if="isErrors">
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
                  {{ !item.numeroLinea ? '' : `No. Línea ${item.numeroLinea}` }}
                  -> {{ item.message }}
                </q-item>
              </q-list>
            </div>
            <!-- <div class="col">
              <q-spinner-tail color="blue-grey" size="25px" />
            </div> -->
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
      </transition>
    </q-card-section>
    <q-card-section style="max-height: 70vh; height: 60vh" class="scroll">
      <q-table
        :rows="listaRegistroFiltrados"
        :columns="columns"
        :rows-per-page-options="[0]"
        row-key="consecutivo"
        separator="cell"
        dense
        selection="multiple"
        v-model:selected="registrosSelected"
        table-header-class="text-condensed bg-primary-light text-accent"
        no-data-label="No existen datos disponibles"
        hide-pagination
        class="my-sticky-header-table"
      >
        <template #body-cell-concepto="props">
          <q-td :props="props" :class="props.row.clase">
            {{ props.row.concepto }}
          </q-td>
        </template>
        <template #body-cell-categoria="props">
          <q-td :props="props">
            <CategoriaSelect
              v-model="props.row.categoria"
              :tipo-afectacion="props.row.tipo_afectacion"
              :agregar="true"
            ></CategoriaSelect>
          </q-td>
        </template>
        <template #body-cell-cargo="props">
          <q-td :props="props">
            <span :class="props.row.clase">
              {{ formato.toCurrency(parseFloat(props.row.cargo)) }}
            </span>
          </q-td>
        </template>
        <template #body-cell-abono="props">
          <q-td :props="props">
            <span :class="props.row.clase">
              {{ formato.toCurrency(parseFloat(props.row.abono)) }}
            </span>
          </q-td>
        </template>
        <template #body-cell-acciones="props">
          <q-td :props="props">
            <q-btn
              icon="delete_sweep"
              size="md"
              :class="props.row.clase"
              dense
              @click="deleteRow(props)"
              flat
            />
            <!-- class="q-ml-sm"
              color="accent" -->
          </q-td>
        </template>
      </q-table>
    </q-card-section>
    <q-card-actions class="q-pa-xs">
      <div class="row justify-between items-center full-width text-accent">
        <div class="col-9 q-pl-xl">
          <table style="border: 0px solid red">
            <tr>
              <td>Total cargos:</td>
              <td class="summary__value">
                {{ toCurrency(sumaCargos) }}
              </td>
            </tr>
            <tr>
              <td>Total abonos:</td>
              <td class="summary__value">
                {{ toCurrency(sumaAbonos) }}
              </td>
            </tr>
            <tr>
              <td>Importe Total:</td>
              <td class="summary__value">
                {{ toCurrency(sumatoriaImporte) }}
              </td>
            </tr>
          </table>
        </div>
        <div class="col-2">
          <div class="row justify-center">
            <q-btn flat label="Cancelar" v-close-popup class="q-mr-lg" />
            <q-btn label="Guardar" color="primary-button" @click="saveItems" />
          </div>
        </div>
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup>
/**
 * imports
 */
import { ref, computed, onMounted, toRef } from 'vue'
import { read, utils } from 'xlsx'
import CategoriaSelect from '../formComponents/CategoriaSelect.vue'
import { useFormato } from 'src/composables/utils/useFormato'
import { api } from 'src/boot/axios'
import { DateTime } from 'luxon'
import DateInput from '../formComponents/DateInput.vue'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import DialogTitle from '../formComponents/modal/DialogTitle.vue'

/**
 * state
 */
const archivoExcel = ref(null)
const registrosSelected = ref([])
const listaRegistrosTarjeta = ref([])
const todos = ref()
const fecha_inicio = ref('01/01/1900')
const fecha_fin = ref('01/01/1900')
const errorItems = ref([])
const isLoading = ref(false)
/**
 * composables
 */
const formato = useFormato()
const notificacion = useNotificacion()
const { toCurrency } = useFormato()

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
  console.log('desde', desde)
  fecha_inicio.value = desde
  fecha_fin.value = hasta
})
/**
 * emits
 */
const emit = defineEmits(['itemsSaved'])

/**
 *
 * @param {*} v
 */
const monthsMap = new Map()
// assuming `todos` is a standard VueJS `ref`
async function updateFile(v) {
  try {
    // `v.target.files[0]` is the desired file object
    const files = v.target.files
    if (!files || files.length == 0) return

    // read first file
    const wb = read(await files[0].arrayBuffer())
    // // get data of first worksheet as an array of objects
    // const rows = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    //   raw: false
    // })

    monthsMap.set('Ene', '01')
    monthsMap.set('Feb', '02')
    monthsMap.set('Mar', '03')
    monthsMap.set('Abr', '04')
    monthsMap.set('May', '05')
    monthsMap.set('Jun', '06')
    monthsMap.set('Jul', '07')
    monthsMap.set('Ago', '08')
    monthsMap.set('Sep', '09')
    monthsMap.set('Oct', '10')
    monthsMap.set('Nov', '11')
    monthsMap.set('Dic', '12')
    // for (const row of rows) {
    //   for (const key in row) {
    //     console.log('data cell', row[key])
    //   }
    // }
    switch (props.cuenta.banco.id.toString()) {
      case '1':
        cargarMovimientosSantander(wb)
        break
      case '2':
        cargarMovimientosBancomer(wb)
        break
      default:
        break
    }
  } catch (e) {
    console.log(e)
  }
}

/**
 * Cargar movimientos de santander.
 * @param {Object} wb - Excel data
 */
function cargarMovimientosSantander(wb) {
  // get data of first worksheet as an array of objects
  const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    header: ['FECHA', 'CONSECUTIVO', 'CONCEPTO', 'IMPORTE'],
    skipHeader: true,
    raw: false
  })

  // console.table(data)
  // data.forEach((d) => {
  //   console.log(d.IMPORTE)
  // })

  todos.value = data.map((row) => ({
    fecha: row.FECHA.replace(
      row.FECHA.substring(3, 6),
      monthsMap.get(row.FECHA.substring(3, 6))
    ),
    consecutivo: row.CONSECUTIVO,
    concepto: row.CONCEPTO,
    importe: row.IMPORTE
  }))
  todos.value.forEach((row, index) => {
    const importe = parseFloat(row.importe)
    row.cargo = importe > 0 ? importe : 0
    row.abono = importe < 0 ? importe : 0
  })
  console.table(todos.value)
  // console.log('datda', todos.value[5])
  crearListaRegistrosTarjeta(todos.value)
}
/**
 * Cargar movimientos de Santander
 * @param {Object} wb - Excel data
 */
function cargarMovimientosBancomer(wb) {
  // get data of first worksheet as an array of objects
  const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    header: ['FECHA', 'DESCRIPCION', 'CARGO', 'ABONO', 'SALDO'],
    skipHeader: true,
    raw: false
  })

  todos.value = data.map((row, index) => ({
    fecha: row.FECHA,
    consecutivo: index,
    concepto: row.DESCRIPCION,
    cargo: row.CARGO?.replace(',', '') ?? 0,
    abono: row.ABONO?.replace(',', '') ?? 0,
    saldo: row.SALDO?.replace(',', '') ?? 0
  }))
  crearListaRegistrosTarjeta(todos.value)
}
/**
 * Convertir un arreglo de datos de excel a registros para visualizar en la tabla.
 * @param {Array} excelData - Datos obtenidos del archivo excel
 */
function crearListaRegistrosTarjeta(excelData) {
  console.table(excelData)
  todos.value.forEach((row, index) => {
    const fechaObject = DateTime.fromFormat(row.fecha.toString(), 'dd/MM/yyyy')
    if (fechaObject.isValid) {
      const item = {
        id: index,
        fecha: fechaObject.toISODate(),
        consecutivo: row.consecutivo,
        cargo: parseFloat(row.cargo),
        abono: parseFloat(row.abono),
        concepto: row.concepto,
        tipoAfectacion: row.cargo !== 0 ? 'C' : 'A',
        clase: row.abono !== 0 ? 'registro-abono' : '',
        saved: false
      }
      listaRegistrosTarjeta.value.push(item)
    }
  })
  console.table(listaRegistrosTarjeta.value)
}
/**
 * computed
 */
const listaRegistroFiltrados = computed({
  get() {
    const start_date = DateTime.fromFormat(fecha_inicio.value, 'dd/MM/yyyy')
    const end_date = DateTime.fromFormat(fecha_fin.value, 'dd/MM/yyyy')

    return listaRegistrosTarjeta.value.filter((registro) => {
      const fecha_registro = DateTime.fromISO(registro.fecha)
      return fecha_registro >= start_date && fecha_registro <= end_date
    })
  }
})
const isErrors = computed({
  get() {
    return errorItems.value.length > 0
  }
})

const sumaCargos = computed({
  get() {
    return listaRegistroFiltrados.value.reduce((accumulator, registro) => {
      return accumulator + parseFloat(registro.cargo)
    }, 0)
  }
})
const sumaAbonos = computed({
  get() {
    return listaRegistroFiltrados.value.reduce((accumulator, registro) => {
      return accumulator + parseFloat(registro.abono)
    }, 0)
  }
})

const sumatoriaImporte = computed({
  get() {
    return listaRegistroFiltrados.value.reduce((accumulator, registro) => {
      return (
        accumulator + parseFloat(registro.cargo) + parseFloat(registro.abono)
      )
    }, 0)
  }
})

function saveItems() {
  const containsErrors = validarMovimientos()
  if (containsErrors) {
    setTimeout(() => {
      errorItems.value = []
    }, 6000)
  } else {
    var lista_registros_tarjeta = []

    listaRegistroFiltrados.value.forEach((item) => {
      const importe = item.tipoAfectacion === 'C' ? item.cargo * -1 : item.abono
      const registro = {
        estado_registro_tarjeta_id: 1, //pendiente
        tipo_afectacion: item.tipoAfectacion,
        cuenta_id: props.cuenta.id,
        categoria_id: item.categoria.id,
        importe,
        fecha: item.fecha,
        concepto: item.concepto
      }
      lista_registros_tarjeta.push(registro)
    })

    isLoading.value = true

    api
      .post('/create_multiple_registros_tarjeta', {
        lista_registros_tarjeta
      })
      .then((response) => {
        console.log('guardado correctamente')
        console.log('response', response)
        const cuenta_id = response.data.retorno[0].cuenta_id
        console.log('cuenta', cuenta_id)
        isLoading.value = false
        emit('itemsSaved', cuenta_id)
      })
      .catch((error) => {
        isLoading.value = false
        console.error(error.response.data.exception)
        notificacion.mostrarNotificacionNegativa(
          'No fue posible posible guardar los registro, revisar consola',
          900
        )
      })
    // console.log('items guardados')
  }
}

/**
 * Funcion utilizada para validar los movimiento al momento de guardar
 */
function validarMovimientos() {
  errorItems.value = []
  if (listaRegistroFiltrados.value.length <= 0) {
    errorItems.value.push({
      id: 1,
      numeroLinea: undefined,
      message: 'Favor de ingresar los datos que desea guardar.'
    })
  } else {
    console.table(listaRegistroFiltrados.value)
    listaRegistroFiltrados.value.forEach((item, index) => {
      if (!item.categoria) {
        errorItems.value.push({
          id: index,
          numeroLinea: item.id,
          message: 'Favor de ingresar la categoria.'
        })
      }
    })
  }
  return errorItems.value.length > 0
}

/**
 * Funcion utilizada para eliminar varios movimientos seleccionados
 */
function eliminarSeleccionados() {
  console.log('eliminar seleccionados', registrosSelected.value)
  registrosSelected.value.forEach((item) => {
    var index = listaRegistrosTarjeta.value.indexOf(item)
    if (index !== -1) {
      listaRegistrosTarjeta.value.splice(index, 1)
    }
  })
  registrosSelected.value.length = 0
}

function deleteRow(props) {
  // const rowIndex = props.rowIndex
  const id = props.row.id
  console.log(id)
  const index = listaRegistrosTarjeta.value.findIndex((r) => r.id == id)
  // listaRegistrosTarjeta.find

  listaRegistrosTarjeta.value.splice(index, 1)
}
function fileClear() {
  listaRegistrosTarjeta.value.length = 0
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
    align: 'left',
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
    style: 'width:95px;min-width: 95px;max-width: 95px',
    headerStyle: 'width: 95px;min-width: 95px;max-width: 95px'
  },
  {
    name: 'concepto',
    label: 'Concepto',
    field: 'concepto',
    sortable: true,
    align: 'left',
    filter: true
  },
  {
    name: 'cargo',
    label: 'Cargo',
    field: 'cargo',
    // sortable: true,
    align: 'right',
    // format: (val, row) => `${formato.toCurrency(parseFloat(val))}`,
    style: 'width:100px; min-width: 100px; max-width: 100px',
    headerStyle: 'width:100px; min-width: 100px; max-width: 100px'
  },
  {
    name: 'abono',
    label: 'Abono',
    field: 'abono',
    // sortable: true,
    align: 'right',
    // format: (val, row) => `${formato.toCurrency(parseFloat(val))}`,
    style: 'width:100px; min-width: 100px; max-width: 100px',
    headerStyle: 'width:100px; min-width: 100px; max-width: 100px'
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
  },
  {
    name: 'acciones',
    label: '',
    field: 'action',
    sortable: false,
    align: 'center',
    style: 'width:70px',
    headerStyle: 'width:70px'
  }
]
function closeErrors() {
  errorItems.value = []
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
