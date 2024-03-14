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
            <q-breadcrumbs-el label="Home" icon="home" to="/" />
            <q-breadcrumbs-el label="Usuarios" icon="account_balance" />
          </q-breadcrumbs>
        </div>
      </div>
      <q-toolbar-title> </q-toolbar-title>
    </q-toolbar>

    <div class="column q-mx-md">
      <div class="row fit">
        <q-table
          style="width: 100%"
          dense
          :rows="listaUsuarios"
          :columns="columns"
          row-key="id"
          :filter="filter"
          :rows-per-page-options="[0]"
          hide-pagination
        >
          <template #top-left>
            <div class="page-title">Usuarios</div>
          </template>
          <template #top-right>
            <div class="row inline items-center q-gutter-x-md">
              <div class="">
                <q-btn-dropdown
                  split
                  color="primary-button"
                  push
                  glossy
                  no-caps
                  label="Nuevo"
                  icon="add_circle"
                  @click="addRow(1)"
                  text-color="accent-light"
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
                        <q-item-label>Usuario de Ahorros</q-item-label>
                      </q-item-section>
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
                        <q-item-label>Usuario de Efectivo</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
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
            <q-card class="cuenta-card text-primary q-ma-sm" bordered>
              <q-inner-loading
                class="card-loading"
                :showing="loadingAccount[props.rowIndex]"
              >
                <q-spinner-ball size="70px" color="white" />
              </q-inner-loading>
              <q-card-section>
                <div
                  class="row justify-around q-gutter-x-lg q-pb-md"
                  @click="abrirMovimientos(props)"
                  style="cursor: pointer"
                >
                  <div class="col-2">
                    <q-avatar size="60px">
                      <q-img
                        :src="`/icons/${props.row.banco?.icono ?? 'cash.png'}`"
                        width="50px"
                        height="50px"
                      />
                    </q-avatar>
                  </div>
                  <div class="col-8" @click="abrirMovimientos(props)">
                    <div class="row cuenta-card__title">
                      {{ props.row.nombre }}
                    </div>
                    <div class="row cuenta__subtitle">
                      <div
                        class="fit flex flex-left text-left non-selectable"
                        v-if="props.row.identificador !== ''"
                      >
                        **** **** **** {{ props.row.identificador }}
                      </div>
                      <q-tooltip> Abrir movimientos </q-tooltip>
                    </div>
                    <div class="row text-condensed text-blue-grey-4">
                      {{ props.row.usuario.nombreCompleto }}
                    </div>
                  </div>
                  <div class="text-subtitle2 full-width" align="right">
                    {{ formato.toCurrency(props.row.saldo ?? 0) }}
                  </div>
                </div>
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
            :edited-item="editedItem"
            @registeredUser="userRegistered"
            @updatedUser="userUpdated"
          ></UserRegistrationForm>
        </q-dialog>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from 'vue'
import { useQuasar } from 'quasar'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { useFormato } from 'src/composables/utils/useFormato'
import { useRouter } from 'vue-router'
import { useUserService } from 'src/composables/admin/useUserService'
import UserRegistrationForm from 'src/components/admin/usuarios/UserRegistrationForm.vue'
import { userSessionService } from 'src/composables/login/useSessionService'

/**
 * composables
 */
const $q = useQuasar()
const notificacion = useNotificacion()
const formato = useFormato()
const router = useRouter()
const userService = useUserService()
// const usuariosCrud = useUsuariosCrud()
const sessionService = userSessionService()
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
const filter = ref()
const showFormItem = ref(false)
const editedItem = ref({ ...defaultItem })
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
  userService.loadUsers()
  // cuentaStore.loadOrRefetchListaUsuarios()
  // console.log(
  //   'onMounted UsuariosPage.vue',
  //   cuentaStore.listaUsuarios.length > 0
  // )
})

userService.onResulLoadUsers(({ data }) => {
  if (!!data) {
    console.log(
      '%csrc/pages/admin/UsuariosPage.vue:275 data',
      'color: #007acc;',
      data
    )
    listaUsuarios.value = JSON.parse(JSON.stringify(data.usersList))
  }
})

function addRow(tipoUsuarioId) {
  console.log('tipo de cuenta', tipoUsuarioId)
  editedItem.value = { ...defaultItem }
  editedItem.value.tipoUsuario.id = tipoUsuarioId.toString()
  showFormItem.value = true
}
/**
 * Iniciar la edición de un item.
 * @param {*} item
 */
function editItem(item) {
  editedItem.value = {
    ...item.row
  }
  console.log('iniciar edicion el item', editedItem.value)
  console.log('indice:', item.rowIndex)
  showFormItem.value = true
}

function abrirMovimientos(props_row) {
  loadingAccount.value[props_row.rowIndex] = true
  router.push(`/usuarios/${props_row.row.id}`)
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
      // usuariosCrud.cuentaDelete({ id: item.row.id })
    })
    .onCancel(() => {})
    .onDismiss(() => {})
}

// usuariosCrud.onDoneUsuarioDelete(({ data }) => {
//   const itemDeleted = data.cuentaDelete.cuenta
//   console.log('itemDeleted', itemDeleted)
//   notificacion.mostrarNotificacionPositiva(
//     `La cuenta ${itemDeleted.nombre} se eliminó correctamente`,
//     1400
//   )
// })

function userRegistered(itemSaved) {
  showFormItem.value = false
}
function userUpdated(itemUpdated) {
  showFormItem.value = false
  editedItem.value = { ...defaultItem }
}
</script>

<style lang="scss" scoped>
.cuenta-card {
  width: 350px;
  min-width: 340px;
  background: $main-background;
  border-radius: 10px;
  cursor: normal;

  &:hover {
    box-shadow: rgba(104, 102, 102, 0.76) 5px 14px 28px,
      rgba(112, 128, 173, 0.74) 5px 10px 10px;
    -webkit-font-smoothing: subpixel-antialiased;
    -webkit-transform: translateZ(0) scale(1, 1);
    background: #ffffff;
    transform: translate(-1px, -2px);
    transition: all 0.25s;
  }
  &__title {
    text-decoration: underline;
    font-size: 1.1rem;
    color: $dark;
  }
  &__acciones {
    border-top: 1px solid #d5dde4;
  }
}

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
  // text-decoration: underline;
}
</style>
