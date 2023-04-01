<template>
  <q-select
    filled
    v-model="categoria"
    :options="filteredOptions"
    option-label="nombre"
    label="Categoria"
    use-input
    input-debounce="0"
    @filter="filterFn"
    behavior="menu"
    clearable=""
    :rules="[(val) => !!val || 'Favor de ingresar la categoria']"
    lazyRules
    dense
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
import { LISTA_CATEGORIAS } from 'src/graphql/categorias'
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
      return null
    }
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
  LISTA_CATEGORIAS,
  null, //argumentos
  graphql_options //opciones
)
/**
 * computed
 */
const categoria = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
const options = computed({
  get() {
    return resultadoLista.value?.listaCategorias ?? []
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
      (v) => v.nombre.toLowerCase().indexOf(needle) > -1
    )
  })
}
</script>

<style lang="scss" scoped></style>
