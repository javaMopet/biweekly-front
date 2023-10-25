<template>
  <div class="col">
    <q-select
      v-if="mostrarCategorias"
      outlined
      color="secondary"
      v-model="categoria"
      :options="filteredOptions"
      option-label="nombre"
      :label="tipoMovimientoLabel"
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
      <template #before-options="props">
        <div class="row justify-end">
          <q-btn
            dense
            class="text-condensed"
            color="primary"
            outline=""
            icon="add"
            flat
            rounded
            no-caps
            label="Agregar"
            @click="addItemCategoria(props)"
          >
          </q-btn>
        </div>
      </template>
      <!-- <template #after>
        <q-btn color="more-button" round flat dense icon="more_vert">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable @click="addItemCategoria(props)" v-close-popup>
                <q-item-section class="text-teal">
                  Nueva categoría
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template> -->
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

  <Teleport to="#modal">
    <q-dialog v-model="showRegistroCategoria" persistent>
      <registro-categoria
        :edited-item="editedCategoriaParam"
        @categoriaSaved="categoriaSaved"
      ></registro-categoria>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { ref, toRefs, watch, onMounted, computed, Teleport } from 'vue'
import RegistroCategoria from '../categorias/RegistroCategoria.vue'
import { useCategoriaCrud } from '/src/composables/useCategoriaCrud.js'

/**
 *
 */
const categoriaCrud = useCategoriaCrud()

/**
 * onMounted
 */
onMounted(() => {
  // console.log('inicializando', props.tipoAfectacion)
  tipoMovimientoId.value = props.tipoAfectacion === 'A' ? '1' : '2'
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
const tipoMovimientoId = ref('1')
const editedCategoriaParam = ref({ tipoMovimientoId: tipoMovimientoId.value })

const { tipoAfectacion } = toRefs(props)
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
  tipoAfectacion: {
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
  },
  isCambiable: {
    type: Boolean,
    required: false,
    default: true
  }
})
/**
 * emits
 */
const emit = defineEmits(['update:modelValue'])
/**
 * watch
 */
watch(tipoAfectacion, (newVal, oldVal) => {
  // console.log('new - old ', newVal, oldVal)
  tipoMovimientoId.value = newVal === 'A' ? '1' : '2'
})
/**
 * graphql
 */
const graphql_options = ref({
  fetchPolicy: 'network-only'
})
// const {
//   result: resultadoLista,
//   onError: onErrorListaCuentas
//   // refetch: reloadResultadoLista
// } = useQuery(
//   LISTA_CATEGORIAS,
//   null, //argumentos
//   graphql_options //opciones
// )
/**
 * computed
 */
// const valor = computed({
//   get() {
//     return props.modelValue
//   },
//   set(val) {
//     emit('update:modelValue', val)
//   }
// })
// const tipoMovimientoId =computed({
//   get(){

//   },
//   set(val){

//   }
// })
const mostrarCategorias = computed({
  get() {
    return tipoMovimientoId.value === '1' || tipoMovimientoId.value === '2'
  }
})
const lblChangeTipoMovimiento = computed({
  get() {
    return tipoMovimientoId.value === '2' ? 'Ingreso' : 'Gasto'
  }
})
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
    if (!!tipoMovimientoId.value) {
      // return (resultadoLista.value?.listaCategorias ?? []).filter(
      //   (categoria) => categoria.tipoMovimientoId === tipoMovimientoId.value
      // )
      return categoriaCrud.listaCategorias.value.filter(
        (categoria) => categoria.tipoMovimientoId === tipoMovimientoId.value
      )
    } else {
      return resultadoLista.value?.listaCategorias ?? []
    }
  }
})
const tipoMovimientoLabel = computed({
  get() {
    return tipoMovimientoId.value === '1'
      ? 'Ingreso'
      : tipoMovimientoId.value === '2'
      ? 'Gasto'
      : 'Traspaso'
  }
})
// onErrorListaCuentas((error) => {
//   console.log('error', error)
// })
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
function toogleTipoAfectacion(val) {
  categoria.value = null
  tipoMovimientoId.value = tipoMovimientoId.value === '1' ? '2' : '1'
}
function addItemCategoria(props_row) {
  editedCategoriaParam.value = {
    tipoMovimientoId: tipoMovimientoId.value,
    cuentaContable: null,
    cuentaDefault: null,
    icono: 'insert_emoticon',
    color: '#019A9D'
  }
  showRegistroCategoria.value = true
}
function categoriaSaved(value) {
  categoria.value = value
  showRegistroCategoria.value = false
}
</script>

<style lang="scss" scoped></style>
