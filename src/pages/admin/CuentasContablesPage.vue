<template>
  <div class="column items-center" style="border: 0px solid red">
    <q-toolbar class="" dense fit>
      <div class="row items-center q-ml-sm q-gutter-x-sm">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs
            class="breadcrum-component"
            active-color="primary"
            separator=">"
            separator-color="primary"
          >
            <q-breadcrumbs-el icon="home" label="Home" to="/" />
            <q-breadcrumbs-el
              label="Cuentas Contables"
              icon="account_balance"
            />
          </q-breadcrumbs>
        </div>
      </div>
      <q-toolbar-title> </q-toolbar-title>
    </q-toolbar>
    <div class="q-pl-sm">
      <div class="row justify-between full-width">
        <div class="page-title">Cuentas Contables</div>
        <div class="q-pl-md">
          <q-input
            ref="filterRef"
            outlined
            v-model="filter"
            label="Buscar Cuenta Contable"
            clearable
            dense
            style="width: 400px"
            color="secondary"
          >
            <template v-slot:append>
              <q-icon name="filter_alt" />
            </template>
          </q-input>
        </div>
      </div>

      <div class="row fit" style="border: 0px solid red">
        <q-tree
          v-if="arbolLleno"
          :nodes="cuentaContableStore.arbolCuentasContables"
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
          class="font-tree"
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
                </span>
              </div>
              <q-menu touch-position context-menu class="text-primary">
                <q-list style="min-width: 100px">
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
                  <q-separator />
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
                    class="text-negative-pastel"
                  >
                    <q-item-section avatar>
                      <q-avatar
                        size="40px"
                        font-size="22px"
                        color="negative-pastel"
                        text-color="white"
                        icon="delete"
                      />
                    </q-item-section>
                    <q-item-section>
                      Eliminar {{ props.node.id }}
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
      </div>
    </div>

    <Teleport to="#modal">
      <q-dialog
        v-model="showFormItem"
        persistent
        transition-show="jump-up"
        transition-hide="jump-down"
      >
        <FormRegistroCuentaContable
          :edited-item="editedItem"
          @cuentaContableSaved="onCuentaContableSaved"
          @cuentaContableUpdated="cuentaContableUpdated"
          :is-padre-default="true"
        ></FormRegistroCuentaContable>
      </q-dialog>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FormRegistroCuentaContable from 'src/components/cuentasContables/FormRegistroCuentaContable.vue'
import { useNotificacion } from 'src/composables/utils/useNotificacion.js'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useCuentaContableStore } from 'src/stores/common/useCuentaContableStore'
import { useCuentasContablesCrud } from 'src/composables/useCuentasContablesCrud'

/**
 * composables
 */
const notificacion = useNotificacion()
const $q = useQuasar()
const $router = useRouter()
const cuentaContableStore = useCuentaContableStore()
const cuentasContablesCrud = useCuentasContablesCrud()

const { loadingArbolCuentas, onDoneDeleteCuentaContable } = cuentaContableStore
/**
 * state
 */
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
    return cuentaContableStore.arbolCuentasContables?.length > 0
  }
})

/**
 * METHODS
 */
function addRow(item_padre) {
  // cuentaContableStore.loadOrRefetchListaCuentas({
  //   subnivel: null, //parseInt(props.subnivel),
  //   clasificacion: null, // props.clasificacion,
  //   tipoAfectacion: null //props.tipoAfectacion
  // })
  const subnivel_padre = item_padre.node.subnivel
  const begin_cta_padre = item_padre.node.id
    .toString()
    .substring(0, 5 - subnivel_padre)

  const numero_hijos = !!item_padre.node.children
    ? item_padre.node.children.length
    : 0

  let id = ''
  if (subnivel_padre < 2 && numero_hijos > 0) {
    const last_item = item_padre.node.children[numero_hijos - 1]

    id = parseInt(last_item.id) + 1
  } else {
    id = begin_cta_padre.toString()
  }

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
    tipoAfectacion: item_padre.node.tipoAfectacion
  }
  showFormItem.value = true
}
/**
 * Funcion utiliza para iniciar la edición de un elemento.
 * @param {} item
 */
function editItem(item) {
  console.log('item to edit...', item.node)
  editedItem.value = {
    ...item.node,
    id: item.node.id.toString(),
    action: 'edit',
    tipoAfectacion: item.node.tipoAfectacion,
    children: undefined
  }
  showFormItem.value = true
}

function deleteItem(item) {
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
      cuentasContablesCrud.cuentaContableDelete({ id: item.node.id })
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
  cuentaSeleccionada.value = cuentaContableStore.findTreeElementById(val)
}

function onCuentaContableSaved() {
  showFormItem.value = false
}

function cuentaContableUpdated() {
  console.log('cuentaContableUpdated()')
  showFormItem.value = false
}

/**
 * GRAPHQL
 */

cuentasContablesCrud.onDoneCuentaContableDelete(({ data }) => {
  if (!!data) {
    console.log('deleted')
    const itemDeleted = data.cuentaContableDelete.cuentaContable
    notificacion.mostrarNotificacionPositiva(
      `La cuenta contable "${itemDeleted.nombreCompleto}" fué eliminada con éxito.`,
      1200
    )
  }
})

cuentasContablesCrud.onErrorCuentaContableDelete(() => {
  notificacion.mostrarNotificacionNegativa(
    `La cuenta contable no pudo ser eliminada. Favor de verificar.`,
    1200
  )
})

// onErrorArbolCuentasContables((error) => {
//   console.error(error)
// })
/**
 * watch
 */
// watch(loadingArbol, (newValue, oldValue) => {
//   console.log('cargando arbol', newValue, oldValue)
// })
</script>

<style lang="scss" scoped>
.font-tree {
  font-family: 'Mulish', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
}
.active {
  background-color: #fcf6f2;
  color: $secondary !important;
  font-weight: 600;
}
.text-primary-dark {
  color: #010b24;
}
.encabezado {
  background-color: $table-header;
  color: $primary;
  font-weight: 500 !important;
  font-size: 0.9rem;
  letter-spacing: 0.025rem;
}
</style>
