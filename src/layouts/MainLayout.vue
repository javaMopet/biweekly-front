<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="text-white">
      <q-toolbar>
        <q-toolbar-title> Biweekly Application </q-toolbar-title>
        <span class="q-pr-sm" v-if="user">{{ user.email }}</span>
        <q-btn
          class="text-white"
          icon="account_circle"
          @click="onClick"
          flat
          round
        >
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
      <q-toolbar
        class="bg-white text-deep-purple-14 no-border no-outline"
        flat
        style="border: 0px solid"
      >
        <q-btn
          class="text-deep-purple-14"
          label="Configuración"
          flat
          icon="settings"
        >
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item
                icon="print"
                clickable
                v-close-popup
                @click="router.push('/main/usuarios')"
              >
                <q-item-section icon="print">Usuarios</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Catálogo de Cuentas</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable>
                <q-item-section>Preferences</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>

                <q-menu anchor="top end" self="top start">
                  <q-list>
                    <q-item v-for="n in 3" :key="n" dense clickable>
                      <q-item-section>Submenu Label</q-item-section>
                      <q-item-section side>
                        <q-icon name="keyboard_arrow_right" />
                      </q-item-section>
                      <q-menu auto-close anchor="top end" self="top start">
                        <q-list>
                          <q-item v-for="n in 3" :key="n" dense clickable>
                            <q-item-section>3rd level Label</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section>Quit</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn
          class="text-deep-purple-14"
          label="Administración"
          flat
          icon="menu"
        >
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section>Open...</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>New</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable>
                <q-item-section>Preferences</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>

                <q-menu anchor="top end" self="top start">
                  <q-list>
                    <q-item v-for="n in 3" :key="n" dense clickable>
                      <q-item-section>Submenu Label</q-item-section>
                      <q-item-section side>
                        <q-icon name="keyboard_arrow_right" />
                      </q-item-section>
                      <q-menu auto-close anchor="top end" self="top start">
                        <q-list>
                          <q-item v-for="n in 3" :key="n" dense clickable>
                            <q-item-section>3rd level Label</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section>Quit</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { defineComponent, ref, onMounted } from "vue";
import { useSessionStore } from "src/stores/sessionStore.js";
import { useRouter } from "vue-router";
import { SessionStorage } from "quasar";

/**
 * state
 */
const user = ref(null);
const filter = ref("");
const iconSet = ref("fontawesome-v5");
const name = ref("nombre");
const tags = ref([]);
const value = ref();

const pagination = ref({
  itemsPerPage: 60,
  page: 0,
});

const leftDrawerOpen = ref(false);

/**
 * stores
 */
const sessionStorage = useSessionStore();
const router = useRouter();

/**
 * onMounted
 */
onMounted(() => {
  user.value = SessionStorage.getItem("user");
});

function onClick() {}
function logout() {
  const promise = sessionStorage.logoutUser();
  if (promise) {
    promise.then(
      (result) => {
        router.push("/login");
      },
      (error) => {}
    );
  }
}
</script>
