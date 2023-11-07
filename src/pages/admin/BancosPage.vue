<template>
  <q-toolbar class="" dense fit>
    <div class="row items-center q-ml-sm q-gutter-x-sm">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs
          class="breadcrum-component"
          active-color="primary"
          separator=">"
          separator-color="primary"
        >
          <q-breadcrumbs-el label="Home" icon="home" to="/home" />
          <q-breadcrumbs-el label="Bancos" icon="account_balance" />
        </q-breadcrumbs>
      </div>
    </div>
    <q-toolbar-title> </q-toolbar-title>
  </q-toolbar>
  <div class="column q-mx-md" style="border: 0px solid red">
    <div class="row fit" style="border: 0px solid red">
      <q-table
        grid
        style="width: 100%"
        dense
        :rows="listaBancos"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :rows-per-page-options="[0]"
        hide-pagination
      >
        <template #top-left>
          <div class="page-title">Bancos</div>
        </template>
        <template v-slot:top-right>
          <div class="q-pa-md">
            <q-btn
              color="primary"
              label="Nuevo"
              @click="addItem"
              push
              glossy
              no-caps
              text-color="white"
            />
          </div>
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
          <q-card class="text-primary q-ma-sm" style="width: 290px">
            <q-card-section>
              <div class="row q-gutter-x-lg items-center">
                <div class="column">
                  <q-img :src="`/icons/${props.row.icono}`" width="50px" />
                </div>
                <div class="column" style="width: 125px">
                  <!-- <div class="row cuenta__title"> -->
                  {{ props.row.nombre }}
                  <!-- </div> -->
                  <div class="row cuenta__subtitle"></div>
                </div>
                <div class="column">
                  <q-btn color="more-button" flat icon="more_vert" round dense>
                    <q-menu>
                      <q-list style="min-width: 100px">
                        <q-item
                          clickable
                          @click="editItem(props)"
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
            </q-card-section>
          </q-card>
        </template>
        <template #body-cell-icono="props">
          <q-icon :name="props.row.icono" size="35px" color="cyan" />
        </template>
      </q-table>
    </div>

    <Teleport to="#modal">
      <q-dialog
        v-model="showFormRegisterItem"
        persistent
        transition-show="jump-up"
        transition-hide="jump-down"
      >
        <FormRegistroBanco
          :edited-item="editedItem"
          @itemSaved="itemSaved"
          @itemUpdated="itemUpdated"
        ></FormRegistroBanco>
      </q-dialog>
    </Teleport>
  </div>
</template>

<script setup>
import { useQuery, useMutation } from '@vue/apollo-composable'
import { ref, computed, onMounted } from 'vue'
import { LISTA_BANCOS, BANCO_DELETE } from '/src/graphql/bancos'
import { useQuasar } from 'quasar'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { useFormato } from 'src/composables/utils/useFormato'
import FormRegistroBanco from 'src/components/bancos/FormRegistroBanco.vue'

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
const {
  onError: onErrorListaBancos,
  result: resultListaBancos,
  refetch: refetchListaBancos
} = useQuery(LISTA_BANCOS, null, graphql_options)

const {
  mutate: deleteBanco,
  onDone: onDoneDeleteBanco,
  onError: onErrorDeleteBanco
} = useMutation(BANCO_DELETE)

onDoneDeleteBanco(({ data }) => {
  if (!!data) {
    console.log('item deleted ', data)
    const deletedItem = data.bancoDelete.banco
    mostrarNotificacion('elminó', deletedItem)
    refetchListaBancos()
  }
})
onErrorDeleteBanco((error) => {
  console.error(error)
})
onErrorListaBancos((error) => {
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
const showFormRegisterItem = ref(false)
const editedItem = ref({ ...defaultItem })
const editedIndex = ref(null)
const rowIndexDelete = ref(null)

/**
 * computed
 */
const listaBancos = computed({
  get() {
    return resultListaBancos.value?.listaBancos ?? []
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

function addItem() {
  editedItem.value = {}
  showFormRegisterItem.value = true
}
function editItem(item) {
  editedItem.value = {
    ...item.row
  }
  editedIndex.value = item.rowIndex
  console.log(editedItem.value)
  showFormRegisterItem.value = true
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
      deleteBanco({ id: item.row.id })
    })
    .onCancel(() => {})
    .onDismiss(() => {})
}

function itemSaved(itemSaved) {
  showFormRegisterItem.value = false
  mostrarNotificacion('guardó', itemSaved)
  refetchListaBancos()
}
function itemUpdated(itemUpdated) {
  showFormRegisterItem.value = false
  mostrarNotificacion('actualizó', itemUpdated)
  editedItem.value = { ...defaultItem }
  refetchListaBancos()
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
.cuenta__subtitle {
  letter-spacing: -0.025rem !important;
  font-size: 0.75rem;
  font-weight: 400;
  color: $positive !important;
  // background-color: $primary;
}
</style>
