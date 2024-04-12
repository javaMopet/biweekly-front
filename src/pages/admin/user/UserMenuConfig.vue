<template>
  <q-card class="my-card">
    <div>Configuración del menú para el usuario: {{ user?.name }}</div>
    <q-card-section>
      <div class="text-h6">Lista de menús</div>
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
          dense
          checked-icon="las la-laugh-wink"
          color="primary"
        />
      </div>
    </q-card-section>
    <q-card-section align="center">
      <q-btn color="accent" icon="save" label="Guardar" @click="guardar()" />
    </q-card-section>
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
import { useUsuarioStore } from 'src/stores/admin/useUsuarioStore'
import { useMenuStore } from 'src/stores/common/useMenuStore'
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const menuStore = useMenuStore()
const usuarioStore = useUsuarioStore()

const selection = ref([])
const user = ref({})

onMounted(() => {
  user.value = usuarioStore.listaUsuarios[0]
})

watch(
  () => route.params.id,
  (newValue, oldValue) => {
    console.log('newValue:', newValue)
    const index = usuarioStore.listaUsuarios.findIndex(
      (usuario) => usuario.id === newValue
    )
    console.log('index:', index)
    user.value = usuarioStore.listaUsuarios[index]
    console.log('user.value:', user.value)
    selection.value = user.value.menus.map((menu) => menu.id)
    console.log('selection:', selection)
  }
)

const isAdmin = computed({
  get() {
    return user.value?.isAdmin
  }
})
function guardar() {
  console.log('Guardando..')
}
</script>

<style lang="scss" scoped></style>
