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
          <div class="row q-pr-lg justify-between">
            <div class="column">
              <div class="form-input__label">
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
                no-caps
                label-color="primary"
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
            <q-btn
              v-if="isSelected"
              label="Eliminar"
              @click="eliminarSeleccionados"
              color="primary"
              dense
            />
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
            :rows="listaRegistrosFiltrados"
            :columns="columns"
            :rows-per-page-options="[0]"
            row-key="consecutivo"
            dense
            separator="cell"
            selection="multiple"
            v-model:selected="registrosSelected"
            table-header-class="text-accent text-condensed bg-primary-light"
            no-data-label="No existen datos disponibles"
            hide-pagination
            class="my-sticky-header-table"
          >
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
                  <transition name="fade">
                    <div class="requerido" v-if="!props.row.isValid">
                      <div class="requerido__message">
                        <q-icon
                          name="las la-exclamation-triangle"
                          size="16px"
                        />
                        Requerido
                      </div>
                    </div>
                  </transition>
                </div>
              </q-td>
            </template>
            <template #body-cell-importe="props">
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
            </template>
            <template #body-cell-acciones="props">
              <q-td :props="props" fit class="bg-white">
                <!-- icon="delete_sweep" -->
                <q-btn
                  icon="las la-trash-alt"
                  size="md"
                  class="q-ml-sm"
                  color="negative"
                  dense
                  @click="deleteRow(props)"
                  flat
                />
              </q-td>
            </template>
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
  <!-- <div class="col bg-white">
    <pre>{{ listaRegistrosFiltrados }}</pre>
  </div> -->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { read, utils } from 'xlsx'
import { useFormato } from 'src/composables/utils/useFormato'
import { DateTime } from 'luxon'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import DateInput from '../formComponents/DateInput.vue'
import TipoMovimientoSelect from '../formComponents/TipoMovimientoSelect.vue'
import { SessionStorage } from 'quasar'
import { useRegistrosCrud } from 'src/composables/useRegistrosCrud'
import DialogTitle from '../formComponents/modal/DialogTitle.vue'

/**
 * Composables
 */
const notificacion = useNotificacion()
const registrosCrud = useRegistrosCrud()
/**
 * state
 */
const archivoExcel = ref(null)
const registrosSelected = ref([])
const listaRegistros = ref([])
const todos = ref()
const errorsList = ref([])
const fecha_inicio = ref('01/01/1900')
const fecha_fin = ref('01/01/1900')
const isLoading = ref(false)

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
})
/**
 * emits
 */
const emit = defineEmits(['itemsSaved'])
/**
 *
 * @param {*} v
 */
// assuming `todos` is a standard VueJS `ref`
async function updateFile(v) {
  try {
    // `v.target.files[0]` is the desired file object
    const files = v.target.files
    if (!files || files.length == 0) return

    // read first file
    const wb = read(await files[0].arrayBuffer())
    // get data of first worksheet as an array of objects
    const rows = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
      raw: false
    })

    // for (const row of rows) {
    //   for (const key in row) {
    //     console.log('data cell', row[key])
    //   }
    // }
    // console.log(props.cuenta)
    if (!!props.cuenta.banco) {
      switch (props.cuenta.banco.id) {
        case 1:
          obtenerMovimientosSantander(wb)
          break
        case 2:
          obtenerMovimientosBancomer(wb)
          break
        default:
          break
      }
    } else {
      obtenerMovimientosEfectivo(wb)
    }
  } catch (e) {
    console.log(e)
  }
}
function obtenerMovimientosSantander(wb) {
  // get data of first worksheet as an array of objects
  const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    skipHeader: true,
    raw: false
  })

  // console.log('data', data)
  const monthsMap = new Map()
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

  todos.value = data.map((row) => ({
    fecha: row.A,
    concepto: row.D,
    retiro: row.E,
    deposito: row.F,
    saldo: row.G,
    referencia: row.H
  }))
  // console.log('datda', todos.value)
  // console.log('datda', todos.value[5])
  todos.value.forEach((row, index) => {
    let fecha = row.fecha.toString()
    for (const [key, value] of monthsMap) {
      // console.log(`${key}: ${value}`)
      fecha = fecha.replace(key.toString(), value.toString())
    }
    console.log('fecha', fecha)
    const validDate = DateTime.fromFormat(fecha, 'dd/MM/yyyy')
    if (validDate.isValid) {
      const tipo_afectacion =
        row.retiro > 0 ? 'C' : row.deposito > 0 ? 'A' : 'N/A'
      const importe =
        row.retiro > 0
          ? parseFloat(row.retiro) * -1
          : row.deposito > 0
          ? parseFloat(row.deposito)
          : 0
      const item = {
        id: index,
        consecutivo: index + 1,
        tipo_afectacion,
        fecha: fecha,
        concepto: row.concepto,
        importe,
        saldo: row.saldo,
        referencia: row.referencia,
        tipoMovimiento: {}
        // saved: false
      }
      listaRegistros.value.push(item)
    }
  })
}
function obtenerMovimientosBancomer(wb) {
  const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    header: ['A', 'B', 'C', 'D', 'E'],
    skipHeader: true,
    raw: false
  })

  todos.value = data.map((row) => ({
    fecha: row.A,
    concepto: row.B,
    cargo: row.C,
    abono: row.D,
    saldo: row.E
  }))

  todos.value.forEach((row, index) => {
    let fecha = row.fecha.toString()
    const fechaObject = DateTime.fromFormat(fecha, 'dd/MM/yyyy')
    if (fechaObject.isValid) {
      const cargo = row.cargo?.replace(',', '')
      const abono = row.abono?.replace(',', '')
      const tipo_afectacion = !!cargo ? 'C' : !!abono ? 'A' : 'N/A'
      const importe = !!cargo
        ? parseFloat(cargo)
        : !!abono
        ? parseFloat(abono)
        : 0
      addItemToSave(row, index, fecha, importe, tipo_afectacion)
    }
  })
  console.table(listaRegistros.value)
}
function obtenerMovimientosEfectivo(wb) {
  const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    header: ['A', 'B', 'C', 'D', 'E', 'F'],
    skipHeader: true,
    raw: false
  })

  todos.value = data.map((row) => ({
    consecutivo: row.A,
    fecha: row.B,
    concepto: row.C,
    cargo: row.D,
    abono: row.E,
    saldo: row.F
  }))
  // console.log('todos', todos.value)
  console.table(todos.value)

  todos.value.forEach((row, index) => {
    let fecha = row.fecha?.toString() || ''
    // console.log('fecha', fecha)
    let fechaObject = DateTime.fromFormat(fecha, 'dd/MM/yyyy')
    if (!fechaObject.isValid) {
      fechaObject = DateTime.fromFormat(fecha, 'dd-MM-yyyy')
    }
    // console.log('fecha valida', fechaObject.isValid)
    if (fechaObject.isValid) {
      const cargo = parseFloat(row.cargo?.replace(',', '') ?? 0)
      const abono = parseFloat(row.abono?.replace(',', '') ?? 0)
      console.log('cargo y abono: ', cargo, abono)
      if (cargo !== 0 && abono !== 0) {
        console.trace('error en la linea')
        return
      }
      let tipo_afectacion = null
      let importe = 0
      if (cargo !== 0) {
        tipo_afectacion = 'C'
        importe = cargo * -1
      } else {
        tipo_afectacion = 'A'
        importe = abono
      }
      addItemToSave(row, index, fecha, importe, tipo_afectacion)
    }
  })
  console.table(listaRegistros.value)
}

/**
 * Agregar un item a la lista de movimientos a guardar
 * @param {*} row
 * @param {*} index
 * @param {*} fecha
 * @param {*} importe
 * @param {*} tipo_afectacion
 */
function addItemToSave(row, index, fecha, importe, tipo_afectacion) {
  console.log('fecha', fecha)
  const item = {
    id: index,
    consecutivo: row.consecutivo,
    tipo_afectacion,
    fecha: fecha,
    concepto: row.concepto,
    importe,
    saldo: row.saldo,
    saved: false,
    isValid: true
  }
  listaRegistros.value.push(item)
}

function obtenerRegistros() {
  var registrosInput = []
  var opciones = ['1', '2']
  const userId = SessionStorage.getItem('user').id
  listaRegistrosFiltrados.value.forEach((item) => {
    console.log('recorriendo arreglo')
    console.dir(item.tipoMovimiento)
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
        userId
      })
    }
  })
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
  listaRegistrosFiltrados.value.forEach((item) => {
    const fecha = DateTime.fromFormat(item.fecha, 'dd/MM/yyyy')
    const userId = SessionStorage.getItem('user').id
    if (item.tipoMovimiento.tipoMovimientoId === '3') {
      traspasosInput.push({
        fecha,
        observaciones: 'Traspaso entre cuentas',
        userId,
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
  console.table(listaRegistrosFiltrados.value)
  const containsErrors = validarMovimientos()
  if (containsErrors) {
    setTimeout(() => {
      errorsList.value.length = 0
      listaRegistrosFiltrados.value.forEach((item) => {
        item.isValid = true
      })
    }, 4000)
  } else {
    var registrosInput = obtenerRegistros()
    var traspasosInput = obtenerTraspasos()
    saveItemsAfterValidate(registrosInput, traspasosInput)
  }
}

function saveItemsAfterValidate(registrosInput, traspasosInput) {
  console.table(registrosInput)
  console.table(traspasosInput)

  isLoading.value = true
  registrosCrud.importarRegistros({
    registrosInput,
    traspasosInput
  })
}
registrosCrud.onDoneImportarRegistros(({ data }) => {
  console.dir(data)
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
  // setTimeout(() => {
  if (listaRegistrosFiltrados.value.length <= 0) {
    addError(0, null, 'No hay datos para guardar')
  }
  listaRegistrosFiltrados.value.forEach((item) => {
    if (!!item.tipoMovimiento) {
      const tipoMovimiento = item.tipoMovimiento
      if (!tipoMovimiento.value) {
        addError(
          1,
          item.consecutivo,
          'Favor de ingresar los valores requeridos'
        )
        item.isValid = false
      } else {
        item.isValid = true
      }
    } else {
      addError(1, item.consecutivo, 'Favor de agregar categoria')
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
  console.log('eliminar seleccionados', registrosSelected.value)
  registrosSelected.value.forEach((item) => {
    var index = listaRegistros.value.indexOf(item)
    if (index !== -1) {
      listaRegistros.value.splice(index, 1)
    }
  })
}

function deleteRow(props) {
  const index = listaRegistros.value.findIndex((r) => r.id == props.row.id)

  listaRegistros.value.splice(index, 1)
}
function fileClear() {
  listaRegistros.value.length = 0
}
/**
 * computed
 */
const isSelected = computed({
  get() {
    return registrosSelected.value.length > 0
  }
})

const listaRegistrosFiltrados = computed({
  get() {
    const start_date = DateTime.fromFormat(fecha_inicio.value, 'dd/MM/yyyy')
    const end_date = DateTime.fromFormat(fecha_fin.value, 'dd/MM/yyyy')

    return listaRegistros.value.filter((registro) => {
      const fecha_registro = DateTime.fromFormat(registro.fecha, 'dd/MM/yyyy')
        .isValid
        ? DateTime.fromFormat(registro.fecha, 'dd/MM/yyyy')
        : DateTime.fromFormat(registro.fecha, 'dd-MM-yyyy')
      return fecha_registro >= start_date && fecha_registro <= end_date
    })
  }
})

const sumatoriaMovimientos = computed({
  get() {
    return listaRegistrosFiltrados.value.reduce((accumulator, registro) => {
      return accumulator + parseFloat(registro.importe)
    }, 0)
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
    headerStyle: 'width:100px;max-width:100px',
    style: 'width:100px;max-width:100px'
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
    headerStyle: 'width:100px;max-width:100px'
  },
  {
    name: 'categoria',
    label: 'Categoria',
    field: 'categoria',
    sortable: true,
    align: 'center',
    headerStyle: 'width:400px;max-width:400px',
    style: 'width:400px;max-width:400px'
  },
  {
    name: 'acciones',
    label: '',
    field: 'action',
    sortable: false,
    align: 'center',
    style: 'width:5%'
  }
]
function closeErrors() {
  errorsList.value.length = 0
}
function categoriaSaved() {
  console.log('La categoria fue guardada correctamente')
}
// deprecated
// api
//   .post('/registros/create_multiple', { lista_registros
//   })
//   .then((response) => { console.log('guardado correctamente')
//   })
//   .catch((error) => { console.error(error)
//     console.error('esto es un error')
//   })
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
    box-shadow: rgba(165, 138, 138, 0.76) 5px 14px 28px,
      rgba(145, 109, 109, 0.74) 5px 10px 10px;
  }
}
</style>
