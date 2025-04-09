<template>
  <div class="my-card" style="width: 500px">
    <DialogTitle>{{ actionName }}</DialogTitle>
    <div class="column fit q-pa-lg items-center" style="border: 0px solid red">
      <q-form
        @submit="guardarUsuario"
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
          color="deep-orange"
          dense
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
          color="deep-orange"
          dense
        />
        <q-input
          v-model="authenticable.password"
          :type="isPwd ? 'password' : 'text'"
          label="Password"
          :rules="[(val) => !!val || 'Requerido']"
          v-if="!isEditing"
          clearable
          color="deep-orange"
          dense
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
          color="deep-orange"
          dense
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-select
          v-if="isSuperuser"
          v-model="authenticable.instances"
          :options="instanceStore.instanceList"
          label="Instancias"
          option-label="name"
          multiple
          use-chips
          hint="Selecciona una o más instancias"
          outlined
          color="primary-button"
          dense
        />
        <q-select
          v-if="isSuperuser"
          v-model="authenticable.roles"
          :options="rolesStore.roleList"
          label="Roles"
          option-label="name"
          multiple
          use-chips
          hint="Selecciona uno o más roles"
          outlined
          color="primary-button"
          dense
        />
        <!-- <q-checkbox
          v-if="isSuperuser"
          left-label
          v-model="authenticable.isAdmin"
          label="Is Admin: "
        /> -->

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
    <!-- <pre>{{ authenticable.roles }}</pre> -->
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
import { useInstanceStore } from 'src/stores/admin/useInstanceStore'
import { SessionStorage } from 'quasar'
import { useRoleStore } from 'src/stores/admin/useRoleStore'
// import { cleanAndCamelCase } from 'src/utils/cleanAndCamelCase'

/**
 * composables
 */
const { mostrarNotificacionPositiva, mostrarNotificacionNegativa } =
  useNotificacion()

const userService = useUserService()
const instanceStore = useInstanceStore()
const rolesStore = useRoleStore()

/**
 * state
 */
const defaultItem = {
  id: undefined,
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  isAdmin: false
}
const isPwd = ref(true)
const formItem = ref({ ...defaultItem })
const isAdminInitial = ref(false)

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
const isSuperuser = computed({
  get() {
    return SessionStorage.getItem('current_user').isSuperuser
  }
})

const authenticable = computed({
  get() {
    return props.userToEdit || formItem.value
  },
  set(val) {
    formItem.value = val
  }
})
const actionName = computed({
  get() {
    return authenticable.value.id ? 'Actualizar Usuario' : 'Nuevo Usuario'
  }
})
const isEditing = computed({
  get() {
    return authenticable.value.id ? true : false
  }
})
const lblSubmit = computed({
  get() {
    return authenticable.value.id ? 'Actualizar' : 'Registrar'
  }
})

/**
 * METHODS
 */

/**
 * Guardar o actualizar un usuario,
 * mandar a llamar en el servicio de usuarios.
 */
function guardarUsuario() {
  console.log('authenticable:', authenticable.value)
  console.log('isEditing.value:', isEditing.value)
  const instances = authenticable.value.instances.map((instance) => instance.id)
  const roles = authenticable.value.roles.map((role) => role.id)
  console.log('instances:', instances)
  if (!isEditing.value) {
    // const fieldsToRemove = ['__typename', 'logoImage', 'createdAt', 'name']
    const input = {
      ...authenticable.value,
      instances,
      roles
      // roles: cleanAndCamelCase(authenticable.value.roles, fieldsToRemove)
    }
    // const input = removeFields(authenticable.value, fieldsToRemove)
    console.log('autheticable.value input to register:', input)
    userService.userRegister(input)
  } else {
    const instances = authenticable.value.instances.map(
      (instance) => instance.id
    )
    const roles = authenticable.value.roles.map((role) => role.id)
    console.log('instances:', instances)
    console.log('roles:', roles)
    userService.userUpdate({
      id: authenticable.value.id,
      userInput: {
        name: authenticable.value.name
      },
      instances,
      roles
    })
    // if (isAdminInitial.value != authenticable.value.isAdmin) {
    //   if (authenticable.value.isAdmin) {
    //     console.log('actualizando admin role .......')
    //     userService.userAddRole({
    //       userId: authenticable.value.id,
    //       role: 'admin'
    //     })
    //   } else {
    //     console.log('removing admin role .......')
    //     userService.userRemoveRole({
    //       userId: authenticable.value.id,
    //       role: 'admin'
    //     })
    //   }
    // }
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
  mostrarNotificacionPositiva('El usuario se registró correctamente', 2500)
  emit('userRegistered', newUser)

  // console.log('userUpdate: actualizar usuario nombre .........')
  // userService.userUpdate({
  //   id: newUser.id,
  //   userInput: {
  //     name: authenticable.value.name,
  //     instanceId: authenticable.value.instance.id
  //   }
  // })
  // if (authenticable.value.isAdmin) {
  //   console.log('actualizando admin role .......')
  //   userService.userAddRole({
  //     userId: newUser.id,
  //     role: 'admin'
  //   })
  // }
})

userService.onDoneUserUpdate(({ data }) => {
  mostrarNotificacionPositiva('El usuario se registró correctamente', 2500)
  const newUser = data.userUpdate.user
  emit('userRegistered', newUser)
})

userService.onErrorUserRegister((error) => {
  mostrarNotificacionNegativa(
    `El usuario no puede ser registrado. ${error.message}`,
    2500
  )
})

userService.onErrorUserAddRole((error) => {
  console.log(`no se pudo cambiar el role del usuario. ${error.message}`)
})

/**
 * onMounted
 */
onMounted(() => {
  if (!isEditing.value) {
    authenticable.value.email = ''
    authenticable.value.password = ''
  }
  isAdminInitial.value = authenticable.value.isAdmin
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
