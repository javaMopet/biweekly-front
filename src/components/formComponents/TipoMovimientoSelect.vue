<template>
  <div class="row inline fit">
    <!-- <pre>
 {{ tipoMovimientoId }} - {{ props.tipoAfectacion }} - {{ tipoAfectacion }}</pre
    > -->
    <CategoriaSelect
      v-if="mostrarCategoria"
      v-model="categoria"
      :tipo-afectacion="tipoAfectacion"
      :agregar="false"
      @update:model-value="onSelectCategoriaCuenta"
    ></CategoriaSelect>
    <SelectCuenta
      v-else
      v-model="cuenta"
      label="Cuenta Destino"
      :filter-array="['1', '2']"
      @update:model-value="onSelectCategoriaCuenta"
    ></SelectCuenta>
    <q-btn
      round
      icon="more_vert"
      no-caps
      flat
      class="text-condensed more-button"
    >
      <q-menu dark>
        <q-list style="min-width: 100px">
          <q-item v-close-popup>
            <q-item-section>
              <q-radio
                v-model="tipoMovimientoId"
                val="1"
                label="Ingreso"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                color="positive-pastel"
                @update:model-value="onChangeTipoMovimiento"
                dark
              />
              <q-radio
                v-model="tipoMovimientoId"
                val="2"
                label="Egreso"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                color="negative-pastel"
                @update:model-value="onChangeTipoMovimiento"
                dark
              />
              <q-radio
                v-model="tipoMovimientoId"
                val="3"
                label="Traspaso"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                color="contrast"
                @update:model-value="onChangeTipoMovimiento"
                dark
              />
            </q-item-section>
          </q-item>
          <q-item
            clickable
            @click="agregarCategoria"
            v-if="mostrarCategoria"
            v-close-popup
          >
            <q-item-section class="text-positive-pastel">
              Agregar categoría
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
  <Teleport to="#modal">
    <q-dialog
      v-model="showRegistroCategoria"
      persistent
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <FormRegistroCategoria
        :edited-item="editedCategoriaParam"
        @categoriaSaved="onCategoriaSaved"
      ></FormRegistroCategoria>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import CategoriaSelect from './CategoriaSelect.vue'
import FormRegistroCategoria from '../categorias/FormRegistroCategoria.vue'
import SelectCuenta from './SelectCuenta.vue'

/**
 * props
 */
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => {
      return {}
    }
  },
  tipoAfectacion: {
    type: String,
    required: false,
    default: null
  },
  isCambiable: {
    type: Boolean,
    required: false,
    default: true
  }
})
/**
 * state
 */
const tipoMovimientoId = ref('1')
const categoria = ref()
const cuenta = ref()
const tipoAfectacion = ref(props.tipoAfectacion)
const showRegistroCategoria = ref(false)
const editedCategoriaParam = ref({ tipoMovimientoId: tipoMovimientoId.value })
/**
 * onMounted
 */
onMounted(() => {
  // console.log(props.tipoAfectacion)
  tipoMovimientoId.value = props.tipoAfectacion === 'A' ? '1' : '2'
})
/**
 * emits
 */
const emit = defineEmits(['update:modelValue', 'categoriaSaved'])
/**
 * computed
 */
const tipoMovimiento = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
const mostrarCategoria = computed({
  get() {
    return tipoMovimientoId.value === '1' || tipoMovimientoId.value === '2'
  }
})
// const tipoAfectacion = computed({
//   get() {
//     return tipoMovimientoId.value === '1' ? 'A' : 'C'
//   }
// })
function onChangeTipoMovimiento(val) {
  console.log('val', val)
  switch (val) {
    case '1':
      tipoAfectacion.value = 'A'
      break
    case '2':
      tipoAfectacion.value = 'C'
      break
    default:
      break
  }
}
function onSelectCategoriaCuenta(val) {
  tipoMovimiento.value = {
    tipoMovimientoId: tipoMovimientoId.value,
    value: val
  }
}
function agregarCategoria() {
  editedCategoriaParam.value = {
    tipoMovimientoId: tipoMovimientoId.value,
    cuentaContable: null,
    cuentaDefault: null,
    icono: 'insert_emoticon',
    color: '#019A9D'
  }
  showRegistroCategoria.value = true
}
function onCategoriaSaved(categoriaSaved) {
  showRegistroCategoria.value = false
  categoria.value = categoriaSaved
  tipoMovimiento.value = {
    tipoMovimientoId: tipoMovimientoId.value,
    value: categoriaSaved
  }
  emit('categoriaSaved', categoriaSaved)
}
</script>

<style lang="scss" scoped></style>
./CuentaSelect~.vue.bak./deprecated/CuentaSelect.vue
