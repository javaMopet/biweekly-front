<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'

import '../node_modules/@quasar/quasar-ui-qiconpicker/dist/icon-set/material-icons.umd.js'
import '../node_modules/@quasar/quasar-ui-qiconpicker/dist/icon-set/fontawesome-v5.umd'

export default defineComponent({
  name: 'App'
})
</script>

<style lang="scss">
html,
body {
  margin: 0;
  font-family: Open Sans;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #67748e;
  background-color: #fff;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
</style>
