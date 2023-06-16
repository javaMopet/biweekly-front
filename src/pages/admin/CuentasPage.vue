<template>
  <div class="column q-ma-md" style="border: 0px solid red">
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
          <div class="q-pa-md">
            <q-btn-dropdown
              split
              icon="add_circle"
              color="primary-button"
              push
              glossy
              no-caps
              label="agregar"
              @click="addRow(1)"
              text-color="accent-light"
            >
              <q-list>
                <q-item clickable v-close-popup @click="addRow(1)">
                  <q-item-section avatar>
                    <q-avatar
                      icon="account_balance"
                      color="primary"
                      text-color="white"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Ahorros</q-item-label>
                    <!-- <q-item-label caption>February 22, 2016</q-item-label> -->
                  </q-item-section>
                  <!-- <q-item-section side>
                    <q-icon name="info" color="amber" />
                  </q-item-section> -->
                </q-item>

                <q-item clickable v-close-popup @click="addRow(2)">
                  <q-item-section avatar>
                    <q-avatar
                      icon="payments"
                      color="secondary"
                      text-color="white"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Efectivo</q-item-label>
                    <!-- <q-item-label caption>February 22, 2016</q-item-label> -->
                  </q-item-section>
                  <!-- <q-item-section side>
                    <q-icon name="info" color="amber" />
                  </q-item-section> -->
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
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
          <q-card
            class="tarjeta__cuenta text-primary q-ma-sm"
            style="width: 350px"
          >
            <q-card-section>
              <!--  :class="{
                'bg-primary-grey': props.row.tipoCuenta.id === '1',
                'bg-accent ': props.row.tipoCuenta.id === '2',
                'bg-accent': props.row.tipoCuenta.id === '3',
                'text-white': true
              }" -->
              <div class="row q-gutter-x-lg">
                <!-- <q-icon :name="props.row.tipoCuenta.icon" size="30px" /> -->
                <q-img
                  :src="`/icons/${props.row.banco.icono}`"
                  width="40px"
                  height="40px"
                />
                <div class="column col">
                  <div class="text-h6">{{ props.row.nombre }}</div>
                  <div class="text-condensed text-grey-5 q-mt-xs">
                    {{ props.row.cuentaContable.nombreCompleto }}
                  </div>
                </div>
                <div class="">
                  <!--  :class="{
                    'text-accent-contrast': props.row.tipoCuenta.id === '1',
                    'text-yellow-3': props.row.tipoCuenta.id === '2',
                    'text-accent-contrast': props.row.tipoCuenta.id === '3',
                    'col-auto column items-center q-mx-md': true
                  }" -->
                  <q-btn color="accent" flat icon="more_vert" round dense>
                    <q-menu>
                      <q-list style="min-width: 100px">
                        <!-- <q-item
                        clickable
                        @click="mostrarMovimientos(props.row.id)"
                        v-close-popup
                      >
                        <q-item-section avatar>
                          <q-icon name="receipt" />
                        </q-item-section>
                        <q-item-section>Movimientos</q-item-section>
                      </q-item> -->
                        <q-item clickable @click="editRow(props)" v-close-popup>
                          <q-item-section avatar>
                            <q-icon name="edit" color="info"
                          /></q-item-section>
                          <q-item-section>Editar</q-item-section>
                        </q-item>
                        <q-separator />
                        <q-item
                          clickable
                          @click="deleteRow(props)"
                          v-close-popup
                        >
                          <q-item-section avatar>
                            <q-icon name="delete" color="negative"
                          /></q-item-section>
                          <q-item-section>Eliminar</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                  <!-- <span>{{ props.row.tipoCuenta.nombre }}</span> -->
                </div>
              </div>
            </q-card-section>
            <q-card-section>
              <div
                class="text-subtitle text-grey-8 text-bold q-mt-xs"
                align="right"
              >
                {{ formato.toCurrency(props.row.saldo) }}
              </div>
              <span class="cuenta__card--descripcion">
                {{ props.row.descripcion }}
              </span>
            </q-card-section>

            <!-- <q-separator inset /> -->

            <!-- <q-card-actions>
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
            </q-card-actions> -->
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
import { useFormato } from 'src/composables/utils/useFormato'

/**
 * composables
 */
const $q = useQuasar()
const notificacion = useNotificacion()
const formato = useFormato()

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
        (cuenta) => cuenta.tipoCuenta.id === '1'
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

<style lang="scss">
.cuenta__card--descripcion {
  font-size: 0.8rem !important;
  // color: rgb(85, 85, 103) !important;
  color: rgb(27, 61, 33) !important;
  letter-spacing: -0.025rem;
  font-weight: 600;
}
.text-condensed {
  letter-spacing: -0.025rem !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
}
</style>
