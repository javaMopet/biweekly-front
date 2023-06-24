<template>
  <q-card class="my-card" dense style="width: 80vw; min-width: 80vw">
    <!-- <pre>{{ cuenta }}</pre> -->
    <q-card-section class="bg-primary row inline fit q-py-sm justify-between">
      <div class="text-h6 text-accent">
        Movimientos de la tarjeta {{ cuenta.nombre }}
      </div>
      <div class="">
        <q-btn
          round
          flat
          dense
          icon="close"
          v-close-popup
          color="accent"
          class="btn-close"
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
              label="Carga archivo Excel"
              accept=".xlsx,.xls"
              @input="updateFile"
              dense
              style="width: 450px"
              max-files="1"
              outlined
              no-caps
              label-color="primary"
            >
              <template #before>
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
        :rows="listaRegistros"
        :columns="columns"
        :rows-per-page-options="[0]"
        row-key="consecutivo"
        dense
        selection="multiple"
        v-model:selected="registrosSelected"
        no-data-label="No existen datos disponibles"
      >
        <template #body-cell-categoria="props">
          <q-td :props="props">
            <CategoriaSelect
              v-model="props.row.categoria"
              tipo-movimiento-id="2"
            ></CategoriaSelect>
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
      </q-table>
    </q-card-section>

    <q-card-actions align="right">
      <div class="row">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn label="Guardar" color="primary" @click="saveItems" />
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

/**
 * state
 */
const archivoExcel = ref(null)
const registrosSelected = ref([])
const listaRegistros = ref([])
const todos = ref()
const errorsList = ref([])

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
  }
})
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
    console.log(props.cuenta.banco.id)
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
    const tipoMovimientoId = row.retiro > 0 ? 2 : row.deposito > 0 ? 1 : 'n/a'
    const importe =
      row.retiro > 0
        ? parseFloat(row.retiro) * -1
        : row.deposito > 0
        ? parseFloat(row.deposito)
        : 0
    const item = {
      consecutivo: index + 1,
      tipoMovimientoId,
      fecha: fecha,
      concepto: row.concepto,
      importe,
      saldo: row.saldo,
      referencia: row.referencia,
      saved: false
    }
    listaRegistros.value.push(item)
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
      console.log('row', row.cargo, row.abono)
      const cargo = row.cargo?.replace(',', '')
      const abono = row.abono?.replace(',', '')
      const tipoMovimientoId = !!cargo ? 2 : !!abono ? 1 : 'n/a'
      const importe = !!cargo
        ? parseFloat(cargo)
        : !!abono
        ? parseFloat(abono)
        : 0
      const item = {
        consecutivo: index + 1,
        tipoMovimientoId,
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
  console.log('guardando los movimientos de forma masiva', listaRegistros.value)
  const containsErrors = validarMovimientos()
  if (containsErrors) {
    setTimeout(() => {
      errorsList.value.length = 0
    }, 7000)
  } else {
    var lista_registros = []

    listaRegistros.value.forEach((item) => {
      const fecha = DateTime.fromFormat(item.fecha, 'dd/MM/yyyy')
      const registro = {
        tipoMovimientoId: item.tipoMovimientoId,
        estado_registro_id: 2, //cerrado
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
  console.log('lista de registros a guardar', lista_registros)
  api
    .post('/registros/create_multiple', {
      lista_registros
    })
    .then((response) => {
      console.log('guardado correctamente')
      console.log('response', response)
    })
    .catch((error) => {
      console.error(error)
      console.error('esto es un error')
    })
}

function validarMovimientos() {
  if (listaRegistros.value.length <= 0) {
    addError(0, null, 'No hay datos para guardar')
  }
  listaRegistros.value.forEach((item) => {
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
  const rowIndex = props.rowIndex

  listaRegistros.value.splice(rowIndex, 1)
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
    name: 'fecha',
    label: 'No.',
    field: 'consecutivo',
    sortable: true,
    align: 'left',
    filter: false,
    style: 'width:1%'
  },
  {
    name: 'fecha',
    label: 'Fecha',
    field: 'fecha',
    sortable: true,
    align: 'left',
    filter: false,
    style: 'width:10%'
  },
  {
    name: 'tipomovimiento',
    label: 'Tipo Mov',
    field: 'tipoMovimientoId',
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
    style: 'width:250px;max-width:250px'
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
    style: 'width:200px'
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
