<!-- ComponenteHijo.vue -->
<template>
  <div>
    <p>{{ mensaje }}</p>
  </div>
</template>

<script>
export default {
  setup() {
    const mensaje = 'Hola desde el componente hijo'

    const metodoEnHijo = () => {
      console.log('Método en el componente hijo llamado')
    }

    return {
      metodoEnHijo
    }
  }
}
</script>
