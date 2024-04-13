<template>
  <q-input
    v-model="valor_fecha"
    dense
    color="primary"
    :label="lbl_field"
    lazy-rules
    :rules="rules"
    :readonly="readonly"
    :autofocus="autofocus"
    filled
    :bg-color="bgColor"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy
          cover
          transition-show="scale"
          transition-hide="scale"
          ref="popUpDate"
        >
          <q-date
            v-model="valor_fecha"
            :events="events"
            dense
            mask="DD/MM/YYYY"
            @update:model-value="dateSelected"
            :options="optionsFn"
            :readonly="readonly"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Hecho" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
  <transition name="fade">
    <div class="level2" v-if="containsError">
      <div class="level1">
        <div class="price-error">Requerido.</div>
      </div>
    </div>
  </transition>
</template>

<script>
import { useFormato } from 'src/composables/utils/useFormato'
import { ref, computed } from 'vue'

export default {
  props: {
    modelValue: {
      type: String,
      default: null,
      required: true
    },
    lbl_field: {
      type: String,
      required: false,
      default: 'Fecha'
    },
    optional: {
      type: Boolean,
      required: false,
      default: true
    },
    rangoFechaInicio: {
      type: String,
      required: false,
      default: ''
    },
    rangoFechaFin: {
      type: String,
      required: false,
      default: ''
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    },
    autofocus: {
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
    bgColor: {
      type: String,
      required: false,
      default: 'accent'
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    /**
     * composables
     */
    const formato = useFormato()
    /**
     * state
     */
    const events = ref()
    const popUpDate = ref(null)
    const containsError = ref(false)

    /**
     * computed
     */
    const valor_fecha = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        emit('update:modelValue', val)
      }
    })
    function dateSelected(value, reason, details) {
      console.log('seleccionado', value, reason, details)
      popUpDate.value.hide()
      if (!value) {
        valor_fecha.value = ''
      }
    }
    /**
     * methods
     */
    function optionsFn(date) {
      if (!!props.rangoFechaInicio && !!props.rangoFechaFin) {
        return date >= props.rangoFechaInicio && date <= props.rangoFechaFin
      } else {
        return true
      }
    }

    const validar = () => {
      console.log('validando la fecha', valor_fecha.value)
      if (!valor_fecha.value) {
        containsError.value = true
        setTimeout(() => {
          containsError.value = false
        }, 2500)
        return false
      } else {
        containsError.value = false
        return true
      }
    }

    return {
      valor_fecha,
      events,
      popUpDate,
      containsError,
      dateSelected,
      optionsFn,
      validar
    }
  }
}
</script>

<style lang="scss" scoped>
.level1 {
  margin: 5px auto;
  position: fixed;
  z-index: 5000;
}
.level2 {
  position: fixed;
  z-index: 5;
}
.price-error {
  background: $negative-pastel;
  color: white;
  position: fixed;
  // left: 8px;
  z-index: 5;
  border-radius: 5px;
  padding: 3px;
  padding-right: 15px;
  box-shadow: rgba(124, 113, 113, 0.76) 5px 14px 28px,
    rgba(112, 93, 93, 0.74) 5px 10px 10px;
  font-size: 0.8rem;
  &::before {
    content: '';
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 15px solid $negative-pastel;
    position: relative;
    top: -25px;
  }
}
.input-noError {
  // border: 1px solid $positive;
  border: 1px solid white;
  border-radius: 4px;
  padding: 1px;
}
.input-error {
  border: 1px solid red;
  border-radius: 4px;
  padding: 1px;
  transition: all 0.1s ease-out;
}
</style>
