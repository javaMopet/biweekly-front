<template>
  <!-- <pre>{{ filteredOptions }}</pre>
  <pre>{{ resultadoLista }}</pre>
  <pre>{{ optionsList }}</pre> -->
  <div class="row q-gutter-x-sm">
    <div class="col">
      <q-select
        outlined
        color="secondary"
        v-model="categoria"
        :options="filteredOptions"
        option-label="nombre"
        label="Categoria"
        use-input
        fill-input
        hide-selected
        input-debounce="2"
        @filter="filterFn"
        behavior="menu"
        clearable=""
        :rules="rules"
        lazyRules
        dense
        map-options
        :readonly="readonly"
        :autofocus="autofocus"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="col-auto" v-if="agregar">
      <q-btn color="accent" icon="add" @click="agregarCategoria" />
    </div>
  </div>

  <Teleport to="#modal">
    <q-dialog v-model="showRegistroCategoria" persistent>
      <registro-categoria></registro-categoria>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { useQuery } from '@vue/apollo-composable'
import { LISTA_CATEGORIAS } from 'src/graphql/categorias'
import { ref, onMounted, computed, Teleport } from 'vue'
import RegistroCategoria from '../categorias/RegistroCategoria.vue'

/**
 * onMounted
 */
onMounted(() => {
  console.log('inicializando')
  // if (filteredOptions.value.length <= 0) {
  //   console.log('recargando ')
  //   reloadResultadoLista()
  // }
})
/**
 * state
 */
const filteredOptions = ref([])
const showRegistroCategoria = ref(false)
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
  tipoMovimientoId: {
    type: String,
    required: false,
    default: null
  },
  readonly: {
    type: Boolean,
    required: false,
    default: false
  },
  agregar: { type: Boolean, required: false, default: false },
  rules: {
    type: Array,
    required: false,
    default: () => {
      return []
    }
  },
  autofocus: {
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
 * graphql
 */
const graphql_options = ref({
  fetchPolicy: 'network-only'
})
const {
  result: resultadoLista,
  onError: onErrorListaCuentas
  // refetch: reloadResultadoLista
} = useQuery(
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
const optionsList = computed({
  get() {
    if (!!props.tipoMovimientoId) {
      return (resultadoLista.value?.listaCategorias ?? []).filter(
        (categoria) => categoria.tipoMovimientoId === props.tipoMovimientoId
      )
    } else {
      return resultadoLista.value?.listaCategorias ?? []
    }
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
      filteredOptions.value = optionsList.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    filteredOptions.value = optionsList.value.filter(
      (v) => v.nombre.toLowerCase().indexOf(needle) > -1
    )
  })
}
function agregarCategoria() {
  showRegistroCategoria.value = true
}
</script>

<style lang="scss" scoped></style>
