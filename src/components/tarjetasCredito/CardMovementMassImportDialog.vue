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
          :selected-rows-label="getSelectedString"
          table-header-class="text-condensed bg-primary-light text-accent"
          no-data-label="No existen datos disponibles"
          hide-pagination
          class="my-sticky-header-table"
          :loading="loadingRows"
          :table-row-class-fn="getRowClass"
        >
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
          <template #body-cell-concepto="props">
            <q-td :props="props">
              <q-input
                v-model="props.row.concepto"
                :class="props.row.clase"
                dense
                lazy-rules
                outlined
                color="primary-button"
                bg-color="lime-1"
                label-color="input-label"
                style="width: 100%"
                :tabindex="props.row.consecutivo + 1"
                :autofocus="props.row.autofocus"
              ></q-input>
            </q-td>
          </template>
          <template #body-cell-categoria="props">
            <q-td :props="props">
              <CategoriaSelect
                v-model="props.row.categoria"
                :tipo-afectacion="props.row.tipoAfectacion"
                :agregar="false"
                :tabindex="props.row.consecutivo + 1"
              ></CategoriaSelect>
            </q-td>
          </template>
          <template #body-cell-importe="props">
            <q-td :props="props">
              <span :class="props.row.clase">
                {{ formato.toCurrency(parseFloat(props.row.importe)) }}
              </span>
            </q-td>
          </template>
          <!-- <template #body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                icon="delete_sweep"
                size="md"
                :class="props.row.clase"
                dense
                @click="deleteRow(props)"
                flat
              />
            </q-td>
          </template> -->
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
          <div class="col-3 q-py-md q-pr-lg">
            <div class="row justify-end">
              <!-- <q-btn
                label="Cancelar"
                v-close-popup
                class="q-mr-lg"
                tabindex="50"
                color="negative-pastel"
                outline
              /> -->
              <q-btn
                label="Guardar"
                color="primary-button"
                @click="saveItems"
                tabindex="51"
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
import { read, utils } from 'xlsx'
import CategoriaSelect from '../formComponents/CategoriaSelect.vue'
import { useFormato } from 'src/composables/utils/useFormato'
// import { api } from 'src/boot/axios'
import { DateTime } from 'luxon'
import DateInput from '../formComponents/DateInput.vue'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import DialogTitle from '../formComponents/modal/DialogTitle.vue'
import { useRegistrosTarjetaCrud } from 'src/composables/useRegistrosTarjetaCrud'
import { parse, format } from 'date-fns'
import es from 'date-fns/locale/es'
import { Dialog, useDialogPluginComponent } from 'quasar'
import RegistroCategoriaDialog from '../categorias/RegistroCategoriaDialog.vue'

/**
 * state
 */
const archivoExcel = ref(null)
const registrosSelected = ref([])
const listaRegistrosTarjeta = ref([])
const todos = ref()
const fecha_inicio = ref('01/01/1900')
const fecha_fin = ref('01/01/1900')
const isLoading = ref(false)
const loadingRows = ref(false)
const tipoMovimientoId = ref('2')
const editedCategoriaParam = ref({ tipoMovimientoId: tipoMovimientoId.value })
const errorsList = ref([])
/**
 * composables
 */
const formato = useFormato()
const { toCurrency } = useFormato()
const registrosTarjetaCrud = useRegistrosTarjetaCrud()
const { mostrarNotificacionNegativa, _mostrarNotificacionPositiva } =
  useNotificacion()

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
  // console.log('[ desde ] >', desde)
  fecha_inicio.value = desde
  fecha_fin.value = hasta
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
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

/**
 *
 * @param {*} v
 */
const monthsMap = new Map()
const monthsEnglishMap = new Map()
// assuming `todos` is a standard VueJS `ref`

async function updateFile(v) {
  loadingRows.value = true
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

    monthsEnglishMap.set('Jan', '01')
    monthsEnglishMap.set('Feb', '02')
    monthsEnglishMap.set('Mar', '03')
    monthsEnglishMap.set('Apr', '04')
    monthsEnglishMap.set('May', '05')
    monthsEnglishMap.set('Jun', '06')
    monthsEnglishMap.set('Jul', '07')
    monthsEnglishMap.set('Ago', '08')
    monthsEnglishMap.set('Sep', '09')
    monthsEnglishMap.set('Oct', '10')
    monthsEnglishMap.set('Nov', '11')
    monthsEnglishMap.set('Dic', '12')

    // for (const row of rows) {
    //   for (const key in row) {
    //     console.log('data cell', row[key])
    //   }
    // }
    // console.log('props.cuenta.banco.id:', props.cuenta.banco.id)
    switch (props.cuenta.banco.id.toString()) {
      case '1':
        // cargarMovimientosSantander(wb)
        cargarMovimientosSantanderNuevo(wb)
        break
      case '2':
        cargarMovimientosBancomer(wb)
        break
      case '6':
        cargarMovimientosAmericanExpress(wb)
        break
      default:
        break
    }
  } catch (e) {
    console.log(e)
    loadingRows.value = false
  }
  loadingRows.value = false
}

/**
 * Cargar movimientos de santander.
 * @param {Object} wb - Excel data
 */
/*
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

  todos.value = data
    .filter((row) => {
      return !!row.FECHA
    })
    .map((row) => ({
      fecha: convertidorFecha(row.FECHA),
      consecutivo: row.CONSECUTIVO,
      concepto: row.CONCEPTO,
      importe: parseFloat(row.IMPORTE)
    }))

  // console.log(todos.value)
  // console.log('datda', todos.value[5])
  crearListaRegistrosTarjeta(todos.value)
}
*/
/**
 * Cargar movimientos de santander.
 * @param {Object} wb - Excel data
 */
function cargarMovimientosSantanderNuevo(wb) {
  // get data of first worksheet as an array of objects
  const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    header: ['A', 'B', 'C', 'D', 'E', 'F'],
    skipHeader: true,
    raw: false
  })

  todos.value = data
    .filter((row) => {
      return !!row.A
    })
    .map((row, index) => ({
      fecha: convertidorFecha(row.A),
      consecutivo: index + 1,
      concepto: row.C,
      retiro: convertirImporte(row.D),
      deposito: convertirImporte(row.E)
    }))

  console.table(todos.value)
  todos.value = todos.value.map((row /* , index */) => ({
    fecha: row.fecha,
    consecutivo: row.consecutivo,
    concepto: row.concepto,
    importe: parseFloat(row.retiro) * -1 + parseFloat(row.deposito) * -1
  }))
  console.log(todos.value)

  crearListaRegistrosTarjeta(todos.value)
}

function convertidorFecha(fecha) {
  // console.log('fecha:', fecha)
  if (fecha.includes('/')) {
    const partes = fecha.split('/')
    // console.log('partes:', partes)
    if (isNaN(partes[1])) {
      // asume que el formato es 01/ene/2025 pe.
      const fechaParseada = parse(fecha, 'dd/MMM/yy', new Date(), {
        locale: es
      })
      const fechaP = format(fechaParseada, 'dd/MM/yyyy')
      // console.log('fechaP:', fechaP)
      return fechaP
    } else {
      // asume que el formato esta en MM/dd/yy
      const [mes, dia, anio] = partes
      let diaInt = parseInt(dia) + 1
      const anioCompleto = anio.length === 2 ? `20${anio}` : anio // cambiar para 2100
      return `${diaInt.toString().padStart(2, '0')}/${mes
        .toString()
        .padStart(2, '0')}/${anioCompleto}`
    }
  }
}
function convertirImporte(importe) {
  if (!importe) return 0
  return parseFloat(importe.replace(/[$,]/g, ''))
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
  // console.log('data.map', data)
  todos.value = data.map((row, index) => ({
    fecha: row.FECHA,
    consecutivo: index,
    concepto: row.DESCRIPCION,
    cargo: row.CARGO === '' ? 0 : (row.CARGO?.replace(',', '') ?? 0),
    abono: row.ABONO === '' ? 0 : (row.ABONO?.replace(',', '') ?? 0),
    saldo: row.SALDO?.replace(',', '') ?? 0
  }))
  console.log('todos.value', todos.value)
  todos.value = todos.value.map((row /* , index */) => ({
    fecha: row.fecha,
    consecutivo: row.consecutivo,
    concepto: row.concepto,
    importe: parseFloat(row.cargo) + parseFloat(row.abono)
  }))
  crearListaRegistrosTarjeta(todos.value)
}
/**
 * Cargar movimientos de American Express
 * @param {Object} wb - Excel data
 */
function cargarMovimientosAmericanExpress(wb) {
  // get data of first worksheet as an array of objects
  const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    header: [
      'FECHA',
      'FECHA_COMPRA',
      'DESCRIPCION',
      'TITULAR',
      'CUENTA',
      'IMPORTE'
    ],
    skipHeader: true,
    raw: false
  })
  // console.log('data.map', data)
  todos.value = data
    .filter((row) => {
      return !!row.FECHA
    })
    .map((row, index) => ({
      fecha: row.FECHA.replace(
        row.FECHA.substring(3, 6),
        monthsEnglishMap.get(row.FECHA.substring(3, 6))
      ).replace(' ', '/'),
      consecutivo: index,
      concepto: row.DESCRIPCION,
      importe: parseFloat(row.IMPORTE)
    }))

  todos.value = todos.value.map((row, index) => ({
    fecha: row.fecha.replace(' ', '/'),
    consecutivo: index,
    concepto: row.concepto,
    importe: row.importe
  }))
  // console.log('todos.value', todos.value)
  crearListaRegistrosTarjeta(todos.value)
}
/**
 * Convertir un arreglo de datos de excel a registros para visualizar en la tabla.
 * @param {Array} excelData - Datos obtenidos del archivo excel
 */
function crearListaRegistrosTarjeta(excelData) {
  // console.table(excelData)
  let autofocus = true
  excelData.forEach((row, index) => {
    if (row.fecha) {
      const fechaObject = DateTime.fromFormat(
        row.fecha.toString(),
        'dd/MM/yyyy'
      )
      if (fechaObject.isValid) {
        const item = {
          id: index,
          fecha: fechaObject.toISODate(),
          consecutivo: row.consecutivo,
          importe: row.importe,
          concepto: row.concepto,
          tipoAfectacion: 'C',
          clase: row.importe < 0 ? 'registro-abono' : '',
          saved: false,
          autofocus,
          isValid: true
        }
        listaRegistrosTarjeta.value.push(item)
        autofocus = false
      }
    }
  })
  // console.log(listaRegistrosTarjeta.value)
}

function getRowClass(row) {
  return !row.isValid ? 'tr-fade bg-red-1' : ''
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

const sumatoriaImporte = computed({
  get() {
    return listaRegistroFiltrados.value.reduce((accumulator, registro) => {
      return accumulator + parseFloat(registro.importe)
    }, 0)
  }
})

function saveItems() {
  try {
    const containsErrors = validarMovimientos()
    if (containsErrors) {
      // setTimeout(() => {
      //   errorItems.value = []
      // }, 6000)
      errorsList.value.reverse().forEach((error) => {
        mostrarNotificacionNegativa(
          `Error en la línea ${error.numero_linea}: ${error.message}`,
          3000,
          'top-right'
        )
      })
    } else {
      var lista_registros_tarjeta = []

      listaRegistroFiltrados.value.forEach((item) => {
        const registro = {
          estadoRegistroTarjetaId: 1, //pendiente
          tipoAfectacion: item.tipoAfectacion,
          cuentaId: props.cuenta.id,
          categoriaId: item.categoria.id,
          importe: item.importe * -1,
          fecha: item.fecha,
          concepto: item.concepto
        }
        lista_registros_tarjeta.push(registro)
      })

      isLoading.value = true
      console.log('lista_registros_tarjeta:', lista_registros_tarjeta)
      registrosTarjetaCrud.registroTarjetaMultipleCreate({
        input: lista_registros_tarjeta
      })

      // api
      //   .post('/create_multiple_registros_tarjeta', {
      //     lista_registros_tarjeta
      //   })
      //   .then((response) => {
      //     // console.log('guardado correctamente')
      //     // console.log('response', response)
      //     const cuenta_id = response.data.retorno[0].cuenta_id
      //     // console.log('cuenta', cuenta_id)
      //     isLoading.value = false
      //     emit('itemsSaved', cuenta_id)
      //   })
      //   .catch((error) => {
      //     isLoading.value = false
      //     // console.error(error.response.data.exception)
      //     notificacion.mostrarNotificacionNegativa(
      //       'No fue posible posible guardar los registro, revisar consola',
      //       900
      //     )
      //   })
      // console.log('items guardados')
    }
  } catch (e) {
    console.log('error', e)
    mostrarNotificacionNegativa(e.message, 2500, 'top-right')
  }
  isLoading.value = false
}
registrosTarjetaCrud.onDoneRegistroTarjetaMultipleCreate(({ data }) => {
  console.log('data:', data)
  const registrosTarjeta = data.registroTarjetaMultipleCreate.registrosTarjeta
  const cuenta_id = registrosTarjeta[0].cuenta.id
  isLoading.value = false
  onDialogOK({ cuenta_id })
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
  errorsList.value.length = 0

  if (listaRegistroFiltrados.value.length <= 0) {
    throw new Error('No hay registros para guardar')
  }

  listaRegistroFiltrados.value.forEach((item) => {
    if (!item.categoria || !item.categoria.id) {
      if (item.tipoMovimientoId === '3') {
        if (!item.cuentaDestino || !item.cuentaDestino.id) {
          addError(1, item.consecutivo, 'Seleccionar cuenta destino.')
          item.isValid = false
        } else {
          item.isValid = true
        }
      } else {
        addError(1, item.consecutivo, 'Seleccionar categoria.')
        item.isValid = false
      }
    } else {
      item.isValid = true
    }
  })
  return errorsList.value.length > 0
}

function addError(code, numero_linea, message) {
  errorsList.value.push({
    code,
    numero_linea,
    message
  })
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

// function deleteRow(props) {
//   // const rowIndex = props.rowIndex
//   const id = props.row.id
//   // console.log(id)
//   const index = listaRegistrosTarjeta.value.findIndex((r) => r.id == id)
//   // listaRegistrosTarjeta.find

//   listaRegistrosTarjeta.value.splice(index, 1)
// }
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
    name: 'importe',
    label: 'Importe',
    field: 'importe',
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
  }
  // {
  //   name: 'acciones',
  //   label: '',
  //   field: 'action',
  //   sortable: false,
  //   align: 'center',
  //   style: 'width:70px',
  //   headerStyle: 'width:70px'
  // }
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
  //de ${listaRegistrosFiltrados.value.length}
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
