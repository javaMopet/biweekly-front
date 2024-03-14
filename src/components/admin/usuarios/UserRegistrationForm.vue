<template>
  <div class="my-card" style="width: 500px">
    <DialogTitle>{{ actionName }}</DialogTitle>
    <div class="row fit q-pa-lg justify-center" style="border: 0px solid red">
      <q-form
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        @submit="registerUser"
        class="q-gutter-md"
        style="width: 75%"
      >
        <div>
          <div class="q-pt-md">
            <q-input
              v-model="authenticable.email"
              autocomplete="off"
              type="email"
              label="Email"
              class="fit"
              :rules="[(val) => !!val || 'Email required!']"
            />
          </div>
          <div class="row">
            <q-input
              v-model="authenticable.password"
              type="password"
              label="Password"
              class="fit"
              :rules="[(val) => !!val || 'Password required!']"
            />
          </div>
          <div class="row">
            <q-input
              v-model="authenticable.passwordConfirmation"
              type="password"
              label="Password Confirmation"
              class="fit"
              :rules="[(val) => !!val || 'Password Confirmation required!']"
            />
          </div>
          <div class="row">
            <q-input
              v-model="authenticable.name"
              type="text"
              label="Name"
              class="fit"
              :rules="[(val) => !!val || 'Name required!']"
            />
          </div>
        </div>
        <div class="col row justify-end q-pt-lg q-gutter-lg">
          <q-btn
            label="Cancelar"
            flat
            v-close-popup
            class="q-ml-sm"
            color="negative"
            no-caps
            rounded
          />
          <q-btn
            :label="lblSubmit"
            type="submit"
            color="primary-button"
            no-caps
          />
        </div>
      </q-form>
    </div>
  </div>

  <Teleport to="#modal">
    <q-dialog
      v-model="show_icon_picker"
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <IconPicker
        v-model="editedFormItem.icono"
        @onClose="cancelIconPicker"
        @onIconSelected="onIconSelected"
      ></IconPicker>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import IconPicker from '/src/components/IconPicker.vue'

import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { SessionStorage } from 'quasar'

import { useTipoMovimientoStore } from 'src/stores/common/useTipoMovimientoStore'
import DialogTitle from 'src/components/formComponents/modal/DialogTitle.vue'
import { useUserService } from 'src/composables/admin/useUserService'

/**
 * composables
 */
const { mostrarNotificacionPositiva, mostrarNotificacionNegativa } =
  useNotificacion()
const tipoMovimientoStore = useTipoMovimientoStore()

const userService = useUserService()

/**
 * state
 */
const defaultItem = {
  id: null,
  nombre: null,
  icono: 'insert_emoticon',
  descripcion: null,
  color: '#019A9D',
  tipoMovimiento: null,
  tipoMovimientoId: '2',
  cuentaContable: null
}
const formItem = ref({ ...defaultItem })
const ppproxy = ref(null)

const cuentaContableOptions = ref({
  cuentaContableSubnivel: 0,
  clasificacion: '',
  tipoAfectacion: 'C'
})

const authenticable = ref({
  email: '',
  password: '',
  name: ''
})

/**
 * props
 */
const props = defineProps({
  editedItem: {
    type: Object,
    required: false,
    default: () => {
      return {
        id: null
      }
    }
  },
  editedIndex: {
    type: Number,
    required: false,
    default: -1
  }
})
/**
 * emits
 */
const emit = defineEmits(['registeredUser', 'updatedUser'])
/**
 * computed
 */
const tiposMovimientoOptions = computed({
  get() {
    return (tiposMovimientoDao.listaTiposMovimiento.value ?? []).filter(
      (tipoMovimiento) => tipoMovimiento.id != '3'
    )
  }
})
const editedFormItem = computed({
  get() {
    return !!props.editedItem ? props.editedItem : formItem.value
  },
  set(val) {
    formItem.value = val
  }
})
const actionName = computed({
  get() {
    return !!editedFormItem.value.id ? 'Actualizar Usuario' : 'Nuevo Usuario'
  }
})
const isEditing = computed({
  get() {
    return !!editedFormItem.value.id
  }
})
const lblSubmit = computed({
  get() {
    return !!editedFormItem.value.id ? 'Actualizar' : 'Registrar'
  }
})
const color = new Map([
  ['1', 'ingreso-button'],
  ['2', 'egreso-button'],
  ['3', 'traspaso-button']
])

const active_color = computed({
  get() {
    return color.get(editedFormItem.value.tipoMovimientoId)
  }
})

/**
 * METHODS
 */

function onChangeTipoMovimiento(tipoMovimientoId) {
  console.log('cambio en el tipo de usuario', tipoMovimientoId)
  editedFormItem.value.cuentaContable = null
  obtenerCuentasContables(tipoMovimientoId)
}
function obtenerCuentasContables(tipoMovimientoId) {
  switch (tipoMovimientoId) {
    case '1': //Ingreso
      cuentaContableOptions.value.tipoAfectacion = 'A'
      break
    case '2': //Gasto
      cuentaContableOptions.value.tipoAfectacion = 'C'
      break
    case '3':
      break
    case '4': //Inversion
      cuentaContableOptions.value.tipoAfectacion = 'A'
      break
    default:
      break
  }
}
/**
 * Guardar o actualizar una categoría.
 */
function registerUser() {
  // console.log('registering user')

  // const input = {
  //   ...editedFormItem.value,
  //   cuentaContableId: parseInt(cuenta_contable_id),
  //   cuentaDefaultId: parseInt(cuentaDefaultId),
  //   tipoMovimientoId: parseInt(editedFormItem.value.tipoMovimientoId),
  //   importeDefault: parseFloat(editedFormItem.value.importeDefault ?? '0'),
  //   userId,
  //   orden: 1000,
  //   tipoMovimiento: undefined,
  //   cuentaContable: undefined,
  //   cuentaDefault: undefined,
  //   __typename: undefined
  // }
  // console.log('guardando item:', input)
  // if (!editedFormItem.value.id) {
  //   // usuarioCrud.usuarioCreate({ input })
  // } else {
  //   const id = editedFormItem.value.id
  //   // usuarioCrud.usuarioUpdate({ id, input })
  // }
  console.log('registrando usuario')
  userService.userRegister(authenticable.value)
}

userService.onDoneUserRegister(({ data }) => {
  console.log(
    '%csrc/components/admin/usuarios/UserRegistrationForm.vue:253 data',
    'color: #007acc;',
    data
  )
})

userService.onErrorUserRegister((error) => {
  console.log(
    '%csrc/components/admin/usuarios/UserRegistrationForm.vue:261 error',
    'color: #007acc;',
    error
  )
})

/**
 *
 */
// usuarioCrud.onDoneUsuarioCreate(({ data }) => {
//   if (!!data) {
//     const itemSaved = data.usuarioCreate.usuario
//     mostrarNotificacionPositiva(
//       `Categoría "${itemSaved.nombre}" creada correctamente.`,
//       1600
//     )
//     emit('usuarioSaved', itemSaved)
//   }
// })

// usuarioCrud.onDoneUsuarioUpdate(({ data }) => {
//   if (!!data) {
//     const itemUpdated = data.usuarioUpdate.usuario
//     mostrarNotificacionPositiva(
//       `Categoría "${itemUpdated.nombre}" actualizada correctamente.`,
//       1600
//     )
//     emit('usuarioUpdated', itemUpdated, props.editedIndex)
//   }
// })

// usuarioCrud.onErrorUsuarioCreate((error) => {
//   const nombreError = error.graphQLErrors[0]?.extensions?.nombre ?? null

//   const errorString = !!nombreError
//     ? 'No fue posible guardar la usuario. Ya existe una usuario con el nombre que intenta guardar'
//     : 'No fue posible guardar la usuario. Favor de intentar nuevamente'

//   mostrarNotificacionNegativa(errorString, 2100)
// })

// usuarioCrud.onErrorUsuarioUpdate((error) => {
//   const nombreError = error.graphQLErrors[0]?.extensions?.nombre ?? null

//   const errorString = !!nombreError
//     ? 'No fue posible guardar la usuario. Ya existe una usuario con el nombre que intenta guardar'
//     : 'No fue posible guardar la usuario. Favor de intentar nuevamente'

//   mostrarNotificacionNegativa(errorString, 2100)
// })

/**
 * onMounted
 */
onMounted(() => {
  obtenerCuentasContables(editedFormItem.value.tipoMovimientoId)
})

/**
 * GRAPHQL
 */
const options = ref({
  fetchPolicy: 'network-only'
})

/**
 * icon picker
 */
const show_icon_picker = ref(false)
function cancelIconPicker() {
  show_icon_picker.value = false
}
function selectIcon() {
  show_icon_picker.value = true
}
function onIconSelected(value) {
  console.log('IconoSeleccionado', value)
  editedFormItem.value.icono = value
  show_icon_picker.value = false
}
function colorSelecionado(value) {
  ppproxy.value.hide()
}
</script>

<style lang="scss" scoped>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  color: rgb(170, 27, 27) !important;
  -webkit-text-fill-color: white !important;
  -webkit-box-shadow: 0 0 0 1000px darken($color: $dark, $amount: 1) inset !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
}
</style>
