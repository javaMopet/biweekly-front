<template>
  <q-card class="my-card" dense style="width: 80vw; min-width: 80vw">
    <q-card-section class="bg-primary row inline fit q-py-sm justify-between">
      <div class="text-h6 text-contrast">Movimientos de la tarjeta</div>
      <div class="">
        <q-btn
          round
          flat
          dense
          icon="close"
          v-close-popup
          color="accent-light"
        ></q-btn>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row justify-between">
        <q-file
          v-model="archivoExcel"
          label="Selecciona archivo Excel"
          color="primary"
          accept=".xlsx,.xls"
          @input="updateFile"
          dense
          stack-label
          clearable
          style="width: 400px"
        />
        <q-btn
          color="negative"
          icon="delete"
          label="Eliminar"
          dense
          outline
          @click="eliminarSeleccionados"
        />
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
              :readonly="true"
              v-model="props.row.categoria"
              tipo-movimiento-id="2"
            ></CategoriaSelect>
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
        <q-btn label="Guardar" color="primary" />
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup>
/**
 * imports
 */
import { ref } from 'vue'
import { read, utils } from 'xlsx'
import CategoriaSelect from '../formComponents/CategoriaSelect.vue'
import { useFormato } from 'src/composables/utils/useFormato'

/**
 * state
 */
const archivoExcel = ref(null)
const registrosSelected = ref()
const listaRegistrosTarjeta = ref([])
const todos = ref()
/**
 * composables
 */
const formato = useFormato()
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

    for (const row of rows) {
      for (const key in row) {
        console.log('data cell', row[key])
      }
    }

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
      const item = {
        fecha: fecha,
        consecutivo: row.consecutivo,
        importe: row.importe,
        concepto: row.concepto,
        saved: false
      }
      listaRegistrosTarjeta.value.push(item)
    })
  } catch (e) {
    console.log(e)
  }
}

function guardarMovimientos() {
  console.log('guardando los movimeintos')
}
function eliminarSeleccionados() {
  console.log('eliminar seleccionados')
}

function deleteRow(props) {
  const rowIndex = props.rowIndex

  listaRegistrosTarjeta.value.splice(rowIndex, 1)
}

const columns = [
  // { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
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
    name: 'consecutivo',
    label: 'Consecutivo',
    field: 'consecutivo',
    sortable: true,
    align: 'left',
    filter: true,
    style: 'width:100px'
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
    align: 'left'
  },
  {
    name: 'importe',
    label: 'Importe',
    field: 'importe',
    sortable: true,
    align: 'right',
    format: (val, row) => `${formato.toCurrency(parseFloat(val))}`,
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
</script>

<style lang="scss" scoped></style>
