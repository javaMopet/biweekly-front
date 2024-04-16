<template>
  <div
    class="fullscreen bg-image text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh; opacity: 0.6">403</div>

      <div class="text-h2" style="opacity: 0.9">
        Oops. You don’t have permission to access.
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="primary"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorForbidden'
})
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #6f8664 0%, #e4e5b2 100%);
}
</style>
