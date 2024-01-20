<template>
  <div class="column" style="border: 0px solid red">
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
        <div class="" v-if="isAlta" style="border: 0px solid red">
          <q-btn
            color="accent"
            class="small-button"
            icon="add"
            @click="addNew(props)"
          />
        </div>
      </template>
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No results </q-item-section>
        </q-item>
      </template>
    </q-select>
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
        :is-padre-default="false"
      ></FormRegistroCuentaContable>
    </q-dialog>
  </Teleport>
</template>

<script>
import { ref, computed } from 'vue'
import FormRegistroCuentaContable from '../cuentasContables/FormRegistroCuentaContable.vue'
import { useCuentaContableStore } from 'src/stores/common/useCuentaContableStore'
export default {
  props: {
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
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    /**
     * composables
     */
    const cuentaContableStore = useCuentaContableStore()
    /**
     * state
     */
    const filteredOptions = ref([])
    const form_cuentaContable_show = ref(false)
    const formEditedItem = ref(null)

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
        return (cuentaContableStore.listaCuentasContables ?? []).filter(
          (cc) =>
            cc.subnivel === props.subnivel &&
            cc.tipoAfectacion === props.tipoAfectacion &&
            cc.id.toString().startsWith(props.clasificacion)
        )
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

    function addNew() {
      console.log('registrar una cuenta contable')
      const tipoAfectacion = !!props.tipoAfectacion
        ? props.tipoAfectacion
        : { A: 'Abono' }
      formEditedItem.value = {
        padre: null,
        tipoAfectacion,
        subnivel: 0,
        action: 'add'
      }
      console.log(formEditedItem.value)
      form_cuentaContable_show.value = true
    }

    function cuentaContableSaved(item) {
      form_cuentaContable_show.value = false
      cuentaContable.value = item
    }

    return {
      filteredOptions
    }
  }
}
</script>
<style lang="scss" scoped></style>
