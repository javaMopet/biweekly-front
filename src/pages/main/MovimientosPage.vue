<template>
  <q-toolbar class="text-dark">
    <q-toolbar-title> Movimientos </q-toolbar-title>
    <q-btn flat round dense icon="arrow_back" @click="$router.back()" />
  </q-toolbar>
  <q-space style="height: 10px" />
  <div class="row fit" style="border: 0px solid red">
    <q-table
      style="width: 100%"
      dense
      :rows="listaMovimientos"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :rows-per-page-options="[0]"
    >
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
      <template #body-cell-icono="props">
        <q-icon :name="props.row.icono" size="35px" color="cyan" />
      </template>
      <template v-slot:body-cell-acciones="props">
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
      </template>
    </q-table>
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
const filter = ref()
const editedItem = ref({ ...defaultItem })
const editedIndex = ref(null)
const rowIndexDelete = ref(null)
const showFormItem = ref(false)

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
})
/**
 * METHODS
 */

function addItem(tipo_movimiento) {
  editedItem.value = { ...defaultItem, tipoMovimientoId: tipo_movimiento }
  editedIndex.value = null
  showFormItem.value = true
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
      console.log('response data', data.data)
      columns.value = JSON.parse(JSON.stringify(data.data))
      columns.value.forEach((column) => {
        if (column.name != 'nombre_categoria') {
          column.format = (val, row) =>
            !!val ? `${formato.toCurrency(val)}` : ''
        } else {
          column.style = 'background-color: #d9e4ee'
        }
      })
    })
    .catch((error) => {
      console.log('error', error)
    })
}
function obtenerMovimientos() {
  api
    .get('/movimientos')
    .then(({ data }) => {
      // console.log('response data', data.data)
      listaMovimientos.value = JSON.parse(JSON.stringify(data.data))
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
</style>
