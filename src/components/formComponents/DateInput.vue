<template>
  <q-input
    v-model="valor_fecha"
    dense
    outlined
    color="secondary"
    :label="lbl_field"
    lazy-rules
    :rules="rules"
    :readonly="readonly"
    :autofocus="autofocus"
    :tabindex="props.tabindex"
    ref="inputEditing"
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
            :options="optionsFn"
            :readonly="readonly"
            :tabindex="tabindex"
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
import { ref, computed } from 'vue'

/**
 * composables
 */

/**
 * state
 */
const events = ref()
const popUpDate = ref(null)
const inputEditing = ref(null)

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
    required: false,
    default: 'Fecha'
  },
  optional: {
    type: Boolean,
    required: false,
    default: true
  },
  rangoFechaInicio: {
    type: String,
    required: false,
    default: ''
  },
  rangoFechaFin: {
    type: String,
    required: false,
    default: ''
  },
  readonly: {
    type: Boolean,
    required: false,
    default: false
  },
  autofocus: {
    type: Boolean,
    required: false,
    default: false
  },
  rules: {
    type: Array,
    required: false,
    default: () => {
      return []
    }
  },
  tabindex: {
    type: Number,
    required: false,
    default: -1
  }
})
defineExpose({ focus })
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
function dateSelected(value /* , reason, details */) {
  // console.log('seleccionado', value, reason, details)
  if (value) {
    popUpDate.value.hide()
  }
}
/**
 * methods
 */
function optionsFn(date) {
  if (!!props.rangoFechaInicio && !!props.rangoFechaFin) {
    return date >= props.rangoFechaInicio && date <= props.rangoFechaFin
  } else {
    return true
  }
}
function focus() {
  inputEditing.value.focus()
}
</script>

<style lang="scss" scoped></style>
