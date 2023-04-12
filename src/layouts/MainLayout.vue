<template>
  <q-layout view="hHh LpR lFr">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="font-title">
          Biweekly Application
        </q-toolbar-title>
        <span class="q-pr-sm" v-if="user">{{ user.email }}</span>
        <q-btn icon="account_circle" @click="onClickAccount" flat round>
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup @click="logout">
                <q-item-section>Cerrar Sesion</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section>Acerca de...</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      elevated
      class="bg-primary shadow-24"
    >
      <q-list class="shadow-15">
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.nombre"
          v-bind="link"
        >
        </EssentialLink>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLazyQuery } from '@vue/apollo-composable'
import { useSessionStore } from 'src/stores/sessionStore.js'
import { useRouter } from 'vue-router'
import { SessionStorage } from 'quasar'
import EssentialLink from 'src/components/EssentialLink.vue'
import { LISTA_MENUS } from 'src/graphql/menus'

/**
 * state
 */
const leftDrawerOpen = ref(false)
const user = ref(null)
const essentialLinks = ref([])

/**
 * stores
 */
const sessionStorage = useSessionStore()
const router = useRouter()
/**
 * graphql
 */
const {
  /*  result,
  loading,
  error,*/
  onResult: onResultCargarMenu,
  onError: onErrorCargarMenu,
  load: cargarMenu
} = useLazyQuery(LISTA_MENUS)

onResultCargarMenu(({ data }) => {
  if (!!data) {
    essentialLinks.value = JSON.parse(JSON.stringify(data.menuLevels))
  }
})

onErrorCargarMenu((error) => {
  console.error(error)
})

/**
 * onMounted
 */
onMounted(() => {
  user.value = SessionStorage.getItem('user')
  if (!!user.value) {
    cargarMenu(null, { usuarioId: user.value.id })
  } else {
    router.push('/login')
  }
})
/**
 * methods
 */
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function logout() {
  const promise = sessionStorage.logoutUser()
  if (promise) {
    promise.then(
      (result) => {
        router.push('/login')
      },
      (error) => {
        router.push('/login')
      }
    )
  }
}
function onClickAccount() {}

// onResult(({ data }) => {
//   essentialLinks.value = data.menuLevels;
// });
</script>
<style lang="scss">
.font-title {
  font-family: 'Lobster Two', cursive;
  font-size: 1.5rem;
}
.font-subtitle {
  // font-family: 'Lobster Two', cursive;
  // font-family: 'Assistant', sans-serif;
  // font-family: 'Monserrat Alternates', sans-serif;
  font-family: 'Sen', sans-serif;
  font-size: 1.5rem;
}
</style>
