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
      :rules="rules"
      lazyRules
      dense
      map-options
      :readonly="readonly"
      :autofocus="autofocus"
      :clearable="clearable"
      @update:model-value="onSelectCategoria"
      :tabindex="props.tabindex"
    >
      <template #after>
        <q-btn
          v-if="props.agregar"
          color="button-new"
          icon="add"
          @click="addItemCategoria(props)"
          dense
          class="small-button"
          glossy
          push
          tabindex="100"
        >
          <q-tooltip> Nueva Categoría </q-tooltip>
        </q-btn>
      </template>
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No results </q-item-section>
        </q-item>
      </template>
    </q-select>
    <!-- <div class="">
      <q-btn
        color="accent"
        class="addNew-button"
        icon="add"
        no-caps
        @click="addItemCategoria(props)"
        outline
      />
    </div> -->
  </div>

  <!-- <Teleport to="#modal">
    <q-dialog
      v-model="showRegistroCategoria"
      persistent
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <FormRegistroCategoria
        :edited-item="editedCategoriaParam"
        @categoriaSaved="categoriaSaved"
      ></FormRegistroCategoria>
    </q-dialog>
  </Teleport> -->
</template>

<script setup>
import { ref, toRefs, watch, onMounted, computed } from 'vue'
// import FormRegistroCategoria from '../categorias/FormRegistroCategoria.vue'
import { useCategoriaStore } from 'src/stores/common/categoriaStore'
import RegistroCategoriaDialog from '../categorias/RegistroCategoriaDialog.vue'
import { Dialog } from 'quasar'

/**
 *
 */
const categoriaStore = useCategoriaStore()

/**
 * onMounted
 */
onMounted(() => {
  // console.log('inicializando', props.tipoAfectacion)
  // 1 - Ingreso
  // 2 - Gasto
  // 3 - Traspaso
  tipoMovimientoId.value = props.tipoAfectacion === 'C' ? '2' : '1'
  // if (filteredOptions.value.length <= 0) {
  //   console.log('recargando ')
  //   reloadResultadoLista()
  // }
})
/**
 * state
 */
const filteredOptions = ref([])
const tipoMovimientoId = ref('1')
const editedCategoriaParam = ref({ tipoMovimientoId: tipoMovimientoId.value })

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
  clearable: {
    type: Boolean,
    required: false,
    default: false
  },
  isCambiable: {
    type: Boolean,
    required: false,
    default: true
  },
  tabindex: {
    type: Number,
    required: false
  }
})

const { tipoAfectacion } = toRefs(props)
/**
 * emits
 */
const emit = defineEmits(['update:modelValue'])
/**
 * watch
 */
watch(tipoAfectacion, (newVal, _oldVal_) => {
  // console.log('new - old ', newVal, oldVal)
  tipoMovimientoId.value = newVal === 'A' ? '1' : '2'
})
const mostrarCategorias = computed({
  get() {
    return tipoMovimientoId.value === '1' || tipoMovimientoId.value === '2'
  }
})

// const lblChangeTipoMovimiento = computed({
//   get() {
//     return tipoMovimientoId.value === '2' ? 'Ingreso' : 'Gasto'
//   }
// })

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
    if (tipoMovimientoId.value) {
      // return (resultadoLista.value?.listaCategorias ?? []).filter(
      //   (categoria) => categoria.tipoMovimientoId === tipoMovimientoId.value
      // )
      return categoriaStore.listaCategorias.filter(
        (categoria) => categoria.tipoMovimientoId === tipoMovimientoId.value
      )
    }
    return []
    // else {
    //   return resultadoLista.value?.listaCategorias ?? []
    // }
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

// function toogleTipoAfectacion(val) {
//   categoria.value = null
//   tipoMovimientoId.value = tipoMovimientoId.value === '1' ? '2' : '1'
// }
function addItemCategoria(_props_row) {
  editedCategoriaParam.value = {
    tipoMovimientoId: tipoMovimientoId.value,
    cuentaContable: null,
    cuentaDefault: null,
    icono: 'insert_emoticon',
    color: '#019A9D'
  }
  // showRegistroCategoria.value = true
  openRegistroCategoriaDialog()
}
function openRegistroCategoriaDialog() {
  Dialog.create({
    component: RegistroCategoriaDialog,
    parent: this,
    componentProps: {
      editedItem: editedCategoriaParam.value
    },
    // persistent: true,
    // noEscDismiss: true,
    // noBackdropDismiss: true,
    // transitionShow: 'jump-up',
    // transitionHide: 'jump-down',
    onOk: (value) => {
      categoria.value = value
    },
    onCancel: () => {
      console.log('cancel')
    }
  })
}

function onSelectCategoria(_value) {
  // console.log(value)
}
</script>

<style lang="css" scoped></style>
