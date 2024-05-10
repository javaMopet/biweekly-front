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
        <span>{{ instanceName }}</span>
        <q-toolbar-title class="font-title"> </q-toolbar-title>
        <!-- <span class="q-pr-sm text-bold" v-if="user">{{ user.name }}</span> -->
        <!-- {{ user.id }} -->
        <q-btn
          icon-right="account_circle"
          @click="onClickAccount"
          size="1rem"
          :label="user.name"
          no-caps
          flat
          dense
        >
          <q-menu class="text-caption" fit>
            <q-list style="min-width: 170px">
              <q-item>
                <q-item-section top avatar>
                  <q-avatar
                    color="secondary"
                    text-color="white"
                    icon="las la-user-tie"
                    size="xl"
                    font-size="40px"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-bold">{{ user.name }}</q-item-label>
                  <q-item-label>{{ user.email }}</q-item-label>
                  <q-item-label class="text-bold" v-if="user.isAdmin">{{
                    'Administrador'
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator spaced horizontal />
              <q-item clickable v-close-popup @click="logout">
                <q-item-section top avatar>
                  <q-avatar
                    text-color="primary"
                    icon="logout"
                    font-size="25px"
                  />
                </q-item-section>
                <q-item-section class="text-subtitle2 text-primary"
                  >Cerrar Sesión</q-item-section
                >
              </q-item>
              <!-- <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section>Acerca de...</q-item-section>
              </q-item> -->
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
      <div
        class="column justify-baseline full-height"
        style="border: 0px solid green"
      >
        <div class="col-auto row justify-center" style="border: 0px solid red">
          <div class="application-title q-pa-lg">
            <q-img
              :src="logoPath"
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
        <div class="col-7" style="border: 0px solid aquamarine">
          <q-list class="no-shadow q-mt-lg">
            <EssentialLink
              v-for="link in menuStore.arbolMenus"
              :key="link.nombre"
              v-bind="link"
            >
            </EssentialLink>
          </q-list>
        </div>
        <!-- <div class="col-2 row items-end" style="border: 1px solid pink">
          <router-link to="/logout">logout</router-link>
        </div> -->
      </div>
    </q-drawer>

    <!-- <q-footer v-model="footer" reveal elevated bordered>
      <div class="" style="border: 1px solid red; height: 100%">
        <div class="">Footer</div>
      </div>
    </q-footer> -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { SessionStorage, useQuasar } from 'quasar'
import EssentialLink from 'src/components/EssentialLink.vue'
import { useSessionService } from 'src/composables/login/useSessionService'
import { useIdle } from '@vueuse/core'
import { useMenuStore } from 'src/stores/common/useMenuStore'

// const { idle, lastActive, reset } = useIdle(5 * 60 * 1000) // 5 min
const {
  idle: idleFirst,
  lastActive: lastAciveFirst,
  reset: resetFirst
} = useIdle(30 * 60 * 1000) // 2 min
const {
  idle: idleLast,
  lastActive: lastActiveLast,
  reset: resetLast
} = useIdle(31 * 60 * 1000) // 3 min

/**
 * composable
 */
const $q = useQuasar()
const sessionService = useSessionService()
const menuStore = useMenuStore()

/**
 * state
 */
const leftDrawerOpen = ref(false)
const user = ref({})
// const essentialLinks = ref([])
const instanceName = ref('')
const logoPath = ref('/icons/tree.png')
/**
 * stores
 */
// const sessionStorage = useSessionStore()
const router = useRouter()

/**
 * onMounted
 */
onMounted(() => {
  const credentials = SessionStorage.getItem('credentials') || undefined
  user.value = SessionStorage.getItem('current_user')
  console.log('user.value:', user.value.instance.logoImage)
  logoPath.value = '/icons/' + user.value.instance.logoImage
  // /icons/tree.png
  if (!user.value) router.push('login')

  instanceName.value = user.value.instance.name
})
/**
 * methods
 */
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function logout() {
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
          // console.log('%csrc/layouts/MainLayout.vue:22', 'color: #007acc;')
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
  // console.log('Session cerrada')
  router.push('/login')
})

// sessionService.onDoneUserLogout(() => {
//   throw NotImplementedException('NO implementado')
// })

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
