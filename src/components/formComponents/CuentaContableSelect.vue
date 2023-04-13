<template>
  <div class="row q-gutter-x-sm">
    <div class="col">
      <q-select
        outlined
        color="secondary"
        v-model="cuentaContable"
        :options="filteredOptions"
        option-label="nombreCompleto"
        :label="props.inputLabel"
        use-input
        input-debounce="0"
        @filter="filterFn"
        behavior="menu"
        clearable=""
        dense
        map-options
        hide-selected
        fill-input
        lazy-rules
        :rules="[(val) => !!val || 'requerido']"
        :readonly="props.readonly"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="q-mt-xs" style="border: 0px solid red" v-if="!props.readonly">
      <q-btn
        color="accent"
        outline
        icon="add"
        dense
        @click="registrarCuentaContable"
      />
    </div>
  </div>

  <Teleport to="#modal">
    <q-dialog v-model="form_cuentaContable_show" persistent>
      <RegistroCuentaContable></RegistroCuentaContable>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { useQuery } from '@vue/apollo-composable'
import { LISTA_CUENTAS_CONTABLES } from 'src/graphql/cuentasContableGql'
import { ref, computed, defineProps, defineEmits } from 'vue'
import RegistroCuentaContable from '../cuentasContables/RegistroCuentaContable.vue'

/**
 * state
 */
const filteredOptions = ref([])
const form_cuentaContable_show = ref(false)
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
    required: false,
    default: 0
  },
  clasificacion: {
    type: String,
    required: false,
    default: ''
  },
  tipoAfectacion: {
    type: String,
    required: false,
    default: () => {
      return null
    }
  },
  inputLabel: {
    type: String,
    required: false,
    default: 'Cuenta Contable'
  },
  readonly: {
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
const { result: resultadoLista, onError: onErrorListaCuentas } = useQuery(
  LISTA_CUENTAS_CONTABLES,
  {
    subnivel: null, //parseInt(props.subnivel),
    clasificacion: null, // props.clasificacion,
    tipoAfectacion: null //props.tipoAfectacion
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
    return (resultadoLista.value?.listaCuentasContables ?? []).filter(
      (cc) =>
        cc.subnivel === props.subnivel &&
        cc.tipoAfectacion === props.tipoAfectacion &&
        cc.id.toString().startsWith(props.clasificacion)
    )
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
function registrarCuentaContable() {
  console.log('registrar una cuenta contable')
  form_cuentaContable_show.value = true
}
</script>

<style lang="scss" scoped></style>
