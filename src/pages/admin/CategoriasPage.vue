<template>
  <div class="row text-h5 text-secondary q-pa-md font-subtitle">CATEGORIAS</div>
  <!-- <pre>{{ listaCategoriasInversiones }}</pre> -->
  <q-toolbar class="text-dark">
    <q-btn-dropdown
      split
      icon="add"
      label="AGREGAR"
      color="primary"
      @click="addRow('2')"
    >
      <q-list>
        <q-item
          v-for="tipoMovimiento in listaTiposMovimiento"
          v-bind:key="tipoMovimiento.id"
          clickable
          v-close-popup
          @click="addRow(tipoMovimiento.id)"
        >
          <q-item-section avatar>
            <q-icon :name="tipoMovimiento.icono" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ tipoMovimiento.nombre }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-toolbar-title> </q-toolbar-title>

    <q-btn flat round dense icon="arrow_back" @click="$router.back()" />
  </q-toolbar>
  <q-space style="height: 10px" />
  <div class="row fit q-gutter-sm" style="border: 0px solid red">
    <div class="col q-pl-xs">
      <q-table
        dense
        :rows="listaCategoriasIngresos"
        :columns="columns"
        row-key="id"
        :filter="filterIngresos"
        :rows-per-page-options="[0]"
        hide-header
        class="bg-primary-light"
      >
        <template #top-left>
          <div class="text-h5 text-bold text-accent">Ingresos</div>
        </template>
        <template v-slot:top-right>
          <q-input
            outlined
            dense
            debounce="300"
            v-model="filterIngresos"
            placeholder="Buscar Ingresos"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template #body-cell-icono="props">
          <q-td
            :props="props"
            :style="`border-left: 3px solid ${props.row.color}`"
            class="bg-white"
          >
            <div class="row justify-around text-white bg-high-contrast">
              <q-icon :name="props.row.icono" size="22px" />
            </div>
          </q-td>
        </template>
        <template #body-cell-nombre="props">
          <q-td :props="props" class="bg-white">
            <div class="column">
              <div>
                <span class="categoria-nombre text-blue-grey-8"
                  >{{ props.row.nombre }}
                </span>
                &nbsp;
                <span class="text-accent text-caption">{{
                  props.row.cuentaContable.nombreCompleto
                }}</span>
              </div>
              <span class="text-positive text-subtitle2">{{
                props.row.descripcion
              }}</span>
            </div>
          </q-td>
        </template>
        <template #body-cell-acciones="props">
          <q-td :props="props" fit class="bg-white">
            <q-btn
              icon="edit"
              size="md"
              dense
              @click="editRow(props)"
              rounded
              color="dark"
              flat
            />
            <q-btn
              icon="delete"
              size="md"
              class="q-ml-sm"
              color="accent"
              rounded
              dense
              @click="deleteRow(props)"
              flat
            />
          </q-td>
        </template>
      </q-table>
      <q-table
        dense
        :rows="listaCategoriasInversiones"
        :columns="columns"
        row-key="id"
        :filter="filterInversiones"
        :rows-per-page-options="[0]"
        hide-header
        class="bg-primary-light"
      >
        <template #top-left>
          <div class="text-h5 text-bold text-accent">Inversiones</div>
        </template>
        <template v-slot:top-right>
          <q-input
            outlined
            dense
            debounce="300"
            v-model="filterInversiones"
            placeholder="Buscar Inversiones"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template #body-cell-icono="props">
          <q-td
            :props="props"
            :style="`border-left: 3px solid ${props.row.color}`"
            class="bg-white"
          >
            <div class="row justify-around text-white bg-high-contrast">
              <q-icon :name="props.row.icono" size="22px" />
            </div>
          </q-td>
        </template>
        <template #body-cell-nombre="props">
          <q-td :props="props" class="bg-white">
            <div class="column">
              <div>
                <span class="categoria-nombre text-blue-grey-8"
                  >{{ props.row.nombre }}
                </span>
                &nbsp;
                <span class="text-accent text-caption">{{
                  props.row.cuentaContable.nombreCompleto
                }}</span>
              </div>
              <span class="text-positive text-subtitle2">{{
                props.row.descripcion
              }}</span>
            </div>
          </q-td>
        </template>
        <template #body-cell-acciones="props">
          <q-td :props="props" fit class="bg-white">
            <q-btn
              icon="edit"
              size="md"
              dense
              @click="editRow(props)"
              rounded
              color="dark"
              flat
            />
            <q-btn
              icon="delete"
              size="md"
              class="q-ml-sm"
              color="accent"
              rounded
              dense
              @click="deleteRow(props)"
              flat
            />
          </q-td>
        </template>
      </q-table>
    </div>
    <div class="col">
      <q-table
        dense
        :rows="listaCategoriasEgresos"
        :columns="columns"
        row-key="id"
        :filter="filterGastos"
        :rows-per-page-options="[0]"
        hide-header
        class="bg-primary-light"
      >
        <template #top-left>
          <div class="text-h5 text-bold text-accent">Gastos</div>
        </template>
        <template v-slot:top-right>
          <q-input
            outlined
            dense
            debounce="300"
            v-model="filterGastos"
            placeholder="Buscar Gastos"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template #body-cell-icono="props">
          <q-td
            :props="props"
            :style="`border-left: 3px solid ${props.row.color}`"
            class="bg-white"
          >
            <div class="row justify-around text-white bg-high-contrast">
              <q-icon :name="props.row.icono" size="22px" />
            </div>
          </q-td>
        </template>
        <template #body-cell-nombre="props">
          <q-td :props="props" class="bg-white">
            <div class="column">
              <div>
                <span class="categoria-nombre text-blue-grey-8"
                  >{{ props.row.nombre }}
                </span>
                &nbsp;
                <span class="text-accent text-caption">{{
                  props.row.cuentaContable.nombreCompleto
                }}</span>
              </div>
              <span class="text-positive text-subtitle2">{{
                props.row.descripcion
              }}</span>
            </div>
          </q-td>
        </template>
        <template #body-cell-acciones="props">
          <q-td :props="props" fit class="bg-white">
            <q-btn
              icon="edit"
              size="md"
              dense
              @click="editRow(props)"
              rounded
              color="dark"
              flat
            />
            <q-btn
              icon="delete"
              size="md"
              class="q-ml-sm"
              color="accent"
              rounded
              dense
              @click="deleteRow(props)"
              flat
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>

  <Teleport to="#modal">
    <q-dialog v-model="showFormItem" persistent>
      <RegistroCategoria
        :edited-item="editedItem"
        :edited-index="editedIndex"
        @categoriaSaved="categoriaSaved"
        @categoriaUpdated="categoriaUpdated"
      ></RegistroCategoria>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ref, computed, onMounted } from 'vue'
import { LISTA_CATEGORIAS, CATEGORIA_DELETE } from '/src/graphql/categorias'
import { LISTA_TIPOS_MOVIMIENTO } from 'src/graphql/movimientos'
import RegistroCategoria from 'src/components/categorias/RegistroCategoria.vue'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { useQuasar } from 'quasar'
/**
 * composables
 */
const notificacion = useNotificacion()
const $q = useQuasar()

/**
 * state
 */
const defaultItem = {
  id: null,
  nombre: null,
  icono: 'insert_emoticon',
  descripcion: null,
  color: '#019a9d',
  tipoMovimiento: null,
  tipoMovimientoId: '1',
  cuentaContable: null
}
const listaCategorias = ref([])
const filterIngresos = ref()
const filterGastos = ref()
const filterInversiones = ref()
const editedItem = ref({ ...defaultItem })
const editedIndex = ref(-1)
const rowIndexDelete = ref(null)
const showFormItem = ref(false)

/**
 * computed
 */
const listaCategoriasIngresos = computed({
  get() {
    return listaCategorias.value.filter(
      (categoria) => categoria.tipoMovimientoId === '1'
    )
  }
})
const listaCategoriasEgresos = computed({
  get() {
    return listaCategorias.value.filter(
      (categoria) => categoria.tipoMovimientoId === '2'
    )
  }
})
const listaCategoriasInversiones = computed({
  get() {
    return listaCategorias.value.filter(
      (categoria) => categoria.tipoMovimientoId === '4'
    )
  }
})
const listaTiposMovimiento = computed({
  get() {
    return (
      resultListaTiposMovimientos.value?.listaTiposMovimiento.filter(
        (tipoMovimiento) => tipoMovimiento.id != '3'
      ) ?? []
    )
  }
})
/**
 * onMount
 */
onMounted(() => {})
/**
 * METHODS
 */

function addRow(tipoMovimientoId) {
  console.log('tipoMovimientoId', tipoMovimientoId)
  editedItem.value = { ...defaultItem, tipoMovimientoId: tipoMovimientoId }
  console.log('editeditem', editedItem.value)
  editedIndex.value = null
  showFormItem.value = true
}
function editRow(item) {
  editedItem.value = {
    ...item.row,
    importeDefault: item.row.importeDefault.toString(),
    tipoMovimientoId: item.row.tipoMovimiento.id
  }
  console.log('item', editedItem.value)
  editedIndex.value = item.rowIndex
  showFormItem.value = true
}

function deleteRow(item) {
  rowIndexDelete.value = item.rowIndex
  $q.dialog({
    title: 'Confirmar',
    style: 'width:500px',
    message: ` ¿Confirme si desea eliminar la categoria "${item.row.nombre}"?`,
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
      deleteCategoria({ id: item.row.id })
    })
    .onCancel(() => {})
    .onDismiss(() => {})
}

function categoriaSaved(itemSaved) {
  showFormItem.value = false
  listaCategorias.value.push(itemSaved)
  mostrarNotificacion('guardó', itemSaved)
}
function categoriaUpdated(itemUpdated, indice) {
  console.log('se actualizó el item con indice: ', indice)
  showFormItem.value = false
  mostrarNotificacion('actualizó', itemUpdated)
  // listaCategorias.value[indice] = itemUpdated
  editedItem.value = { ...defaultItem }
  editedIndex.value = null
}
function mostrarNotificacion(action, cuenta) {
  notificacion.mostrarNotificacionPositiva(
    `La categoria "${cuenta.nombre}" se ${action} correctamente`,
    2500
  )
}

/**
 * GRAPHQL
 */
const options = ref({
  fetchPolicy: 'network-only'
})

const { onResult: onResultCategorias, onError: onErrorListaCategorias } =
  useQuery(LISTA_CATEGORIAS, null, options)

const {
  result: resultListaTiposMovimientos,
  onError: onErrorListaTiposMovimiento
} = useQuery(LISTA_TIPOS_MOVIMIENTO, null, options)

onResultCategorias(({ data }) => {
  listaCategorias.value = JSON.parse(JSON.stringify(data.listaCategorias))
})
onErrorListaCategorias((error) => {
  console.error(error)
})
onErrorListaTiposMovimiento((error) => {
  console.error(error)
})

const {
  mutate: deleteCategoria,
  onDone: onDoneDeleteCategoria,
  onError: onErrorDeleteCategoria
} = useMutation(CATEGORIA_DELETE)

onDoneDeleteCategoria(({ data }) => {
  if (!!data) {
    console.log('item deleted ', data)
    const deletedItem = data.categoriaDelete.categoria
    listaCategorias.value.splice(rowIndexDelete.value, 1)
    rowIndexDelete.value = null
    mostrarNotificacion('elminó', deletedItem)
  }
})
onErrorDeleteCategoria((error) => {
  console.error(error)
})

const columns = [
  // { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
  {
    name: 'icono',
    label: '',
    sortable: true,
    align: 'left',
    filter: false
  },
  {
    name: 'nombre',
    label: 'Categoria',
    field: 'nombre',
    sortable: true,
    align: 'left',
    filter: true
  },
  // {
  //   name: 'descripcion',
  //   label: 'Descripción',
  //   field: 'descripcion',
  //   sortable: true,
  //   align: 'left'
  // },

  // {
  //   name: 'color',
  //   label: 'Color',
  //   field: 'color',
  //   sortable: true,
  //   align: 'left'
  // },
  // {
  //   name: 'cuentaContable',
  //   label: 'Cuenta Contable',
  //   field: '',
  //   sortable: true,
  //   align: 'left'
  // },
  // {
  //   name: 'tipo_categoria',
  //   label: 'Tipo Categoria',
  //   field: (row) => `${row.tipoMovimiento.nombre}`,
  //   sortable: true,
  //   align: 'left'
  // },
  // {
  //   name: 'creacion',
  //   label: 'Fecha Creación',
  //   field: 'createdAt',
  //   sortable: true,
  //   align: 'left'
  // },
  {
    name: 'acciones',
    label: '',
    field: 'action',
    sortable: false,
    align: 'center'
  }
]
</script>

<style lang="scss">
@function color-texto($color) {
  @if (lightness($color) > 50) {
    @return rgb(51, 149, 162);
  } @else {
    @return rgb(217, 163, 230);
  }
}
.categoria-nombre {
  font-weight: bold;
  font-size: 1rem;
}
.bg-high-contrast {
  background-image: linear-gradient(310deg, #7928ca 0%, #ff0080 100%);
  padding: 10px;
  border-radius: 0.5rem !important;
  width: 40px;
}
</style>
