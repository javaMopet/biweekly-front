<template>
  <div class="row q-gutter-x-sm">
    <div class="col">
      <q-select
        outlined
        color="secondary"
        v-model="cuenta"
        :options="filteredOptions"
        option-label="nombre"
        :label="props.label"
        use-input
        input-debounce="0"
        @filter="filterFn"
        behavior="menu"
        clearable=""
        :rules="[
          (val) => opcional || !!val || 'Favor de ingresar la categoria'
        ]"
        lazyRules
        dense
        :hint="props.hint"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="q-mt-xs" style="border: 0px solid red">
      <q-btn color="accent" outline icon="add" dense @click="registrarCuenta" />
    </div>
  </div>

  <Teleport to="#modal">
    <q-dialog v-model="form_cuenta_show" persistent>
      <RegistroCuenta></RegistroCuenta>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { useQuery } from '@vue/apollo-composable'
import { LISTA_CUENTAS } from 'src/graphql/cuentas'
import { ref, computed, defineProps, defineEmits } from 'vue'
import RegistroCuenta from '../cuentas/RegistroCuenta.vue'

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
    required: false,
    default: ''
  }

  // tipoMovimientoId: {
  //   type: Number,
  //   required: false,
  //   default: null
  // }
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
  LISTA_CUENTAS,
  null, //arguments
  graphql_options
)
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
const options = computed({
  get() {
    return resultadoLista.value?.listaCuentas ?? []
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
function registrarCuenta() {
  form_cuenta_show.value = true
}
</script>

<style lang="scss" scoped></style>
