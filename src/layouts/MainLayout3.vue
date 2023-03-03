<template>
  <q-layout view="hHh lpR lFf">
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
    </q-header>

    <q-page-container>
      <div class="row q-pt-lg">
        <div style="border: 0px solid red; width: 70px" />
        <div>
          <!-- <div class="area">area</div> -->
          <nav class="main-menu q-pt-xl">
            <ul>
              <li>
                <!-- <a href="/main">
                  <i class="fa fa-home fa-2x"></i>
                  <span class="nav-text"> Dashboard </span>
                </a> -->
                <q-item clickable v-ripple dense to="/main" class="text-white">
                  <q-item-section>
                    <q-icon name="fa fa-home fa-2x" />
                  </q-item-section>
                  <q-item-section class="nav-text">Dashboard</q-item-section>
                </q-item>
              </li>
              <li class="has-subnav">
                <!-- <a href="/main/catalogos">
                  <i class="fa fa-laptop fa-2x"></i>
                  <span class="nav-text"> Catálogos </span>
                </a> -->
                <q-item
                  clickable
                  v-ripple
                  dense
                  to="/main/catalogos"
                  class="text-white"
                >
                  <q-item-section>
                    <q-icon name="fa fa-laptop fa-3x" />
                  </q-item-section>
                  <q-item-section class="nav-text">Catálogos</q-item-section>
                </q-item>
              </li>
              <li class="has-subnav">
                <a href="#">
                  <i class="fa fa-list fa-2x"></i>
                  <span class="nav-text"> Forms </span>
                </a>
              </li>
              <li class="has-subnav">
                <a href="#">
                  <i class="fa fa-folder-open fa-2x"></i>
                  <span class="nav-text"> Pages </span>
                </a>
              </li>
              <li>
                <a href="#">
                  <i class="fa fa-bar-chart-o fa-2x"></i>
                  <span class="nav-text"> Graphs and Statistics </span>
                </a>
              </li>
              <li>
                <a href="#">
                  <i class="fa fa-font fa-2x"></i>
                  <span class="nav-text"> Quotes </span>
                </a>
              </li>
              <li>
                <a href="#">
                  <i class="fa fa-table fa-2x"></i>
                  <span class="nav-text"> Tables </span>
                </a>
              </li>
              <li>
                <a href="#">
                  <i class="fa fa-map-marker fa-2x"></i>
                  <span class="nav-text"> Maps </span>
                </a>
              </li>
              <li>
                <a href="#">
                  <i class="fa fa-info fa-2x"></i>
                  <span class="nav-text"> Documentation </span>
                </a>
              </li>
            </ul>

            <ul class="logout">
              <li>
                <a href="#">
                  <i class="fa fa-power-off fa-2x"></i>
                  <span class="nav-text"> Logout </span>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div style="height: 92vh; width: 93vw; border: 0px solid">
          <router-view />
        </div>
      </div>
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

<style>
@import url(//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css);

@import url(https://fonts.googleapis.com/css?family=Titillium+Web:300);
.fa-2x {
  font-size: 2em;
}
.fa {
  position: relative;
  display: table-cell;
  width: 60px;
  height: 36px;
  text-align: center;
  vertical-align: middle;
  font-size: 20px;
}

.main-menu:hover,
nav.main-menu.expanded {
  width: 250px;
  overflow: visible;
}

.main-menu {
  background: #2a2533;
  border-right: 1px solid #e5e5e5;
  position: absolute;
  top: 0;
  bottom: 0;
  height: 100%;
  left: 0;
  width: 60px;
  overflow: hidden;
  -webkit-transition: width 0.15s linear;
  transition: width 0.15s linear;
  -webkit-transform: translateZ(0) scale(1, 1);
  z-index: 1000;
}

.main-menu > ul {
  margin: 7px 0;
}

.main-menu li {
  position: relative;
  display: block;
  width: 250px;
}

.main-menu li > a {
  position: relative;
  display: table;
  border-collapse: collapse;
  border-spacing: 0;
  color: #999;
  font-family: arial;
  font-size: 14px;
  text-decoration: none;
  -webkit-transform: translateZ(0) scale(1, 1);
  -webkit-transition: all 0.15s linear;
  transition: all 0.15s linear;
}

.main-menu .nav-icon {
  position: relative;
  display: table-cell;
  width: 60px;
  height: 36px;
  text-align: center;
  vertical-align: middle;
  font-size: 18px;
}

.main-menu .nav-text {
  position: relative;
  display: table-cell;
  vertical-align: middle;
  width: 190px;
  font-family: "Titillium Web", sans-serif;
}

.main-menu > ul.logout {
  position: absolute;
  left: 0;
  bottom: 0;
}

.no-touch .scrollable.hover {
  overflow-y: hidden;
}

.no-touch .scrollable.hover:hover {
  overflow-y: auto;
  overflow: visible;
}

a:hover,
a:focus {
  text-decoration: none;
}

nav {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}

nav ul,
nav li {
  outline: 0;
  margin: 0;
  padding: 0;
}
.main-menu li:hover > a,
nav.main-menu li.active > a,
.dropdown-menu > li > a:hover,
.dropdown-menu > li > a:focus,
.dropdown-menu > .active > a,
.dropdown-menu > .active > a:hover,
.dropdown-menu > .active > a:focus,
.no-touch .dashboard-page nav.dashboard-menu ul li:hover a,
.dashboard-page nav.dashboard-menu ul li.active a {
  color: #fff;
  background-color: #5fa2db;
}
.area {
  float: left;
  background: #e2e2e2;
  width: 100%;
  height: 100%;
}
@font-face {
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 300;
  src: local("Titillium WebLight"), local("TitilliumWeb-Light"),
    url(http://themes.googleusercontent.com/static/fonts/titilliumweb/v2/anMUvcNT0H1YN4FII8wpr24bNCNEoFTpS2BTjF6FB5E.woff)
      format("woff");
}
</style>
