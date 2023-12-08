<template>
  <q-layout view="lHh LpR lFr">
    <q-header bordered class="bg-white text-accent" dense>
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="toggleLeftDrawer"
          class="float-right text-primary"
        />
        <!-- <q-img
          src="/icons/logoHorizontal3.png"
          spinner-color="primary"
          spinner-size="72px"
          width="380px"
        /> -->
        <q-toolbar-title class="font-title"> </q-toolbar-title>
        <span class="q-pr-sm text-bold" v-if="user"
          >{{ user.id }}{{ user.name }}</span
        >
        <q-btn
          icon="account_circle"
          @click="onClickAccount"
          flat
          round
          dense
          size="1.2rem"
        >
          <q-menu>
            <q-list style="min-width: 150px">
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
      class="bg-menu shadow-10"
    >
      <div class="" style="border: 0px solid red">
        <div class="application-title q-pa-lg" align="center">
          <q-img
            src="/icons/tree.png"
            spinner-color="primary"
            spinner-size="72px"
            width="120px"
          />
          <!-- <q-img
            src="/icons/logo.png"
            spinner-color="primary"
            spinner-size="72px"
            width="220px"
          /> -->
          <!-- <span class="font-title-letter text-secondary">B</span>iweekly
          Application -->
        </div>
      </div>
      <q-separator spaced inset horizontal color="blue-grey-5" />

      <q-list class="no-shadow q-mt-lg">
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
.application-title {
  font-family: 'Lobster Two', cursive;
  font-size: 2rem;
}
.font-title-letter {
  font-family: 'Lobster Two', cursive;
  font-size: 1.7rem !important;
}
.font-subtitle {
  //   font-family: 'Lobster Two', cursive;
  // font-family: 'Montserrat Alternates', sans-serif;
  // font-family: 'Roboto Flex', sans-serif;
  // font-family: 'Roboto Slab', serif;
  font-size: 1.5rem;
}
.bg-menu {
  background-color: $primary !important;
  color: #14153f;
  font-size: 0.95rem;
}
</style>
