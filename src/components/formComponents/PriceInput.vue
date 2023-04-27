<template>
  <div>
    <q-input
      v-model="inputValue"
      type="text"
      v-on:blur="onBlur"
      @focus="onFocus"
      input-class="text-right"
      placeholder="0.00"
      ref="inputEditing"
      outlined
      color="secondary"
      dense
      label="Precio"
      :error="!isValid"
      :readonly="readonly"
      :autofocus="autofocus"
    >
      <template #append>
        <div class="text-subtitle1">{{ editingLabel }}</div>
      </template>
      <template #error> Favor de ingresar el importe </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, onMounted } from 'vue'
import { formatMoney } from 'accounting-js'
/**
 * state
 */
const selectedCurrency = ref({})
const editing = ref(false)
const localValue = ref(0)
const inputEditing = ref()

const inputValue = computed({
  get() {
    return editing.value ? props.modelValue : formatMoney(props.modelValue)
  },
  set(val) {
    localValue.value = val
    emit('update:modelValue', val)
  }
})

/**
 * emits
 */
const emit = defineEmits(['update:modelValue', 'blur'])

const props = defineProps({
  modelValue: {
    type: String,
    default: '0.00'
  },
  currencyCode: {
    type: String,
    required: false,
    default: 'MNX'
  },
  debug: {
    type: Boolean,
    default: false
  },
  opcional: {
    type: Boolean,
    required: false,
    default: true
  },
  readonly: {
    type: Boolean,
    required: false,
    default: false
  },
  isValid: {
    type: Boolean,
    required: false,
    default: true
  },
  autofocus: {
    type: Boolean,
    required: false,
    default: false
  }
})
/**
 * computed
 */

const editingLabel = computed({
  get() {
    return selectedCurrency.value.code
  }
})

/**
 * onMounted
 */
onMounted(() => {
  if (props.debug) {
    debugger
  }

  localValue.value = props.modelValue

  setCurrency(props.currencyCode)

  onBlur()
})
function onBlur(e) {
  editing.value = false
  emit('blur')
}
function onFocus() {
  editing.value = true
}

var currenciesOpts = {
  EUR: {
    name: 'Euro',
    symbol: '€',
    symbolNative: '€',
    code: 'EUR',
    decimalPlaces: 2
  },
  GBP: {
    name: 'Pound Sterling',
    symbol: '£',
    symbolNative: '£',
    code: 'GBP',
    decimalPlaces: 2,
    exchangeRate: 0.895
  },
  USD: {
    name: 'US Dollar',
    symbol: 'US$',
    symbolNative: '$',
    code: 'USD',
    decimalPlaces: 2,
    exchangeRate: 1.185
  },
  MNX: {
    name: 'Peso mx',
    symbol: 'MNX$',
    symbolNative: '$',
    code: 'MNX',
    decimalPlaces: 2
  },
  CAD: {
    name: 'Canadian Dollar',
    symbol: 'CA$',
    symbolNative: '$',
    code: 'CAD',
    decimalPlaces: 2,
    exchangeRate: 1.501
  }
}
const currencies = ref(Object.assign({}, currenciesOpts))
function setCurrency(code) {
  selectedCurrency.value = currencies.value[code] || {}
}
</script>
<style lang="scss" scoped></style>
