<template>
  <div class="">
    <q-toolbar class="" dense fit>
      <div class="row items-center q-ml-sm q-gutter-x-sm">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs
            class="breadcrum-component"
            active-color="primary"
            separator=">"
            separator-color="primary"
          >
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el
              label="Tarjetas de Crédito"
              icon="account_balance"
              to="/admin/cuentas"
            />
          </q-breadcrumbs>
        </div>
      </div>
      <q-toolbar-title> </q-toolbar-title>
    </q-toolbar>

    <div class="column q-mx-md">
      <div class="row fit">
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
            <div class="page-title">Tarjetas de crédito</div>
          </template>
          <template #top-right>
            <div class="row inline items-center q-gutter-x-md">
              <div class="">
                <q-btn
                  color="primary"
                  icon="add_card"
                  @click="addRow(3)"
                  label="Agregar"
                  no-caps
                  push
                  text-color="accent-light"
                  glossy
                />
              </div>
              <div class="bg-accent-light">
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
              </div>
            </div>
          </template>
          <template #item="props">
            <q-card class="tarjeta__cuenta q-ma-sm clickable" clickable>
              <q-inner-loading :showing="loadingCard[props.rowIndex]">
                <q-spinner-ball size="50px" color="primary" />
              </q-inner-loading>
              <q-card-section>
                <div class="column" style="border: 0px solid red">
                  <div
                    class="row inline fit items-center justify-between"
                    style="border: 0px solid yellow; padding-left: 15px"
                  >
                    <div
                      class="q-pl-md"
                      align="right"
                      style="border: 0px solid purple"
                      @click="abrirMovimientos(props)"
                    >
                      <q-item-label align="right" class="text-grey-2 text-bold">
                        {{ props.row.nombre }}
                      </q-item-label>
                    </div>
                    <div
                      class="col-2"
                      align="right"
                      style="border: 0px solid red"
                    >
                      <q-btn
                        color="grey-5"
                        icon="more_vert"
                        flat
                        dense
                        round
                        style="transform: translate(10px, -10px)"
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
                  <div class="column" style="border: 0px solid red">
                    <div
                      class="q-py-sm row inline justify-between items-center"
                      style="
                        padding-left: 10px;
                        padding-top: 20px;
                        padding-bottom: 10px;
                      "
                      @click="abrirMovimientos(props)"
                    >
                      <q-img
                        src="/images/chip.png"
                        width="46px"
                        height="40px"
                      />
                      <div class="q-pr-lg" @click="abrirMovimientos(props)">
                        <q-img
                          :src="`/icons/${
                            props.row.banco?.icono ?? 'cash.png'
                          }`"
                          width="60px"
                        />
                      </div>
                    </div>
                    <div
                      class="row inline justify-start"
                      style="border: 0px solid green; padding-left: 20px"
                    >
                      <div
                        class="non-selectable q-py-xs text-grey-4 text-h6"
                        @click="abrirMovimientos(props)"
                      >
                        **** **** **** {{ props.row.identificador }}
                      </div>
                      <q-tooltip> Abrir movimientos </q-tooltip>
                    </div>
                  </div>
                  <div
                    class="row justify-between items-center q-px-lg"
                    @click="abrirMovimientos(props)"
                  >
                    <span class="text-caption text-grey-6"
                      >HORACIO PEÑA MENDOZA</span
                    >
                    <q-item-label
                      align="right"
                      caption
                      lines="2"
                      class="text-blue-grey-3 text-bold text-h3"
                      ><span class="text-h6">{{
                        formato.toCurrency(props.row.saldo)
                      }}</span>
                    </q-item-label>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </template>
          <template #body-cell-icono="props">
            <q-icon :name="props.row.icono" size="35px" color="cyan" />
          </template>
        </q-table>
      </div>
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
import { useFormato } from 'src/composables/utils/useFormato'

/**
 * composables
 */
const $q = useQuasar()
const notificacion = useNotificacion()
const router = useRouter()
const formato = useFormato()

/**
 * state
 */
const loadingCard = ref([])
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
onMounted(() => {})

// onResultCuentas(({ data }) => {
//   if (!!data) {
//     console.log('response', data)
//     listaCuentas.value = JSON.parse(JSON.stringify(data.listaCuentas))
//   }
// })
/**
 * Methods
 */

/**
 *
 * @param {*} tipoCuentaId
 */
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
  loadingCard.value[props_row.rowIndex] = true
  router.push(`/tarjetas_credito/${props_row.row.id}`)
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
    1500
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

<style lang="scss">
.tarjeta__credito--link {
  font-size: 1rem;
  letter-spacing: -0.025rem;
  color: #a19ba9 !important;
  text-decoration: underline !important;
  color: $dark;
  &:hover {
    text-decoration: underline !important;
    color: $dark !important;
  }
}
</style>
