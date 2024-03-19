<template>
  <div class="my-card" style="width: 500px">
    <DialogTitle>{{ actionName }}</DialogTitle>
    <div class="column fit q-pa-lg items-center" style="border: 0px solid red">
      <q-form
        @submit="registerUser"
        class="column q-gutter-md"
        style="width: 75%"
        autocomplete="off"
      >
        <q-input
          v-model="authenticable.name"
          type="text"
          label="Nombre"
          stack-label
          clearable
          class="fit"
          :rules="[(val) => !!val || 'Nombre requerido.']"
        />
        <!-- standout="bg-contrast" -->
        <q-input
          v-model="authenticable.email"
          clearable
          autocomplete="false"
          type="email"
          label="Email"
          stack-label
          class="fit"
          :rules="[(val) => !!val || 'Email required!']"
          :readonly="isEditing"
        />
        <q-input
          v-model="authenticable.password"
          :type="isPwd ? 'password' : 'text'"
          label="Password"
          :rules="[(val) => !!val || 'Requerido']"
          v-if="!isEditing"
          clearable
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-input
          v-model="authenticable.passwordConfirmation"
          :type="isPwd ? 'password' : 'text'"
          label="Password Confirmation"
          :rules="[
            (val) => !!val || 'Campo requerido.',
            (val) =>
              val === authenticable.password ||
              'Password Confirmation doesn\'t match'
          ]"
          v-if="!isEditing"
          clearable
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

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
import DialogTitle from 'src/components/formComponents/modal/DialogTitle.vue'
import { useUserService } from 'src/composables/admin/useUserService'

/**
 * composables
 */
const { mostrarNotificacionPositiva, mostrarNotificacionNegativa } =
  useNotificacion()

const userService = useUserService()

/**
 * state
 */
const defaultItem = {
  id: undefined,
  name: '',
  email: '',
  password: '',
  passwordConfirmation: ''
}
const isPwd = ref(true)
const formItem = ref({ ...defaultItem })

/**
 * props
 */
const props = defineProps({
  userToEdit: {
    type: Object,
    required: false,
    default: () => {
      return {
        id: null
      }
    }
  }
})
/**
 * emits
 */
const emit = defineEmits(['userRegistered', 'updatedUser'])
/**
 * computed
 */
const authenticable = computed({
  get() {
    return !!props.userToEdit ? props.userToEdit : formItem.value
  },
  set(val) {
    formItem.value = val
  }
})
const actionName = computed({
  get() {
    return !!authenticable.value.id ? 'Actualizar Usuario' : 'Nuevo Usuario'
  }
})
const isEditing = computed({
  get() {
    return !!authenticable.value.id
  }
})
const lblSubmit = computed({
  get() {
    return !!authenticable.value.id ? 'Actualizar' : 'Registrar'
  }
})

/**
 * METHODS
 */

/**
 * Guardar o actualizar un usuario,
 * mandar a llamar en el servicio de usuarios.
 */
function registerUser() {
  if (!isEditing.value) {
    // if (isFormValid()) {
    userService.userRegister(authenticable.value)
    // }
  } else {
    userService.userUpdate({
      id: authenticable.value.id,
      userInput: {
        name: authenticable.value.name
      }
    })
  }
}
// function isFormValid() {
//   if (
//     authenticable.value.password !== authenticable.value.passwordConfirmation
//   ) {
//     mostrarNotificacionNegativa("",  2100)
//     return false
//   }
//   return true
// }

userService.onDoneUserRegister(({ data }) => {
  const newUser = data.userRegister.authenticatable

  userService.userUpdate({
    id: newUser.id,
    userInput: { name: authenticable.value.name }
  })
})

userService.onDoneUserUpdate(({ data }) => {
  mostrarNotificacionPositiva('El usuario se registró correctamente', 2500)
  const newUser = data.userUpdate.user
  emit('userRegistered', newUser)
})

userService.onErrorUserRegister((error) => {
  mostrarNotificacionNegativa('El usuario no puede ser registrado', 2500)
})

/**
 * onMounted
 */
onMounted(() => {
  if (!isEditing.value) {
    authenticable.value.email = ''
    authenticable.value.password = ''
  }
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

function onIconSelected(value) {
  console.log('IconoSeleccionado', value)
  authenticable.value.icono = value
  show_icon_picker.value = false
}
</script>

<style lang="scss" scoped>
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
}
</style>
