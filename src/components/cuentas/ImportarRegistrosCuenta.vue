<template>
  <div class="my-card" style="width: 80%; min-width: 80%; max-width: 80%">
    <q-inner-loading
      :showing="isLoading"
      label="Saving... Please wait..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
      style="z-index: 500"
    />
    <DialogTitle>Cuenta &nbsp;&nbsp;~ {{ account?.nombre }} ~</DialogTitle>
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
            :rows="listaRegistrosFiltrados"
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
            :table-row-class-fn="getRowClass"
          >
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
            <template
              #body-cell-categoria="props"
              :class="{ 'bg-orange': !props.row.isValid }"
            >
              <q-td :props="props">
                <div class="column col">
                  <div>
                    <!-- <pre>{{ props.row.categoria.id }}</pre> -->
                    <!-- <pre>{{ props.row.isValid }}</pre> -->
                    <CategoriaSelectionComponent
                      v-model="props.row.categoria"
                      v-model:tipoMovimientoId="props.row.tipoMovimientoId"
                      v-model:cuentaDestino="props.row.cuentaDestino"
                      :tipo-afectacion="props.row.tipo_afectacion"
                      @categoriaSaved="categoriaSaved"
                    ></CategoriaSelectionComponent>
                  </div>
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
  <!-- <div class="col bg-white"> -->
  <!-- <pre>cta: {{ props.cuenta?.id }} - {{ cuenta?.id }}</pre> -->
  <!-- <pre>{{ listaRegistrosFiltrados.map((det) => det.categoria) }}</pre> -->
  <!-- <pre>{{ listaRegistrosFiltrados }}</pre> -->
  <!-- </div> -->
</template>

<script setup>
import { ref, computed, onMounted, toRef } from 'vue'
import { read, utils } from 'xlsx'
import { useFormato } from 'src/composables/utils/useFormato'
import { DateTime } from 'luxon'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import DateInput from '../formComponents/DateInput.vue'
import TipoMovimientoSelect from '../formComponents/TipoMovimientoSelect.vue'
import { SessionStorage } from 'quasar'
import { useRegistrosCrud } from 'src/composables/useRegistrosCrud'
import DialogTitle from '../formComponents/modal/DialogTitle.vue'
import { toast } from 'vue3-toastify'
import { parse, format } from 'date-fns'
import es from 'date-fns/locale/es'
import en from 'date-fns/locale/en-US'
import { useCategoriaStore } from 'src/stores/common/categoriaStore'
import CategoriaSelectionComponent from '../formComponents/CategoriaSelectionComponent.vue'
import { useRouter } from 'vue-router'

/**
 * Composables
 */
const notificacion = useNotificacion()
const registrosCrud = useRegistrosCrud()
const categoriaStore = useCategoriaStore()
const router = useRouter()
const { mostrarNotificacionNegativa } = useNotificacion()
/**
 * state
 */
const account = ref()
const archivoExcel = ref(null)
const registrosSelected = ref([])
const listaRegistros = ref([])
const todos = ref()
const errorsList = ref([])
const fecha_inicio = ref('01/01/1900')
const fecha_fin = ref('01/01/1900')
const isLoading = ref(false)
const loadingRows = ref(false)

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
    required: true
  },
  fecha_desde: {
    type: String,
    required: true
  },
  fecha_hasta: {
    type: String,
    required: true
  }
})
/**
 * onMounted
 */
onMounted(() => {
  const { cuenta, fecha_desde, fecha_hasta } = props
  account.value = cuenta
  if (!account.value) {
    notificacion.mostrarNotificacionNegativa(
      'No se ha seleccionado una cuenta',
      1500
    )
    router.push('/cuentas')
    return
  }
  let desde = formato.formatoFechaFromISO(fecha_desde)
  let hasta = formato.formatoFechaFromISO(fecha_hasta)
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
  loadingRows.value = true
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

    // console.log('props.cuenta.banco.id:', props.cuenta.banco)
    if (!!props.cuenta.banco) {
      switch (props.cuenta.banco.id) {
        case '1':
          // obtenerMovimientosSantander(wb)
          obtenerMovimientosSantanderNuevo(wb)
          break
        case '2':
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
    loadingRows.value = false
  }
  loadingRows.value = false
}
function getSelectedString() {
  return registrosSelected.value.length === 0
    ? ''
    : `${registrosSelected.value.length} registro${
        registrosSelected.value.length > 1 ? 's' : ''
      } seleccionados. Importe: ${formato.toCurrency(
        importe_seleccionado.value
      )} `
  //de ${listaRegistrosFiltrados.value.length}
}
function obtenerMovimientosSantander(wb) {
  // get data of first worksheet as an array of objects
  const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    skipHeader: true,
    raw: false
  })

  todos.value = data.map((row) => ({
    fecha: row.A,
    concepto: row.D,
    retiro: row.E,
    deposito: row.F,
    saldo: row.G,
    referencia: row.H
  }))

  todos.value.forEach((row, index) => {
    let fecha = convertidorFecha(row.fecha.toString())
    if (!!fecha) {
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
        }
        listaRegistros.value.push(item)
      }
    }
  })
}
function obtenerMovimientosSantanderNuevo(wb) {
  // get data of first worksheet as an array of objects
  const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    header: ['A', 'B', 'C', 'D', 'E', 'F'],
    skipHeader: true,
    raw: false
  })

  todos.value = data.map((row) => ({
    fecha: row.A,
    hora: row.B,
    concepto: row.C,
    retiro: row.D,
    deposito: row.E,
    referencia: row.F
  }))

  // console.table(todos.value)

  todos.value.forEach((row, index) => {
    let fecha = convertidorFecha(row.fecha.toString())
    if (!!fecha) {
      const validDate = DateTime.fromFormat(fecha, 'dd/MM/yyyy')
      if (validDate.isValid) {
        const retiro = convertirImporte(row.retiro)
        const deposito = convertirImporte(row.deposito)
        const tipo_afectacion = retiro != 0 ? 'C' : deposito != 0 ? 'A' : 'N/A'
        const importe =
          retiro != 0
            ? parseFloat(retiro)
            : deposito != 0
            ? parseFloat(deposito)
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
        }
        listaRegistros.value.push(item)
      }
    }
  })
}

function convertidorFecha(fecha) {
  if (fecha.includes('/')) {
    const partes = fecha.split('/')
    if (isNaN(partes[1])) {
      // asume que el formato es 01/ene/2025 pe.
      const fechaParseada = parse(fecha, 'dd/MMM/yy', new Date(), {
        locale: es
      })
      const fechaP = format(fechaParseada, 'dd/MM/yyyy')
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
  } else if (fecha.includes('-')) {
    const fechaParseada = parse(fecha, 'dd-MMM', new Date(), {
      locale: en
    })
    const fechaP = format(fechaParseada, 'dd/MM/yyyy')
    return fechaP
  }
}

function convertirImporte(importe) {
  if (!importe) return 0
  return parseFloat(importe.replace(/[$,]/g, ''))
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
      row.consecutivo = index
      const importe = !!cargo
        ? parseFloat(cargo)
        : !!abono
        ? parseFloat(abono)
        : 0
      addItemToSave(row, index, fecha, importe, tipo_afectacion)
    }
  })
  // console.table(listaRegistros.value)
}

function obtenerMovimientosEfectivo(wb) {
  // console.log('movimientos efectivo')
  // console.log('wb.SheetNames:', wb.SheetNames)
  const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[1]], {
    header: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    skipHeader: true,
    raw: false
  })

  // console.log('data:', data)

  todos.value = data
    .filter((row) => !!row.A)
    .map((row, index) => ({
      consecutivo: index + 1,
      fecha: convertidorFecha(row.A),
      movimiento: row.B,
      categoria: row.C,
      concepto: row.D,
      cargo: convertirImporte(row.E),
      abono: convertirImporte(row.F),
      saldo: convertirImporte(row.G)
    }))

  // console.log('todos', todos.value)
  // console.table(todos.value)
  // console.log('categoriaStore.listaCategorias:', categoriaStore.listaCategorias)
  try {
    todos.value.forEach((row, index) => {
      let fecha = row.fecha?.toString() || ''
      // console.log('fecha', fecha)
      let fechaObject = DateTime.fromFormat(fecha, 'dd/MM/yyyy')
      if (!fechaObject.isValid) {
        fechaObject = DateTime.fromFormat(fecha, 'dd-MM-yyyy')
      }
      // console.log('fecha valida', fechaObject.isValid)
      if (fechaObject.isValid) {
        // console.log('row.cargo:', row.cargo)
        const cargo = parseFloat(row.cargo ?? 0)
        const abono = parseFloat(row.abono ?? 0)
        // console.log('cargo y abono: ', cargo, abono)
        if (cargo !== 0 && abono !== 0) {
          console.trace('error en la linea')
          return
        }
        // let tipo_afectacion = null
        let importe = 0
        if (cargo !== 0) {
          // tipo_afectacion = 'C'
          importe = cargo * -1
        } else {
          // tipo_afectacion = 'A'
          importe = abono
        }
        const categoria = buscarCategoriaPorCadena(row.categoria, index)

        const tipo_afectacion = !!categoria
          ? categoria.tipoMovimientoId === '2'
            ? 'C'
            : 'A'
          : cargo !== 0
          ? 'C'
          : 'A'

        addItemToSave(row, index, fecha, importe, tipo_afectacion, categoria)
      }
    })
    // console.table(listaRegistros.value)
  } catch (e) {
    console.log(e)
    loadingRows.value = false
  }
}

function buscarCategoriaPorCadena(cadena, index) {
  const tipoChar = cadena.charAt(0) // 'I' o 'G'
  const nombre = cadena.slice(2) // remueve el tipo y el espacio

  const tipo_movimiento = tipoChar === 'I' ? '1' : '2'

  const cat = categoriaStore.listaCategorias.find(
    (cat) => cat.tipoMovimientoId === tipo_movimiento && cat.nombre === nombre
  )

  return cat
}

/**
 * Agregar un item a la lista de movimientos a guardar
 * @param {*} row
 * @param {*} index
 * @param {*} fecha
 * @param {*} importe
 * @param {*} tipo_afectacion
 */
function addItemToSave(row, index, fecha, importe, tipo_afectacion, categoria) {
  const categoriaInput = !categoria ? { ...categoriaAux } : categoria
  const item = {
    id: index,
    consecutivo: row.consecutivo,
    tipo_afectacion,
    fecha: fecha,
    concepto: row.concepto,
    importe,
    saldo: row.saldo,
    categoria: categoriaInput,
    saved: false,
    isValid: true
  }
  listaRegistros.value.push(item)
}
const categoriaAux = {
  id: undefined,
  nombre: '',
  tipoMovimientoId: '1',
  instancesId: SessionStorage.getItem('current_instance').id,
  tipoMovimiento: {
    id: '1',
    nombre: 'Ingreso'
  }
}

function obtenerRegistros() {
  var registrosInput = []
  var opciones = ['1', '2']
  const user = SessionStorage.getItem('current_user')
  // console.log('listaRegistrosFiltrados.value:', listaRegistrosFiltrados.value)
  listaRegistrosFiltrados.value
    .filter((detalle) => !!detalle.categoria)
    .forEach((item) => {
      // console.log('recorriendo arreglo')
      // console.dir(item)
      const fecha = fechaFromFormat(item.fecha)
      // console.log('fecha:', fecha)
      registrosInput.push({
        estadoRegistroId: 2, //cerrado
        tipoAfectacion: obtenerTipoAfectacionCategoria(item.tipoMovimientoId),
        cuentaId: props.cuenta.id,
        categoriaId: item.categoria.id,
        importe: parseFloat(item.importe),
        fecha: fecha.toISODate(),
        observaciones: item.concepto,
        userId: user.id
      })
    })
  // console.table(registrosInput)
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
  listaRegistrosFiltrados.value
    .filter((detalle) => !!detalle.cuentaDestino)
    .forEach((item) => {
      const fecha = DateTime.fromFormat(item.fecha, 'dd/MM/yyyy')
      const user = SessionStorage.getItem('current_user')
      traspasosInput.push({
        fecha,
        observaciones: 'Traspaso entre cuentas',
        userId: user.id,
        traspasoDetalles: [
          {
            cuentaId: parseInt(item.cuentaDestino.id),
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
    })
  // console.table(traspasosInput);
  return traspasosInput
}

function saveItems() {
  try {
    const containsErrors = validarMovimientos()
    // console.log('containsErrors:', containsErrors)
    if (containsErrors) {
      // toast.error("El formulario contiene algunos errores o datos faltantes", {
      //   position: toast.POSITION.TOP_CENTER,
      //   autoClose: 7000,
      //   theme: 'dark',
      //   transition: 'bounce',
      //   pauseOnFocusLoss: false,
      //   style: 'width: 450px; min-width: 450px'
      // })

      errorsList.value.reverse().forEach((error) => {
        mostrarNotificacionNegativa(
          `Error en la línea ${error.numero_linea}: ${error.message}`,
          5000,
          'top-right'
        )
      })
    } else {
      var registrosInput = obtenerRegistros()
      var traspasosInput = obtenerTraspasos()
      saveItemsAfterValidate(registrosInput, traspasosInput)
    }
  } catch (e) {
    console.log('error', e)
    mostrarNotificacionNegativa(e.message, 2500, 'top-right')
  }
  isLoading.value = false
}

function saveItemsAfterValidate(registrosInput, traspasosInput) {
  isLoading.value = true
  registrosCrud.importarRegistros({
    registrosInput,
    traspasosInput
  })
}
registrosCrud.onDoneImportarRegistros(({ data }) => {
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
  errorsList.value.length = 0

  if (listaRegistrosFiltrados.value.length <= 0) {
    throw new Error('No hay registros para guardar')
  }

  listaRegistrosFiltrados.value.forEach((item) => {
    // console.log('item:', item)
    // console.log('item.categoria:', item.categoria)
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
  // console.log('errorsList:', errorsList.value)
  return errorsList.value.length > 0
  // , 4000
  // })
}

function addError(code, numero_linea, message) {
  // console.log('Adding error - message:', message)
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
const importe_seleccionado = computed({
  get() {
    return registrosSelected.value.reduce((accumulator, registro) => {
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
// function closeErrors() {
//   errorsList.value.length = 0
// }
function categoriaSaved() {
  console.log('La categoria fue guardada correctamente')
}

function getRowClass(row) {
  return !row.isValid ? 'tr-fade bg-red-1' : ''
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
    box-shadow: rgba(165, 138, 138, 0.76) 5px 14px 28px,
      rgba(145, 109, 109, 0.74) 5px 10px 10px;
  }
}

.tr-fade {
  transition: background-color 0.6s ease;
}

.error_base {
  background-color: #63a58a !important;
}
</style>
