<template>
  <div class="column" style="border: 1px solid red">
    <div class="row text-h5 text-contrast q-pa-md font-subtitle">CUENTAS</div>
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
          <!-- <q-btn
          label="Nueva cuenta"
          color="primary"
          class=""
          @click="addRow()"
          icon="queue"
        /> -->
          <q-btn-dropdown
            split
            icon="add"
            label="AGREGAR"
            color="primary"
            @click="addRow(0)"
          >
            <q-list>
              <q-item clickable v-close-popup @click="addRow(1)">
                <q-item-section avatar>
                  <q-icon name="account_balance" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Ahorros</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="addRow(3)">
                <q-item-section avatar>
                  <q-icon name="credit_card" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Tarjeta Crédito</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="addRow(2)">
                <q-item-section avatar>
                  <q-icon name="payments" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Efectivo</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
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
          <q-card class="my-card text-primary q-ma-sm" style="width: 350px">
            <q-card-section
              :class="{
                'bg-dark': props.row.tipoCuenta.id === '1',
                'bg-contrast ': props.row.tipoCuenta.id === '2',
                'bg-secondary': props.row.tipoCuenta.id === '3',
                'text-white': true
              }"
            >
              <div class="row">
                <div class="column col">
                  <div class="text-h6">{{ props.row.nombre }}</div>
                </div>
                <div
                  class=""
                  :class="{
                    'text-accent-contrast': props.row.tipoCuenta.id === '1',
                    'text-yellow-3': props.row.tipoCuenta.id === '2',
                    'text-accent-light': props.row.tipoCuenta.id === '3',
                    'col-auto column items-center q-mx-md': true
                  }"
                >
                  <q-icon :name="props.row.tipoCuenta.icon" size="30px" />
                  <span>{{ props.row.tipoCuenta.nombre }}</span>
                </div>
              </div>
            </q-card-section>

            <q-card-section>
              <div class="text-caption text-accent">
                {{ props.row.cuentaContable.nombreCompleto }}
              </div>
              {{ props.row.descripcion }}
            </q-card-section>

            <q-separator inset />

            <q-card-actions>
              <q-btn
                round
                color="primary"
                flat
                icon="edit"
                @click="editRow(props)"
              />
              <q-btn
                round
                flat
                icon="delete"
                class="q-ml-sm"
                @click="deleteRow(props)"
              />
            </q-card-actions>
          </q-card>
        </template>
        <template #body-cell-icono="props">
          <q-icon :name="props.row.icono" size="35px" color="cyan" />
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
    <!-- <pre>{{ listaCuentas }}</pre> -->
  </div>
</template>

<script setup>
import { useLazyQuery, useQuery, useMutation } from '@vue/apollo-composable'
import { ref, computed, onMounted } from 'vue'
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
 * GRAPHQL
 */
const graphql_options = ref({
  fetchPolicy: 'cache-and-network'
  // fetchPolicy: 'cache-only'
})
const { onError: onErrorListaCuentas, result: resultCuentas } = useQuery(
  LISTA_CUENTAS,
  null,
  graphql_options
)

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
onErrorListaCuentas((error) => {
  console.error(error)
})
/**
 * state
 */
const defaultItem = {
  id: null,
  nombre: null,
  descripcion: null,
  tipoCuenta: {
    id: null
  }
}
// const listaCuentas = ref([])
const filter = ref()
const showFormItem = ref(false)
const editedItem = ref({ ...defaultItem })
const editedIndex = ref(null)
const rowIndexDelete = ref(null)

/**
 * computed
 */
const listaCuentas = computed({
  get() {
    return resultCuentas.value?.listaCuentas ?? []
  }
})
/**
 *
 */
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
  // cargarCuentas()
})

// onResultCuentas(({ data }) => {
//   if (!!data) {
//     console.log('response', data)
//     listaCuentas.value = JSON.parse(JSON.stringify(data.listaCuentas))
//   }
// })

function addRow(tipoCuentaId) {
  console.log('tipo de cuenta', tipoCuentaId)
  editedItem.value = { ...defaultItem }
  editedItem.value.tipoCuenta.id = tipoCuentaId.toString()
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
</script>

<style lang="scss" scoped></style>
