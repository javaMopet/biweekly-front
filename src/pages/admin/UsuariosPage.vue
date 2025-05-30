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
          :rows="usuarioStore.listaUsuarios"
          :columns="columns"
          row-key="id"
          :filter="filter"
          :rows-per-page-options="[0]"
          hide-pagination
          :loading="usuarioStore.loadingListaUsuarios"
          loading-label="Cargando lista de usuarios..."
        >
          <template #top-left>
            <div class="page-title">
              <span class="q-pr-md">Usuarios</span>
              <q-btn
                v-if="isModificable"
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
                      size="80px"
                      color="accent-light"
                    />
                  </div>
                  <div
                    class="col items-center q-pl-sm"
                    style="max-width: 220px; width: 220px"
                  >
                    <div class="text-bold" v-if="props.row.isSuperuser">
                      Superusuario
                    </div>
                    <div class="" v-else>&nbsp;</div>
                    <div class="text-bold" v-if="props.row.isAdmin">
                      Administrador
                    </div>
                    <div class="" v-else>&nbsp;</div>
                    <div class="text-primary">
                      {{ props.row.name }}
                    </div>
                    <!-- <div class="">{{ props.row.instance.name }}</div> -->
                    <div class="">
                      <span class="text-bold">Roles:</span>
                      {{ props.row.roles.map((rol) => rol.name).join(', ') }}
                    </div>
                    <router-link
                      :to="{
                        name: 'usuarioMenuConfig',
                        params: { id: props.row.id }
                      }"
                      >Configurar menú</router-link
                    >
                  </div>
                </div>
                <div class="row text-blue-8 text-bold justify-center q-pt-lg">
                  {{ props.row.email }}
                </div>
                <q-separator spaced inset horizontal />
                <div
                  class="row full-width items-center justify-between q-pt-sm cuenta-card__acciones"
                >
                  <div class="col" align="right" style="cursor: normal">
                    <q-btn
                      v-if="isModificable"
                      flat
                      round
                      icon="las la-edit"
                      class="button-edit"
                      @click="editItem(props)"
                      ><q-tooltip> Editar </q-tooltip></q-btn
                    >
                    <q-btn
                      v-if="isModificable"
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
        <router-view></router-view>
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
import { ref, onMounted, computed } from 'vue'
import { SessionStorage, useQuasar } from 'quasar'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { RouterLink } from 'vue-router'
import { useUserService } from 'src/composables/admin/useUserService'
import UserRegistrationForm from 'src/components/admin/usuarios/UserRegistrationForm.vue'
import { useUsuarioStore } from 'src/stores/admin/useUsuarioStore'

/**
 * composables
 */
const $q = useQuasar()
const { mostrarNotificacionPositiva, mostrarNotificacionNegativa } =
  useNotificacion()

const userService = useUserService()
const usuarioStore = useUsuarioStore()

/**
 * state
 */
const defaultItem = {
  id: null,
  nombre: null,
  tipoUsuario: {
    id: null
  },
  usuario: null,
  isAdmin: false
}

const userToEdit = ref({})
const filter = ref()
const showFormItem = ref(false)
// const userToEdit = ref({ ...defaultItem })
// const loadingAccount = ref([])

/**
 * computed
 */
const isModificable = computed({
  get() {
    return SessionStorage.getItem('current_user').canModify
  }
})
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
onMounted(() => {})

function addRow(tipoUsuarioId) {
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
  // console.log('userToEdit instances:', userToEdit.value.instances)
  // console.log('userToEdit roles:', userToEdit.value.roles)
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

/**
 * GRAPHQL
 */
userService.onDoneUserDelete(({ data }) => {
  const itemDeleted = data.userDelete.user
  console.log('itemDeleted', itemDeleted)
  mostrarNotificacionPositiva(
    `El usuario ${itemDeleted.name} se eliminó correctamente`,
    2100
  )
  usuarioStore.loadOrRefetchUsers()
})
userService.onErrorUserDelete((error) => {
  console.error('error', error)
  mostrarNotificacionNegativa(
    `Surgió un error al intentar eliminar el usuario.`,
    2100
  )
})
userService.onErrorUserUpdate((error) => {
  console.error('error', error)
  mostrarNotificacionNegativa(
    `Surgió un error al intentar actualizar el usuario.`,
    2100
  )
})

function userRegistered(/* itemSaved */) {
  showFormItem.value = false
  usuarioStore.loadOrRefetchUsers()
}

function userUpdated(/* itemUpdated */) {
  showFormItem.value = false
  userToEdit.value = { ...defaultItem }
}
</script>

<style lang="scss" scoped></style>
