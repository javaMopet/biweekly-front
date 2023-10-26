<template>
  <q-card class="my-card" dense style="width: 80vw; min-width: 80vw">
    <q-card-section class="row justify-between items-start dialog-title">
      <div class="dialog__title--name">{{ cuenta.nombre }}</div>
      <div class="dialog-closebutton">
        <q-btn
          round
          icon="close"
          class="dialog__title--closeButton"
          v-close-popup
          push
          glossy
        ></q-btn>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="column justify-between q-gutter-y-sm">
        <!-- <div class="row items-center q-gutter-x-sm">
          <span> Carga tu archivo con movimientos: </span>
        </div> -->
        <div class="row">
          <q-toolbar class="q-gutter-x-md">
            <div class="row q-pr-lg justify-between">
              <div class="load__file-text text-condensed" style="width: 135px">
                Selecciona un archivo en formato Excel:
              </div>
              <q-file
                v-model="archivoExcel"
                label="Carga archivo Excel"
                accept=".xlsx,.xls"
                @input="updateFile"
                dense
                style="width: 350px"
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
                <template #append>
                  <q-img src="/icons/excel2.png" width="24px" />
                </template>
              </q-file>
              <q-btn
                v-if="isSelected"
                label="Eliminar"
                @click="eliminarSeleccionados"
                outline
                color="primary"
              />
            </div>
            <q-separator vertical inset></q-separator>
            <div class="row items-center q-gutter-x-md">
              <span class="text-condensed"> Desde:</span>
              <DateInput
                v-model="fecha_inicio"
                lbl_field="Fecha"
                :opcional="false"
                style="width: 140px"
              ></DateInput>
              <span class="text-condensed">Hasta:</span>
              <DateInput
                v-model="fecha_fin"
                lbl_field="Fecha"
                :opcional="false"
                style="width: 140px"
              ></DateInput>
            </div>
          </q-toolbar>
        </div>
        <q-page-sticky
          position="top"
          style="z-index: 100; width: 600px"
          :offset="[508, 68]"
          expand
        >
          <transition name="fade">
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
          </transition>
        </q-page-sticky>
      </div>
    </q-card-section>
    <q-card-section style="max-height: 70vh; height: 70vh" class="scroll">
      <q-table
        :rows="listaRegistrosFiltrados"
        :columns="columns"
        :rows-per-page-options="[0]"
        row-key="consecutivo"
        dense
        selection="multiple"
        v-model:selected="registrosSelected"
        table-header-class="bg-accent text-white text-condensed"
        no-data-label="No existen datos disponibles"
        hide-pagination
      >
        <!-- <template #body-cell-tipoAfectacion="props">
          <q-td :props="props">
            {{ props.row.tipoAfectacion.nombre }}
          </q-td>
        </template> -->
        <template #body-cell-categoria="props">
          <q-td :props="props">
            <TipoMovimientoSelect
              v-model="props.row.tipoMovimiento"
              :tipo-afectacion="props.row.tipo_afectacion"
            ></TipoMovimientoSelect>
          </q-td>
        </template>
        <template #body-cell-importe="props">
          <q-td :props="props">
            <span
              :class="[
                props.row.importe > 0 ? 'importe_positivo' : 'importe_negativo'
              ]"
            >
              {{ formato.toCurrency(parseFloat(props.row.importe)) }}
            </span>
          </q-td>
        </template>
        <template #body-cell-acciones="props">
          <q-td :props="props" fit class="bg-white">
            <q-btn
              icon="delete_sweep"
              size="md"
              class="q-ml-sm"
              color="negative"
              dense
              @click="deleteRow(props)"
              flat
            />
          </q-td>
        </template>
        <template #bottom-row>
          <q-tr>
            <q-td class="text-bold" colspan="4">Total Movimientos:</q-td>
            <q-td align="right" class="text-bold">
              {{ formato.toCurrency(sumatoriaMovimientos) }}</q-td
            >
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
    <q-card-actions align="right">
      <div class="column float-right">
        <!-- <div class="row">Importe total movimientos:</div> -->
        <div class="row q-gutter-x-md float-right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn label="Guardar" color="primary" @click="saveItems" />
        </div>
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup>
/**
 * imports
 */
import { ref, computed, onMounted } from 'vue'
import { read, utils } from 'xlsx'
import { useFormato } from 'src/composables/utils/useFormato'
import { api } from 'src/boot/axios'
import { DateTime } from 'luxon'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import DateInput from '../formComponents/DateInput.vue'
import { format } from 'accounting-js'
import TipoMovimientoSelect from '../formComponents/TipoMovimientoSelect.vue'

/**
 * Composables
 */
const notificacion = useNotificacion()
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
      const item = {
        id: index,
        consecutivo: index + 1,
        tipo_afectacion,
        fecha: fecha,
        concepto: row.concepto,
        importe,
        saldo: row.saldo,
        saved: false,
        tipoMovimiento: {}
      }
      listaRegistros.value.push(item)
    }
  })
  console.table(listaRegistros.value)
}
function obtenerMovimientosEfectivo(wb) {
  const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    header: ['A', 'B', 'C', 'D', 'E'],
    skipHeader: true,
    raw: false
  })

  todos.value = data.map((row) => ({
    consecutivo: row.A,
    fecha: row.B,
    concepto: row.C,
    importe: row.D,
    saldo: row.E
  }))
  console.log('todos', todos.value)

  todos.value.forEach((row, index) => {
    let fecha = row.fecha?.toString() || ''
    console.log('fecha', fecha)
    const fechaObject = DateTime.fromFormat(fecha, 'dd/MM/yyyy')
    console.log('fecha valida', fechaObject.isValid)
    if (fechaObject.isValid) {
      console.log('row', row.importe)
      const importeReal = row.importe?.replace(',', '')
      const importe = !!importeReal ? parseFloat(importeReal) : 0
      const tipo_afectacion = importe >= 0 ? 'A' : 'C'

      const item = {
        id: index,
        consecutivo: row.consecutivo,
        tipo_afectacion,
        fecha: fecha,
        concepto: row.concepto,
        importe,
        saldo: row.saldo,
        saved: false
      }
      listaRegistros.value.push(item)
    }
  })
  console.log(listaRegistros.value)
}

function saveItems() {
  console.table(listaRegistrosFiltrados.value)
  const containsErrors = validarMovimientos()
  if (containsErrors) {
    setTimeout(() => {
      errorsList.value.length = 0
    }, 7000)
  } else {
    var lista_registros = []

    listaRegistrosFiltrados.value.forEach((item) => {
      const fecha = DateTime.fromFormat(item.fecha, 'dd/MM/yyyy')
      const registro = {
        estado_registro_id: 2, //cerrado
        tipo_afectacion: item.tipo_afectacion,
        cuenta_id: props.cuenta.id,
        categoria_id: item.categoria.id,
        importe: parseFloat(item.importe),
        fecha: fecha.toISODate(),
        observaciones: item.concepto
      }
      lista_registros.push(registro)
    })
    saveItemsAfterValidate(lista_registros)
  }
}

function saveItemsAfterValidate(lista_registros) {
  console.table(lista_registros)
  // api
  //   .post('/registros/create_multiple', {
  //     lista_registros
  //   })
  //   .then((response) => {
  //     console.log('guardado correctamente')
  //     console.log('response', response)
  //     notificacion.mostrarNotificacionPositiva(
  //       'Los registros han sido guardados correctamente.',
  //       1200
  //     )
  //     emit('itemsSaved')
  //   })
  //   .catch((error) => {
  //     console.error(error)
  //     console.error('esto es un error')
  //   })
}

function validarMovimientos() {
  if (listaRegistrosFiltrados.value.length <= 0) {
    addError(0, null, 'No hay datos para guardar')
  }
  listaRegistrosFiltrados.value.forEach((item) => {
    if (!item.categoria) {
      addError(1, item.consecutivo, 'Favor de agregar categoria')
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
    filter: false
  },
  {
    name: 'fecha',
    label: 'Fecha',
    field: 'fecha',
    sortable: true,
    align: 'left',
    filter: false
  },

  {
    name: 'concepto',
    label: 'Concepto',
    field: 'concepto',
    sortable: true,
    align: 'left',
    filter: true,
    style: 'width: 30%'
  },
  {
    name: 'importe',
    label: 'Importe',
    field: 'importe',
    sortable: true,
    align: 'right'
  },
  {
    name: 'categoria',
    label: 'Categoria',
    field: 'categoria',
    sortable: true,
    align: 'center',
    style: 'width:30%'
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
</script>

<style lang="scss">
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
</style>
