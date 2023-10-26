<template>
  <div class="column">
    <div class="column">
      <q-table
        dense
        :rows="listaMovimientosIngreso"
        :columns="columnsIngresos"
        row-key="id"
        :filter="filter"
        :rows-per-page-options="[0]"
        separator="horizontal"
        hide-pagination
      >
        <template #top-left>
          <div class="row inline q-gutter-x-md items-center">
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
            <MesSelect
              v-model="mes"
              @update:model-value="onChangeMes"
            ></MesSelect>
          </div>
        </template>
        <template #top-right>
          <div class="row" style="border: 0px solid red">
            <q-input
              outlined
              dense
              debounce="400"
              v-model="filter"
              placeholder="Buscar Ingreso"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>
        <template #header="props">
          <q-tr :props="props" class="movimientos__headers-background">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              <span class="movimientos__headers-font"> {{ col.label }}</span>
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-nombre_categoria="props">
          <q-td
            dense
            :props="props"
            class="text-primary"
            :style="`border-left: 6px solid ${props.row.color}`"
          >
            <q-icon :name="props.row.icono" size="22px" color="blue-grey-6" />

            <span class="q-pl-sm movimientos__columna-categoria">
              {{ props.value }}</span
            >
          </q-td>
        </template>
        <template v-slot:body-cell="props">
          <q-td dense :props="props" clickable @click="addItem2(props)">
            <span class="movimientos__celda--importe"> {{ props.value }}</span>
          </q-td>
        </template>
      </q-table>
    </div>
    <div class="">
      <q-table
        :rows="saldosIngreso"
        :columns="columnsSaldos"
        row-key="name"
        hide-header
        hide-bottom
        separator="cell"
        dense
      />
    </div>
    <div class="row fit" style="border: 0px solid red">
      <q-table
        class="my-sticky-header-table"
        style="width: 100%"
        flat
        bordered
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        dense
        :rows="listaMovimientos"
        :columns="columnsEgresos"
        row-key="id"
        :filter="filter"
        separator="horizontal"
        hide-botton
        hide-pagination
      >
        <template #top-right>
          <div class="bg-white">
            <q-input
              outlined
              dense
              debounce="300"
              v-model="filter"
              placeholder="Buscar Gasto"
            >
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>
        <template #header="props">
          <q-tr :props="props" class="movimientos__headers-background">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              <span class="movimientos__headers-font"> {{ col.label }}</span>
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body-cell-nombre_categoria="props">
          <q-td
            dense
            :props="props"
            class="text-primary"
            :style="`border-left: 5px solid ${props.row.color}`"
          >
            <q-icon :name="props.row.icono" size="22px" color="blue-grey-7" />

            <span class="q-pl-sm movimientos__columna-categoria">
              {{ props.value }}</span
            >
          </q-td>
        </template>
        <template v-slot:body-cell="props">
          <q-td dense :props="props" clickable @click="addItem2(props)">
            <span class="movimientos__celda--importe"> {{ props.value }}</span>
          </q-td>
        </template>
      </q-table>
    </div>
    <div class="">
      <q-table
        :rows="saldosEgreso"
        :columns="columnsSaldos"
        row-key="name"
        hide-header
        hide-bottom
        separator="none"
        dense
      />
    </div>
    <div class="">
      <!-- NET CASH PROCEDS and FINAL CASH BALANCE -->
      <q-table
        :rows="listaSaldosMovimientos"
        :columns="columnsIngresos"
        row-key="name"
        hide-header
        hide-bottom
        separator="none"
        dense
      >
        <template #body-cell="props">
          <q-td
            dense
            :props="props"
            :class="{
              'table__body-totals': props.row.categoria_id === 1,
              'table__body-preBalance': props.row.categoria_id === 2
            }"
          >
            {{ props.value }}
          </q-td>
        </template>
      </q-table>
    </div>
    <div class="row fit" style="border: 0px solid red">
      <!-- LISTA DE CUENTAS BANCARIAS -->
      <q-table
        style="width: 100%"
        flat
        bordered
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        dense
        :rows="listaSaldosCuentas"
        :columns="columnsIngresos"
        row-key="id"
        :filter="filter"
        separator="none"
        hide-pagination
        hide-bottom
        hide-header
      >
        <template #header="props">
          <q-tr :props="props" class="movimientos__headers-background">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              <span class="movimientos__headers-font"> {{ col.label }}</span>
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-nombre_categoria="props">
          <q-td
            dense
            :props="props"
            :style="`border-left: 5px solid ${props.row.color}`"
          >
            <q-icon :name="props.row.icono" size="22px" color="dark" />
            <span class="q-pl-sm movimientos__columna-categoria">
              {{ props.value }}</span
            >
          </q-td>
        </template>
        <template v-slot:body-cell="props">
          <q-td dense :props="props">
            <span class="movimientos__celda--importe"> {{ props.value }}</span>
          </q-td>
        </template>
      </q-table>
    </div>
    <div class="">
      <!-- Total Cash bank account & Net Balance -->
      <q-table
        :rows="listaSaldosFinales"
        :columns="columnsIngresos"
        row-key="name"
        hide-header
        hide-bottom
        separator="cell"
        dense
      >
        <template #body-cell="props">
          <q-td
            dense
            :props="props"
            :class="{
              'table__body-netBalance': props.row.categoria_id === 2,
              'table__body-preBalance': props.row.categoria_id === 1
            }"
          >
            {{ props.value }}
          </q-td>
        </template>
      </q-table>
    </div>
  </div>

  <Teleport to="#modal">
    <q-dialog v-model="showFormItem" persistent>
      <FormCuentaRegistro
        :edited-item="editedItem"
        :edited-index="editedIndex"
        @movimientoSaved="movimientoSaved"
        @movimientoUpdated="movimientoUpdated"
      ></FormCuentaRegistro>
    </q-dialog>
  </Teleport>
  <Teleport to="#modal">
    <q-dialog v-model="show_movimientos" persistent>
      <ListaMovimientos
        :cell-data="cellData"
        @registro-created="onRegistroCreated"
      ></ListaMovimientos>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { useMutation } from '@vue/apollo-composable'
import { ref, onMounted } from 'vue'
import { MOVIMIENTO_DELETE } from '/src/graphql/movimientos'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { useQuasar } from 'quasar'
import { DateTime } from 'luxon'
import { useFormato } from 'src/composables/utils/useFormato'
import { api } from 'src/boot/axios'
import ListaMovimientos from 'src/components/movimientos/ListaMovimientos.vue'
import MesSelect from 'src/components/formComponents/MesSelect.vue'
import FormCuentaRegistro from 'src/components/movimientos/FormCuentaRegistro.vue'

/**
 * composables
 */
const notificacion = useNotificacion()
const $q = useQuasar()
const formato = useFormato()

/**
 * state
 */
const defaultItem = {
  categoria: null,
  cuenta: null,
  registro: {
    estadoRegistroId: 2,
    importe: '',
    fecha: '',
    date: formato.formatoFecha(new Date())
  },
  observaciones: ''
}
const pagination = ref({
  rowsPerPage: 0
})
const periodoOptions = ref([
  { id: 1, nombre: 'Quincenal' },
  { id: 2, nombre: 'Mensual' }
])

const periodo = ref(periodoOptions.value[0])

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

const mes = ref(mesOptions.value[0])
const ejercicio_fiscal = ref(2023)
const listaMovimientos = ref([])
const listaMovimientosIngreso = ref([])
const saldosIngreso = ref([])
const saldosEgreso = ref([])
const listaSaldosCuentas = ref([])
const listaSaldosFinales = ref([])
const listaSaldosMovimientos = ref([])
const filter = ref()
const editedItem = ref({ ...defaultItem })
const editedIndex = ref(null)
const rowIndexDelete = ref(null)
const showFormItem = ref(false)
const show_movimientos = ref(false)
const cellData = ref({})

const columnsIngresos = ref([])
const columnsEgresos = ref([])
const columnsSaldos = ref([])
/**
 * onMount
 */
onMounted(() => {
  const dateNow = DateTime.now()
  ejercicio_fiscal.value = dateNow.year
  const mes_id = dateNow.month
  const mes_value = mesOptions.value.find(
    (mesOption) => mesOption.id === mes_id
  )
  mes.value = mes_value
  obtenerColumnas(ejercicio_fiscal.value, mes.value.id)
  cargarDatos()
})

function cargarDatos() {
  obtenerMovimientos()
  obtenerIngresosEgresosSaldos()
  obtenerSaldosMovimientos()
  obtenerSaldosCuentas()
  obtenerSaldosFinales()
}
/**
 * METHODS
 */
function addItem(tipo_movimiento) {
  editedItem.value = { ...defaultItem, tipoMovimientoId: tipo_movimiento }
  editedIndex.value = null
  showFormItem.value = true
}
function addItem2(props) {
  const row = { ...props.row }
  const col = { ...props.col }
  // console.log('row', row)
  // console.log('col', col)
  cellData.value = {
    categoriaId: row.categoria_id,
    nombre_categoria: row.nombre_categoria,
    tipo_movimiento_id: row.tipo_movimiento_id.toString(),
    icono: row.icono,
    fecha_inicio: col.fecha_inicio,
    fecha_fin: col.fecha_fin,
    fecha_inicio_formato: formato.toFormatoInputDateFromISO(col.fecha_inicio),
    fecha_fin_formato: formato.toFormatoInputDateFromISO(col.fecha_fin),
    periodo_id: col.periodo_id,
    label: col.label
  }
  if (!!cellData.value.periodo_id) {
    show_movimientos.value = true
  }
}
function editRow(item) {
  editedItem.value = JSON.parse(JSON.stringify(item.row))
  editedIndex.value = item.rowIndex
  console.log('Editar elemento...', editedItem.value, editedIndex.value)
  showFormItem.value = true
}
function obtenerColumnas(ejercicio_fiscal, mes) {
  // console.log('Obteniendo columnas del ejercicio y mes', ejercicio_fiscal, mes)
  api
    .get('/columnas', {
      params: {
        ejercicio_fiscal,
        mes
      }
    })
    .then(({ data }) => {
      columnsIngresos.value = JSON.parse(JSON.stringify(data.data))
      columnsEgresos.value = JSON.parse(JSON.stringify(data.data))
      columnsSaldos.value = JSON.parse(JSON.stringify(data.data))

      columnsIngresos.value.forEach((column) => {
        // console.log('column', column)
        if (column.name != 'nombre_categoria') {
          column.format = (val, row) =>
            !!val ? `${formato.toCurrency(val)}` : ''
        } else {
          // column.style = 'background-color: #aebbc7'
          // column.style = 'background-color: #c8d7ca'
          // column.classes = 'categoria_background'
        }
      })
      columnsEgresos.value.forEach((column) => {
        // console.log('column', column)
        if (column.name != 'nombre_categoria') {
          column.format = (val, row) =>
            !!val ? `${formato.toCurrency(val)}` : ''
        } else {
          // column.style = 'background-color: #aebbc7'
          // column.style = 'background-color: #c8d7ca'
          // column.classes = 'categoria_background'
        }
      })
      columnsSaldos.value.forEach((element) => {
        if (element.name != 'nombre_categoria') {
          element.format = (val, row) =>
            !!val ? `${formato.toCurrency(val)}` : ''
        }
        element.classes = 'table__body-totals'
      })
      // console.log('columnas saldos', columnsSaldos.value)
    })
    .catch((error) => {
      console.log('error', error)
    })
}
function obtenerMovimientos() {
  api
    .get('/movimientos', {
      params: {
        tipoMovimientoId: 2,
        isSaldos: 0
      }
    })
    .then(({ data }) => {
      listaMovimientos.value = JSON.parse(JSON.stringify(data.data))
    })
    .catch((error) => {
      console.log('error', error)
    })

  api
    .get('/movimientos', {
      params: {
        tipoMovimientoId: 1,
        isSaldos: 0
      }
    })
    .then(({ data }) => {
      listaMovimientosIngreso.value = JSON.parse(JSON.stringify(data.data))
    })
    .catch((error) => {
      console.log('error', error)
    })
}
function obtenerIngresosEgresosSaldos() {
  api
    .get('/movimientos', {
      params: {
        tipoMovimientoId: 1,
        isSaldos: 1
      }
    })
    .then(({ data }) => {
      saldosIngreso.value = JSON.parse(JSON.stringify(data.data))
      // console.log('saldos de ingresos obtenidos', saldosIngreso.value)
    })
    .catch((error) => {
      console.log('error', error)
    })
  api
    .get('/movimientos', {
      params: {
        tipoMovimientoId: 2,
        isSaldos: 1
      }
    })
    .then(({ data }) => {
      saldosEgreso.value = JSON.parse(JSON.stringify(data.data))
    })
    .catch((error) => {
      console.log('error', error)
    })
}

function obtenerSaldosMovimientos() {
  api
    .get('/saldos_movimientos', {
      params: {
        ejercicio_fiscal_id: 2023,
        isSaldos: 0
      }
    })
    .then(({ data }) => {
      // console.log('response data', data.data)
      listaSaldosMovimientos.value = JSON.parse(JSON.stringify(data.data))

      // console.log('ingresos data', listaMovimientosIngreso.value)
    })
    .catch((error) => {
      console.log('error', error)
    })
}

function obtenerSaldosCuentas() {
  api
    .get('/saldos_cuentas', {
      params: {
        ejercicio_fiscal_id: 2023,
        isSaldos: 0
      }
    })
    .then(({ data }) => {
      // console.log('response data', data.data)
      listaSaldosCuentas.value = JSON.parse(JSON.stringify(data.data))

      // console.log('ingresos data', listaMovimientosIngreso.value)
    })
    .catch((error) => {
      console.log('error', error)
    })
  // api
  //   .get('/saldos_cuentas', {
  //     params: {
  //       ejercicio_fiscal_id: 2023,
  //       isSaldos: 1
  //     }
  //   })
  //   .then(({ data }) => {
  //     console.log('response data', data.data)
  //     saldosCuentas.value = JSON.parse(JSON.stringify(data.data))
  //   })
  //   .catch((error) => {
  //     console.log('error', error)
  //   })
}

function obtenerSaldosFinales() {
  api
    .get('/saldos_finales', {
      params: {
        ejercicio_fiscal_id: 2023,
        isSaldos: 0
      }
    })
    .then(({ data }) => {
      listaSaldosFinales.value = JSON.parse(JSON.stringify(data.data))
    })
    .catch((error) => {
      console.log('error', error)
    })
}

function deleteRow(item) {
  rowIndexDelete.value = item.rowIndex
  $q.dialog({
    title: 'Confirmar',
    style: 'width:500px',
    message: ` ¿Confirme si desea eliminar la movimiento "${item.row.nombre}"?`,
    ok: {
      push: true,
      color: 'positive',
      label: 'Continuar'
    },
    cancel: {
      push: true,
      color: 'negative',
      flat: true,
      label: 'cancelar'
    },
    persistent: true
  })
    .onOk(() => {
      deleteMovimiento({ id: item.row.id })
    })
    .onCancel(() => {})
    .onDismiss(() => {})
}

function movimientoSaved(itemSaved) {
  showFormItem.value = false
  listaMovimientos.value.push(itemSaved)
  mostrarNotificacion('guardó', itemSaved)
}
function movimientoUpdated(itemUpdated) {
  showFormItem.value = false
  mostrarNotificacion('actualizó', itemUpdated)
  listaMovimientos.value[editedIndex.value] = itemUpdated
  editedItem.value = { ...defaultItem }
  editedIndex.value = null
}
function mostrarNotificacion(action, cuenta) {
  notificacion.mostrarNotificacionPositiva(
    `La movimiento "${cuenta.nombre}" se ${action} correctamente`,
    2500
  )
}
function onRegistroCreated(itemCreated) {
  console.log('El registro fue creado', itemCreated)
  // show_movimientos.value = false
  cargarDatos()
}
function onChangeMes(value) {
  obtenerColumnas(ejercicio_fiscal.value, value.id)
}
/**
 * GRAPHQL
 */
const {
  mutate: deleteMovimiento,
  onDone: onDoneDeleteMovimiento,
  onError: onErrorDeleteMovimiento
} = useMutation(MOVIMIENTO_DELETE)

onDoneDeleteMovimiento(({ data }) => {
  if (!!data) {
    console.log('item deleted ', data)
    const deletedItem = data.movimientoDelete.movimiento
    listaMovimientos.value.splice(rowIndexDelete.value, 1)
    rowIndexDelete.value = null
    mostrarNotificacion('elminó', deletedItem)
  }
})

onErrorDeleteMovimiento((error) => {
  console.error(error)
})
</script>

<style lang="scss">
@function color-texto($color) {
  @if (lightness($color) > 50) {
    @return rgb(51, 149, 162);
  } @else {
    @return rgb(217, 163, 230);
  }
}
.tabla-columna-importe {
  background-color: #ffffff !important;
  &:hover {
    background-color: #78a0ce4b !important;
    // border: 0.2px solid rgb(179, 179, 190) !important;
    cursor: pointer;
    // font-weight: 600 !important;
    // font-size: inherit;
    transition: all 0.3s;
  }
}

.my-sticky-header-table {
  /* height or max-height is important */
  height: calc(100vh - 530px);

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    // background-color: $accent-light;
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
}
.table__body-preBalance {
  background-color: rgb(230, 200, 230) !important;
  font-weight: 600 !important;
  font-size: 0.9rem !important;
}
.table__body-netBalance {
  background-color: rgb(245, 231, 209) !important;
}

.table__body-totals {
  background-color: #d9e6f8 !important;
  font-weight: 600 !important;
  font-size: 0.8rem !important;
  font-style: italic;
}

.movimientos__celda--importe {
  font-size: 0.78rem !important;
  font-weight: 600 !important;
  color: #212364;
}
.movimientos__headers-font {
  font-size: 0.65rem;
  color: #748097 !important;
  font-weight: bold !important;
  text-transform: uppercase !important;
}
.movimientos__headers-background {
  background-color: #eaecea !important;
}
.movimientos__columna-categoria {
  font-weight: 600 !important;
  font-size: 0.78rem;
  color: $dark;
  letter-spacing: -0.015rem;
}
.categoria_background {
  background-color: #f3f6f9 !important;
  border: 1px solid red;
}
.movimientos__categoria-nombre {
  color: $primary;
  letter-spacing: -0.025rem;
  font-weight: 600;
  font-size: 0.78rem;
}
</style>
