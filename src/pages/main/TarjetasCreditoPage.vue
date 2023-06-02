<template>
  <div class="column q-ma-md" style="border: 0px solid red">
    <!-- <div class="row text-h5 text-secondary q-pa-md font-subtitle">
      TARJETAS DE CRÉDITO
    </div> -->

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
        <template #top-left>
          <q-btn
            color="primary"
            icon="add_card"
            rounded
            @click="addRow(3)"
            outline
            label="Nueva Tarjeta"
          />
          <!-- <q-btn-dropdown
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
          </q-btn-dropdown> -->
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
          <!--clase: tarjeta__cuenta -->
          <q-card
            class="q-ma-sm tarjeta__cuenta"
            outlined
            style="border: 0px solid red"
          >
            <!-- @click="mostrarMovimientos(props.row.id)" -->
            <q-item class="text-primary">
              <q-item-section avatar top>
                <q-icon name="credit_card" size="40px" color="orange-6" />
              </q-item-section>
              <q-item-section align="left">
                <q-item-label class="text-dark text-bold text-h6">
                  {{ props.row.nombre }}
                </q-item-label>
                <!-- <q-separator
                  spaced
                  inset
                  color="grey-5"
                  style="width: 100%; margin-left: 0px !important"
                /> -->
                <!-- <q-item-label caption lines="2" class="text-grey-7"></q-item-label> -->
                <router-link
                  :to="{ name: 'tarjetaCredito', params: { id: props.row.id } }"
                  class="tarjeta__credito--link"
                >
                  <div
                    class="fit flex flex-left text-left non-selectable q-py-sm"
                  >
                    **** **** {{ props.row.identificador }}
                  </div>
                  <q-tooltip> Abrir movimientos </q-tooltip>
                </router-link>

                <q-item-label
                  align="right"
                  caption
                  lines="2"
                  class="text-blue-grey-6 text-bold text-h3"
                  ><span class="text-h6">$ 1,800.00</span>
                </q-item-label>
              </q-item-section>
              <q-item-section
                side
                top
                cursor-pointer
                class="q-ml-md"
                @click.prevent
              >
                <q-btn color="dark" icon="more_horiz" flat dense>
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
                      <q-item clickable @click="deleteRow(props)" v-close-popup>
                        <q-item-section avatar>
                          <q-icon name="delete" color="negative"
                        /></q-item-section>
                        <q-item-section>Eliminar</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
                <!-- <q-icon
                  name="more_horiz"
                  color="dark"
                  cursor-pointer
                  clickable
                  outlined
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

            <!-- <q-separator inset color="grey-7" />
            <q-card-actions align="left">
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
import { useRouter } from 'vue-router'

/**
 * composables
 */
const $q = useQuasar()
const notificacion = useNotificacion()
const router = useRouter()

/**
 * state
 */

/**
 * GRAPHQL
 */
const graphql_options = ref({
  fetchPolicy: 'cache-and-network'
  // fetchPolicy: 'cache-only'
})
const {
  onError: onErrorListaCuentas,
  result: resultCuentas,
  refetch: refetchListaCuentas
} = useQuery(LISTA_CUENTAS, null, graphql_options)

const {
  mutate: deleteCuenta,
  onDone: onDoneDeleteCuenta,
  onError: onErrorDeleteCuenta
} = useMutation(CUENTA_DELETE)

onDoneDeleteCuenta(({ data }) => {
  if (!!data) {
    refetchListaCuentas()
    const deletedItem = data.cuentaDelete.cuenta
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
  identificador: null,
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
  }
  // {
  //   name: 'acciones',
  //   label: 'Acciones',
  //   field: 'action',
  //   sortable: false,
  //   align: 'center'
  // }
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
function mostrarMovimientos(value) {
  console.log('movimientos tarjeta', value)
  router.push(`/tarjetas_credito/${value}`)
}
</script>

<style lang="scss" scoped>
.tarjeta__credito--link {
  font-size: 0.85rem;
  color: #a19ba9 !important;
  text-decoration: underline !important;
  color: $dark;
  &:hover {
    text-decoration: underline !important;
    color: $dark !important;
  }
}
.tarjeta__cuenta {
  // border: 1px solid white !important;
  &:hover {
    // border: 1px solid red !important;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px,
      rgba(0, 0, 0, 0.22) 0px 10px 10px;
    transform: translate(-1px, -2px);
    transition: all 0.25s;
  }
}
</style>
