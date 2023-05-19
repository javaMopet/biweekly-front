<template>
  <q-card class="my-card">
    <q-card-section>
      <div>tarjeta id: {{ route.params.id }}</div>
      <q-file
        class="q-py-sm"
        v-model="archivoExcel"
        label="Ingresar CFDI"
        color="primary"
        outlined
        standout="bg-teal text-white"
        accept=".xlsx,.xls"
        @input="updateFile"
        dense
        flat
        clearable
      />
      <!-- @update:model-value="cargarExcel" -->
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <q-table
            :rows="registroEditedItem"
            :columns="columns"
            row-key="name"
            dense
            hide-bottom
            hide-header
            hide-no-data
            class="no-border"
            flat
          >
            <template #body-cell-fecha="props">
              <q-td :props="props">
                <DateInput v-model="props.row.fecha"></DateInput>
              </q-td>
            </template>
            <template #body-cell-concepto="props">
              <q-td :props="props">
                <q-input
                  v-model="props.row.concepto"
                  type="textarea"
                  label="Concepto"
                  rows="1"
                  outlined
                  dense
                  lazy-rules
                  :rules="[(val) => !!val || 'Favor de ingresar el concepto']"
                />
              </q-td>
            </template>
            <template #body-cell-categoria="props">
              <q-td :props="props">
                <CategoriaSelect
                  v-model="props.row.categoria"
                  :readonly="true"
                ></CategoriaSelect>
              </q-td>
            </template>
            <template #body-cell-importe="props">
              <q-td :props="props">
                <PriceInput v-model="props.row.importe"></PriceInput>
              </q-td>
            </template>
            <template #body-cell-acciones="props">
              <q-td :props="props" fit class="bg-white">
                <q-btn icon="add" type="submit" color="primary" outline round />
                <!-- <q-btn
                  icon="add"
                  round
                  outline
                  color="primary"
                  @click="addRow(props)"
                  dense
                /> -->
                <!-- <q-btn
              icon="delete"
              size="md"
              class="q-ml-sm"
              color="accent"
              rounded
              dense
              @click="deleteRow(props)"
              flat
            /> -->
              </q-td>
            </template>
          </q-table>
        </div>
        <div>
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>

      <q-table
        title="Table Title"
        :rows="listaRegistrosTarjeta"
        :columns="columns"
        :rows-per-page-options="[0]"
        row-key="name"
        dense
      >
        <!-- <template #top-left>
          <q-btn
            color="primary"
            icon="add"
            label="Nuevo Registro"
            outline
            @click="addRow"
          />
        </template> -->
        <!-- <template #body-cell-categoria="props">
          <q-td :props="props">
            <q-select
              v-model="props.row.categoria"
              :options="categoriaOptions"
              label="Standard"
              filled
            />
          </q-td>
        </template> -->
        <template #body-cell-acciones="props">
          <q-td :props="props" fit class="bg-white">
            <q-btn
              v-if="!props.row.saved"
              icon="save"
              size="md"
              dense
              @click="saveRow(props)"
              rounded
              color="dark"
              flat
            />
            <q-btn
              v-else
              icon="edit"
              size="md"
              dense
              @click="editRow(props)"
              rounded
              color="dark"
              flat
            />
            <q-btn
              icon="delete"
              size="md"
              class="q-ml-sm"
              color="accent"
              rounded
              dense
              @click="deleteRow(props)"
              flat
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>

  <Teleport to="#modal">
    <q-dialog v-model="showForm" persistent>
      <RegistroMovimientoTarjeta></RegistroMovimientoTarjeta>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import { DateTime } from 'luxon'
import RegistroMovimientoTarjeta from 'src/components/tarjetasCredito/RegistroMovimientoTarjeta.vue'
import DateInput from 'src/components/formComponents/DateInput.vue'
import CategoriaSelect from 'src/components/formComponents/CategoriaSelect.vue'
import PriceInput from 'src/components/formComponents/PriceInput.vue'
import { read, utils } from 'xlsx'

const route = useRoute()

/**
 * state
 */
const archivoExcel = ref(null)
const registroEditedItem = ref([
  {
    concepto: 'mi concepto',
    fecha: '10/05/2013',
    importe: '500.20'
  }
])
const listaRegistrosTarjeta = ref([])
const categoriaOptions = ref([])
const showForm = ref(false)

/**
 * computed
 */
const registrosTarjeta = computed({
  get() {
    return []
  }
  // set() {}
})
/**
 * functions
 */
function addRow() {
  const item = { ...registroEditedItem.value[0] }
  listaRegistrosTarjeta.value.push(item)
}

function deleteRow(props) {
  const rowIndex = props.rowIndex

  listaRegistrosTarjeta.value.splice(rowIndex, 1)
}
function onSubmit() {}

const defaultItem = {
  fecha: DateTime.now,
  concepto: '',
  categoria: {},
  importe: 0.0
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
    style: 'width:200px'
  },
  {
    name: 'consecutivo',
    label: 'Consecutivo',
    field: 'consecutivo',
    sortable: true,
    align: 'left',
    filter: true
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
function cargarExcel() {
  archivoExcel.value
  console.log('excel cargado', archivoExcel.value)
  const reader = new FileReader()

  reader.onload = (event) => {
    const data = event.target.result
    const workbook = read(data, { type: 'array' })
    const firstSheedName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheedName]
    const rows = XLSX.utils.sheet_to_json(worksheet)
    for (const row of rows) {
      for (const key in row) {
        console.log('data cell', row[key])
      }
    }
  }
  reader.readAsArrayBuffer(archivoExcel.value)
}
const todos = ref()
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
</script>

<style lang="scss" scoped></style>
