<template>
  <div class="row component__bordered">
    <q-select
      v-model="mes"
      :options="mesOptions"
      option-label="nombre"
      label="Mes"
      dense
      borderless
      color="secondary"
      label-color="dark"
      @update:model-value="onChangeMes"
      use-input
      hide-selected
      fill-input
      style="width: 200px"
      hide-dropdown-icon
    >
      <template #before>
        <q-btn
          color="primary"
          round
          icon="arrow_left"
          @click="prevMonth"
          dense
          flat
        />
      </template>
      <template #prepend>
        <q-icon name="calendar_month" />
      </template>
      <template #after>
        <q-btn
          color="primary"
          round
          icon="arrow_right"
          dense
          flat
          @click="nextMont"
        />
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    defalt: null
  }
})

/**
 * emits
 */
const emit = defineEmits(['update:modelValue'])

const mes = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
function onChangeMes(value) {
  emit('update:modelValue', value)
}
function prevMonth() {
  // console.log(mes.value)
  const mesPrevio = mes.value.id - 1
  if (!!mesPrevio) {
    // console.log(mesPrevio)
    mes.value = mesOptions.value.find((option) => option.id === mesPrevio)
  }
}
function nextMont() {
  // console.log(mes.value)
  const mesSiguiente = mes.value.id + 1
  if (!!mesSiguiente && mesSiguiente < 13) {
    mes.value = mesOptions.value.find((option) => option.id === mesSiguiente)
  }
}

const mesOptions = ref([
  { id: 1, nombre: 'Enero' },
  { id: 2, nombre: 'Febrero' },
  { id: 3, nombre: 'Marzo' },
  { id: 4, nombre: 'Abril' },
  { id: 5, nombre: 'Mayo' },
  { id: 6, nombre: 'Junio' },
  { id: 7, nombre: 'Julio' },
  { id: 8, nombre: 'Agosto' },
  { id: 9, nombre: 'Septiembre' },
  { id: 10, nombre: 'Octubre' },
  { id: 11, nombre: 'Noviembre' },
  { id: 12, nombre: 'Diciembre' }
])
</script>

<style lang="scss" scoped>
.component__bordered {
  border: 1px solid #cdd0d3;
  border-radius: 4px;
}
</style>
