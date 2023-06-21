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
        :rules="props.rules"
        lazyRules
        dense
        :hint="props.hint"
        :readonly="readonly"
      >
        <template #selected-item="scope">
          <q-img
            class="q-mx-md"
            :src="`/icons/${scope.opt.icono}`"
            width="20px"
            height="20px"
          />
          <q-item-label>
            {{ scope.opt.nombre }}
          </q-item-label>
        </template>
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar>
              <!-- <q-icon :name="scope.opt.icon" /> -->
              <q-img
                :src="`/icons/${scope.opt.icono}`"
                width="30px"
                height="30px"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.nombre }}</q-item-label>
              <!-- <q-item-label caption>{{ scope.opt.nombre }}</q-item-label> -->
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div v-if="agregar" class="q-mt-xs" style="border: 0px solid red">
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
import { LISTA_BANCOS } from 'src/graphql/bancos'
import { ref, computed } from 'vue'
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
    default: 'Seleccionar Banco'
  },
  hint: {
    type: String,
    required: false,
    default: ''
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
const { result: resultadoLista, onError: onErrorListar } = useQuery(
  LISTA_BANCOS,
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
    return resultadoLista.value?.listaBancos ?? []
  }
})
onErrorListar((error) => {
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
