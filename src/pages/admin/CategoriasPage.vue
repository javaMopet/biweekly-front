<template>
  <div class="row fit q-gutter-sm" style="border: 0px solid red">
    <q-toolbar class="" dense fit>
      <div class="row items-center q-ml-sm q-gutter-x-sm">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs
            class="breadcrum-component"
            active-color="primary"
            separator=">"
            separator-color="primary"
          >
            <q-breadcrumbs-el icon="home" to="/home" label="Home" />
            <q-breadcrumbs-el label="Categorias" icon="category" />
          </q-breadcrumbs>
        </div>
      </div>
      <q-toolbar-title> </q-toolbar-title>
    </q-toolbar>
    <div class="col q-pl-xs">
      <q-table
        dense
        :rows="categoriaStore.listaCategoriasIngresos"
        :columns="columns"
        row-key="id"
        :filter="filterIngresos"
        :rows-per-page-options="[0]"
        hide-header
        class="bg-primary-light"
        hide-pagination
        :loading="categoriaStore.loadingListaCategorias"
        loading-label="Cargando Categorias..."
        no-data-label="No hay categorias de ingreso registradas"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
        <template #top-left>
          <div class="row items-center">
            <div class="page-title q-pr-md">Ingresos</div>
            <q-btn
              color="primary-button"
              icon="add"
              label="Nuevo"
              no-caps
              @click="addRow('1')"
              class="addNew-button"
              rounded
            />
          </div>
        </template>
        <template #top-right>
          <div class="row item-center q-gutter-x-md">
            <q-input
              outlined
              dense
              debounce="300"
              v-model="filterIngresos"
              placeholder="Buscar Ingresos"
              class="bg-accent-light"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>
        <template #body-cell-icono="props">
          <q-td
            :props="props"
            :style="`border-left: 8px solid ${props.row.color}`"
            class="bg-white"
          >
            <div class="row justify-around items-center text-dark">
              <q-icon :name="props.row.icono" size="25px" />
            </div>
          </q-td>
        </template>
        <template #body-cell-nombre="props">
          <q-td :props="props" class="bg-white">
            <div class="column">
              <div>
                <span class="categoria-nombre">{{ props.row.nombre }} </span>
                &nbsp;
                <span class="text-table-title categoria-subtitle">{{
                  props.row.cuentaContable?.nombreCompleto
                }}</span>
                <q-tooltip>
                  {{ props.row.descripcion }}
                </q-tooltip>
              </div>
              <!-- <span class="text-positive text-condensed">{{
                props.row.descripcion
              }}</span> -->
            </div>
          </q-td>
        </template>
        <template #body-cell-acciones="props">
          <q-td :props="props" fit class="bg-white q-gutter-x-md">
            <q-btn
              class="button-edit"
              icon="las la-edit"
              dense
              @click="editRow(props)"
              round
              flat
            />
            <q-btn
              icon="las la-trash-alt"
              class="button-delete"
              round
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
        class="my-sticky-header-table"
        :rows="categoriaStore.listaCategoriasEgresos"
        :columns="columns"
        row-key="id"
        :filter="filterGastos"
        :rows-per-page-options="[0]"
        hide-header
        hide-pagination
        dense
        :loading="categoriaStore.loadingListaCategorias"
        loading-label="Cargando Categorias..."
        no-data-label="No hay categorias de egreso registradas"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
        <template #top-left>
          <div class="row items-center">
            <div class="page-title q-pr-md">Gastos</div>
            <q-btn
              color="primary-button"
              icon="add"
              label="Nuevo"
              no-caps
              @click="addRow('2')"
              class="addNew-button"
              rounded
            />
          </div>
        </template>
        <template v-slot:top-right>
          <q-input
            outlined
            dense
            debounce="300"
            v-model="filterGastos"
            placeholder="Buscar Gastos"
            class="bg-accent-light"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template #body-cell-icono="props">
          <q-td
            :props="props"
            :style="`border-left: 8px solid ${props.row.color}`"
            class="bg-white"
          >
            <div class="row justify-around text-dark">
              <q-icon :name="props.row.icono" size="25px" />
            </div>
          </q-td>
        </template>
        <template #body-cell-nombre="props">
          <q-td :props="props" class="bg-white">
            <div class="column">
              <div>
                <span class="categoria-nombre">{{ props.row.nombre }} </span>
                &nbsp;
                <span class="text-table-title categoria-subtitle">{{
                  props.row.cuentaContable?.nombreCompleto
                }}</span>
                <q-tooltip>
                  {{ props.row.descripcion }}
                </q-tooltip>
              </div>
            </div>
          </q-td>
        </template>
        <template #body-cell-acciones="props">
          <q-td :props="props" fit class="bg-white q-gutter-x-md">
            <q-btn
              class="button-edit"
              icon="las la-edit"
              dense
              @click="editRow(props)"
              round
              flat
            />
            <q-btn
              icon="las la-trash-alt"
              class="button-delete"
              round
              @click="deleteRow(props)"
              flat
              dense
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>

  <Teleport to="#modal">
    <q-dialog
      v-model="showFormItem"
      persistent
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <FormRegistroCategoria
        :edited-item="editedItem"
        :edited-index="editedIndex"
        @categoriaSaved="categoriaSaved"
        @categoriaUpdated="categoriaUpdated"
      ></FormRegistroCategoria>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import FormRegistroCategoria from 'src/components/categorias/FormRegistroCategoria.vue'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { useQuasar } from 'quasar'
import { useCategoriaStore } from 'src/stores/common/categoriaStore'
import { useCategoriaService } from 'src/composables/useCategoriaService'
/**
 * composables
 */
const notificacion = useNotificacion()
const $q = useQuasar()
const { mostrarNotificacionNegativa } = useNotificacion()

/**
 * stores
 */
const categoriasCrud = useCategoriaService()
const categoriaStore = useCategoriaStore()
/**
 * state
 */
const defaultItem = {
  id: null,
  nombre: null,
  icono: 'insert_emoticon',
  descripcion: null,
  color: '#019A9D',
  tipoMovimiento: null,
  tipoMovimientoId: '1',
  cuentaContable: null,
  importeDefault: ''
}

const filterIngresos = ref()
const filterGastos = ref()
const editedItem = ref({ ...defaultItem })
const editedIndex = ref(-1)

const showFormItem = ref(false)
/**
 * GRAPHQL
 */

categoriasCrud.onDoneCategoriaDelete(({ data }) => {
  if (data) {
    const deletedItem = data.categoriaDelete.categoria
    mostrarNotificacion('elminó', deletedItem)
  }
})

categoriasCrud.onErrorCategoriaDelete((error) => {
  const errorString = error?.toString() ?? ''
  const mensaje = errorString.includes('REFERENCE constraint')
    ? 'La categoría ya ha sido utilizada previamente, no es posible eliminar, favor de verificar.'
    : 'No es posible eliminar esta categoría, favor de verificar.'

  notificacion.mostrarNotificacionNegativa(mensaje, 2200)
})

categoriaStore.onErrorListaCategorias((error) => {
  mostrarNotificacionNegativa(
    `No es posible obtener el listado de categorias. Favor de verificar. ${error.message}`,
    2100
  )
})
/**
 * computed
 */

// const listaTiposMovimiento = computed({
//   get() {
//     const listado =
//       resultListaTiposMovimientos.value?.listaTiposMovimiento.filter(
//         (tipoMovimiento) => tipoMovimiento.id != '3'
//       ) ?? []

//     listado.forEach((element) => {
//       element.nombre_color = element.id === '1' ? 'positive' : 'negative'
//     })

//     return listado
//   }
// })
/**
 * onMount
 */
// onMounted(() => {
//   // categoriaStore
// })
/**
 * METHODS
 */

function addRow(tipoMovimientoId) {
  editedItem.value = { ...defaultItem, tipoMovimientoId: tipoMovimientoId }
  editedIndex.value = null
  showFormItem.value = true
}
function editRow(item) {
  editedItem.value = {
    ...item.row,
    importeDefault: item.row.importeDefault
      ? item.row.importeDefault.toString()
      : '',
    tipoMovimientoId: item.row.tipoMovimiento.id
  }
  // console.log('item', editedItem.value)
  editedIndex.value = item.rowIndex
  showFormItem.value = true
}

function deleteRow(item) {
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
      categoriasCrud.categoriaDelete({ id: item.row.id })
    })
    .onCancel(() => {})
    .onDismiss(() => {})
}

function categoriaSaved(/* itemSaved */) {
  showFormItem.value = false
  // mostrarNotificacion('guardó', itemSaved)
  // categoriasCrud.refetchListaCategorias()
}
function categoriaUpdated(/* itemUpdated, indice */) {
  showFormItem.value = false
  editedItem.value = { ...defaultItem }
  editedIndex.value = null
  // categoriasCrud.refetchListaCategorias()
}

function mostrarNotificacion(action, cuenta) {
  notificacion.mostrarNotificacionPositiva(
    `La categoria "${cuenta.nombre}" se ${action} correctamente`,
    2500
  )
}

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

<style lang="scss" scoped>
@function color-texto($color) {
  @if (lightness($color) > 50) {
    @return rgb(51, 149, 162);
  } @else {
    @return rgb(217, 163, 230);
  }
}
.categoria-nombre {
  color: $categoria;
  letter-spacing: -0.025rem;
  font-weight: 400;
  font-size: 0.85rem;
}
.categoria-subtitle {
  font-size: 0.7rem;
  // letter-spacing: -0.035rem;
}

.delete_button {
  &:hover {
    color: $negative-pastel !important;
  }
}
.edit_button {
  &:hover {
    color: $info !important;
  }
}
.my-sticky-header-table {
  /* height or max-height is important */
  height: calc(100vh - 125px);

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: $primary-light;
  }
  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:first-child th {
    top: 0;
  }

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }
}
</style>
