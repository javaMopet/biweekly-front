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
        <span class="q-pr-sm text-bold" v-if="user">{{ user.name }}</span>
        <!-- {{ user.id }} -->
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
      <!-- <p>Idle: {{ idleFirst }}</p>
      <p>IdleLast: {{ idleLast }}</p> -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useLazyQuery } from '@vue/apollo-composable'
import { useRouter } from 'vue-router'
import { SessionStorage, useQuasar } from 'quasar'
import EssentialLink from 'src/components/EssentialLink.vue'
import { LISTA_MENUS } from 'src/graphql/menus'
import { userSessionService } from 'src/composables/login/useSessionService'
import { useCounter, useIdle } from '@vueuse/core'

// const { idle, lastActive, reset } = useIdle(5 * 60 * 1000) // 5 min
const {
  idle: idleFirst,
  lastActive: lastAciveFirst,
  reset: resetFirst
} = useIdle(2 * 60 * 1000) // 2 min
const {
  idle: idleLast,
  lastActive: lastActiveLast,
  reset: resetLast
} = useIdle(3 * 60 * 1000) // 3 min

/**
 * composable
 */
const $q = useQuasar()
const sessionService = userSessionService()

/**
 * state
 */
const leftDrawerOpen = ref(false)
const user = ref(null)
const essentialLinks = ref([])

/**
 * stores
 */
// const sessionStorage = useSessionStore()
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
  const email = SessionStorage.getItem('credentials')?.email || undefined

  if (!email) router.push('/home')

  user.value = JSON.parse(SessionStorage.getItem('current_user'))

  if (!user.value) router.push('login')

  cargarMenu(null, { usuarioId: user.value.id })
})
/**
 * methods
 */
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function logout() {
  // const promise = sessionStorage.logoutUser()
  // if (promise) {
  //   promise.then(
  //     (result) => {
  //       router.push('/login')
  //     },
  //     (error) => {
  //       router.push('/login')
  //     }
  //   )
  // }
  sessionService.userLogout()
}
const dialogCloseSession = ref()

watch(idleFirst, (idlevalue) => {
  if (idlevalue) {
    if (!!dialogCloseSession.value) {
      console.log(
        '%csrc/layouts/MainLayout.vue:192 dialogcloesSession.value',
        'color: #007acc;',
        dialogCloseSession.value
      )
      // dialogCloseSession.value.show()
    } else {
      dialogCloseSession.value = $q
        .dialog({
          title: 'Confirmar',
          style: 'width:500px',
          message: ` ¿Desea cerra sessión?`,
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
          // dialogCloseSession.value.hide()
          // dialogCloseSession.value = null
        })
        .onCancel(() => {
          // dialogCloseSession.value.hide()
          // dialogCloseSession.value = null
        })
        .onDismiss(() => {
          // dialogCloseSession.value.hide()
          console.log('%csrc/layouts/MainLayout.vue:22', 'color: #007acc;')
          dialogCloseSession.value = null
        })
    }
    resetFirst()
  }
})

watch(idleLast, (idlevalue) => {
  if (idlevalue) {
    dialogCloseSession.value.hide()
    dialogCloseSession.value = null
    sessionService.userLogout()
  }
})

sessionService.onDoneUserLogout(() => {
  console.log('Session cerrada')
  router.push('/login')
})

sessionService.onDoneUserLogout(() => {
  throw NotImplementedException('NO implementado')
})

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
