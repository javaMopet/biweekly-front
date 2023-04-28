<template>
  <q-toolbar class="text-dark">
    <q-toolbar-title> Movimientos </q-toolbar-title>
    <q-btn flat round dense icon="arrow_back" @click="$router.back()" />
  </q-toolbar>
  <q-space style="height: 10px" />
  <div class="column">
    <div class="column">
      <q-table
        class="my-sticky-header-table"
        style="width: 100%; height: 280px !important"
        dense
        :rows="listaMovimientosIngreso"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :rows-per-page-options="[0]"
        separator="cell"
        hide-pagination
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-dark"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:top-left>
          <div class="row q-pa-md q-gutter-x-lg">
            <q-btn-dropdown
              split
              icon="add"
              color="primary"
              label="AGREGAR"
              @click="addItem('2')"
              dense
            >
              <q-list>
                <q-item clickable v-close-popup @click="addItem('2')">
                  <q-item-section avatar>
                    <q-avatar
                      color="negative"
                      text-color="white"
                      icon="arrow_downward"
                    ></q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Gasto</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="addItem('1')">
                  <q-item-section avatar>
                    <q-avatar
                      color="positive"
                      text-color="white"
                      icon="arrow_upward"
                    ></q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Ingreso</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="addItem('3')">
                  <q-item-section avatar>
                    <q-avatar
                      color="blue-5"
                      text-color="white"
                      icon="sync_alt"
                    ></q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Transferencia</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-select
              v-model="periodo"
              :options="periodoOptions"
              option-label="nombre"
              label="Periodo"
              outlined
              dense
            />
            <q-select
              v-model="mes"
              :options="mesOptions"
              option-label="nombre"
              label="Mes"
              outlined
              dense
            />
          </div>
        </template>
        <template v-slot:top-right>
          <q-input
            outlined
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <!-- <template #body-cell-icono="props">
          <q-td style="width: 30px"> </q-td>
        </template> -->
        <template v-slot:body-cell="props">
          <q-td dense :props="props" clickable @click="addItem2(props)">
            <span v-if="props.col.name === 'nombre_categoria'">
              <q-icon :name="props.row.icono" size="22px" color="dark" />
              {{ props.value }}
            </span>
            <span dense v-else class="">
              {{ props.value }}
            </span>

            <!-- <q-badge v-else color="blue" :label="props.value" /> -->
            <!-- <PriceInput v-else></PriceInput> -->
          </q-td>
        </template>
        <!-- <template v-slot:body-cell-acciones="props">
          <q-td :props="props" fit>
            <q-btn icon="edit" size="sm" flat dense @click="editRow(props)" />
            <q-btn
              icon="delete"
              size="sm"
              class="q-ml-sm text-negative"
              flat
              dense
              @click="deleteRow(props)"
            />
          </q-td>
        </template> -->
      </q-table>
    </div>
    <div class="row fit" style="border: 0px solid red">
      <q-table
        class="my-sticky-header-table"
        style="width: 100%; height: 380px !important"
        flat
        bordered
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        dense
        :rows="listaMovimientos"
        :columns="columns"
        row-key="id"
        :filter="filter"
        separator="cell"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-dark"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:top-right>
          <q-input
            outlined
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell="props">
          <q-td dense :props="props" clickable @click="addItem2(props)">
            <span v-if="props.col.name === 'nombre_categoria'">
              <q-icon :name="props.row.icono" size="22px" color="dark" />
              {{ props.value }}
            </span>
            <span dense v-else class="">
              {{ props.value }}
            </span>

            <!-- <q-badge v-else color="blue" :label="props.value" /> -->
            <!-- <PriceInput v-else></PriceInput> -->
          </q-td>
        </template>
        <!-- <template #body-cell-icono="props">
          <q-td style="width: 30px" class="bg-categoria-light">
            <q-icon :name="props.row.icono" size="22px" color="dark" />
          </q-td>
        </template> -->
        <!-- <template v-slot:body-cell-acciones="props">
          <q-td :props="props" fit>
            <q-btn icon="edit" size="sm" flat dense @click="editRow(props)" />
            <q-btn
              icon="delete"
              size="sm"
              class="q-ml-sm text-negative"
              flat
              dense
              @click="deleteRow(props)"
            />
          </q-td>
        </template> -->
      </q-table>
    </div>
    <div class="row fit" style="border: 0px solid red">
      <q-table
        class="my-sticky-header-table"
        style="width: 100%; height: 200px !important"
        flat
        bordered
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        dense
        :rows="listaSaldosCuentas"
        :columns="columns"
        row-key="id"
        :filter="filter"
        separator="cell"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-dark"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:top-right>
          <q-input
            outlined
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell="props">
          <q-td dense :props="props" clickable @click="addItem2(props)">
            <span v-if="props.col.name === 'nombre_categoria'">
              <q-icon :name="props.row.icono" size="22px" color="dark" />
              {{ props.value }}
            </span>
            <span dense v-else class="">
              {{ props.value }}
            </span>

            <!-- <q-badge v-else color="blue" :label="props.value" /> -->
            <!-- <PriceInput v-else></PriceInput> -->
          </q-td>
        </template>
        <!-- <template #body-cell-icono="props">
          <q-td style="width: 30px" class="bg-categoria-light">
            <q-icon :name="props.row.icono" size="22px" color="dark" />
          </q-td>
        </template> -->
        <!-- <template v-slot:body-cell-acciones="props">
          <q-td :props="props" fit>
            <q-btn icon="edit" size="sm" flat dense @click="editRow(props)" />
            <q-btn
              icon="delete"
              size="sm"
              class="q-ml-sm text-negative"
              flat
              dense
              @click="deleteRow(props)"
            />
          </q-td>
        </template> -->
      </q-table>
    </div>
  </div>

  <Teleport to="#modal">
    <q-dialog v-model="showFormItem" persistent>
      <RegistroMovimiento
        :edited-item="editedItem"
        :edited-index="editedIndex"
        @movimientoSaved="movimientoSaved"
        @movimientoUpdated="movimientoUpdated"
      ></RegistroMovimiento>
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
import RegistroMovimiento from 'src/components/movimientos/RegistroMovimiento.vue'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { useQuasar } from 'quasar'
import { DateTime } from 'luxon'
import { useFormato } from 'src/composables/utils/useFormato'
import { api } from 'src/boot/axios'
import PriceInput from 'src/components/formComponents/PriceInput.vue'
import ListaMovimientos from 'src/components/movimientos/ListaMovimientos.vue'

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

const mes = ref(mesOptions.value[0])
const listaMovimientos = ref([])
const listaMovimientosIngreso = ref([])
const listaSaldosCuentas = ref([])
const filter = ref()
const editedItem = ref({ ...defaultItem })
const editedIndex = ref(null)
const rowIndexDelete = ref(null)
const showFormItem = ref(false)
const show_movimientos = ref(false)
const cellData = ref({})

const columns = ref([
  // {
  //   name: 'categoria_id',
  //   label: 'Id',
  //   field: 'categoria_id',
  //   sortable: true,
  //   align: 'left'
  // },
  // {
  //   name: 'nombre_categoria',
  //   label: 'Nombre',
  //   field: 'nombre_categoria',
  //   sortable: true,
  //   align: 'left'
  // },
  // {
  //   name: 'columna_8',
  //   label: 'Columna_8',
  //   field: '8',
  //   sortable: true,
  //   align: 'left'
  // },
  // {
  //   name: 'columna_9',
  //   label: 'Columna_9',
  //   field: '9',
  //   sortable: true,
  //   align: 'left'
  // }
])
/**
 * onMount
 */
onMounted(() => {
  obtenerColumnas()
  obtenerMovimientos()
  obtenerSaldosCuentas()
})
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
function obtenerColumnas() {
  api
    .get('/columnas')
    .then(({ data }) => {
      columns.value = JSON.parse(JSON.stringify(data.data))
      columns.value.forEach((column) => {
        if (column.name != 'nombre_categoria') {
          column.format = (val, row) =>
            !!val ? `${formato.toCurrency(val)}` : ''
        } else {
          // column.style = 'background-color: #d9e4ee'
          column.style = 'background-color: #c8d7ca'
        }
      })
      console.log('columnas ', columns.value)
    })
    .catch((error) => {
      console.log('error', error)
    })
}
function obtenerMovimientos() {
  api
    .get('/movimientos', {
      params: {
        tipoMovimientoId: 2
      }
    })
    .then(({ data }) => {
      // console.log('response data', data.data)
      listaMovimientos.value = JSON.parse(JSON.stringify(data.data))
      console.log('response data', listaMovimientos.value)
    })
    .catch((error) => {
      console.log('error', error)
    })
  api
    .get('/movimientos', {
      params: {
        tipoMovimientoId: 1
      }
    })
    .then(({ data }) => {
      // console.log('response data', data.data)
      listaMovimientosIngreso.value = JSON.parse(JSON.stringify(data.data))

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
        ejercicio_fiscal_id: 2023
      }
    })
    .then(({ data }) => {
      console.log('response data', data.data)
      listaSaldosCuentas.value = JSON.parse(JSON.stringify(data.data))

      // console.log('ingresos data', listaMovimientosIngreso.value)
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
  obtenerMovimientos()
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

<style lang="scss" scoped>
@function color-texto($color) {
  @if (lightness($color) > 50) {
    @return rgb(51, 149, 162);
  } @else {
    @return rgb(217, 163, 230);
  }
}
.tabla-columna-importe {
  background-color: #fafcfd !important;
  &:hover {
    background-color: #d9e4ee !important;
    border: 1.6px solid rgb(179, 179, 190) !important;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s;
  }
}

.my-sticky-header-table {
  /* height or max-height is important */
  height: calc(100vh - 375px);

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: $table-header;
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

// .my-sticky-virtscroll-table {
//   /* height or max-height is important */
//   height: 410px;

//   .q-table__top,
//   .q-table__bottom,
//   thead tr:first-child th {
//     /* bg color is important for th; just specify one */
//     background-color: #00b4ff;
//   }
//   thead tr th {
//     position: sticky;
//     z-index: 1;
//   }
//   /* this will be the loading indicator */
//   thead tr:last-child th {
//     /* height of all previous header rows */
//     top: 48px;
//   }
//   thead tr:first-child th {
//     top: 0;
//   }

//   /* prevent scrolling behind sticky top row on focus */
//   tbody {
//     /* height of all previous header rows */
//     scroll-margin-top: 48px;
//   }
// }
</style>
