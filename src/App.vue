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
  // font-family: 'Assistant', sans-serif;
  // font-family: 'Lobster Two', cursive;
  // font-family: 'Montserrat Alternates', sans-serif;
  // font-family: 'Sen', sans-serif;
  // font-family: 'IBM Plex Sans Condensed', sans-serif;
  font-family: 'Roboto Flex', sans-serif;
  // font-size: 0.95rem;
}
</style>
