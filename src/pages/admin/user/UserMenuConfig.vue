<template>
  <q-card class="my-card">
    <q-card-section class="text-h6">
      <span
        >Configurar el menú del usuario:&nbsp;
        <span class="text-bold">{{ user?.name }}</span></span
      >
    </q-card-section>
    <q-card-section>
      <div class="">Lista de opciones:</div>
      <!-- <div class="text-subtitle2">by John Doe</div> -->
    </q-card-section>
    <q-card-section>
      <div class="column">
        <q-checkbox
          :disable="isAdmin"
          v-model="selection"
          v-for="menu in menuStore.listaMenus"
          :key="menu.id"
          :label="menu.nombre"
          :val="menu.id"
          checked-icon="las la-check-circle"
          unchecked-icon="la la-circle"
          color="secondary"
        />
      </div>
    </q-card-section>
    <q-card-section align="center">
      <q-btn
        color="primary"
        icon="save"
        label="Guardar"
        @click="guardar()"
        :disable="!isDataChanged"
      />
    </q-card-section>
    <!-- <q-card-section>
      <pre>{{ user?.menus?.map((menu) => menu.id) }}</pre>
      <pre>{{ selection }}</pre>
    </q-card-section> -->
    <pre>{{ stringSelection }}</pre>
    <pre>{{ isDataChanged }}</pre>
  </q-card>

  <!-- <ul>
    <li v-for="menu in menuStore.listaMenus" :key="menu.id">
      {{ menu.nombre }}
      >
    </li>
  </ul> -->

  <!-- <pre>{{ menuStore.listaMenus }}</pre> -->
</template>

<script setup>
import { useUserService } from 'src/composables/admin/useUserService'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { useUsuarioStore } from 'src/stores/admin/useUsuarioStore'
import { useMenuStore } from 'src/stores/common/useMenuStore'
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const menuStore = useMenuStore()
const userService = useUserService()
const usuarioStore = useUsuarioStore()
const { mostrarNotificacionPositiva, mostrarNotificacionNegativa } =
  useNotificacion()

const selection = ref([])
const user = ref({})

onMounted(() => {
  // user.value = usuarioStore.listaUsuarios[0]
  console.log('onMounted')
  inicilizar(route.params.id)
})
usuarioStore.onResultUsersList(() => {
  inicilizar(route.params.id)
})

watch(
  () => route.params.id,
  (newValue, oldValue) => {
    inicilizar(newValue)
  }
)
function inicilizar(newValue) {
  // console.log('newValue:', newValue)
  // console.log('usuarioStore.listaUsuarios:', usuarioStore.listaUsuarios)
  const index = usuarioStore.listaUsuarios.findIndex(
    (usuario) => usuario.id === newValue
  )
  // console.log('index:', index)
  user.value = usuarioStore.listaUsuarios[index]
  // console.log('user.value:', user.value)
  selection.value = user.value?.menus.map((menu) => menu.id)
  // console.table(selection.value)
}
/**
 * computed
 */
const isAdmin = computed({
  get() {
    return user.value?.isAdmin
  }
})
const isDataChanged = computed({
  get() {
    let listaInicial = user.value?.menus?.map((menu) => menu.id).sort() || []
    return !(JSON.stringify(listaInicial) === stringSelection.value)
  }
})
const stringSelection = computed({
  get() {
    let sSelection = selection.value || []
    return JSON.stringify(sSelection.sort())
  }
})
/**
 * methods
 */
function guardar() {
  if (isDataChanged.value) {
    // console.log('guardar')
    saveDataMenus()
  }
  // else {
  //   // console.log('no hacer nada')
  // }
}
function saveDataMenus() {
  let cambios = []
  menuStore.listaMenus.forEach((menu) => {
    const oldValue = user.value.menus.map((menu) => menu.id).includes(menu.id)
    const newValue = selection.value.includes(menu.id)
    if (oldValue !== newValue) {
      cambios.push({ menuId: menu.id, checked: newValue })
    }
  })

  userService.userMenuUpdate({ id: user.value.id, menuInput: cambios })
}

userService.onDoneUserMenuUpdate(({ data }) => {
  mostrarNotificacionPositiva('Cambios guardados correctamente.', 1900)
})
userService.onErrorUserMenuUpdate((error) => {
  mostrarNotificacionNegativa(
    'Ocurrió un error al intentar actualizar el menú para el usuario',
    1900
  )
})
</script>

<style lang="scss" scoped></style>
