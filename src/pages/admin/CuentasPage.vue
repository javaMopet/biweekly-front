<template>
  <div class="">
    <q-toolbar class="" dense fit>
      <div class="row items-center q-ml-sm q-gutter-x-sm">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs
            class="breadcrum_clase"
            active-color="primary"
            separator=">"
            separator-color="primary"
          >
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el label="Cuentas" icon="account_balance" />
          </q-breadcrumbs>
        </div>
      </div>
      <q-toolbar-title> </q-toolbar-title>
    </q-toolbar>
    <div class="page-title"></div>
    <div class="column q-mx-md" style="border: 0px solid red">
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
                color="secondary-button"
                push
                glossy
                no-caps
                label="Agregar"
                @click="addRow(1)"
                text-color="accent-light"
                dense
              >
                <q-list class="bg-primary-light">
                  <q-item clickable v-close-popup @click="addRow(1)">
                    <q-item-section avatar>
                      <q-avatar
                        icon="account_balance"
                        color="primary"
                        text-color="white"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Cuenta de Ahorros</q-item-label>
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
                      <q-item-label>Cuenta de Efectivo</q-item-label>
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
            <q-card class="tarjeta__cuenta text-primary q-ma-sm clickable">
              <q-card-section>
                <div class="row q-gutter-x-lg">
                  <div class="column" @click="abrirMovimientos(props)">
                    <q-avatar size="60px">
                      <q-img
                        :src="`/icons/${props.row.banco?.icono ?? 'cash.png'}`"
                        width="50px"
                        height="50px"
                      />
                    </q-avatar>
                  </div>
                  <div class="column" @click="abrirMovimientos(props)">
                    <div class="row cuenta__title">
                      {{ props.row.nombre }}
                    </div>
                    <div class="row cuenta__subtitle">
                      <!-- **** **** **** {{ props.row.identificador }} -->
                      <!-- <router-link
                      :to="{
                        name: 'cuenta',
                        params: { id: props.row.id }
                      }"
                      class="tarjeta__credito--link cuenta__subtitle"
                    > -->
                      <div
                        class="fit flex flex-left text-left non-selectable"
                        v-if="props.row.identificador !== ''"
                      >
                        **** **** **** {{ props.row.identificador }}
                      </div>
                      <q-tooltip> Abrir movimientos </q-tooltip>
                      <!-- </router-link> -->
                    </div>
                    <div class="row text-condensed text-blue-grey-4">
                      {{ props.row.cuentaContable.nombreCompleto }}
                    </div>
                  </div>
                  <div class="column">
                    <q-btn
                      color="more-button"
                      flat
                      icon="more_vert"
                      round
                      dense
                    >
                      <q-menu>
                        <q-list style="min-width: 100px">
                          <q-item
                            clickable
                            @click="editRow(props)"
                            v-close-popup
                          >
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
                  </div>
                </div>
                <div
                  class="row inline"
                  style="border: 0px solid red; width: 100%"
                  @click="abrirMovimientos(props)"
                >
                  <q-item-label
                    style="border: 0px solid red; width: 100%"
                    caption
                    class="text-blue-grey-6 text-bold"
                    align="right"
                  >
                    <span class="text-h6">
                      {{ formato.toCurrency(props.row.saldo) }}
                    </span>
                  </q-item-label>
                </div>
              </q-card-section>

              <!-- <q-card-section>
              <div
                class="text-subtitle text-grey-8 text-bold q-mt-xs"
                align="right"
              ></div>
              <span class="cuenta__card--descripcion"> </span>
            </q-card-section> -->

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
import { useRouter } from 'vue-router'

/**
 * composables
 */
const $q = useQuasar()
const notificacion = useNotificacion()
const formato = useFormato()
const router = useRouter()

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
    console.log('item deleted ', data)
    const deletedItem = data.cuentaDelete.cuenta
    listaCuentas.value.splice(rowIndexDelete.value, 1)
    rowIndexDelete.value = null
    mostrarNotificacion('elminó', deletedItem)
    refetchListaCuentas()
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
        (cuenta) => cuenta.tipoCuenta.id !== '3'
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
function abrirMovimientos(props_row) {
  router.push(`/cuentas/${props_row.row.id}`)
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
  refetchListaCuentas()
}
function cuentaUpdated(itemUpdated) {
  showFormItem.value = false
  mostrarNotificacion('actualizó', itemUpdated)
  listaCuentas.value[editedIndex.value] = itemUpdated
  editedItem.value = { ...defaultItem }
  editedIndex.value = null
  refetchListaCuentas()
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
.cuenta__title {
  letter-spacing: -0.025rem !important;
  font-size: 1.2rem;
  font-weight: 600;
}
.cuenta__subtitle {
  letter-spacing: -0.025rem !important;
  font-size: 0.75rem;
  font-weight: 400;
  color: $positive !important;
  // background-color: $primary;
}
</style>
