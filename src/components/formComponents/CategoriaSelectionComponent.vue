<template>
  <div class="row inline fit">
    <CategoriaSelect
      v-if="mostrarCategoria"
      v-model="categoria"
      :tipo-afectacion="tipoAfectacion"
      :agregar="false"
      @update:model-value="onSelectCategoriaCuenta"
    ></CategoriaSelect>
    <SelectCuenta
      v-else
      v-model="cuentaDestino"
      label="Cuenta Destino"
      :filter-array="['1', '2']"
      @update:model-value="onSelectCuentaDestino"
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
  <!-- <pre>{{ tipoMovimientoId }}-{{ tipoAfectacion }}-{{ categoria?.id }}</pre> -->
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
    type: Object, // depende de qué tipo sea el value seleccionado
    required: true
  },
  cuentaDestino: {
    type: Object,
    required: false,
    default: () => null
  },
  tipoMovimientoId: {
    type: String,
    required: true,
    default: '1'
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
const tipoAfectacion = ref(props.tipoAfectacion)
const showRegistroCategoria = ref(false)
const editedCategoriaParam = ref()
const categoriaAux = {
  id: -1,
  nombre: 'No definida'
}
/**
 * onMounted
 */
onMounted(() => {
  tipoMovimientoId.value = props.tipoAfectacion === 'A' ? '1' : '2'
  editedCategoriaParam.value = {
    tipoMovimientoId: tipoMovimientoId.value
  }
})
/**
 * emits
 */
const emit = defineEmits([
  'update:modelValue',
  'update:cuentaDestino',
  'update:tipoMovimientoId',
  'categoriaSaved'
])
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
const cuentaDestino = computed({
  get() {
    return props.cuentaDestino
  },
  set(val) {
    emit('update:cuentaDestino', val)
  }
})
const tipoMovimientoId = computed({
  get: () => props.tipoMovimientoId,
  set: (val) => emit('update:tipoMovimientoId', val)
})

const mostrarCategoria = computed({
  get() {
    return tipoMovimientoId.value === '1' || tipoMovimientoId.value === '2'
  }
})

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
  // console.log('onSelectCategoriaCuenta')
  // console.log('val:', val)
  emit('update:modelValue', val)
  emit('update:cuentaDestino', null)
}
function onSelectCuentaDestino(val) {
  // console.log('onSelectCuentaDestino')
  // console.log('val:', val)
  emit('update:modelValue', { ...categoriaAux })
  emit('update:cuentaDestino', val)
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
  emit('update:modelValue', categoriaSaved)
  emit('categoriaSaved', categoriaSaved)
}
</script>

<style lang="scss" scoped></style>
