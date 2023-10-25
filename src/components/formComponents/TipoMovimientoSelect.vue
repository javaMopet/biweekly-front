<template>
  <div class="row inline fit">
    <CategoriaSelect
      v-if="mostrarCategoria"
      v-model="categoria"
      :tipo-afectacion="props.tipoAfectacion"
      :agregar="false"
    ></CategoriaSelect>
    <CuentaSelect
      v-else
      v-model="cuenta"
      label="Cuenta Destino"
      :filter-array="['1', '2']"
    ></CuentaSelect>
    <q-btn
      round
      icon="more_vert"
      no-caps
      flat
      class="text-condensed more-button"
    >
      <q-menu>
        <q-list style="min-width: 100px">
          <q-item v-close-popup>
            <q-item-section>
              <q-radio
                v-model="tipoMovimientoId"
                val="1"
                label="Ingreso"
                v-close-popup
              />
              <q-radio
                v-model="tipoMovimientoId"
                val="2"
                label="Egreso"
                v-close-popup
              />
              <q-radio
                v-model="tipoMovimientoId"
                val="3"
                label="Traspaso"
                v-close-popup
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, defineProps } from 'vue'
import CategoriaSelect from './CategoriaSelect.vue'
import CuentaSelect from './CuentaSelect.vue'

/**
 *
 */
const tipoMovimientoId = ref('1')
const categoria = ref()
const cuenta = ref()
/**
 * props
 */
const props = defineProps({
  tipoAfectacion: {
    type: String,
    required: false,
    default: null
  },
  isCambiable: {
    type: Boolean,
    required: false,
    default: true
  }
})
/**
 * onMounted
 */
onMounted(() => {
  // console.log(props.tipoAfectacion)
})
/**
 * computed
 */
const mostrarCategoria = computed({
  get() {
    return tipoMovimientoId.value === '1' || tipoMovimientoId.value === '2'
  }
})
</script>

<style lang="scss" scoped></style>
