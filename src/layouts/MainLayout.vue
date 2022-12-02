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
      <!--
  Animenu
  -------
  https://github.com/catalinred/animenu
  https://twitter.com/catalinred
-->

      <nav class="animenu" role="navigation" aria-label="Menu">
        <button class="animenu__btn" type="button">
          <span class="animenu__btn__bar"></span>
          <span class="animenu__btn__bar"></span>
          <span class="animenu__btn__bar"></span>
        </button>

        <ul class="animenu__nav">
          <li><a href="#">Home</a></li>
          <li>
            <a href="#" class="animenu__nav__hasDropdown" aria-haspopup="true"
              >Archive</a
            >
            <ul class="animenu__nav__dropdown" aria-label="submenu" role="menu">
              <li><a href="#" role="menuitem">Sub Item 1</a></li>
              <li><a href="#" role="menuitem">Sub Item 2</a></li>
              <li><a href="#" role="menuitem">Sub Item 3</a></li>
            </ul>
          </li>
          <li>
            <a href="#" class="animenu__nav__hasDropdown" aria-haspopup="true"
              >Categories</a
            >
            <ul class="animenu__nav__dropdown" aria-label="submenu" role="menu">
              <li><a href="#" role="menuitem">Sub Item 1</a></li>
              <li><a href="#" role="menuitem">Sub Item 2</a></li>
              <li><a href="#" role="menuitem">Sub Item 3</a></li>
            </ul>
          </li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
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
<style lang="scss">
// Animenu
// -------
// https://github.com/catalinred/animenu
// https://twitter.com/catalinred

// Variables
$baseMenuBackground: #111; // Base color theme
$secondaryMenuBackground: #0186ba; // Secondary color (highlights, triangles...)
$gutter: 10px; // Base gutter

// Latest CSS box model
*,
*:after,
*:before {
  box-sizing: border-box;
}

// The classic hamburger icon
// <button class="animenu__btn">
//   <span class="animenu__btn__bar"></span>
//   <span class="animenu__btn__bar"></span>
//   <span class="animenu__btn__bar"></span>
// </button>
.animenu__btn {
  display: none;
  cursor: pointer;
  background-color: $baseMenuBackground;
  border: 0;
  padding: 10px;
  height: 40px;
  width: 40px;

  &:hover {
    background-color: $secondaryMenuBackground;
  }
}

.animenu__btn__bar {
  display: block;
  width: 20px;
  height: 2px;
  background-color: #fff;
  transition: 0.15s cubic-bezier(0.75, -0.55, 0.25, 1.55);

  & + .animenu__btn__bar {
    margin-top: 4px;
  }
}

.animenu__btn--active {
  .animenu__btn__bar {
    margin: 0;
    position: absolute;

    &:nth-child(1) {
      transform: rotate(45deg);
    }

    &:nth-child(2) {
      opacity: 0;
    }

    &:nth-child(3) {
      transform: rotate(-45deg);
    }
  }
}

// Clear some defaults
.animenu {
  display: block;
  ul {
    padding: 0;
    list-style: none;
    font: 0 -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  }

  li,
  a {
    display: inline-block;
    font-size: 15px;
  }

  a {
    color: lighten($baseMenuBackground, 60%);
    text-decoration: none;
  }
}

// First level -> main menu items
// <nav class="animenu">
//    <ul class="animenu__nav">
//    ...
//    </ul>
//  </nav>
.animenu__nav {
  background-color: $baseMenuBackground;

  > li {
    position: relative;
    border-right: 1px solid lighten($baseMenuBackground, 20%);

    > a {
      padding: $gutter 3 * $gutter;
      text-transform: uppercase;
    }

    &:hover {
      > ul {
        opacity: 1;
        visibility: visible;
        margin: 0;
      }

      > a {
        color: #fff;
      }
    }

    // Duplicate stuff due to
    // https://www.w3.org/TR/2018/PR-selectors-3-20180911/#grouping
    &:focus-within {
      > ul {
        opacity: 1;
        visibility: visible;
        margin: 0;
      }

      > a {
        color: #fff;
      }
    }
  }

  &__hasDropdown:before {
    content: "";
    position: absolute;
    border: 4px solid transparent;
    border-bottom: 0;
    border-top-color: currentColor;
    top: 50%;
    margin-top: -2px;
    right: 10px;
  }
}

// Second level
// <nav class="animenu">
//    <ul class="animenu__nav">
//      <li>
//        <ul class="animenu__nav__dropdown"></ul>
//      </li>
//    </ul>
//  </nav>
.animenu__nav__dropdown {
  min-width: 100%;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  opacity: 0;
  visibility: hidden;
  margin: 2 * $gutter 0 0 0;
  background-color: lighten($baseMenuBackground, 15%);
  transition: margin 0.15s, opacity 0.15s;

  > li {
    width: 100%;
    border-bottom: 1px solid lighten($baseMenuBackground, 25%);

    &:first-child > a:after {
      content: "";
      position: absolute;
      height: 0;
      width: 0;
      left: 1em;
      top: -6px;
      border: 6px solid transparent;
      border-top: 0;
      border-bottom-color: inherit;
    }

    &:last-child {
      border: 0;
    }
  }

  a {
    padding: $gutter;
    width: 100%;
    border-color: lighten($baseMenuBackground, 15%);

    &:hover {
      background-color: $secondaryMenuBackground;
      border-color: $secondaryMenuBackground;
      color: #fff;
    }

    // Duplicate stuff due to
    // https://www.w3.org/TR/2018/PR-selectors-3-20180911/#grouping
    &:focus-within {
      background-color: $secondaryMenuBackground;
      border-color: $secondaryMenuBackground;
      color: #fff;
    }
  }
}

// The main breakpoint is 767px
// Adjust the first and second levels display
@media screen and (max-width: 767px) {
  .animenu__btn {
    display: inline-block;
  }

  .animenu__nav,
  .animenu__nav__dropdown {
    display: none;
  }

  // First level -> main menu items
  // <nav class="animenu">
  //    <ul class="animenu__nav">
  //    ...
  //    </ul>
  //  </nav>
  .animenu__nav {
    margin: $gutter 0;

    > li {
      width: 100%;
      border-right: 0;
      border-bottom: 1px solid lighten($baseMenuBackground, 25%);

      &:last-child {
        border: 0;
      }

      &:first-child > a:after {
        content: "";
        position: absolute;
        height: 0;
        width: 0;
        left: 1em;
        top: -6px;
        border: 6px solid transparent;
        border-top: 0;
        border-bottom-color: inherit;
      }

      > a {
        width: 100%;
        padding: $gutter;
        border-color: $baseMenuBackground;
        position: relative; //dropdown caret
      }
    }

    a:hover {
      background-color: $secondaryMenuBackground;
      border-color: $secondaryMenuBackground;
      color: #fff;
    }
  }

  // Second level
  // <nav class="animenu">
  //    <ul class="animenu__nav">
  //      <li>
  //        <ul class="animenu__nav__dropdown"></ul>
  //      </li>
  //    </ul>
  //  </nav>
  .animenu__nav__dropdown {
    position: static;
    background-color: lighten($baseMenuBackground, 15%);
    margin: 0;
    transition: none;
    visibility: visible;
    opacity: 1;

    > li:first-child > a:after {
      content: none;
    }

    a {
      padding-left: 2 * $gutter;
      width: 100%;
    }
  }
}

// Expanding the animenu
// <nav class="animenu">
//    <ul class="animenu__nav animenu__nav--active">
//      <li>
//        <ul class="animenu__nav__dropdown"></ul>
//      </li>
//    </ul>
//  </nav>
.animenu__nav--active {
  display: block !important;

  & .animenu__nav__dropdown {
    display: block;
  }
}
</style>
