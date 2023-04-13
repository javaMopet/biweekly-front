<template>
  <div class="row text-h5 text-secondary q-pa-md font-subtitle">
    CUENTAS CONTABLES
  </div>
  <div class="column items-center" style="border: 0px solid red">
    <div class="q-pl-sm">
      <div class="col">
        <div>
          <q-input
            ref="filterRef"
            outlined
            v-model="filter"
            label="Buscar Cuenta Contable"
            clearable
            dense
            style="width: 800px"
            color="secondary"
          >
            <template v-slot:append>
              <q-icon name="filter_alt" />
            </template>
          </q-input>
        </div>
      </div>
      <div class="row fit" style="border: 0px solid red">
        <!-- <q-scroll-area style="width: 600px; height: calc(100vh - 200px)"> -->
        <q-tree
          v-if="arbolLleno"
          :nodes="arbolCuentas"
          node-key="id"
          label-key="label"
          v-model:selected="selected"
          v-model:expanded="expanded"
          default-expand-all
          color="secondary"
          selected-color="accent"
          @update:selected="onSelected"
          dense
          style="width: 800px"
          no-connectors
          :filter="filter"
          loa
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
                <span
                  :class="{
                    active: props.node.id == props.tree.selected,
                    'text-weight-regular text-primary-dark':
                      props.node.subnivel == 0
                  }"
                  >{{ props.node.label
                  }}<span class="text-primary text-caption">{{
                    props.node.tipoAfectacion == 'C'
                      ? ' (Cargo)'
                      : props.node.tipoAfectacion == 'A'
                      ? ' (Abono)'
                      : props.node.tipoAfectacion
                  }}</span>
                  <!-- <span class="text-weight-light text-caption">
                &nbsp;--------------&nbsp; &nbsp;-----&nbsp;&nbsp;-----&nbsp;
                {{
                  props.node.tipoAfectacion == 'C'
                    ? 'Cargo'
                    : props.node.tipoAfectacion == 'A'
                    ? 'Abono'
                    : props.node.tipoAfectacion
                }}
              </span> -->
                </span>
                <!-- <div class="text-weight-regular">
              <span class="text-grey-7 text-caption">{{
                props.node.tipoAfectacion == 'C'
                  ? 'Cargo'
                  : props.node.tipoAfectacion == 'A'
                  ? 'Abono'
                  : props.node.tipoAfectacion
              }}</span>
            </div> -->
              </div>
              <q-menu touch-position context-menu class="text-primary">
                <q-list dense style="min-width: 100px">
                  <q-item
                    v-if="props.node.subnivel != 0"
                    clickable
                    v-close-popup
                    @click="addRow(props)"
                  >
                    <q-item-section
                      >Agregar Sub-Cuenta Contable a "{{
                        props.node.label
                      }}"</q-item-section
                    >
                  </q-item>
                  <q-item clickable v-close-popup @click="editItem(props)">
                    <q-item-section>Editar {{ props.node.id }} </q-item-section>
                  </q-item>
                  <!-- <q-item clickable v-close-popup @click="moverItem(props)">
                <q-item-section
                  >Mover Cuenta Contable {{ props.node.nombre }}</q-item-section
                >
              </q-item> -->

                  <q-separator />
                  <!-- <q-item clickable>
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
              </q-item> -->
                  <q-separator />
                  <q-item
                    v-if="
                      !!props.node.children
                        ? props.node.children.length <= 0
                          ? true
                          : false
                        : true
                    "
                    clickable
                    v-close-popup
                    @click="deleteItem(props)"
                    class="bg-warning text-dark"
                  >
                    <q-item-section
                      >Eliminar {{ props.node.id }}
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>Cerrar</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </div>
          </template>
        </q-tree>
        <!-- </q-scroll-area> -->
        <!-- <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">{{ cuentaSeleccionada.label }}</div>
        <div class="text-subtitle2">
          Subnivel: {{ cuentaSeleccionada.subnivel }}
        </div>
      </q-card-section>
    </q-card> -->
      </div>
    </div>

    <Teleport to="#modal">
      <q-dialog v-model="showFormItem" persistent>
        <RegistroCuentaContable
          :edited-item="editedItem"
          @cuentaContableSaved="cuentaContableSaved"
          @cuentaContableUpdated="cuentaContableUpdated"
        ></RegistroCuentaContable>
      </q-dialog>
    </Teleport>
  </div>
</template>

<script setup>
import { useQuery, useMutation } from '@vue/apollo-composable'
import { ref, computed, watch } from 'vue'
import {
  ARBOL_CUENTAS_CONTABLES,
  ITEM_DELETE
} from '/src/graphql/cuentasContableGql'
import RegistroCuentaContable from 'src/components/cuentasContables/RegistroCuentaContable.vue'
import { useNotificacion } from 'src/composables/utils/useNotificacion.js'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

/**
 * composables
 */
const notificacion = useNotificacion()
const $q = useQuasar()
const $router = useRouter()
/**
 * state
 */

// const arbolCuentas = ref([])
const expanded = ref([])
const selected = ref(null)
const filter = ref('')
const showFormItem = ref(false)
const cuentaSeleccionada = ref({ id: undefined, label: '' })
const editedItem = ref({
  id: null,
  nombre: null
})
const itemToDelete = ref({
  padre_id: null,
  item: null
})

/**
 * computed
 */
const arbolLleno = computed({
  get() {
    return arbolCuentas.value.length > 0
  }
})
const arbolCuentas = computed({
  get() {
    return resultArbolCuentas.value?.arbolCuentasContables ?? []
  }
})
/**
 * METHODS
 */
function addRow(item_padre) {
  // console.log('Agregando Item  al padre:', item_padre.node)
  // console.log('subnivel:', item_padre.node.subnivel)
  const subnivel_padre = item_padre.node.subnivel

  const begin_cta_padre = item_padre.node.id
    .toString()
    .substring(0, 5 - subnivel_padre)
  // console.log('begin_cta_padre:', begin_cta_padre)

  const numero_hijos = !!item_padre.node.children
    ? item_padre.node.children.length
    : 0
  // console.log('numero de hijos', numero_hijos)
  let id = ''
  if (subnivel_padre < 2 && numero_hijos > 0) {
    const last_item = item_padre.node.children[numero_hijos - 1]
    // console.log('last item encontrado', last_item)
    id = parseInt(last_item.id) + 1
  } else {
    id = begin_cta_padre.toString()
  }

  console.log('id', id)
  editedItem.value = {
    action: 'add',
    id: id.toString(),
    nombre: null,
    padreId: item_padre.node.id,
    padre: {
      ...item_padre.node,
      nombreCompleto: `${item_padre.node.id} - ${item_padre.node.nombre}`
    },
    subnivel: item_padre.node.subnivel - 1,
    tipoAfectacion:
      item_padre.node.tipoAfectacion === 'C'
        ? 'Cargo'
        : item_padre.node.tipoAfectacion === 'A'
        ? 'Abono'
        : item_padre.node.tipoAfectacion
  }
  showFormItem.value = true
}
function editItem(item) {
  console.log('item to edit...', item.node)
  editedItem.value = {
    ...item.node,
    id: item.node.id.toString(),
    action: 'edit',
    tipoAfectacion:
      item.node.tipoAfectacion === 'C'
        ? 'Cargo'
        : item.node.tipoAfectacion === 'A'
        ? 'Abono'
        : 'Other',
    children: undefined
  }
  showFormItem.value = true
}

function deleteItem(item) {
  console.log('item', item)
  itemToDelete.value = {
    padre_id: item.node.padreId,
    item: item.node
  }
  deleteItem.value = $q
    .dialog({
      title: 'Confirmar',
      style: 'width:500px',
      message: `Está a punto de eliminar la cuenta contable "${item.node.label}" ¿Desea continuar con la eliminación?`,
      ok: {
        push: true,
        color: 'positive',
        label: 'Continuar'
      },
      cancel: {
        push: true,
        color: 'negative',
        flat: true,
        label: 'cancelar'
      },
      persistent: true
    })
    .onOk(() => {
      deleteCuentaContable({ id: item.node.id })
    })
    .onCancel(() => {
      itemToDelete.value = {
        padre_id: null,
        item: null
      }
    })
    .onDismiss(() => {})
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

function cuentaContableSaved(itemSaved) {
  console.log('saved', itemSaved)
  const padre = searchTree(arbolCuentas.value[0], itemSaved.padreId)
  padre.children.push(itemSaved)
  notificacion.mostrarNotificacionPositiva(
    `La cuenta contable ${itemSaved.label} se guardó correctamente.`,
    2000
  )
  showFormItem.value = false
}
function cuentaContableUpdated(itemUpdated) {
  console.log('updated', itemUpdated)
  const itemEdit = searchTree(arbolCuentas.value[0], itemUpdated.id)
  itemEdit.nombre = itemUpdated.nombre
  itemEdit.label = `${itemUpdated.id} - ${itemUpdated.nombre}`
  itemEdit.tipoAfectacion = itemUpdated.tipoAfectacion == 'Cargo' ? 'C' : 'A'
  notificacion.mostrarNotificacionPositiva(
    `La cuenta contable ${itemUpdated.label} se actualizó correctamente.`,
    2000
  )
  showFormItem.value = false
}

/**
 * GRAPHQL
 */
const graphql_options = ref({
  fetchPolicy: 'network-only'
})

const {
  result: resultArbolCuentas,
  onError: onErrorArbolCuentasContables,
  loading: loadingArbol
} = useQuery(ARBOL_CUENTAS_CONTABLES, null, graphql_options)

const {
  mutate: deleteCuentaContable,
  onDone: onDoneDeleteCuentaContable,
  onError: onErrorDeleteCuentaContable
} = useMutation(ITEM_DELETE)

onDoneDeleteCuentaContable(({ data }) => {
  console.log('data', data)
  const item_padre = searchTree(
    arbolCuentas.value[0],
    itemToDelete.value.padre_id
  )
  const index = item_padre.children.indexOf(itemToDelete.value.item)
  item_padre.children.splice(index, 1)
  itemToDelete.value = {
    padre_id: null,
    item: null
  }
  notificacion.mostrarNotificacionPositiva(
    'La cuenta contable fué eliminada.',
    2000
  )
})
onErrorDeleteCuentaContable((error) => {
  console.error(error)
})
onErrorArbolCuentasContables((error) => {
  console.error(error)
})
/**
 * watch
 */
watch(loadingArbol, (newValue, oldValue) => {
  console.log('cargando arbol', newValue, oldValue)
})
</script>

<style lang="scss" scoped>
.active {
  // background-color: rgb(22, 39, 39);
  // color: rgb(250, 225, 188) !important;
  color: rgb(0, 52, 224) !important;
}
.text-primary-dark {
  color: #010b24;
}
.encabezado {
  background-color: $secondary-light;
  color: $primary;
}
</style>
