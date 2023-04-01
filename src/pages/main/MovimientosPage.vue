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
      <template #item="props">
        <q-card class="my-card q-ma-sm" flat bordered>
          <q-item
            class="bg-dark text-white"
            :style="`border-top: 6px solid ${props.row.color}`"
          >
            <q-item-section avatar>
              <q-icon :name="props.row.icono" />
            </q-item-section>

            <q-item-section>
              <div class="row items-center no-wrap">
                <!-- <q-item-label>{{ props.row.color }}</q-item-label> -->
                <!-- <div class="col">
                  <q-item-label class="text-h6">{{
                    props.row.nombre
                  }}</q-item-label>
                  <q-item-label class="text-accent-light text-subtitle2">
                    {{ props.row.cuentaContable.nombreCompleto }}
                  </q-item-label>
                </div> -->
                <div class="col-auto q-pl-md">
                  <!-- <q-avatar
                    size="30px"
                    :class="{
                      'text-white': true,
                      'bg-positive': props.row.tipoMovimiento.id === '1',
                      'bg-negative': props.row.tipoMovimiento.id === '2'
                    }"
                    >{{ props.row.tipoMovimiento.nombre[0] }}</q-avatar
                  > -->
                </div>
              </div>
            </q-item-section>
          </q-item>

          <q-card-section>
            {{ props.row.descripcion }}
          </q-card-section>

          <q-separator inset />

          <q-card-actions style="border: 0px solid red">
            <q-btn round flat icon="edit" @click="editRow(props)" />
            <!-- color="primary" -->
            <q-btn
              round
              flat
              icon="delete"
              class="q-ml-sm"
              @click="deleteRow(props)"
            />
            <!-- color="negative" -->
          </q-card-actions>
        </q-card>
      </template>
      <template v-slot:top-left>
        <!-- <q-btn
          label="Nueva movimiento"
          color="primary"
          class=""
          @click="addRow()"
          icon="queue"
        /> -->
        <div class="q-pa-md">
          <q-btn-dropdown
            split
            color="primary"
            glossy
            no-caps
            label="Nuevo"
            v-model="btnElement"
          >
            <q-list>
              <q-item clickable v-close-popup @click="addIngreso">
                <q-item-section avatar>
                  <q-avatar color="accent" text-color="white">I</q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Ingreso</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="addEgreso">
                <q-item-section avatar>
                  <q-avatar color="secondary" text-color="white">E</q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Egreso</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <!-- <div class="q-mt-md">
          <q-page-sticky position="bottom-left" :offset="[18, 18]">
            <q-fab
              v-model="fab2"
              label="Acciones"
              label-class="bg-secondary white"
              vertical-actions-align="left"
              color="primary"
              icon="add"
              direction="up"
              label-position="left"
              external-label
              :hide-label="true"
            >
              <q-fab-action
                label-class="bg-secondary white"
                external-label
                color="positive-pastel"
                @click="addRow"
                icon="arrow_upward"
                label="Ingreso"
                label-position="right"
              />
              <q-fab-action
                label-class="bg-secondary white"
                external-label
                color="negative-pastel"
                @click="addRow"
                icon="arrow_downward"
                label="Egreso"
                label-position="right"
              />
              <q-fab-action
                label-class="bg-secondary white"
                external-label
                color="blue-6"
                @click="addRow"
                icon="sync_alt"
                label="Transferencia"
                label-position="right"
              />
            </q-fab>
          </q-page-sticky>
        </div> -->
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
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ref, onMounted } from 'vue'
import { LISTA_MOVIMIENTOS, MOVIMIENTO_DELETE } from '/src/graphql/movimientos'
// import { LISTA_CUENTAS_CONTABLES } from '/src/graphql/cuentasContableGql'
import RegistroMovimiento from 'src/components/movimientos/RegistroMovimiento.vue'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { useQuasar, SessionStorage } from 'quasar'
import { DateTime } from 'luxon'
import { useFormato } from 'src/composables/utils/useFormato'

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
  // id: null,
  // importe: 1500,
  // tipoAfectacion: 'C',
  // tipoDetalle: 'N',

  numero: null,
  estadoMovimientoId: parseInt(2),
  tipoMovimientoId: '1',
  fecha: formato.formatoFecha(new Date()),
  observaciones: '',
  userId: SessionStorage.getItem('user').id,
  detallesMovimiento: [
    {
      importe: 0
    },
    {
      cuenta: null
    }
  ]

  // categoria: {
  //   id: null,
  //   nombre: '',
  //   descripcion: ''
  // }
}
const listaMovimientos = ref([])
const filter = ref()
const editedItem = ref({ ...defaultItem })
const editedIndex = ref(null)
const rowIndexDelete = ref(null)
const showFormItem = ref(false)
const fab2 = ref(false)
const btnElement = ref(null)

const columns = [
  { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
  {
    name: 'nombre',
    label: 'Nombre',
    field: (row) =>
      !!row.detallesMovimiento[0]
        ? row.detallesMovimiento[0].categoria.nombre
        : '',
    sortable: true,
    align: 'left'
  },
  {
    name: 'descripcion',
    label: 'Descripción',
    field: 'observaciones',
    sortable: true,
    align: 'left'
  },

  {
    name: 'importe',
    label: 'Importe',
    field: (row) =>
      !!row.detallesMovimiento[0]
        ? formato.toCurrency(row.detallesMovimiento[0].importe)
        : '',
    sortable: true,
    align: 'left'
  },
  {
    name: 'fecha',
    label: 'Fecha',
    field: 'fecha_campo',
    sortable: true,
    align: 'left'
  },
  {
    name: 'tipo_movimiento',
    label: 'Tipo Movimiento',
    field: (row) => row.tipoMovimiento.nombre,
    sortable: true,
    align: 'left'
  },
  {
    name: 'estado',
    label: 'Estado',
    field: 'estadoMovimientoId',
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
/**
 * onMount
 */
onMounted(() => {})
/**
 * METHODS
 */

function addIngreso(event) {
  console.log('Agregando un ingreso', event)
}
function addEgreso(event) {
  console.log('Agregando un egreso', event)
}
function addRow() {
  editedItem.value = { ...defaultItem }
  editedIndex.value = null
  showFormItem.value = true
}
function editRow(item) {
  editedItem.value = JSON.parse(JSON.stringify(item.row))
  editedIndex.value = item.rowIndex
  console.log('Editar elemento...', editedItem.value, editedIndex.value)
  showFormItem.value = true
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
function onMainClick(val) {
  console.log('val', val)
}
function onItemClick(item) {
  console.log('item', item)
}
/**
 * GRAPHQL
 */
const options = ref({
  fetchPolicy: 'network-only'
})

const { onResult: onResultMovimientos, onError: onErrorListaMovimientos } =
  useQuery(LISTA_MOVIMIENTOS, null, options)

onResultMovimientos(({ data }) => {
  if (!!data) {
    console.log('data', data.listaMovimientos[0])
    listaMovimientos.value = JSON.parse(JSON.stringify(data.listaMovimientos))
    listaMovimientos.value.forEach((element) => {
      console.log('element', element.observaciones)
      element.date = DateTime.fromISO(element.fecha)
      element.fecha_campo = DateTime.fromISO(element.fecha).toFormat(
        'dd/MM/yyyy'
      )
    })
  }
})
onErrorListaMovimientos((error) => {
  console.error(error)
})

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
