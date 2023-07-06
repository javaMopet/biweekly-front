<template>
  <q-card class="my-card" dense style="width: 80vw; min-width: 80vw">
    <q-card-section
      class="bg-main-menu row inline fit q-py-sm justify-between items-center"
    >
      <div class="dialog__title--name">
        Tarjeta de crédito - {{ cuenta.nombre }}
      </div>
      <div class="">
        <q-btn
          round
          flat
          dense
          icon="close"
          class="float-right"
          color="accent dialog__title--closeButton"
          v-close-popup
          vertical-top
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
            <q-file
              v-model="archivoExcel"
              label="CARGAR"
              accept=".xlsx,.xls"
              @input="updateFile"
              dense
              style="width: 450px"
              max-files="1"
              outlined
              label-color="accent"
              clearable
              bg-color="toolbar-button"
              dark
              @clear="fileClear"
            >
              <template #prepend>
                <!-- <q-icon color="white" name="attach_file" /> -->
                <q-icon color="white" name="cloud_upload" />
                <q-separator spaced inset vertical dark />
              </template>
            </q-file>
            <!-- <DateInput
              v-model="fecha_desde"
              clearable
              label="Desde la fecha"
            ></DateInput> -->
            <q-btn
              v-if="isSelected"
              label="Eliminar"
              @click="eliminarSeleccionados"
              outline
              color="primary"
            />
          </q-toolbar>
        </div>
        <transition name="fade">
          <div class="row bg-pink-1" v-if="isErrors">
            <div class="column">
              <div class="row q-gutter-x-md q-pl-sm q-pt-sm">
                <q-icon name="warning" size="1.5rem" color="negative" />
                <span class="text-caption text-dark"
                  >El formulario contiene los siguientes errores:</span
                >
              </div>
              <q-list dense>
                <q-item :inset-level="0.5" dense>
                  <q-item-section
                    avatar
                    dense
                    style="min-width: 25px !important; width: 25px !important"
                  >
                    <q-icon color="primary" name="arrow_right" />
                  </q-item-section>
                  <q-item-section class="text-subtitle2"
                    >Debes seleccionar la categoría en todos los
                    movimientos</q-item-section
                  >
                </q-item>
              </q-list>
            </div>
          </div>
        </transition>
      </div>
    </q-card-section>
    <q-card-section style="max-height: 70vh; height: 70vh" class="scroll">
      <q-table
        :rows="listaRegistrosTarjeta"
        :columns="columns"
        :rows-per-page-options="[0]"
        row-key="consecutivo"
        dense
        selection="multiple"
        v-model:selected="registrosSelected"
      >
        <template #body-cell-categoria="props">
          <q-td :props="props">
            <CategoriaSelect
              v-model="props.row.categoria"
              :tipo-afectacion="props.row.tipoAfectacion"
            ></CategoriaSelect>
          </q-td>
        </template>
        <template #body-cell-importe="props">
          <q-td :props="props">
            <span class="text-primary">
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
      </q-table>
      <!-- <pre>{{ props.cuenta }}</pre> -->
    </q-card-section>

    <q-card-actions align="right">
      <div class="row q-gutter-x-md">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn
          label="Guardar"
          color="primary-button"
          @click="guardarMovimientos"
        />
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup>
/**
 * imports
 */
import { ref, computed } from 'vue'
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
const isErrors = ref(false)
const fecha_desde = ref()
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
  }
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

  console.log('data', data)
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
  todos.value.forEach((row) => {
    let fecha = row.fecha.toString()
    for (const [key, value] of monthsMap) {
      // console.log(`${key}: ${value}`)
      fecha = fecha.replace(key.toString(), value.toString())
    }
    const fechaObject = DateTime.fromFormat(fecha, 'dd/MM/yyyy')
    if (fechaObject.isValid) {
      const importe = parseFloat(row.importe) * -1
      const tipoAfectacion = importe < 0 ? 'C' : 'A'
      const item = {
        fecha,
        consecutivo: row.consecutivo,
        importe: importe.toString(),
        tipoAfectacion,
        concepto: row.concepto,
        saved: false
      }
      listaRegistrosTarjeta.value.push(item)
    }
  })
}
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

function guardarMovimientos() {
  console.log('guardando los movimeintos', listaRegistrosTarjeta.value)
  const containsErrors = validarMovimientos()
  if (containsErrors) {
    isErrors.value = true
    setTimeout(() => {
      isErrors.value = false
    }, 6000)
  } else {
    var lista_registros_tarjeta = []

    listaRegistrosTarjeta.value.forEach((item) => {
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

function validarMovimientos() {
  let containsErrors = false
  containsErrors = listaRegistrosTarjeta.value.length <= 0
  listaRegistrosTarjeta.value.forEach((item) => {
    if (!item.categoria) {
      containsErrors = true
    }
  })
  return containsErrors
}
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
  const rowIndex = props.rowIndex

  listaRegistrosTarjeta.value.splice(rowIndex, 1)
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
    name: 'categoria',
    label: 'Categoria',
    field: 'categoria',
    sortable: true,
    align: 'left',
    style: 'width:450px;max-width:450px'
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
    name: 'acciones',
    label: '',
    field: 'action',
    sortable: false,
    align: 'center',
    style: 'width:100px'
  }
]
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
// .importe_negativo {
//   color: red;
// }
// .importe_positivo {
//   color: green;
// }
</style>
