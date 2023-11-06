<template>
  <div class="col">
    <q-select
      outlined
      color="secondary"
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
    >
    </q-select>
  </div>
  <div v-if="agregar" class="q-mt-xs" style="border: 0px solid red">
    <q-btn color="accent" outline icon="add" dense @click="registrarCuenta" />
  </div>

  <Teleport to="#modal">
    <q-dialog v-model="form_cuenta_show" persistent>
      <RegistroCuenta></RegistroCuenta>
    </q-dialog>
  </Teleport>
</template>

<script setup>
// import { useQuery } from '@vue/apollo-composable'
// import { LISTA_CUENTAS_REDUCED } from 'src/graphql/cuentas'
import { ref, computed } from 'vue'
import RegistroCuenta from '../cuentas/RegistroCuenta.vue'
import { useCuentaCrud } from 'src/composables/useCuentaCrud'

/**
 * composable
 */
const cuentaCrud = useCuentaCrud()
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
  }
})
/**
 * emits
 */
const emit = defineEmits(['update:modelValue'])

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
      cuentaCrud.listaCuentasReduced.value?.filter((option) => {
        // console.log(props.filterArray.includes(option.tipoCuenta.id))
        return props.filterArray.includes(option.tipoCuenta.id)
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
</script>

<style lang="scss" scoped></style>
