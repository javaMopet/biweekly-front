<template>
  <div class="row bg-primary text-secondary q-pa-sm q-mt-sm text-subtitle1">
    Cuentas Contables
  </div>
  <div class="row fit" style="border: 0px solid red">
    <q-tree
      v-if="arbolLleno"
      :nodes="arbolCuentas"
      node-key="id"
      label-key="label"
      v-model:selected="selected"
      v-model:expanded="expanded"
      color="secondary"
      selected-color="accent"
      default-expand-all
      @update:selected="onSelected"
      dense
    >
      <template v-slot:default-header="props">
        <div class="row items-center">
          <div class="column">
            <div class="text-weight-bold text-black">
              <span>{{ props.node.nombre }}</span>
            </div>
            <span
              :class="{
                active: props.node.id == props.tree.selected,
                'text-danger': true
              }"
              >{{ props.node.label }}
            </span>
          </div>
          <!-- <q-menu touch-position context-menu>
            <q-list dense style="min-width: 100px">
              <q-item clickable v-close-popup @click="addItem(prop)">
                <q-item-section
                  >Agregar Submenú a {{ prop.node.nombre }}</q-item-section
                >
              </q-item>
              <q-item clickable v-close-popup @click="editItem(prop)">
                <q-item-section
                  >Editar Menú {{ prop.node.nombre }}</q-item-section
                >
              </q-item>
              <q-item clickable v-close-popup @click="moverItem(prop)">
                <q-item-section
                  >Mover Menú {{ prop.node.nombre }}</q-item-section
                >
              </q-item>

              <q-separator />
              <q-item clickable>
                <q-item-section>Preferences</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>

                <q-menu anchor="top end" self="top start">
                  <q-list>
                    <q-item v-for="n in 3" :key="n" dense clickable>
                      <q-item-section>Submenu Label</q-item-section>
                      <q-item-section side>
                        <q-icon name="keyboard_arrow_right" />
                      </q-item-section>
                      <q-menu auto-close anchor="top end" self="top start">
                        <q-list>
                          <q-item v-for="n in 3" :key="n" dense clickable>
                            <q-item-section>3rd level Label</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="deleteItem(prop)">
                <q-item-section
                  >Eliminar Menú {{ prop.node.nombre }}</q-item-section
                >
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Cerrar</q-item-section>
              </q-item>
            </q-list>
          </q-menu> -->
        </div>
      </template>
    </q-tree>
    <!-- <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">{{ cuentaSeleccionada.label }}</div>
        <div class="text-subtitle2">
          Subnivel: {{ cuentaSeleccionada.subnivel }}
        </div>
      </q-card-section>
    </q-card> -->
  </div>

  <Teleport to="#modal">
    <q-dialog v-model="showFormItem" persistent>
      <CuentaContableForm></CuentaContableForm>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { useQuery, useLazyQuery } from '@vue/apollo-composable'
import { ref, computed, onMounted } from 'vue'
import {
  LISTA_CUENTAS_CONTABLES,
  ARBOL_CUENTAS_CONTABLES
} from '/src/graphql/cuentasContableGql'
import CuentaContableForm from 'src/components/cuentasContables/CuentaContableForm.vue'

/**
 * state
 */
const lista_cuentasContables = ref([])
const arbolCuentas = ref([])
const expanded = ref([])
const selected = ref(null)
const filter = ref()
const showFormItem = ref(false)
const cuentaSeleccionada = ref({ id: undefined, label: '' })

const columns = [
  { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
  {
    name: 'nombre',
    label: 'Nombre',
    field: 'nombre',
    sortable: true,
    align: 'left'
  },
  {
    name: 'subnivel',
    label: 'Subnivel',
    field: 'subnivel',
    sortable: true,
    align: 'left'
  },
  {
    name: 'padre',
    label: 'Padre',
    field: 'padreId',
    // field: (row) => `${row.cuentaContable.id} - ${row.cuentaContable.nombre}`,
    sortable: true,
    align: 'left'
  },
  {
    name: 'tipoAfectacion',
    label: 'Tipo Afectacion',
    field: 'tipoAfectacion',
    // field: (row) => `${row.tipoCuentaContable.nombre}`,
    sortable: true,
    align: 'left'
  },
  {
    name: 'acciones',
    label: 'Acciones',
    field: 'action',
    sortable: false,
    align: 'center'
  }
]

const { load: cargarCuentasContables, onResult: onResultCuentasContables } =
  useLazyQuery(ARBOL_CUENTAS_CONTABLES)

onResultCuentasContables(({ data }) => {
  if (!!data) {
    console.log('response', data.arbolCuentasContables)
    arbolCuentas.value = JSON.parse(JSON.stringify(data.arbolCuentasContables))
  }
})

function addRow() {
  showFormItem.value = true
}
/**
 * onMounted
 */
onMounted(() => {
  const subnivel = -1
  cargarCuentasContables(null, {
    subnivel
  })
})
/**
 * computed
 */
const arbolLleno = computed({
  get() {
    return arbolCuentas.value.length > 0
  }
})
function onSelected(val) {
  console.log('selected', val)
  cuentaSeleccionada.value = searchTree(arbolCuentas.value[0], val)
}

function searchTree(element, id) {
  if (element.id == id) {
    return element
  } else if (element.children != null) {
    var i
    var result = null
    for (i = 0; result == null && i < element.children.length; i++) {
      result = searchTree(element.children[i], id)
    }
    return result
  }
  return null
}
</script>

<style lang="scss" scoped>
.active {
  background-color: rgb(22, 39, 39);
  color: white;
}
</style>
