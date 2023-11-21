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
          :rows="cuentaStore.listaCuentasTarjeta"
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
            <div class="credit-card q-ma-sm">
              <div class="q-pa-sm">
                <q-inner-loading
                  class="card-loading"
                  :showing="loadingCard[props.rowIndex]"
                  style="border-radius: 20px"
                >
                  <q-spinner-ball size="90px" color="white" />
                </q-inner-loading>
                <div
                  class="row inline full-width items-center justify-between credit-card__title"
                  style="padding-left: 15px"
                >
                  <div
                    class="col text-bold text-subtitle1 q-py-sm"
                    @click="abrirMovimientos(props)"
                    style="cursor: pointer"
                  >
                    {{ props.row.nombre }}
                  </div>
                  <div class="row inline">
                    <q-btn
                      flat
                      round
                      icon="las la-edit"
                      class="button-edit"
                      color="primary"
                      @click="editRow(props)"
                    />
                    <q-btn
                      flat
                      round
                      icon="las la-trash-alt"
                      class="button-delete"
                      color="negative"
                      @click="deleteRow(props)"
                    />
                  </div>
                </div>
                <!-- images -->
                <div
                  class="row full-width justify-between items-center credit-card__images"
                  @click="abrirMovimientos(props)"
                >
                  <div class="">
                    <q-img src="/images/chip.png" width="46px" height="40px" />
                  </div>
                  <div
                    class="credit-card__images--logo"
                    @click="abrirMovimientos(props)"
                  >
                    <q-img
                      :src="`/icons/${props.row.banco?.icono ?? 'cash.png'}`"
                      width="60px"
                    />
                  </div>
                </div>
                <!-- temination number -->
                <div
                  class="row full-width justify-center"
                  style="cursor: pointer"
                >
                  <div
                    class="non-selectable q-py-xs text-blue-grey-10 text-h6"
                    @click="abrirMovimientos(props)"
                  >
                    **** **** **** {{ props.row.identificador }}
                  </div>
                </div>
              </div>
              <div class="row justify-between items-center q-px-lg q-pb-sm">
                <span class="text-caption text-blue-grey-1"
                  >HORACIO PEÑA MENDOZA</span
                >
                <q-item-label
                  align="right"
                  caption
                  lines="2"
                  class="text-blue-grey-2 text-bold text-h3"
                  ><span class="text-h6">{{
                    formato.toCurrency(props.row.saldo)
                  }}</span>
                </q-item-label>
              </div>
            </div>
          </template>
          <template #body-cell-icono="props">
            <q-icon :name="props.row.icono" size="35px" color="cyan" />
          </template>
        </q-table>
      </div>
    </div>

    <Teleport to="#modal">
      <q-dialog
        v-model="showFormItem"
        persistent
        transition-show="jump-up"
        transition-hide="jump-down"
      >
        <RegistroCuenta
          :edited-item="editedItem"
          @cuentaSaved="cuentaSaved"
          @cuentaUpdated="cuentaUpdated"
        ></RegistroCuenta>
      </q-dialog>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import RegistroCuenta from 'src/components/cuentas/RegistroCuenta.vue'
import { useQuasar } from 'quasar'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { useRouter } from 'vue-router'
import { useFormato } from 'src/composables/utils/useFormato'
import { useCuentaStore } from 'src/stores/common/useCuentaStore'
import { useRegistrosTarjetaCrud } from 'src/composables/useRegistrosTarjetaCrud'

/**
 * composables
 */
const $q = useQuasar()
const notificacion = useNotificacion()
const router = useRouter()
const formato = useFormato()
const cuentaStore = useCuentaStore()
const registrosTarjetaCrud = useRegistrosTarjetaCrud()

/**
 * state
 */
const loadingCard = ref([])
/**
 * GRAPHQL
 */
// const {
//   mutate: deleteCuenta,
//   onDone: onDoneDeleteCuenta,
//   onError: onErrorDeleteCuenta
// } = useMutation(CUENTA_DELETE)

registrosTarjetaCrud.onDoneRegistroTarjetaDelete(({ data }) => {
  if (!!data) {
    refetchListaCuentas()
    const deletedItem = data.cuentaDelete.cuenta
    mostrarNotificacion('elminó', deletedItem)
  }
})

registrosTarjetaCrud.onErrorRegistroTarjetaDelete((error) => {
  console.error(error)
  notificacion.mostrarNotificacionNegativa(
    'No es posible eliminar esta tarjeta de crédito debido a que tiene movimientos',
    1500
  )
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

/**
 * computed
 */

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
  showFormItem.value = true
}
function editRow(item) {
  editedItem.value = {
    ...item.row
  }
  showFormItem.value = true
}
function abrirMovimientos(props_row) {
  console.log('abriendo movimientos', props_row)
  loadingCard.value[props_row.rowIndex] = true
  router.push(
    `/tarjetas_credito/${props_row.row.id}?dia_corte=${props_row.row.diaCorte}`
  )
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
  // mostrarNotificacion('guardó', itemSaved)
}
function cuentaUpdated(itemUpdated) {
  showFormItem.value = false
  // mostrarNotificacion('actualizó', itemUpdated)
  editedItem.value = { ...defaultItem }
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
