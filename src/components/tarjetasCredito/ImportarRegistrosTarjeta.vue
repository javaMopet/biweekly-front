<template>
  <q-card class="my-card" dense style="width: 80%; min-width: 80%">
    <q-card-section class="row justify-between items-start dialog-title">
      <div class="dialog__title--name">
        Tarjeta de crédito &nbsp;&nbsp;~ {{ cuenta.nombre }} ~
      </div>
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
              style="width: 300px"
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
          <q-btn
            v-if="isSelected"
            label="Eliminar"
            @click="eliminarSeleccionados"
            outline
            color="primary"
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
                <span class="errors-message__title"
                  >El formulario contiene los siguientes errores:</span
                >
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
        <template #body-cell-acciones="props">
          <q-td :props="props" fit class="bg-white">
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

    <q-card-actions>
      <div class="row inline justify-between items-center fit q-pa-md">
        <div class="">
          <span class="text-bold text-primary"> Importe Total:</span>
          <span class="q-pl-md text-secondary text-bold">{{
            formato.toCurrency(sumatoriaImporte)
          }}</span>
        </div>
        <div class="row q-gutter-lg q-pa-sm">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn label="Guardar" color="primary-button" @click="saveItems" />
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
/**
 * composables
 */
const formato = useFormato()
const notificacion = useNotificacion()
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
function cargarMovimientosSantander(wb) {
  // get data of first worksheet as an array of objects
  const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    header: ['A', 'B', 'C', 'D'],
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
    consecutivo: row.B,
    concepto: row.C,
    importe: row.D
  }))
  // console.log('datda', todos.value)
  // console.log('datda', todos.value[5])
  todos.value.forEach((row, index) => {
    let fecha = row.fecha.toString()
    for (const [key, value] of monthsMap) {
      // console.log(`${key}: ${value}`)
      fecha = fecha.replace(key.toString(), value.toString())
    }
    const fechaObject = DateTime.fromFormat(fecha, 'dd/MM/yyyy')
    if (fechaObject.isValid) {
      const importe = parseFloat(row.importe) * -1
      const tipo_afectacion = importe < 0 ? 'C' : 'A'
      const clase = importe >= 0 ? 'registro_positivo' : ''
      const item = {
        id: index,
        fecha,
        consecutivo: row.consecutivo,
        importe: importe.toString(),
        tipo_afectacion,
        concepto: row.concepto,
        saved: false,
        clase
      }
      listaRegistrosTarjeta.value.push(item)
    }
  })

  console.table(listaRegistrosTarjeta.value)
}
/**
 * computed
 */
const isErrors = computed({
  get() {
    return errorItems.value.length > 0
  }
})
const listaRegistroFiltrados = computed({
  get() {
    const start_date = DateTime.fromFormat(fecha_inicio.value, 'dd/MM/yyyy')
    const end_date = DateTime.fromFormat(fecha_fin.value, 'dd/MM/yyyy')

    return listaRegistrosTarjeta.value.filter((registro) => {
      const fecha_registro = DateTime.fromFormat(registro.fecha, 'dd/MM/yyyy')
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
function cargarMovimientosBancomer(wb) {
  // get data of first worksheet as an array of objects
  const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    header: ['A', 'B', 'C', 'D', 'E'],
    skipHeader: true,
    raw: false
  })

  console.log('data', data)

  todos.value = data.map((row) => ({
    fecha: row.A,
    concepto: row.B,
    cargo: row.C,
    abono: row.D,
    saldo: row.E
  }))
  // console.log('datda', todos.value)
  // console.log('datda', todos.value[5])
  todos.value.forEach((row, index) => {
    let fecha = row.fecha.toString()
    const fechaObject = DateTime.fromFormat(fecha, 'dd/MM/yyyy')
    if (fechaObject.isValid) {
      console.log('row', row.cargo, row.abono)
      const cargo = row.cargo?.replace(',', '')
      const abono = row.abono?.replace(',', '')
      const tipo_afectacion = !!cargo ? 'C' : !!abono ? 'A' : 'N/A'
      const importeCargoAbono = !!cargo
        ? Math.abs(parseFloat(cargo))
        : !!abono
        ? Math.abs(parseFloat(abono))
        : 0

      const importe =
        tipo_afectacion === 'C' ? importeCargoAbono * -1 : importeCargoAbono
      const item = {
        id: index,
        fecha,
        consecutivo: index,
        importe,
        concepto: row.concepto,
        tipo_afectacion,
        saved: false
      }
      listaRegistrosTarjeta.value.push(item)
    }
  })
}

function saveItems() {
  const containsErrors = validarMovimientos()
  if (containsErrors) {
    setTimeout(() => {
      errorItems.value = []
    }, 6000)
  } else {
    var lista_registros_tarjeta = []

    listaRegistroFiltrados.value.forEach((item) => {
      const registro = {
        estado_registro_tarjeta_id: 1, //pendiente
        tipo_afectacion: item.tipo_afectacion,
        cuenta_id: props.cuenta.id,
        categoria_id: item.categoria.id,
        importe: parseFloat(item.importe),
        fecha: formato.convertDateFromInputToIso(item.fecha),
        concepto: item.concepto
      }
      lista_registros_tarjeta.push(registro)
    })

    api
      .post('/create_multiple_registros_tarjeta', {
        lista_registros_tarjeta
      })
      .then((response) => {
        console.log('guardado correctamente')
        console.log('response', response)
        emit('itemsSaved')
      })
      .catch((error) => {
        console.error(error.response.data.exception)
        notificacion.mostrarNotificacionNegativa(
          'No fue posible posible guardar los registro, revisar consola',
          900
        )
      })
    console.log('items guardados')
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
    style: 'width:80px'
  },
  {
    name: 'fecha',
    label: 'Fecha',
    field: 'fecha',
    sortable: true,
    align: 'left',
    filter: false,
    style: 'width:120px'
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
    sortable: true,
    align: 'right',
    // format: (val, row) => `${formato.toCurrency(parseFloat(val))}`,
    style: 'width:150px'
  },
  {
    name: 'categoria',
    label: 'Categoria',
    field: 'categoria',
    sortable: true,
    align: 'left',
    style: 'width:450px;max-width:450px'
  },
  {
    name: 'acciones',
    label: '',
    field: 'action',
    sortable: false,
    align: 'center',
    style: 'width:100px'
  }
]
function closeErrors() {
  errorItems.value = []
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

.registro_positivo {
  color: $negative !important;
  font-weight: 700;
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
</style>
