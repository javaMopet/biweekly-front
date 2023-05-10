<template>
  <div>
    <div v-if="children.length == 0">
      <q-item
        clickable
        v-ripple
        :inset-level="nivel / 2"
        dense
        :to="'/' + ruta"
        active-class="text-primary bg-grey-2 text-bold q-py-sm q-mx-xs rounded-borders"
        class="text-accent q-py-sm q-mx-xs"
      >
        <q-item-section avatar>
          <q-icon :name="icono" />
        </q-item-section>
        <q-item-section>{{ nombre }}</q-item-section>
      </q-item>
    </div>
    <div v-else>
      <div v-if="children.length > 0">
        <!-- {{children}} -->
        <q-expansion-item
          expand-separator
          :icon="icono"
          :label="nombre"
          :caption="caption"
          :header-inset-level="nivel / 2"
          :content-inset-level="0.1"
          default-closed
          class="q-mx-xs q-py-sm"
        >
          <EssentialLink v-for="child in children" :key="child" v-bind="child">
          </EssentialLink>
        </q-expansion-item>
      </div>
      <!--div v-else>
        <q-item clickable v-ripple :inset-level="nivel">
          <q-item-section>{{nombre}}</q-item-section>
        </q-item>
      </div-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'EssentialLink',
  props: {
    nombre: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    ruta: {
      type: String,
      default: '#'
    },

    icono: {
      type: String,
      default: ''
    },

    nivel: {
      type: Number,
      default: 0
    },

    children: {
      type: Array
    }
  }
}
</script>
<style lang="scss" scoped></style>
