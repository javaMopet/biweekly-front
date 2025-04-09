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
          <q-breadcrumbs-el label="Instances" icon="account_balance" />
        </q-breadcrumbs>
      </div>
    </div>
    <q-toolbar-title> </q-toolbar-title>
  </q-toolbar>
  <div class="column q-mx-md" style="border: 0px solid red">
    <div class="row fit" style="border: 0px solid red">
      <q-table
        style="width: 100%"
        :rows="instanceStore.instanceList"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :rows-per-page-options="[0]"
        hide-pagination
        :loading="instanceStore.loadingListaInstances"
        loading-label="Cargando lista de instances..."
      >
        <template #top-left>
          <div class="page-title">Instances</div>
        </template>
        <template v-slot:top-right>
          <div class="q-pa-md">
            <q-btn
              color="primary-button"
              label="Nuevo"
              @click="addItem"
              push
              glossy
              no-caps
              text-color="accent-light"
              icon="add_circle"
            />
          </div>
          <q-input
            outlined
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar Cuenta"
            clearable
            class="bg-accent-light"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template #item="props">
          <q-card
            v-if="!props.row.deleted"
            class="bg-white my-card q-ma-sm"
            flat
            bordered
            style="width: 220px"
          >
            <q-card-section class="q-pa-md">
              <div class="row items-center items-between no-wrap">
                <div
                  class=""
                  style="height: 60px; max-height: 60px; min-height: 60px"
                >
                  <q-img :src="`/icons/${props.row.icono}`" width="50px" />
                </div>
                <div class="q-ml-md" style="text-wrap: balance">
                  {{ props.row.nombre }}
                </div>
              </div>
            </q-card-section>
            <q-card-actions
              align="right"
              style="border-top: 1px solid #cccccc"
              class="q-py-xs"
            >
              <q-btn
                flat
                round
                icon="las la-edit"
                class="button-edit"
                @click="editItem(props)"
                ><q-tooltip> Editar </q-tooltip></q-btn
              >
              <q-btn
                flat
                round
                icon="las la-trash-alt"
                class="button-delete"
                @click="deleteItem(props)"
              />
              <!-- <q-btn flat round color="primary" icon="share" /> -->
            </q-card-actions>
          </q-card>
        </template>
        <template #body-cell-icono="props">
          <q-icon :name="props.row.icono" size="35px" color="cyan" />
        </template>
        <template #body-cell-acciones="props">
          <q-td :props="props" class="q-gutter-x-md">
            <q-btn
              icon="las la-edit"
              class="button-edit"
              dense
              @click="editItem(props)"
              flat
            />
            <q-btn
              icon="las la-trash-alt"
              class="button-delete"
              dense
              @click="deleteItem(props)"
              flat
            />
          </q-td>
        </template>
      </q-table>
      <!-- <pre>Bad:
      <span v-for="(error, i) of instancesCrud.error.graphQLErrors" :key="i">
        {{ error.message }}
      </span>
    </pre> -->
    </div>

    <Teleport to="#modal">
      <q-dialog
        v-model="showFormRegisterItem"
        persistent
        transition-show="jump-up"
        transition-hide="jump-down"
      >
        <FormInstanceRegistration
          :edited-item="editedItem"
          @itemSaved="itemSaved"
          @itemUpdated="itemUpdated"
        ></FormInstanceRegistration>
      </q-dialog>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { toast } from 'vue3-toastify'
import FormInstanceRegistration from 'src/components/admin/instances/FormInstanceRegistration.vue'
import { useInstanceService } from 'src/composables/admin/useInstanceService'
import { useInstanceStore } from 'src/stores/admin/useInstanceStore'

/**
 * composables
 */
const $q = useQuasar()
// const notificacion = useNotificacion()
// const instancesCrud = useInstancesCrud()
const instanceStore = useInstanceStore()
const instanceService = useInstanceService()
const { /* mostrarNotificacionNegativa,  */ mostrarNotificacionPositiva } =
  useNotificacion()

/**
 * GRAPHQL
 */

instanceService.onDoneInstanceDelete(({ data }) => {
  if (data) {
    const deletedItem = data.instanceDelete.instance
    console.log('deletedItem:', deletedItem)
    mostrarNotificacionPositiva(
      `La instancia "${deletedItem.name}" se elimininó correctamente`,
      1500
    )
  }
})

instanceService.onErrorInstanceDelete((error) => {
  const errorString = error?.toString() ?? ''
  const mensaje = errorString.includes('REFERENCE constraint')
    ? 'La instancia ha sido utilizado en alguna cuenta, no es posible eliminar'
    : 'No es posible eliminar esta instancia, favor de verificar.'

  // mostrarNotificacionNegativa(mensaje, 1600)
  toast.error(mensaje, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 4000,
    theme: 'dark'
  })
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

const filter = ref()
const showFormRegisterItem = ref(false)
const editedItem = ref({ ...defaultItem })
const editedIndex = ref(null)
const rowIndexDelete = ref(null)

/**
 *
 */
const columns = [
  { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
  {
    name: 'name',
    label: 'Nombre',
    field: 'name',
    sortable: true,
    align: 'left'
  },
  {
    name: 'dominio',
    label: 'Dominio',
    field: 'dominio',
    sortable: false,
    align: 'left'
  },
  {
    name: 'logo',
    label: 'Logo - Imagen',
    field: 'logoImage',
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
// fetchPolicy: 'cache-first'
// fetchPolicy: 'cache-and-network'
// fetchPolicy: 'network-only'
// Lo utilizamos con un no-cache para que no se guarde la lista en cache
// sino más bien en el store de la aplicacion
// const graphlOptions = reactive({
//   fetchPolicy: 'no-cache'
// })

onMounted(() => {
  // Las variables en el segundo
  // Las options se colocan en el 3er parámetro
  // loadListaInstances(null, { id: null }, graphlOptions)
})

function addItem() {
  editedItem.value = {}
  showFormRegisterItem.value = true
}
function editItem(item) {
  editedItem.value = {
    ...item.row
  }
  editedIndex.value = item.rowIndex
  showFormRegisterItem.value = true
}

function deleteItem(item) {
  rowIndexDelete.value = item.rowIndex
  $q.dialog({
    title: 'Confirmar',
    style: 'width:500px',
    message: `Está a punto de eliminar la instancia "${item.row.name}" ¿Está seguro que desea continuar con la eliminación?`,
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
      instanceService.instanceDelete(
        { id: item.row.id },
        // ,{ refetchQueries: ['listaInstances'] }
        null,
        {
          errorPolicy: 'all'
        }
      )
    })
    .onCancel(() => {})
    .onDismiss(() => {})
}

function itemSaved(/* itemSaved */) {
  showFormRegisterItem.value = false
}
function itemUpdated(/* itemUpdated */) {
  showFormRegisterItem.value = false
  editedItem.value = { ...defaultItem }
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
