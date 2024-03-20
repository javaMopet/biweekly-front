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
    <q-dialog
      v-model="form_cuenta_show"
      persistent
      transition-show="jump-up"
      transition-hide="jump-down"
    >
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBancoStore } from 'src/stores/common/useBancoStore'

/**
 * composable
 */
const bancoStore = useBancoStore()
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

// onErrorListar((error) => {
//   console.log('error', error)
// })
// bancosCrud.onErrorListaBancos((error) => {
//   logErrorMessages(error)
// })
/**
 * methods
 */
function filterFn(val, update) {
  if (val === '') {
    update(() => {
      filteredOptions.value = bancoStore.listaBancos
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    filteredOptions.value = bancoStore.listaBancos.filter(
      (v) => v.nombre.toLowerCase().indexOf(needle) > -1
    )
  })
}

/**
 * Mostrar registro de cuentas
 */
function registrarCuenta() {
  form_cuenta_show.value = true
}
</script>
../cuentas/AccountRegistrationForm.vue
