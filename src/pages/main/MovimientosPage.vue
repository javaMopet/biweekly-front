<template>
  <!-- Lista del detalle de ingresos -->
  <q-table
    dense
    :rows="listaMovimientosIngreso"
    :columns="columnsT"
    row-key="id"
    :filter="filterIngreso"
    :rows-per-page-options="[0]"
    separator="none"
    class="my-sticky-header-table-ingreso"
    hide-bottom
    hide-pagination
  >
    <!-- :class="{
      'my-sticky-header-table-ingreso': listaMovimientosIngreso.length > 4
    }" -->
    <template #top-left>
      <div class="row inline q-gutter-x-md items-center">
        <PeriodoSelect
          v-model:year="ejercicio_fiscal"
          v-model:month="mes"
          @onChangePeriodo="onChangePeriodo"
        ></PeriodoSelect>
        <!-- :disable="loadingRegistros" -->
        <q-btn
          color="primary-button"
          icon="fa-regular fa-file-excel"
          label="Exportar"
          @click="exportToExcel"
          no-caps
        />
        <!-- icon="las la-file-excel" -->
      </div>
    </template>
    <template #top-right>
      <div class="row">
        <q-input
          outlined
          dense
          debounce="400"
          v-model="filterIngreso"
          placeholder="Buscar Ingreso"
          class="bg-accent-light"
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
          class="q-gutter-x-md table__header"
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
        >
          <span> {{ col.periodo_id === 0 ? 'INGRESOS' : col.label }}</span>
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
          <q-icon :name="props.row.icono" size="22px" color="categoria-icon" />

          <span class="q-pl-sm movimientos__columna-categoria">
            {{ props.value }}</span
          >
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell="props">
      <q-td
        dense
        :props="props"
        clickable
        @dblclick="addItem(props)"
        class="q-pa-xs q-ma-none"
        style="padding: 0px !important"
      >
        <input
          v-model="props.value"
          type="text"
          class="ultra-skinny-input"
          readonly
          @keydown="(e) => handleKey(e, props)"
          :ref="
            (el) => {
              if (el) {
                inputIngresoRefs[`${props.col.field}_${props.rowIndex + 1}`] =
                  el
              }
            }
          "
        />
      </q-td>
    </template>
  </q-table>
  <!-- END Lista del detalle de ingresos -->

  <!-- tabla de saldos totales de ingresos -->
  <q-table
    :rows="saldosIngreso"
    :columns="columnasSaldos"
    row-key="name"
    hide-header
    hide-bottom
    separator="none"
    dense
  >
    <template #body-cell="props">
      <q-td class="bg-table-summary" :props="props">{{ props.value }}</q-td>
    </template>
  </q-table>
  <!-- END tabla de totales de ingresos -->

  <!-- tabla de totales de egresos -->
  <q-table
    class="my-sticky-header-table"
    :rows-per-page-options="[0]"
    dense
    :rows="listaMovimientos"
    :columns="columnsT"
    row-key="id"
    :filter="filter"
    separator="none"
    hide-botton
    hide-pagination
  >
    <template #top-left></template>
    <template #top-right>
      <q-input
        outlined
        dense
        debounce="300"
        v-model="filter"
        placeholder="Buscar Gasto"
        class="bg-accent-light"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template #header="props">
      <q-tr :props="props">
        <q-th
          class="q-gutter-x-md table__header"
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
        >
          <span> {{ col.periodo_id === 0 ? 'EGRESOS' : col.label }}</span>
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
        <q-icon :name="props.row.icono" size="22px" color="categoria-icon" />

        <span class="q-pl-sm movimientos__columna-categoria">
          {{ props.value }}</span
        >
      </q-td>
    </template>
    <template v-slot:body-cell="props">
      <q-td dense :props="props" clickable @dblclick="addItem(props)">
        <span class="movimientos__celda--importe"> {{ props.value }}</span>
      </q-td>
    </template>
  </q-table>

  <!-- Saldos finales Egresos -->
  <q-table
    :rows="saldosEgreso"
    :columns="columnasSaldos"
    row-key="name"
    hide-header
    hide-bottom
    separator="none"
    dense
  >
    <template #body-cell="props">
      <q-td class="bg-table-summary" :props="props">{{ props.value }}</q-td>
    </template>
  </q-table>
  <!-- NET CASH PROCEDS and FINAL CASH BALANCE -->
  <q-table
    :rows="listaSaldosMovimientos"
    :columns="columnasSaldos"
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
  <!--  -->
  <!-- LISTA DE CUENTAS BANCARIAS -->
  <q-table
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
    <template v-slot:body-cell-nombre_categoria="props">
      <q-td dense :props="props">
        <q-icon :name="props.row.icono" size="22px" color="dark" />
        <span class="q-pl-sm movimientos__columna-categoria">
          {{ props.value }}
        </span>
      </q-td>
    </template>
    <template v-slot:body-cell="props">
      <q-td dense :props="props">
        <span class="cuentas__celda--importe"> {{ props.value }}</span>
      </q-td>
    </template>
  </q-table>

  <div class="">
    <!-- Total Cash bank account & Net Balance -->
    <q-table
      :rows="listaSaldosFinales"
      :columns="columnasSaldos"
      row-key="name"
      hide-header
      hide-bottom
      separator="cell"
      dense
    >
      <template #body-cell="props">
        <q-td
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
    <!-- <pre>{{ cellData }}</pre> -->
  </div>

  <Teleport to="#modal">
    <q-dialog
      v-model="show_movimientos"
      persistent
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <ListaMovimientos
        :cell-data="cellData"
        @registro-created="onRegistroCreated"
        @registro-updated="onRegistroUpdated"
        @registro-deleted="onRegistroDeleted"
      ></ListaMovimientos>
    </q-dialog>
  </Teleport>
  <!-- <pre>{{ inputIngresoRefs }}</pre> -->
</template>

<script setup>
import { ref, nextTick, computed, onMounted } from 'vue'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { DateTime } from 'luxon'
import { useFormato } from 'src/composables/utils/useFormato'
import { api } from 'src/boot/axios'
import ListaMovimientos from 'src/components/movimientos/ListaMovimientos.vue'
import PeriodoSelect from 'src/components/formComponents/PeriodoSelect.vue'
import { SessionStorage, exportFile } from 'quasar'

/**
 * composables
 */
const { _mostrarNotificacionPositiva } = useNotificacion()
const formato = useFormato()

/**
 * state
 */
const inputIngresoRefs = ref({})

// const defaultItem = {
//   categoria: null,
//   cuenta: null,
//   registro: {
//     estadoRegistroId: 2,
//     importe: '',
//     fecha: '',
//     date: formato.formatoFecha(new Date())
//   },
//   observaciones: ''
// }
const pagination = ref({
  rowsPerPage: 0
})
// const periodoOptions = ref([
//   { id: 1, nombre: 'Quincenal' },
//   { id: 2, nombre: 'Mensual' }
// ])

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

const mes = ref(mesOptions.value[0])
const ejercicio_fiscal = ref(2023)
const listaMovimientos = ref([])
const listaMovimientosIngreso = ref([])
const saldosIngreso = ref([])
const saldosEgreso = ref([])
const listaSaldosCuentas = ref([])
const listaSaldosFinales = ref([])
const listaSaldosMovimientos = ref([])
const filterIngreso = ref('')
const filter = ref()
const show_movimientos = ref(false)
const cellData = ref({})

const columnsT = ref([])
const columnasSaldos = ref([])

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
//
function addItem(props) {
  if (isModificable.value) {
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
    if (cellData.value.periodo_id) {
      show_movimientos.value = true
    }
  } else {
    console.log("Can't modify")
  }
}

function obtenerColumnas(ejercicio_fiscal, mes) {
  api
    .get('/movimientos/columnas', {
      params: {
        ejercicio_fiscal,
        mes,
        is_saldos: 0
      }
    })
    .then(({ data }) => {
      columnsT.value = JSON.parse(JSON.stringify(data.data))

      columnsT.value.forEach((column) => {
        if (column.name != 'nombre_categoria') {
          column.format = (val) => (val ? `${formato.toCurrency(val)}` : '')
        }
      })
    })
    .catch((error) => {
      console.log('error', error)
    })
  api
    .get('/movimientos/columnas', {
      params: {
        ejercicio_fiscal,
        mes,
        is_saldos: 1
      }
    })
    .then(({ data }) => {
      columnasSaldos.value = JSON.parse(JSON.stringify(data.data))

      columnasSaldos.value.forEach((column) => {
        if (column.name != 'nombre_categoria') {
          column.format = (val) => (val ? `${formato.toCurrency(val)}` : '')
        }
      })
      // console.log('columnasSaldos.value:', columnasSaldos.value)
    })
    .catch((error) => {
      console.log('error', error)
    })
}
/**
 *
 */
function obtenerMovimientos() {
  const instanceId = SessionStorage.getItem('current_instance').id
  api
    .get('/movimientos/ingresos_egresos', {
      params: {
        ejercicioFiscalId: ejercicio_fiscal.value,
        tipoMovimientoId: 2,
        isSaldos: 0,
        instanceId
      }
    })
    .then(({ data }) => {
      listaMovimientos.value = JSON.parse(JSON.stringify(data.data))
    })
    .catch((error) => {
      console.log('error', error)
    })

  api
    .get('/movimientos/ingresos_egresos', {
      params: {
        tipoMovimientoId: 1,
        isSaldos: 0,
        ejercicioFiscalId: ejercicio_fiscal.value,
        instanceId
      }
    })
    .then(({ data }) => {
      listaMovimientosIngreso.value = JSON.parse(JSON.stringify(data.data))
      // console.table(listaMovimientosIngreso.value)
    })
    .catch((error) => {
      console.log('error', error)
    })
}
function obtenerIngresosEgresosSaldos() {
  const instanceId = SessionStorage.getItem('current_instance').id
  api
    .get('/movimientos/ingresos_egresos', {
      params: {
        tipoMovimientoId: 1,
        isSaldos: 1,
        ejercicioFiscalId: ejercicio_fiscal.value,
        instanceId
      }
    })
    .then(({ data }) => {
      saldosIngreso.value = JSON.parse(JSON.stringify(data.data))
    })
    .catch((error) => {
      console.log('error', error)
    })
  api
    .get('/movimientos/ingresos_egresos', {
      params: {
        tipoMovimientoId: 2,
        isSaldos: 1,
        ejercicioFiscalId: ejercicio_fiscal.value,
        instanceId
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
  const instanceId = SessionStorage.getItem('current_instance').id
  api
    .get('/movimientos/saldos_ingresos_egresos', {
      params: {
        ejercicioFiscalId: ejercicio_fiscal.value,
        mesId: mes.value.id,
        isSaldos: 0,
        instanceId
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
  const instanceId = SessionStorage.getItem('current_instance').id
  api
    .get('/movimientos/saldos_cuentas', {
      params: {
        ejercicioFiscalId: ejercicio_fiscal.value,
        mesId: mes.value.id,
        isSaldos: 0,
        instanceId
      }
    })
    .then(({ data }) => {
      listaSaldosCuentas.value = JSON.parse(JSON.stringify(data.data))
    })
    .catch((error) => {
      console.log('error', error)
    })
}

function obtenerSaldosFinales() {
  const instanceId = SessionStorage.getItem('current_instance').id
  api
    .get('/movimientos/saldos_finales', {
      params: {
        ejercicioFiscalId: ejercicio_fiscal.value,
        mesId: mes.value.id,
        isSaldos: 0,
        instanceId
      }
    })
    .then(({ data }) => {
      listaSaldosFinales.value = JSON.parse(JSON.stringify(data.data))
    })
    .catch((error) => {
      console.log('error', error)
    })
}

// function movimientoSaved(itemSaved) {
//   showFormItem.value = false
//   listaMovimientos.value.push(itemSaved)
//   mostrarNotificacion('guardó', itemSaved)
// }
// function movimientoUpdated(itemUpdated) {
//   showFormItem.value = false
//   mostrarNotificacion('actualizó', itemUpdated)
//   listaMovimientos.value[editedIndex.value] = itemUpdated
//   editedItem.value = { ...defaultItem }
//   editedIndex.value = null
// }
// function mostrarNotificacion(action, cuenta) {
//   notificacion.mostrarNotificacionPositiva(
//     `La movimiento "${cuenta.nombre}" se ${action} correctamente`,
//     2500
//   )
// }
function onRegistroCreated(/* itemCreated */) {
  // console.log('El registro fue creado', itemCreated)
  // show_movimientos.value = false
  cargarDatos()
}
function onRegistroUpdated(/* itemUpdated */) {
  cargarDatos()
}
function onRegistroDeleted(/* cuentasIds */) {
  cargarDatos()
}

function onChangePeriodo() {
  cargarDatos()
  obtenerColumnas(ejercicio_fiscal.value, mes.value.id)
}

/**
 * computed
 */

const isModificable = computed({
  get() {
    return SessionStorage.getItem('current_user').canModify
  }
})

function exportToExcel() {
  const params = obtenerParametros()
  api
    .get(`/movimientos/to_excel.xlsx`, {
      params,
      responseType: 'blob' // had to add this one here
    })
    .then((response) => {
      let nombreArchivo = getNombreArchivo()
      // console.log(
      //   "response.headers('conteny-type'):",
      //   response.headers['content-type']
      // )
      const _status = exportFile(nombreArchivo, response.data, {
        mimeType: response.headers['content-type']
      })
      // generandoReporte.value = false
      // // const content = response.headers['content-type'];
      // // download(response.data, 'mipdfprueba.pdf', content);
      // console.log('status cfdi', status)
    })
    .catch((error) => {
      console.log('error', error)
    })
}

function getNombreArchivo() {
  const instance = SessionStorage.getItem('current_instance')
  const instanceName = instance.dominio
  const mesNombre = mes.value.nombre
  const ejercicio = ejercicio_fiscal.value
  const dia = DateTime.now().day
  const nombreArchivo = `Movimientos_${instanceName}_${dia}_${mesNombre}_${ejercicio}.xlsx`
  return nombreArchivo
}
/**
 * * @description Obtiene los parámetros para la exportación a Excel
 * * @param {Object} params
 * * @param {Number} params.ejercicioFiscalId
 * * @param {Number} params.mesId
 * * @param {Number} params.instanceId
 * * @returns {Object}
 */
function obtenerParametros() {
  return {
    ejercicioFiscalId: ejercicio_fiscal.value,
    mesId: mes.value.id,
    instanceId: SessionStorage.getItem('current_instance').id
  }
}
function handleKey(event, props) {
  // console.log('props:', props)
  // console.log('colFieldOrigen:', props.col.field)
  // console.log('rowindex origen:', props.rowIndex)
  const indiceRow = props.rowIndex + 1
  switch (event.key) {
    case 'ArrowUp':
      // console.log('↑ Arriba')
      focusInput(props.col.field, indiceRow - 1)
      break
    case 'ArrowDown':
      // console.log('↓ Abajo')
      focusInput(props.col.field, indiceRow + 1)
      break
    case 'ArrowLeft':
      // console.log('← Izquierda')
      focusInput(Number(props.col.field) - 1, indiceRow)
      break
    case 'ArrowRight':
      // console.log('→ Derecha')
      focusInput(Number(props.col.field) + 1, indiceRow)
      break
    case 'Enter':
      console.log('Enter')
      // focusInput(Number(props.col.field) + 1, props.rowIndex + 1)
      break
  }
}
function focusInput(colField, rowIndex) {
  // console.log('focusing........')
  // console.log('colField:', colField)
  // console.log('rowIndex:', rowIndex)
  nextTick(() => {
    const key = `${colField}_${rowIndex}`
    // console.log('key:', key)
    const inputElement = inputIngresoRefs.value[key]
    // console.log('inputElement:', inputElement)
    if (inputElement) {
      inputElement.focus() // Enfoca el input
    }
  })
}
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
  border: 1px solid #eeeeee96;
  &:hover {
    background-color: #d1e1f14b !important;
    border: 1px solid #999999;
    // border: 0.2px solid rgb(179, 179, 190) !important;
    cursor: pointer;
    // font-weight: 600 !important;
    // font-size: inherit;
    transition: all 0.3s;
  }
}
.my-sticky-header-table-ingreso {
  /* height or max-height is important */
  height: 230px;
  min-height: 230px;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    // background-color: $main-background;
    background-color: white;
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
  height: calc(100vh - 635px);
  // background: white !important;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    // background-color: $main-background;
    // background: white !important;
  }
  thead tr {
    background: $main-background !important;
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
  color: #5d6779;
  border-bottom: 1px solid #aaaaaa !important;
  // border: 1px solid red;
}
/* **************************************************** */
.bg-table-summary {
  font-size: 0.68 rem !important;
  background-color: #b0d1f0cb !important;
  font-weight: 500 !important;
}
/**
* CSS para los totales net cash proceds
*/
.table__body-totals {
  font-family: 'Roboto Slab', 'Open Sans', sans-serif;
  font-weight: 500;
  // background-color: #9cc5ebcb !important;
  background-color: #e3e8eccb !important;
  font-size: 0.85rem !important;
  font-style: normal;
}
// Final cash balance y Total cash bank account
.table__body-preBalance {
  // Final cash balance
  font-family: 'Roboto Slab', 'Open Sans', sans-serif;
  background-color: rgb(230, 200, 230) !important;
  font-weight: 500 !important;
  font-size: 0.85rem !important;
  font-style: italic;
}
.table__body-netBalance {
  font-family: 'Roboto Slab', 'Open Sans', sans-serif;
  background-color: rgba(245, 231, 209, 0.89) !important;
  font-size: 0.9rem;
  font-weight: 600;
  font-style: italic;
  text-align: center;
}
/* ******************************************************** */
.table-body-cuentas {
  font-family: 'DM Sans', sans-serif;
  background-color: #748097 !important;
  font-weight: 500;
}
/* ***************************************************** */
.movimientos__celda--importe1 {
  margin: 0px !important;
  font-family: 'Roboto Slab', 'Open Sans', sans-serif;
  font-size: 0.75rem !important;
  font-weight: 300 !important;
  color: #242121;
  // border: 0px solid white !important;
}
.movimientos__celda--importe {
  font-family: 'Roboto Slab', 'Open Sans', sans-serif;
  font-size: 0.75rem !important;
  font-weight: 300 !important;
  color: #242121;
  // border: 0px solid white !important;
}
.cuentas__celda--importe {
  cursor: normal;
  font-family: 'Roboto Slab', 'Open Sans', sans-serif;
  font-size: 0.75rem !important;
  font-weight: 300 !important;
  color: #123d52;
  // border: 0px solid white !important;
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
  font-family: 'DM Sans', sans-serif;
  font-weight: 400 !important;
  font-size: 0.78rem;
  color: $categoria;
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
.saldosT-body {
  background: #f3f4f7;
}
.tabla-columna__saldo {
  font-family: 'Roboto Slab', 'Open Sans', sans-serif;
  font-size: 0.82rem !important;
  // letter-spacing: -0.0015rem;
  color: $categoria;
  font-weight: 600;
}
.mi-input {
  height: 20px;
  border: 1px solid #1976d2;
  border-radius: 5px;
  padding: 0px;
  // background-color: #e3f2fd;
  margin: 0px;
}

.mi-input input {
  // color: #0d47a1;
  font-weight: bold;
  padding: 0px 0px;
}
.rounded-input {
  border-radius: 999px; /* bordes muy redondos */
  min-width: 120px;
  height: 38px;
  padding: 0;
  margin: 2px;
}

/* borde más visible cuando está enfocado */
.rounded-input.q-input--focused {
  box-shadow: 0 0 0 2px #3f51b5;
}

/* borde sutil cuando no está enfocado */
.rounded-input .q-field__control {
  border: 1px solid #ccc;
  transition: border 0.2s;
  border-radius: 999px;
}
.input-mini {
  border-radius: 999px;
  min-width: 90px; /* o más pequeño si quieres */
  height: 25px !important;
  padding: 0;
  margin: 1px;
  font-size: 13px;
}

.input-mini .q-field__control {
  height: 22px;
  min-height: 23px !important;
  padding: 0 6px !important;
  font-size: 13px;
  border-radius: 999px;
  margin: 0px;
}

/* Enfocado: borde más visible */
.input-mini.q-input--focused {
  box-shadow: 0 0 0 2px #1976d2;
}
.input-ultra-compact {
  min-width: 70px;
  height: 24px !important;
  font-size: 12px;
  margin: 1px;
  border-radius: 999px;
}

.input-ultra-compact .q-field__control {
  min-height: 22px !important;
  padding: 0 4px !important;
  font-size: 12px;
  border-radius: 999px;
}

.input-ultra-compact.q-input--focused {
  box-shadow: 0 0 0 1.5px #2196f3;
}
.skinny-qinput {
  width: 65px;
  height: 20px;
  font-size: 11px;
}

.skinny-qinput .q-field__control {
  padding: 0 4px !important;
  min-height: 20px !important;
  font-size: 11px;
  border-radius: 999px;
  border: 1px solid #ccc;
}

.skinny-qinput.q-input--focused {
  box-shadow: 0 0 0 1px #1976d2;
}

.ultra-skinny-input {
  // width: 65px;
  width: 100%;
  height: 27px;
  font-size: 12px;
  text-align: center;
  padding: 0 1px;
  border: 1px solid #ccc;
  border-radius: 3px;
  outline: none;
  background-color: white;
  margin: 0px;
  transition:
    box-shadow 0.2s,
    border-color 0.2s;
}

.ultra-skinny-input:focus {
  border-color: #2196f3;
  box-shadow: 0 0 0 1px #2196f3;
}
</style>
