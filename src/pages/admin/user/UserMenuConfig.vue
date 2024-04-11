<template>
  <q-card class="my-card">
    <div>menu config user {{ route.params.id }}</div>
    <q-card-section>
      <div class="text-h6">Our Changing Planet</div>
      <div class="text-subtitle2">by John Doe</div>
    </q-card-section>
    <q-card-section>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit
    </q-card-section>
  </q-card>

  <!-- <ul>
    <li v-for="menu in menuStore.listaMenus" :key="menu.id">
      {{ menu.nombre }}
      >
    </li>
  </ul> -->
  <div class="column">
    <q-checkbox
      v-model="selection"
      v-for="menu in menuStore.listaMenus"
      :key="menu.id"
      :label="menu.nombre"
      :val="menu.id"
      dense
    />
  </div>
  <!-- <pre>{{ menuStore.listaMenus }}</pre> -->
</template>

<script setup>
import { useUsuarioStore } from 'src/stores/admin/useUsuarioStore'
import { useMenuStore } from 'src/stores/common/useMenuStore'
import { ref, onMounted, watch } from 'vue'
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
    console.log('oldValue:', oldValue)
  }
)
</script>

<style lang="scss" scoped></style>
