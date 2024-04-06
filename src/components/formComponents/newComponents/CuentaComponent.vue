<template>
  <div class="col">
    <q-select
      outlined
      color="positive"
      v-model="cuenta"
      :options="filteredOptions"
      option-label="nombre"
      :label="props.label"
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
      :style="props.style"
      :disable="props.disable"
    >
    </q-select>
  </div>
  <div v-if="agregar" class="q-mt-xs" style="border: 0px solid red">
    <q-btn color="accent" outline icon="add" dense @click="registrarCuenta" />
  </div>
  <!-- <div class="">
    {{ props.filterIdArray }}
    {{ filteredOptions }}
  </div> -->

  <Teleport to="#modal">
    <q-dialog
      v-model="form_cuenta_show"
      persistent
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <!-- :edited-item="editedItem" -->
      <AccountRegistrationForm
        @cuentaSaved="cuentaSaved"
        @cuentaUpdated="cuentaUpdated"
      ></AccountRegistrationForm>
    </q-dialog>
  </Teleport>
  <!-- <pre>{{ cuentaStore.listaCuentas }}</pre> -->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCuentaStore } from 'src/stores/common/useCuentaStore'
import AccountRegistrationForm from 'src/components/cuentas/AccountRegistrationForm.vue'

/**
 * composable
 */
const cuentaStore = useCuentaStore()

/**
 * state
 */
const filteredOptions = ref([])
const form_cuenta_show = ref(false)
/**
 * props
 */
const props = defineProps({
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
})
/**
 * emits
 */
const emit = defineEmits(['update:modelValue'])
/**
 * onMounted
 */
onMounted(() => {
  console.log('OnMounted Cuenta Component')
  // cuentaStore.fetchOrRefetch()
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
      cuentaStore.listaCuentas
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
</script>

<style lang="scss" scoped></style>
../cuentas/AccountRegistrationForm.vue
