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
          @update:model-value="onChangeEjercicio"
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
          <span class="tarjeta__resumen-etiqueta"> Periodo </span>
          <span class="tarjeta__resumen-valor"> 12/May/2023 - 12/Jun/2023</span>
        </div>
        <q-separator spaced inset vertical />
        <div class="col column items-center">
          <span class="tarjeta__resumen-etiqueta"> Saldo anterior </span>
          <span class="tarjeta__resumen-valor">
            {{ formato.toCurrency(saldo_anterior) }}</span
          >
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
          <span class="tarjeta__resumen-valor">
            {{ formato.toCurrency(saldo_final) }}</span
          >
        </div>
        <q-separator spaced inset vertical />
      </div>
    </q-card-section>
    <q-card-section>
      <q-table
        :rows="listaRegistros"
        :columns="columns"
        dense
        :rows-per-page-options="[0]"
      >
        <template #top-left>
          <q-tr>
            <div class="row">
              <q-btn
                label="nuevo"
                @click="addItem()"
                dense
                color="toolbar-button"
              ></q-btn></div
          ></q-tr>
        </template>
        <template #body-cell-acciones="props">
          <q-td :props="props" class="q-my-xs p-py-xs">
            <div class="row">
              <q-btn
                color="primary"
                icon="more_vert"
                flat
                dense
                size=".6rem"
                round
              >
                <q-menu>
                  <q-list dense style="min-width: 100px">
                    <q-item clickable v-close-popup @click="editItem(props)">
                      <q-item-section>Editar...</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="mesesSinInteres(props)"
                    >
                      <q-item-section>Meses Sin Int ...</q-item-section>
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
                            <q-menu
                              auto-close
                              anchor="top end"
                              self="top start"
                            >
                              <q-list>
                                <q-item v-for="n in 3" :key="n" dense clickable>
                                  <q-item-section
                                    >3rd level Label</q-item-section
                                  >
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
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
  <pre>{{ mes }}</pre>
  <pre>{{ ejercicio_fiscal }}</pre>

  <Teleport to="#modal">
    <q-dialog v-model="showForm" persistent>
      <RegistroMovimientoTarjeta></RegistroMovimientoTarjeta>
    </q-dialog>
  </Teleport>
  <Teleport to="#modal">
    <q-dialog v-model="showFormMSI" persistent>
      <RegistroMesesSinInteres
        :registro-tarjeta="editRegistroItem"
        @registroUpdated="registroUpdated"
      ></RegistroMesesSinInteres>
    </q-dialog>
  </Teleport>
  <Teleport to="#modal">
    <q-dialog v-model="showFormCarga" persistent>
      <CargaRegistrosTarjeta :cuenta="cuenta"></CargaRegistrosTarjeta>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DateTime } from 'luxon'
import RegistroMovimientoTarjeta from 'src/components/tarjetasCredito/RegistroMovimientoTarjeta.vue'
import DateInput from 'src/components/formComponents/DateInput.vue'
import CategoriaSelect from 'src/components/formComponents/CategoriaSelect.vue'
import PriceInput from 'src/components/formComponents/PriceInput.vue'
import { api } from 'src/boot/axios'
// import { OBTENER_EGRESOS } from 'src/graphql/egresos'
import { LISTA_REGISTROS_TARJETA } from 'src/graphql/registrosTarjeta'

import CargaRegistrosTarjeta from 'src/components/tarjetasCredito/CargaRegistrosTarjeta.vue'
import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import { useFormato } from 'src/composables/utils/useFormato'
import { useRegistrosCrud } from 'src/composables/useRegistrosCrud'
import RegistroCuentaContable from 'src/components/cuentasContables/RegistroCuentaContable.vue'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import RegistroMesesSinInteres from 'src/components/tarjetasCredito/RegistroMesesSinInteres.vue'

const route = useRoute()
const router = useRouter()
const formato = useFormato()
const notificacion = useNotificacion()
const registroCrud = useRegistrosCrud()

/**
 * state
 */
const fecha_inicio = ref('1900-01-01')
const fecha_fin = ref('1900-01-01')
const dia_corte = ref(0)

const listaRegistros = ref([])

const registroEditedItem = ref([
  {
    concepto: 'mi concepto',
    fecha: '10/05/2013',
    importe: '500.20'
  }
])

const categoriaOptions = ref([])
const showForm = ref(false)
const showFormMSI = ref(false)
const showFormCarga = ref(false)
const cuenta = ref({})
const ejercicio_fiscal = ref(0)
const mes = ref({})
const saldo_anterior = ref(0)
const editRegistroItem = ref(null)

const graphql_options = ref({
  fetchPolicy: 'network-only'
})

// const variables = reactive({
//   cuentaId: route.params.id,
//   fechaInicio: '',
//   fechaFin: ''
// })
/**
 * onMounted
 */
onMounted(() => {
  console.log('buscando los datos de la tarjeta de crédito', route.params.id)
  const dateNow = DateTime.now()
  ejercicio_fiscal.value = dateNow.year
  const mes_id = dateNow.month
  const mes_value = mesOptions.value.find(
    (mesOption) => mesOption.id === mes_id
  )
  mes.value = mes_value

  api.get(`/cuentas/${route.params.id}`).then((response) => {
    cuenta.value = response?.data ?? {}
    dia_corte.value = cuenta.value.dia_corte
    obtenerSaldoAnterior()
    obtener_fecha_inicio()
    obtener_fecha_fin()
    // variables.fechaInicio = fecha_inicio.value
    // variables.fechaFin = fecha_fin.value
    cargaListaRegistros(
      null,
      {
        cuentaId: route.params.id,
        fechaInicio: fecha_inicio.value,
        fechaFin: fecha_fin.value
      },
      graphqlOptions
    )
  })
})

/**
 * computed
 */

const sumaMovimientos = computed({
  get() {
    return listaRegistros.value.reduce((accumulator, registro) => {
      return accumulator + registro.importe
    }, 0)
  }
})
const saldo_final = computed({
  get() {
    return parseFloat(saldo_anterior.value) + parseFloat(sumaMovimientos.value)
  }
})
/**
 * graphql
 */
const graphqlOptions = reactive({
  // fetchPolicy: 'network-only'
  fetchPolicy: 'no-cache'
})
const {
  onError: onErrorListaRegistros,
  onResult: onResultListaRegistros,
  load: cargaListaRegistros
} = useLazyQuery(LISTA_REGISTROS_TARJETA)

onResultListaRegistros(({ data }) => {
  console.log('lista de registros', data)
  listaRegistros.value = data?.listaRegistrosTarjeta
})
onErrorListaRegistros((error) => {
  console.error('response', error)
})
/**
 * functions
 */
function editItem(item) {
  console.log('editando item...', item.rowIndex, item.row)
}

function obtener_fecha_inicio() {
  fecha_inicio.value = `${ejercicio_fiscal.value}-${(
    '0' +
    (mes.value.id - 1)
  ).slice(-2)}-${cuenta.value.dia_corte}`
}
function obtener_fecha_fin() {
  fecha_fin.value = `${ejercicio_fiscal.value}-${('0' + mes.value.id).slice(
    -2
  )}-${cuenta.value.dia_corte}`
}

function obtenerSaldoAnterior() {
  const fecha = `${ejercicio_fiscal.value}-${mes.value.id - 1}-${
    cuenta.value.dia_corte
  }`
  console.log('fecha para obtener saldos', fecha)
  api
    .get('/cuentas/obtener_saldo_tarjeta', {
      params: {
        cuenta_id: route.params.id,
        fecha
      }
    })
    .then(({ data }) => {
      // console.log('response', data.suma)
      saldo_anterior.value = data.suma
    })
    .catch((error) => {
      console.error(error)
    })
}
function onChangeMes(mes) {
  console.log('Cambiando mes', mes.id)
  obtenerListaRegistros()
}
function onChangeEjercicio(ejercicio_fiscal) {
  console.log('cambio de ejercicio', ejercicio_fiscal)
  obtenerListaRegistros()
}
function obtenerListaRegistros() {
  let ejercicio_inicial_id =
    mes.value.id - 1 <= 0 ? ejercicio_fiscal.value - 1 : ejercicio_fiscal.value
  let ejercicio_final_id = ejercicio_fiscal.value

  let mes_inicial_id = mes.value.id - 1 <= 0 ? 12 : mes.value.id - 1
  let mes_final_id = mes.value.id

  let dia_corte_n = !!cuenta.value.dia_corte ? cuenta.value.dia_corte : 28

  const fechaInicio = `${ejercicio_inicial_id}-${('0' + mes_inicial_id).slice(
    -2
  )}-12`
  const fechaFin = `${ejercicio_final_id}-${('0' + mes_final_id).slice(-2)}-12`
  console.log('fechaInicio', fechaInicio)
  console.log('fechaFin', fechaFin)
  cargaListaRegistros(
    null,
    {
      cuentaId: route.params.id,
      fechaInicio,
      fechaFin
    },
    graphqlOptions
  )
}

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
function addItem() {
  showForm.value = true
}

function deleteItem(item) {
  item.rowIndex
  const registro = item.row
  console.log('registro', registro)
  registroCrud.deleteRegistro({
    id: parseInt(registro.id)
  })
}

registroCrud.onDoneDeleteRegistro((response) => {
  notificacion.mostrarNotificacionInformativa('Registro eliminado')
  console.log('response', response)
})
function mesesSinInteres(item) {
  showFormMSI.value = true
  editRegistroItem.value = item.row
}
function registroUpdated() {
  showFormMSI.value = false
  console.log('El registro fue modificado')
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
    name: 'fecha',
    label: 'Fecha',
    field: (row) => row.fecha,
    sortable: true,
    align: 'left'
  },
  {
    name: 'concepto',
    label: 'Concepto',
    field: (row) => row.concepto,
    sortable: true,
    align: 'left'
  },
  {
    name: 'importe',
    label: 'Importe',
    field: (row) => formato.toCurrency(row.importe),
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

    field: 'action',
    sortable: false,
    align: 'center',
    style: 'width: 100px'
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
