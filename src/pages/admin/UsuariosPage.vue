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
            <q-breadcrumbs-el label="Home" icon="home" to="/home" />
            <q-breadcrumbs-el label="Usuarios" icon="account_balance" />
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
          card
          dense
          :rows="listaUsuarios"
          :columns="columns"
          row-key="id"
          :filter="filter"
          :rows-per-page-options="[0]"
          hide-pagination
        >
          <template #top-left>
            <div class="page-title">
              <span class="q-pr-md">Usuarios</span>
              <q-btn
                icon="add_circle"
                color="primary-button"
                label="Add User"
                @click="addRow"
                no-caps
              />
            </div>
          </template>
          <template #top-right>
            <div class="row inline items-center q-gutter-x-md q-py-md">
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
            <q-card class="cuenta-card text-primary q-ma-sm">
              <q-card-section>
                <div class="row inline items-center">
                  <div class="col-auto">
                    <q-icon
                      name="account_box"
                      size="60px"
                      color="accent-light"
                    />
                  </div>
                  <div
                    class="col items-center"
                    style="max-width: 200px; width: 200px"
                  >
                    <div class="text-primary q-pl-sm">
                      {{ props.row.name }}
                    </div>
                  </div>
                </div>
                <div class="row text-blue-grey-5 justify-center">
                  {{ props.row.email }}
                </div>
                <q-separator spaced inset horizontal />
                <div
                  class="row full-width items-center justify-between q-pt-sm cuenta-card__acciones"
                >
                  <div class="col" align="right" style="cursor: normal">
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
                      @click="deleteRow(props)"
                    />
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
          v-model="showFormItem"
          persistent
          transition-show="jump-up"
          transition-hide="jump-down"
        >
          <UserRegistrationForm
            :userToEdit="userToEdit"
            @userRegistered="userRegistered"
            @updatedUser="userUpdated"
          ></UserRegistrationForm>
        </q-dialog>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { useFormato } from 'src/composables/utils/useFormato'
import { useRouter } from 'vue-router'
import { useUserService } from 'src/composables/admin/useUserService'
import UserRegistrationForm from 'src/components/admin/usuarios/UserRegistrationForm.vue'
import { useSessionService } from 'src/composables/login/useSessionService'

/**
 * composables
 */
const $q = useQuasar()
const { mostrarNotificacionPositiva, mostrarNotificacionNegativa } =
  useNotificacion()
const formato = useFormato()
const router = useRouter()
const userService = useUserService()
// const usuariosCrud = useUsuariosCrud()
const sessionService = useSessionService()
/**
 * GRAPHQL
 */
// usuariosCrud.onErrorUsuarioDelete((error) => {
//   notificacion.mostrarNotificacionNegativa(
//     'No es posible eliminar esta cuenta, favor de verificar que no contenga movimientos',
//     1600
//   )
// })
/**
 * state
 */
const defaultItem = {
  id: null,
  nombre: null,
  tipoUsuario: {
    id: null
  },
  usuario: null
}
// const listaUsuarios = ref([])
const userToEdit = ref({})
const filter = ref()
const showFormItem = ref(false)
// const userToEdit = ref({ ...defaultItem })
const loadingAccount = ref([])
const listaUsuarios = ref([])

/**
 * computed
 */

/**
 * Columns
 */
const columns = [
  // { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
  {
    name: 'email',
    label: 'Email',
    field: 'email',
    sortable: true,
    align: 'left'
  },
  {
    name: 'nombre',
    label: 'Nombre',
    field: 'name',
    sortable: true,
    align: 'left'
  },
  {
    name: 'createdAt',
    label: 'Fecha creación',
    field: 'createdAt',
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
  userService.loadOrRefetchUsers()
})

userService.onResulLoadUsers(({ data }) => {
  listaUsuarios.value.length = 0
  if (!!data) {
    listaUsuarios.value = JSON.parse(JSON.stringify(data.usersList))
  }
})

function addRow(tipoUsuarioId) {
  console.log('tipo de cuenta', tipoUsuarioId)
  userToEdit.value = { ...defaultItem }
  userToEdit.value.tipoUsuario.id = tipoUsuarioId.toString()
  showFormItem.value = true
}
/**
 * Iniciar la edición de un item.
 * @param {*} item
 */
function editItem(item) {
  userToEdit.value = {
    ...item.row
  }
  console.log('iniciar edicion el item', userToEdit.value)
  console.log('indice:', item.rowIndex)
  showFormItem.value = true
}

function deleteRow(item) {
  $q.dialog({
    title: 'Confirmar',
    style: 'width:500px',
    message: `Está a punto de eliminar el usuario "${item.row.name}" \n¿Desea continuar con la eliminación?`,
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
      userService.userDelete({ id: item.row.id })
    })
    .onCancel(() => {})
    .onDismiss(() => {})
}

userService.onDoneUserDelete(({ data }) => {
  const itemDeleted = data.userDelete.user
  console.log('itemDeleted', itemDeleted)
  mostrarNotificacionPositiva(
    `El usuario ${itemDeleted.name} se eliminó correctamente`,
    2100
  )
  userService.loadOrRefetchUsers()
})

function userRegistered(itemSaved) {
  showFormItem.value = false
  userService.loadOrRefetchUsers()
}
function userUpdated(itemUpdated) {
  showFormItem.value = false
  userToEdit.value = { ...defaultItem }
}
</script>

<style lang="scss" scoped></style>
