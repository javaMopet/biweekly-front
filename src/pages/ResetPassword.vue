<template>
  <div>reseteando el password</div>
  <pre>{{ route.params.reset_password_token }}</pre>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'

const route = useRoute()

onMounted(() => {
  console.log('route.params.reset_password_token:', route.query)
})
</script>

<style lang="scss" scoped></style>
