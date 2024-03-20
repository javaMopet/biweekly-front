<template>
  <div class="col">
    <q-select
      outlined
      color="positive"
      v-model="cuenta"
      :options="filteredOptions"
      option-label="nombre"
      :label="label"
      use-input
      fill-input
      hide-selected
      input-debounce="0"
      @filter="filterFn"
      behavior="menu"
      clearable=""
      lazy-rules
      :rules="rules"
      dense
      :readonly="readonly"
      :style="style"
      :disable="disable"
    >
    </q-select>
    <transition name="fade">
      <div class="level2" v-if="containsError">
        <div class="level1">
          <div class="price-error">Campo requerido. Favor seleccionar.</div>
        </div>
      </div>
    </transition>
  </div>
  <div v-if="agregar" class="q-mt-xs" style="border: 0px solid red">
    <q-btn color="accent" outline icon="add" dense @click="registrarCuenta" />
  </div>

  <Teleport to="#modal">
    <q-dialog
      v-model="form_cuenta_show"
      persistent
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <AccountRegistrationForm
        @cuentaSaved="cuentaSaved"
        @cuentaUpdated="cuentaUpdated"
      ></AccountRegistrationForm>
    </q-dialog>
  </Teleport>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import AccountRegistrationForm from '../cuentas/AccountRegistrationForm.vue'
import { useCuentaService } from 'src/composables/cuentas/useCuentaService'

export default {
  props: {
    modelValue: {
      type: Object,
      required: false,
      default: () => {
        return null
      }
    },
    filterArray: {
      type: Array,
      required: false,
      default: () => {
        return ['1', '2', '3']
      }
    },
    filterIdArray: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    },
    opcional: {
      type: Boolean,
      required: false,
      default: false
    },
    label: {
      type: String,
      required: false,
      default: 'Cuenta Bancaria'
    },
    hint: {
      type: String,
      required: false
    },
    agregar: { type: Boolean, required: false, default: false },
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
    rules: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    },
    style: {
      type: String,
      required: false,
      default: ''
    },
    disable: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['update:modelValue'],
  components: { AccountRegistrationForm },
  setup(props, { emit }) {
    /**
     * composable
     */
    const cuentaService = useCuentaService()
    /**
     * state
     */
    const filteredOptions = ref([])
    const form_cuenta_show = ref(false)
    const containsError = ref(false)
    const listaCuentas = ref([])

    /**
     * graphql
     */
    cuentaService.onResultListaCuentas(({ data }) => {
      if (!!data) {
        console.log('Se obtuvo la lista de cuentas', data)
        listaCuentas.value = JSON.parse(
          JSON.stringify(data?.listaCuentas ?? [])
        )
      }
    })
    /**
     * computed
     */
    const cuenta = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        emit('update:modelValue', val)
      }
    })
    const listaOptions = computed({
      get() {
        return (
          listaCuentas.value
            ?.filter((option) => {
              return props.filterArray.includes(option.tipoCuenta.id)
            })
            .filter((option) => {
              return !props.filterIdArray.includes(option.id)
            }) ?? []
        )
      }
    })
    /**
     * methods
     */
    function filterFn(val, update) {
      if (val === '') {
        update(() => {
          filteredOptions.value = listaOptions.value
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        filteredOptions.value = listaOptions.value.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    function registrarCuenta() {
      form_cuenta_show.value = true
    }
    function cuentaSaved(itemSaved) {
      form_cuenta_show.value = false
    }

    const validar = () => {
      console.log('validando la cuenta', cuenta.value)
      if (!cuenta.value?.id) {
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

    return {
      cuenta,
      form_cuenta_show,
      filteredOptions,
      containsError,
      filterFn,
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
../cuentas/AccountRegistrationForm.vue../cuentas/AccountRegisterForm.vue
