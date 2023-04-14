<template>
  <q-input
    v-model="valor_fecha"
    dense
    outlined
    color="secondary"
    :label="lbl_field"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy
          cover
          transition-show="scale"
          transition-hide="scale"
          ref="popUpDate"
        >
          <q-date
            v-model="valor_fecha"
            :events="events"
            dense
            mask="DD/MM/YYYY"
            @update:model-value="dateSelected"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Hecho" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'

/**
 * state
 */
const events = ref()
const popUpDate = ref(null)

/**
 * emits
 */
const emit = defineEmits(['update:modelValue'])

/**
 * props
 */
const props = defineProps({
  modelValue: {
    type: String,
    default: null,
    required: true
  },
  lbl_field: {
    type: String,
    default: '',
    required: true
  }
})
/**
 * computed
 */
const valor_fecha = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
function dateSelected(value, reason, details) {
  console.log('seleccionado', value, reason, details)
  if (!!value) {
    popUpDate.value.hide()
  }
}
</script>

<style lang="scss" scoped></style>
