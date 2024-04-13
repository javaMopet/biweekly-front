<template>
  <div
    style="z-index: 5"
    :class="[containsError ? 'input-error' : 'input-noError']"
  >
    <q-input
      v-model="inputValue"
      type="text"
      v-on:blur="onBlur"
      @focus="onFocus"
      input-class="text-right"
      placeholder="0.00"
      ref="inputEditing"
      color="primary"
      dense
      :label="label"
      :readonly="readonly"
      :autofocus="autofocus"
      lazy-rules
      :rules="rules"
      filled
      :bg-color="bgColor"
    >
      <template #append>
        <div class="text-subtitle1">{{ editingLabel }}</div>
      </template>
    </q-input>
    <transition name="fade">
      <div class="level2" v-if="containsError">
        <div class="level1">
          <div class="price-error">Precio distinto de 0</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, toRef, watch, watchEffect } from 'vue'
import { formatMoney } from 'accounting-js'

export default {
  props: {
    modelValue: {
      type: String,
      default: ''
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
    manualValidation: {
      type: Boolean,
      required: false,
      default: false
    },
    bgColor: {
      type: String,
      required: false,
      default: 'accent'
    }

    // currencyCode: {
    //   type: String,
    //   required: false,
    //   default: 'MNX'
    // },
  },
  emits: ['update:modelValue', 'blur'],
  mounted() {
    console.log('mounted', this.modelValue)
    this.inputValue = this.modelValue
  },
  watch: {
    modelValue(newValue) {
      this.inputValue = newValue
    }
  },
  setup(props, { emit }) {
    /**
     * state
     */
    const selectedCurrency = ref({})
    const editing = ref(false)
    const localValue = ref(0)
    const inputEditing = ref()
    const containsError = ref(false)

    const inputValue = computed({
      get() {
        return editing.value ? props.modelValue : formatMoney(props.modelValue)
      },
      set(val) {
        localValue.value = val
        emit('update:modelValue', val)
      }
    })
    const editingLabel = computed({
      get() {
        return selectedCurrency.value.code
      }
    })

    watch(
      () => props.manualValidation,
      (newValue, oldValue) => {
        console.log('CAMBIANDO validacion manual', oldValue, newValue)
      }
    )

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
    /**
     * Methods
     */
    /**
     * On blur input
     * @param {*} e
     */
    function onBlur(e) {
      editing.value = false
      emit('blur')
      if (props.manualValidation) {
        validar()
      }
    }

    function onFocus() {
      editing.value = true
    }

    const validar = () => {
      console.log('validando el precio', inputValue.value)
      if (inputValue.value === '$0.00') {
        containsError.value = true
        setTimeout(() => {
          containsError.value = false
        }, 2500)
        return false
      } else {
        containsError.value = false
        return true
      }
    }

    function setCurrency(code) {
      selectedCurrency.value = currencies.value[code] || {}
    }

    return {
      inputValue,
      containsError,
      editingLabel,
      selectedCurrency,
      setCurrency,
      onFocus,
      onBlur,
      validar
    }
  }
}
</script>

<style lang="scss" scoped>
.level1 {
  margin: 5px auto;
  position: fixed;
  z-index: 5000;
}
.level2 {
  position: fixed;
  z-index: 5;
}
.price-error {
  background: $negative-pastel;
  color: white;
  position: fixed;
  // left: 8px;
  z-index: 5;
  border-radius: 5px;
  padding: 3px;
  padding-right: 15px;
  box-shadow: rgba(124, 113, 113, 0.76) 5px 14px 28px,
    rgba(112, 93, 93, 0.74) 5px 10px 10px;
  font-size: 0.8rem;
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
.input-noError {
  // border: 1px solid $positive;
  border: 1px solid white;
  border-radius: 4px;
  padding: 1px;
}
.input-error {
  border: 1px solid red;
  border-radius: 4px;
  padding: 1px;
  transition: all 0.1s ease-out;
}
</style>
