<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Quasar App </q-toolbar-title>

        <q-icon name="fa-regular fa-file-pdf" size="25px" />
        <q-icon name="fa-solid fa-fire-extinguisher" />
        <q-icon name="fa-solid fa-barcode" />

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container>
      <!-- <q-icon-picker
        v-model="name"
        :filter="filter"
        :tags="tags"
        font-size="3em"
        tooltips
        @tags="onTags"
        style="height: calc(100vh - 140px)"
      /> -->
      <q-icon-picker
        v-model="value"
        :icon-set="iconSet"
        v-model:pagination="pagination"
        style="height: 220px"
      />

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useQuasar } from "quasar";
import { matMenu } from "@quasar/extras/material-icons";

const filter = ref("");
const iconSet = ref("fontawesome-v5");
const name = ref("nombre");
const tags = ref([]);
const value = ref();

const pagination = ref({
  itemsPerPage: 60,
  page: 0,
});

function onTags(tags) {
  if (this.loaded !== true) {
    let cats = [];
    let t = [...tags];
    cats.splice(0, 0, ...t);
    this.categories.splice(0, this.categories.length, ...cats);
    this.categories.concat(...cats);
    this.categories.forEach((cat) => {
      this.$set(this.selected, cat, false);
    });
    this.loaded = true;
  }
}

const linksList = [
  {
    title: "Docs",
    caption: "quasar.dev",
    icon: "school",
    link: "https://quasar.dev",
  },
  {
    title: "Github",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "https://github.com/quasarframework",
  },
  {
    title: "Discord Chat Channel",
    caption: "chat.quasar.dev",
    icon: "chat",
    link: "https://chat.quasar.dev",
  },
  {
    title: "Forum",
    caption: "forum.quasar.dev",
    icon: "record_voice_over",
    link: "https://forum.quasar.dev",
  },
  {
    title: "Twitter",
    caption: "@quasarframework",
    icon: "rss_feed",
    link: "https://twitter.quasar.dev",
  },
  {
    title: "Facebook",
    caption: "@QuasarFramework",
    icon: "public",
    link: "https://facebook.quasar.dev",
  },
  {
    title: "Quasar Awesome",
    caption: "Community Quasar projects",
    icon: "favorite",
    link: "https://awesome.quasar.dev",
  },
];

const leftDrawerOpen = ref(false);
</script>
