<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'

// Se reemplaza por la importacion en el index.html
// if (process.env.NODE_ENV === 'development') {
//   import(
//     '../node_modules/@quasar/quasar-ui-qiconpicker/dist/icon-set/material-icons.umd.js'
//   )
//   import(
//     '../node_modules/@quasar/quasar-ui-qiconpicker/dist/icon-set/fontawesome-v5.umd.js'
//   )
// }

export default defineComponent({
  name: 'App'
})
</script>

<style lang="scss">
html,
body {
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  // font-size: 14px; // se establece el tamaño de rem
  font-weight: 400;
  line-height: 1.5;
  color: #67748e;
  background-color: #f2f2f2;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
</style>
