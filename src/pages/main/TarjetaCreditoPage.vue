<template>
  <q-card class="my-card">
    <q-toolbar class="bg-grey-2 text-primary" fit dense>
      <!-- arrow_back_ios -->
      <q-btn
        icon="navigate_before"
        flat
        round
        @click="router.push('/tarjetas_credito')"
        dense
        size="1rem"
      />
      <span class="text-h6">{{ cuenta.nombre }}</span>

      <q-toolbar-title>
        <!-- Tarjeta de crédito {{ route.params.id }} -->
      </q-toolbar-title>

      <!-- <q-btn flat round dense icon="apps" class="q-mr-xs" /> -->
      <q-btn outline dense icon="more_vert" flat>
        <q-menu>
          <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>Open...</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>New</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Preferences</q-item-section>
              <q-item-section side>
                <q-icon name="keyboard_arrow_right" />
              </q-item-section>

              <q-menu anchor="top end" self="top start">
                <q-list>
                  <q-item v-for="n in 3" :key="n" dense clickable>
                    <q-item-section>Submenu Label</q-item-section>
                    <q-item-section side>
                      <q-icon name="keyboard_arrow_right" />
                    </q-item-section>
                    <q-menu auto-close anchor="top end" self="top start">
                      <q-list>
                        <q-item v-for="n in 3" :key="n" dense clickable>
                          <q-item-section>3rd level Label</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup>
              <q-item-section>Quit</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
    <q-toolbar inset class="bg-grey-2">
      <q-btn
        outline
        rounded
        dense
        icon="upload"
        label="Importar Movimimientos"
        color="toolbar-button"
        @click="cargarMovimientos"
      />
      <q-toolbar-title> </q-toolbar-title>
      <div class="row q-gutter-x-sm">
        <q-select
          v-model="ejercicio_fiscal"
          :options="ejercicioFiscalOptions"
          option-label="nombre"
          label="Año"
          dense
          outlined
          color="secondary"
          label-color="dark"
        >
          <template #prepend>
            <q-icon name="calendar_month" />
          </template>
        </q-select>
        <q-select
          v-model="mes"
          :options="mesOptions"
          option-label="nombre"
          label="Mes"
          dense
          outlined
          color="secondary"
          label-color="dark"
          @update:model-value="onChangeMes"
        >
          <template #prepend>
            <q-icon name="calendar_month" />
          </template>
        </q-select>
      </div>
    </q-toolbar>
    <!-- <q-toolbar inset class="bg-grey-2 q-gutter-x-l" dense fit>
      <q-btn
        color="toolbar-button"
        text-color="white"
        label="Cargar movimientos"

        icon="upload"
        dense
      />


    </q-toolbar> -->
  </q-card>
  <q-card class="my-card">
    <q-card-section>
      <div class="row">
        <div class="col column items-center">
          <span class="tarjeta__resumen-etiqueta"> Saldo anterior </span>
          <span class="tarjeta__resumen-valor"> $1352.25</span>
        </div>
        <q-separator spaced inset vertical />
        <div class="col column items-center">
          <span class="tarjeta__resumen-etiqueta"> Suma movimientos </span>
          <span class="tarjeta__resumen-valor">
            {{ formato.toCurrency(sumaMovimientos) }}</span
          >
        </div>
        <q-separator spaced inset vertical />
        <div class="col column items-center">
          <span class="tarjeta__resumen-etiqueta"> Saldo final </span>
          <span class="tarjeta__resumen-valor"> $1000.00</span>
        </div>
        <q-separator spaced inset vertical />
        <div class="col column items-center">
          <span class="tarjeta__resumen-etiqueta"> Periodo </span>
          <span class="tarjeta__resumen-valor"> 12/May/2023 - 12/Jun/2023</span>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-table :rows="listaEgresos" :columns="columns"></q-table>
    </q-card-section>
  </q-card>
  <pre>{{ cuenta }}</pre>

  <Teleport to="#modal">
    <q-dialog v-model="showForm" persistent>
      <RegistroMovimientoTarjeta></RegistroMovimientoTarjeta>
    </q-dialog>
  </Teleport>
  <Teleport to="#modal">
    <q-dialog v-model="showFormCarga" persistent>
      <CargaRegistrosTarjeta :cuenta="cuenta"></CargaRegistrosTarjeta>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DateTime } from 'luxon'
import RegistroMovimientoTarjeta from 'src/components/tarjetasCredito/RegistroMovimientoTarjeta.vue'
import DateInput from 'src/components/formComponents/DateInput.vue'
import CategoriaSelect from 'src/components/formComponents/CategoriaSelect.vue'
import PriceInput from 'src/components/formComponents/PriceInput.vue'
import { api } from 'src/boot/axios'
import { OBTENER_EGRESOS } from 'src/graphql/egresos'

import CargaRegistrosTarjeta from 'src/components/tarjetasCredito/CargaRegistrosTarjeta.vue'
import { useQuery } from '@vue/apollo-composable'
import { useFormato } from 'src/composables/utils/useFormato'

const route = useRoute()
const router = useRouter()
const formato = useFormato()

/**
 * state
 */

const registroEditedItem = ref([
  {
    concepto: 'mi concepto',
    fecha: '10/05/2013',
    importe: '500.20'
  }
])

const categoriaOptions = ref([])
const showForm = ref(false)
const showFormCarga = ref(false)
const cuenta = ref({})
const ejercicio_fiscal = ref(2023)
const mes = ref({ id: 6, nombre: 'Junio' })
/**
 * onMounted
 */
onMounted(() => {
  console.log('buscando los datos de la tarjeta de crédito', route.params.id)
  api.get(`/cuentas/${route.params.id}`).then((response) => {
    console.log('response', response.data)
    cuenta.value = response?.data ?? {}
  })
})
/**
 * graphql
 */
const graphql_options = ref({
  fetchPolicy: 'network-only'
})

const {
  onError: onErrorListaEgresos,
  result: resultListaEgresos
  // onResult: onResultListaEgresos,
  // load: cargaListaEgresos
} = useQuery(
  OBTENER_EGRESOS,
  {
    categoriaId: null,
    cuentaId: route.params.id,
    fechaInicio: '2023-05-12',
    fechaFin: '2023-06-12'
  },
  graphql_options
)

onErrorListaEgresos((error) => {
  console.error('response', error)
})

/**
 * computed
 */
const listaEgresos = computed({
  get() {
    return resultListaEgresos.value?.obtenerEgresos ?? []
  }
})
const sumaMovimientos = computed({
  get() {
    return listaEgresos.value.reduce((accumulator, egreso) => {
      return accumulator + egreso.registro.importe
    }, 0)
  }
})
/**
 * functions
 */
function addRow() {
  const item = { ...registroEditedItem.value[0] }
  listaRegistrosTarjeta.value.push(item)
}

function onSubmit() {}

const defaultItem = {
  fecha: DateTime.now,
  concepto: '',
  categoria: {},
  importe: 0.0
}

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

function cargarMovimientos() {
  showFormCarga.value = true
}
function onChangeMes() {
  console.log('onchange mes')
}

const mesOptions = ref([
  { id: 1, nombre: 'Enero' },
  { id: 2, nombre: 'Febrero' },
  { id: 3, nombre: 'Marzo' },
  { id: 4, nombre: 'Abril' },
  { id: 5, nombre: 'Mayo' },
  { id: 6, nombre: 'Junio' },
  { id: 7, nombre: 'Julio' },
  { id: 8, nombre: 'Agosto' },
  { id: 9, nombre: 'Septiembre' },
  { id: 10, nombre: 'Octubre' },
  { id: 11, nombre: 'Noviembre' },
  { id: 12, nombre: 'Diciembre' }
])
const ejercicioFiscalOptions = ref([2021, 2022, 2023])
const columns = [
  { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
  {
    name: 'observaciones',
    label: 'Concepto',
    field: (row) => row.registro.observaciones,
    sortable: true,
    align: 'left'
  },

  {
    name: 'importe',
    label: 'Importe',
    field: (row) => formato.toCurrency(row.registro.importe),
    sortable: true,
    align: 'left'
  },
  {
    name: 'categoria',
    label: 'Categoria',
    field: (row) => row.categoria.nombre,
    sortable: true,
    align: 'left'
  },
  {
    name: 'acciones',
    label: 'Acciones',
    field: 'action',
    sortable: false,
    align: 'center'
  }
]
</script>

<style lang="scss" scoped>
.tarjeta__resumen-etiqueta {
  letter-spacing: -0.025rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #686666;
}
.tarjeta__resumen-valor {
  font-size: 0.85rem;
  font-weight: 400;
  color: #888585;
}
</style>
