<template>
  <div class="column">
    <!-- Lista del detalle de ingresos -->
    <q-table
      dense
      :rows="listaMovimientosIngreso"
      :columns="columnsT"
      row-key="id"
      :filter="filter"
      :rows-per-page-options="[0]"
      separator="horizontal"
      hide-pagination
      :class="{
        'my-sticky-header-table-ingreso': listaMovimientosIngreso.length > 4
      }"
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
            @update:model-value="onChangeEjercicio"
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
        <div class="row">
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
        <q-tr :props="props">
          <q-th
            class="bg-white q-gutter-x-md table__header"
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            dense
          >
            <span> {{ col.periodo_id === 0 ? 'INGRESOS' : col.label }}</span>
            <q-btn
              v-if="col.periodo_id === 0"
              class="button-new"
              label="Nuevo"
              color="traspaso-button"
              icon="add_circle"
              dense
              @click="addCategoria('1')"
            />
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
          <div class="row items-center">
            <q-icon :name="props.row.icono" size="22px" color="blue-grey-6" />

            <span class="q-pl-sm movimientos__columna-categoria">
              {{ props.value }}</span
            >
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell="props">
        <q-td dense :props="props" clickable @click="addItem2(props)">
          <span class="movimientos__celda--importe"> {{ props.value }}</span>
        </q-td>
      </template>
    </q-table>
    <!-- END Lista del detalle de ingresos -->
  </div>
  <!-- tabla de totales de ingresos -->
  <q-table
    :rows="saldosIngreso"
    :columns="columnsT"
    row-key="name"
    hide-header
    hide-bottom
    separator="cell"
    dense
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td></q-td>
      </q-tr>
    </template>
  </q-table>
  <!-- END tabla de totales de ingresos -->
  <div class="row fit" style="border: 0px solid red">
    <!-- tabla de totales de egresos -->
    <q-table
      class="my-sticky-header-table"
      style="width: 100%"
      flat
      bordered
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      dense
      :rows="listaMovimientos"
      :columns="columnsT"
      row-key="id"
      :filter="filter"
      separator="horizontal"
      hide-botton
      hide-pagination
    >
      <!-- <template #header>
          <q-th>
            <q-td> HI </q-td>
          </q-th>
        </template> -->
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
        <q-tr :props="props">
          <q-th
            class="bg-white table__header"
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <span> {{ col.periodo_id === 0 ? 'EGRESOS' : col.label }}</span>
            <q-btn
              v-if="col.periodo_id === 0"
              color="primary"
              icon="add_circle"
              dense
              @click="addCategoria('2')"
              flat
            />
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
      :columns="columnsT"
      row-key="name"
      hide-header
      hide-bottom
      separator="none"
      dense
    />
  </div>
  <!-- NET CASH PROCEDS and FINAL CASH BALANCE -->
  <q-table
    :rows="listaSaldosMovimientos"
    :columns="columnsT"
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
      :columns="columnsT"
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
            {{ props.value }}
          </span>
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
      :columns="columnsT"
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

  <Teleport to="#modal">
    <q-dialog
      v-model="showFormItem"
      persistent
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <FormCuentaRegistro
        :edited-item="editedItem"
        :edited-index="editedIndex"
        @movimientoSaved="movimientoSaved"
        @movimientoUpdated="movimientoUpdated"
      ></FormCuentaRegistro>
    </q-dialog>
    <q-dialog
      v-model="show_movimientos"
      persistent
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <ListaMovimientos
        :cell-data="cellData"
        @registro-created="onRegistroCreated"
      ></ListaMovimientos>
    </q-dialog>
    <q-dialog
      v-model="showRegistroCategoria"
      persistent
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <FormRegistroCategoria
        :edited-item="registroCategoriaItem"
        @categoriaSaved="categoriaSaved"
        @categoriaUpdated="categoriaUpdated"
      ></FormRegistroCategoria>
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
import FormRegistroCategoria from 'src/components/categorias/FormRegistroCategoria.vue'

/**
 * composables
 */
const notificacion = useNotificacion()
const $q = useQuasar()
const formato = useFormato()

/**
 * state
 */
const defaultCategoriaItem = {
  id: null,
  nombre: null,
  icono: 'insert_emoticon',
  descripcion: null,
  color: '#019A9D',
  tipoMovimiento: null,
  tipoMovimientoId: '1',
  cuentaContable: null
}
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

const columnsT = ref([])
const showRegistroCategoria = ref(false)
const registroCategoriaItem = ref()
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

function addCategoria(tipoMovimientoId) {
  console.log('Agregando nueva categoria', tipoMovimientoId)
  console.log('tipoMovimientoId', tipoMovimientoId)
  registroCategoriaItem.value = {
    ...defaultCategoriaItem,
    tipoMovimientoId: tipoMovimientoId
  }
  console.dir('editeditem', registroCategoriaItem.value)
  editedIndex.value = null
  showRegistroCategoria.value = true
}

function obtenerColumnas(ejercicio_fiscal, mes) {
  api
    .get('/columnas', {
      params: {
        ejercicio_fiscal,
        mes
      }
    })
    .then(({ data }) => {
      columnsT.value = JSON.parse(JSON.stringify(data.data))

      columnsT.value.forEach((column) => {
        if (column.name != 'nombre_categoria') {
          column.format = (val) => (!!val ? `${formato.toCurrency(val)}` : '')
        }
      })
    })
    .catch((error) => {
      console.log('error', error)
    })
}
/**
 *
 */
function obtenerMovimientos() {
  api
    .get('/movimientos', {
      params: {
        ejercicioFiscalId: ejercicio_fiscal.value,
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
        isSaldos: 0,
        ejercicioFiscalId: ejercicio_fiscal.value
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
        isSaldos: 1,
        ejercicioFiscalId: ejercicio_fiscal.value
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
        isSaldos: 1,
        ejercicioFiscalId: ejercicio_fiscal.value
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
        ejercicioFiscalId: ejercicio_fiscal.value,
        mesId: mes.value.id,
        isSaldos: 0
      }
    })
    .then(({ data }) => {
      listaSaldosMovimientos.value = JSON.parse(JSON.stringify(data.data))
    })
    .catch((error) => {
      console.log('error', error)
    })
}

function obtenerSaldosCuentas() {
  api
    .get('/saldos_cuentas', {
      params: {
        ejercicioFiscalId: ejercicio_fiscal.value,
        mesId: mes.value.id,
        isSaldos: 0
      }
    })
    .then(({ data }) => {
      listaSaldosCuentas.value = JSON.parse(JSON.stringify(data.data))
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
        ejercicioFiscalId: ejercicio_fiscal.value,
        mesId: mes.value.id,
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
function onChangeEjercicio(newValue) {
  console.dir(mes.value)
  // obtenerColumnas(newValue, mes.value.id)
  mes.value = mesOptions.value[0]
  cargarDatos()
  obtenerColumnas(ejercicio_fiscal.value, mes.value.id)
}
function categoriaSaved() {}
function categoriaUpdated() {}
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

<style lang="scss" scoped>
body {
  background: white;
}

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
.my-sticky-header-table-ingreso {
  /* height or max-height is important */
  height: 250px;
  min-height: 250px;

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
.my-sticky-header-table {
  /* height or max-height is important */
  height: calc(100vh - 615px);

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
}
.table__header {
  font-size: 0.68rem !important;
  font-weight: bold;
  color: $dark;
  border-bottom: 1px solid #aaaaaa !important;
  // border: 1px solid red;
}
.table__body-preBalance {
  // Final cash balance
  font-family: 'Roboto Condensed', 'Open Sans', sans-serif;
  background-color: rgb(230, 200, 230) !important;
  font-weight: 600 !important;
  font-size: 0.9rem !important;
}
.table__body-netBalance {
  font-family: 'Roboto Condensed', 'Open Sans', sans-serif;
  background-color: rgb(245, 231, 209) !important;
  font-size: 1.2rem;
}

/**
* CSS para los totales de cada tabla
*/
.table__body-totals {
  font-family: 'Roboto Condensed', 'Open Sans', sans-serif;
  font-weight: bold;
  background-color: #213872 !important;
  font-size: 0.8rem !important;
  font-style: italic;
}

.movimientos__celda--importe {
  font-family: 'Roboto Condensed', 'Open Sans', sans-serif;
  font-size: 0.85rem !important;
  font-weight: 400 !important;
  color: $primary;
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
  // font-family: 'Raleway', sans-serif;
  // font-weight: 500 !important;
  font-size: 0.78rem;
  color: $categoria;
  // letter-spacing: -0.0025rem;
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
