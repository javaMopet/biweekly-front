<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";

import "../node_modules/@quasar/quasar-ui-qiconpicker/dist/icon-set/material-icons.umd.js";
import "../node_modules/@quasar/quasar-ui-qiconpicker/dist/icon-set/fontawesome-v5.umd";

export default defineComponent({
  name: "App",
});
</script>
