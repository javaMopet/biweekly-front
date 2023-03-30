<template>
  <div class="row">Cuentas</div>
  <div class="row fit" style="border: 0px solid red">
    <q-table
      grid
      style="width: 100%"
      dense
      :rows="listaCuentas"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top-left>
        <q-btn
          label="Nueva cuenta"
          color="primary"
          class=""
          @click="addRow()"
          icon="queue"
        />
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
      <template #item="props">
        <q-card class="my-card text-primary q-ma-sm" style="width: 340px">
          <q-card-section class="bg-primary text-accent-light">
            <div class="text-h6">{{ props.row.nombre }}</div>
            <div class="text-subtitle2">
              {{ props.row.cuentaContable.nombreCompleto }}
            </div>
          </q-card-section>

          <q-card-section>
            {{ props.row.descripcion }}
          </q-card-section>

          <q-separator dark />

          <q-card-actions>
            <q-btn
              round
              color="primary"
              outline
              icon="edit"
              @click="editRow(props)"
            />
            <q-btn
              round
              color="negative"
              flat
              icon="delete"
              class="q-ml-sm"
              @click="deleteRow(props)"
            />
          </q-card-actions>
        </q-card>
        <!-- <q-card class="my-card q-ma-sm">
          <q-card-section>
            <div class="text-h6">
              {{ props.row.nombre }}
            </div>
            <div class="text-subtitle2">
              {{ props.row.cuentaContable.id }} -
              {{ props.row.cuentaContable.nombre }}
            </div>
          </q-card-section>
          <q-card-section>
            <q-btn icon="edit" size="sm" flat dense @click="editRow(props)" />
            <q-btn
              icon="delete"
              size="sm"
              class="q-ml-sm"
              flat
              dense
              @click="deleteRow(props)"
            />
          </q-card-section>
        </q-card> -->
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
            class="q-ml-sm"
            color="negative"
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
      <RegistroCuenta
        :edited-item="editedItem"
        :edited-index="editedIndex"
        @cuentaSaved="cuentaSaved"
        @cuentaUpdated="cuentaUpdated"
      ></RegistroCuenta>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import { ref, onMounted } from 'vue'
import { LISTA_CUENTAS, CUENTA_DELETE } from '/src/graphql/cuentas'
import RegistroCuenta from 'src/components/cuentas/RegistroCuenta.vue'
import { useQuasar } from 'quasar'
import { useNotificacion } from 'src/composables/utils/useNotificacion'

/**
 * composables
 */
const $q = useQuasar()
const notificacion = useNotificacion()

/**
 * state
 */
const defaultItem = {
  id: null,
  nombre: null,
  descripcion: null
}
const listaCuentas = ref([])
const filter = ref()
const showFormItem = ref(false)
const editedItem = ref({ ...defaultItem })
const editedIndex = ref(null)
const rowIndexDelete = ref(null)

const columns = [
  // { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
  {
    name: 'nombre',
    label: 'Nombre',
    field: 'nombre',
    sortable: true,
    align: 'left'
  },

  {
    name: 'descripcion',
    label: 'Descripción',
    field: 'descripcion',
    sortable: true,
    align: 'left'
  },

  {
    name: 'cuenta_contable',
    label: 'Cuenta Contable',
    field: (row) => `${row.cuentaContable.id} - ${row.cuentaContable.nombre}`,
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
 * onMounted
 */
onMounted(() => {
  cargarCuentas()
})

const { onResult: onResultCuentas, load: cargarCuentas } =
  useLazyQuery(LISTA_CUENTAS)

onResultCuentas(({ data }) => {
  if (!!data) {
    console.log('response', data)
    listaCuentas.value = JSON.parse(JSON.stringify(data.listaCuentas))
  }
})

function addRow() {
  editedItem.value = { ...defaultItem }
  editedIndex.value = null
  showFormItem.value = true
}
function editRow(item) {
  editedItem.value = {
    ...item.row
  }
  editedIndex.value = item.rowIndex
  showFormItem.value = true
}

function deleteRow(item) {
  rowIndexDelete.value = item.rowIndex
  $q.dialog({
    title: 'Confirmar',
    style: 'width:500px',
    message: `Está a punto de eliminar la cuenta "${item.row.nombre}" ¿Desea continuar con la eliminación?`,
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
      deleteCuenta({ id: item.row.id })
    })
    .onCancel(() => {})
    .onDismiss(() => {})
}

function cuentaSaved(itemSaved) {
  showFormItem.value = false
  listaCuentas.value.push(itemSaved)
  mostrarNotificacion('guardó', itemSaved)
}
function cuentaUpdated(itemUpdated) {
  showFormItem.value = false
  mostrarNotificacion('actualizó', itemUpdated)
  listaCuentas.value[editedIndex.value] = itemUpdated
  editedItem.value = { ...defaultItem }
  editedIndex.value = null
}
function mostrarNotificacion(action, cuenta) {
  notificacion.mostrarNotificacionPositiva(
    `La cuenta "${cuenta.nombre}" se ${action} correctamente`,
    2500
  )
}
/**
 * GRAPHQL
 */

const {
  mutate: deleteCuenta,
  onDone: onDoneDeleteCuenta,
  onError: onErrorDeleteCuenta
} = useMutation(CUENTA_DELETE)

onDoneDeleteCuenta(({ data }) => {
  if (!!data) {
    console.log('item deleted ', data)
    const deletedItem = data.cuentaDelete.cuenta
    listaCuentas.value.splice(rowIndexDelete.value, 1)
    rowIndexDelete.value = null
    mostrarNotificacion('elminó', deletedItem)
  }
})
onErrorDeleteCuenta((error) => {
  console.error(error)
})
</script>

<style lang="scss" scoped></style>
