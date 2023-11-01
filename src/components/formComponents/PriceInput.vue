<template>
  <div style="z-index: 5">
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
      :label="label"
      :readonly="readonly"
      :autofocus="autofocus"
      lazy-rules
      :rules="rules"
    >
      <template #append>
        <div class="text-subtitle1">{{ editingLabel }}</div>
      </template>
    </q-input>
  </div>

  <transition name="fade">
    <div class="level2" v-if="isError">
      <div class="price-error">Ingresar un precio distinto de 0</div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
  },
  label: {
    type: String,
    required: false,
    default: 'Precio'
  },
  rules: {
    type: Array,
    required: false,
    default: () => {
      return []
    }
  },
  isError: {
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

<style lang="scss" scoped>
.level15 {
  margin: 0 auto;
  position: relative;
}
.level2 {
  position: absolute;
  right: 150px;
  top: 50px;
}
.price-error {
  background: $negative-pastel;
  color: white;
  position: fixed;
  // left: 8px;
  z-index: 1;
  border-radius: 5px;
  padding: 3px;
  padding-right: 15px;
  box-shadow: rgba(124, 113, 113, 0.76) 5px 14px 28px,
    rgba(112, 93, 93, 0.74) 5px 10px 10px;
  &::before {
    content: '';
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 15px solid $negative-pastel;
    position: relative;
    top: -25px;
  }
}
</style>
