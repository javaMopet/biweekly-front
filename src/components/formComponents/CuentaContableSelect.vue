<template>
  <div class="row q-gutter-x-sm">
    <div class="col">
      <q-select
        outlined
        color="positive"
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
        :rules="rules"
        :readonly="props.readonly"
        :disable="props.disable"
      >
        <template #after>
          <q-btn
            color="more-button"
            round
            flat
            dense
            icon="more_vert"
            v-if="!props.disable"
          >
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item
                  clickable
                  @click="addItemCuentaContable(props)"
                  v-close-popup
                >
                  <q-item-section class="text-teal">
                    Nueva cuenta contable
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>

  <Teleport to="#modal">
    <q-dialog
      v-model="form_cuentaContable_show"
      persistent
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <FormRegistroCuentaContable
        v-model="cuentaContable"
        :edited-item="formEditedItem"
        @cuentaContableSaved="cuentaContableSaved"
      ></FormRegistroCuentaContable>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import FormRegistroCuentaContable from '../cuentasContables/FormRegistroCuentaContable.vue'
// import { useCuentaContableStore } from 'src/stores/common/useCuentaContableStore'

/**
 * state
 */
const filteredOptions = ref([])
const form_cuentaContable_show = ref(false)
const formEditedItem = ref(null)
/**
 * composables
 */
// const cuentaContableStore = useCuentaContableStore()
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
  },
  isAlta: {
    type: Boolean,
    required: false,
    default: false
  },
  rules: {
    type: Array,
    required: false,
    default: () => {
      return []
    }
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
    return []
    // (cuentaContableStore.listaCuentasContables ?? []).filter(
    //   (cc) =>
    //     cc.subnivel === props.subnivel &&
    //     cc.tipoAfectacion === props.tipoAfectacion &&
    //     cc.id.toString().startsWith(props.clasificacion)
    // )
  }
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

function addItemCuentaContable() {
  console.log('registrar una cuenta contable')

  formEditedItem.value = {
    padre: {
      __typename: 'CuentaContable',
      id: '212000',
      nombre: 'Documentos por Pagar a Corto Plazo',
      nombreCompleto: '212000 - Documentos por Pagar a Corto Plazo',
      padreId: 210000,
      subnivel: 1,
      tipoAfectacion: 'A'
    },
    tipoAfectacion: { id: 'A', nombre: 'Abono' },
    subnivel: 0,
    action: 'add'
  }
  form_cuentaContable_show.value = true
}

function cuentaContableSaved(item) {
  form_cuentaContable_show.value = false
  cuentaContable.value = item
}
</script>

<style lang="scss" scoped></style>
