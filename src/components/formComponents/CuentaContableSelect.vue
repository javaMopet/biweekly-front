<template>
  <q-select
    filled
    v-model="cuentaContable"
    :options="filteredOptions"
    option-label="nombreCompleto"
    label="Cuenta Contable"
    use-input
    input-debounce="0"
    @filter="filterFn"
    behavior="menu"
    clearable=""
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> No results </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { useQuery } from '@vue/apollo-composable'
import { LISTA_CUENTAS_CONTABLES } from 'src/graphql/cuentasContableGql'
import { ref, computed, defineProps, defineEmits } from 'vue'

/**
 * state
 */
const filteredOptions = ref([])
/**
 * props
 */
const props = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: () => {
      return {
        id: 500,
        nombre: 'mi nombre'
      }
    }
  },
  subnivel: {
    type: Number,
    required: true,
    default: 0
  },
  clasificacion: {
    type: String,
    required: true,
    default: ''
  }
})
/**
 * emits
 */
const emit = defineEmits(['update:modelValue'])
/**
 * graphql
 */
const graphql_options = ref({
  fetchPolicy: 'network-only'
})
const { result: resultadoLista, onError: onErrorListaCuentas } = useQuery(
  LISTA_CUENTAS_CONTABLES,
  {
    subnivel: parseInt(props.subnivel),
    clasificacion: props.clasificacion
  },
  graphql_options
)
/**
 * computed
 */
const cuentaContable = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
const options = computed({
  get() {
    return resultadoLista.value?.listaCuentasContables ?? []
  }
})
onErrorListaCuentas((error) => {
  console.log('error', error)
})
/**
 * methods
 */
function filterFn(val, update) {
  if (val === '') {
    update(() => {
      filteredOptions.value = options.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    filteredOptions.value = options.value.filter(
      (v) => v.nombreCompleto.toLowerCase().indexOf(needle) > -1
    )
  })
}
</script>

<style lang="scss" scoped></style>
