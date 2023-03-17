<template>
  <q-card class="my-card" style="width: 400px">
    <q-card-section class="bg-primary text-secondary">
      Nueva Cuenta
    </q-card-section>

    <q-card-section class="">
      <div class="q-gutter-md">
        <div>
          <q-input v-model="formItem.nombre" type="text" label="Nombre" dense />
        </div>
        <div>
          <q-input
            v-model="formItem.descripcion"
            type="text"
            label="Descripcion"
            dense
          />
        </div>
        <div class="row inline q-gutter-sm">
          <q-input
            class="col"
            v-model="formItem.icono"
            type="text"
            dense
            outlined
            maxlength="20"
            :rules="[(val) => !!val || 'Icono requerido']"
            lazyRules
          />

          <div>
            <q-btn @click="selectIcon" color="dark">
              <q-icon
                color="gray"
                :name="formItem.icono || 'extension'"
                class="size"
                size="2.5em"
              />
            </q-btn>
          </div>
        </div>

        <div class="q-pa-md">
          <div
            class="q-gutter-md row items-start"
            :style="{ backgroundColor: `${formItem.color}` }"
          >
            <q-input
              filled
              v-model="formItem.color"
              :rules="['anyColor']"
              hint="Selecciona un color para la categoría"
              class="my-input"
              :input-style="{ backgroundColor: `${formItem.color}` }"
            >
              <template v-slot:append>
                <q-icon name="colorize" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-color
                      v-model="formItem.color"
                      no-header
                      no-footer
                      default-view="palette"
                      class="my-picker"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <div>
          <q-select
            v-model="formItem.tipo_cuenta"
            :options="tiposCuentaOptions"
            label="Tipo Cuenta"
            option-label="nombre"
            option-value="id"
          />
        </div>
        <div>
          <q-select
            v-model="formItem.cuenta_contable"
            :options="cuentasContablesOptions"
            label="Cuenta Contable"
            option-label="nombreCompleto"
            option-value="id"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-gutter-sm" align="right">
      <q-btn color="primary" label="Cancelar" v-close-popup outline />
      <q-btn color="primary" icon="check" label="Guardar" @click="saveItem" />
    </q-card-section>
  </q-card>

  <teleport to="body">
    <q-dialog v-model="show_icon_picker">
      <q-card
        class="my-card"
        style="max-height: 65vh; max-width: 60vw; width: 900px"
      >
        <q-card-section>
          <IconPicker
            @onClose="cancelIconPicker"
            @onIconSelected="onIconSelected"
          ></IconPicker>
        </q-card-section>
      </q-card>
    </q-dialog>
  </teleport>
</template>

<script setup>
import { useLazyQuery } from '@vue/apollo-composable'
import { ref, onMounted } from 'vue'

import IconPicker from '/src/components/IconPicker.vue'
/**
 * state
 */
const formItem = ref({
  nombre: '',
  icono: '',
  descripcion: '',
  color: ''
})
const tiposCuentaOptions = ref([])
const cuentasContablesOptions = ref([])
/**
 * onMounted
 */
onMounted(() => {
  // cargarTiposCuenta()
  // cargarCuentasContables()
})

// const { load: cargarTiposCuenta, onResult: onResultTiposCuenta } = useLazyQuery(
//   LISTA_TIPOS_CATEGORIA
// )
// const { load: cargarCuentasContables, onResult: onResultCuentasContables } =
//   useLazyQuery(LISTA_CUENTAS_CONTABLES)

// onResultTiposCuenta(({ data }) => {
//   if (!!data) {
//     console.log('data', data.listaTiposCuenta)
//     tiposCuentaOptions.value = data.listaTiposCuenta
//   }
// })

// onResultCuentasContables(({ data }) => {
//   if (!!data) {
//     console.log('data', data)
//     cuentasContablesOptions.value = data.listaCuentasContables
//   }
// })

function saveItem() {
  console.log('save item')
}

/**
 * icon picker
 */
const show_icon_picker = ref(false)
function cancelIconPicker() {
  show_icon_picker.value = false
}
function selectIcon() {
  show_icon_picker.value = true
}
function onIconSelected(value) {
  console.log('IconoSeleccionado', value)
  formItem.value.icono = value
  show_icon_picker.value = false
}
</script>

<style lang="sass" scoped>
.my-input
  max-width: 250px
</style>
