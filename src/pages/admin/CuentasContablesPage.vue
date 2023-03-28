<template>
  <q-toolbar class="bg-primary text-secondary">
    <q-toolbar-title> Cuentas Contables </q-toolbar-title>

    <q-btn flat round dense icon="more_vert" />
  </q-toolbar>
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
        <div
          :class="{
            row: true,
            'items-center': true,
            encabezado: props.node.subnivel != 0,
            'full-width': true
          }"
        >
          <div class="column">
            <!-- <div class="text-weight-bold text-black">
              <span>{{ props.node.nombre }}</span>
            </div> -->
            <span
              :class="{
                active: props.node.id == props.tree.selected,
                'text-weight-bold': props.node.subnivel == 0
              }"
              >{{ props.node.label }}
            </span>
          </div>
          <q-menu touch-position context-menu>
            <q-list dense style="min-width: 100px">
              <q-item
                v-if="props.node.subnivel != 0"
                clickable
                v-close-popup
                @click="addItem(props)"
              >
                <q-item-section
                  >Agregar Sub-Cuenta Contable a "{{
                    props.node.label
                  }}"</q-item-section
                >
              </q-item>
              <q-item clickable v-close-popup @click="editItem(props)">
                <q-item-section
                  >Editar Cuenta Contable "{{
                    props.node.label
                  }}"</q-item-section
                >
              </q-item>
              <!-- <q-item clickable v-close-popup @click="moverItem(props)">
                <q-item-section
                  >Mover Cuenta Contable {{ props.node.nombre }}</q-item-section
                >
              </q-item> -->

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
              <q-item clickable v-close-popup @click="deleteItem(props)">
                <q-item-section
                  >Eliminar Menú {{ props.node.nombre }}</q-item-section
                >
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Cerrar</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
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
      <RegistroCuentaContable
        :edited-item="editedItem"
      ></RegistroCuentaContable>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { useLazyQuery } from '@vue/apollo-composable'
import { ref, computed, onMounted } from 'vue'
import { ARBOL_CUENTAS_CONTABLES } from '/src/graphql/cuentasContableGql'
import RegistroCuentaContable from 'src/components/cuentasContables/RegistroCuentaContable.vue'

/**
 * state
 */

const arbolCuentas = ref([])
const expanded = ref([])
const selected = ref(null)
const filter = ref()
const showFormItem = ref(false)
const cuentaSeleccionada = ref({ id: undefined, label: '' })
const editedItem = ref({
  id: null,
  nombre: null
})

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
/**
 * METHODS
 */
function addItem(item_padre) {
  console.log('Agregando Item  al padre:', item_padre.node)
  console.log('Padre_id:', item_padre.node.id)
  editedItem.value = {
    action: 'add',
    id: null,
    nombre: null,
    padre_id: item_padre.node.id,
    subnivel: item_padre.node.subnivel - 1,
    tipo_afectacion: item_padre.node.tipo_afectacion,
    tipoAfectacion: item_padre.node.tipo_afectacion === 'C' ? 'Cargo' : 'Abono'
  }
  showFormItem.value = true
}
function editItem(item) {
  console.log('item to edit...', item.node)
  editedItem.value = {
    ...item.node,
    action: 'edit',
    tipoAfectacion: item.node.tipo_afectacion === 'C' ? 'Cargo' : 'Abono',
    children: undefined
  }
  showFormItem.value = true
}
/**
 *
 * @param {} val
 */

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
.encabezado {
  background-color: #efece8;
  color: #162a5c;
}
</style>
