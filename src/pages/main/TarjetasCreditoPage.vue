<template>
  <div class="column q-ma-md" style="border: 0px solid red">
    <div class="row text-h5 text-secondary q-pa-md font-subtitle">
      TARJETAS DE CRÉDITO
    </div>
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
        hide-pagination
      >
        <template v-slot:top-left>
          <q-btn-dropdown
            split
            icon="add"
            label="AGREGAR"
            color="primary"
            @click="addRow(3)"
          >
            <q-list>
              <q-item clickable v-close-popup @click="addRow(3)">
                <q-item-section avatar>
                  <q-icon name="credit_card" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Tarjeta Crédito</q-item-label>
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
            placeholder="Buscar Cuenta"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template #item="props">
          <q-card class="q-ma-sm shadow-5" outlined>
            <!-- style="
              background: radial-gradient(circle, #215e70 0%, #043e50 100%);
            " -->
            <q-item class="text-primary">
              <q-item-section center avatar>
                <q-icon name="credit_card" size="30px" color="secondary" />
              </q-item-section>
              <q-item-section align="left">
                <q-item-label class="text-bolder">
                  <RouterLink
                    class="text-primary"
                    :to="`/tarjetas_credito/${props.row.id}`"
                    >{{ props.row.nombre }}</RouterLink
                  >
                </q-item-label>
                <!-- <q-separator
                  spaced
                  inset
                  color="grey-5"
                  style="width: 100%; margin-left: 0px !important"
                /> -->
                <q-item-label caption lines="2" class="text-grey-7">{{
                  props.row.descripcion
                }}</q-item-label>
                <q-item-label
                  caption
                  lines="2"
                  class="text-blue-grey-5 text-bold"
                  >$ 1,800.00</q-item-label
                >
              </q-item-section>
              <q-item-section
                side
                center
                cursor-pointer
                @click="movimientosTarjeta"
                class="q-ml-md"
              >
                <!-- <q-icon
                  name="more_vert"
                  color="contrast"
                  cursor-pointer
                  clickable
                /> -->
                <!-- <q-btn color="contrast" flat icon="menu" style="width: 18px">
                  <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item clickable v-close-popup>
                        <q-item-section>Movimientos</q-item-section>
                      </q-item>
                      <q-separator inset horizontal spaced />
                      <q-item clickable v-close-popup>
                        <q-item-section>Modificar</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section>Eliminar</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn> -->
              </q-item-section>
            </q-item>

            <!-- <q-separator inset color="grey-7" /> -->
            <q-card-actions align="right">
              <q-btn
                round
                flat
                icon="edit"
                @click="editRow(props)"
                color="info"
              />
              <q-btn
                round
                flat
                icon="delete"
                color="negative-pastel"
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
import { useQuery, useMutation } from '@vue/apollo-composable'
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
    console.log('item deleted ', rowIndexDelete.value)
    const deletedItem = data.cuentaDelete.cuenta
    resultCuentas.value?.listaCuentas.splice(rowIndexDelete.value, 1)
    rowIndexDelete.value = null
    mostrarNotificacion('elminó', deletedItem)
  }
})
onErrorDeleteCuenta((error) => {
  console.error(error)
  notificacion.mostrarNotificacionNegativa(
    'No es posible eliminar esta tarjeta de crédito debido a que tiene movimientos',
    1500
  )
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
  },
  cuentaContable: null
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
    return (
      resultCuentas.value?.listaCuentas.filter(
        (cuenta) => cuenta.tipoCuenta.id === '3'
      ) ?? []
    )
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
  console.log('tarjetaSaved', itemSaved)
  showFormItem.value = false
  resultCuentas.value?.listaCuentas.push(itemSaved)
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
function movimientosTarjeta() {
  console.log('movimientostarjta')
}
</script>

<style lang="scss" scoped></style>
