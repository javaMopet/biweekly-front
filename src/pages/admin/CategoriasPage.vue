<template>
  <q-toolbar class="text-dark">
    <q-toolbar-title> Categorias </q-toolbar-title>
    <q-btn flat round dense icon="arrow_back" @click="$router.back()" />
  </q-toolbar>
  <q-space style="height: 10px" />
  <div class="row fit" style="border: 0px solid red">
    <q-table
      grid
      style="width: 100%"
      dense
      :rows="listaCategorias"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :rows-per-page-options="[0]"
    >
      <template #item="props">
        <q-card class="my-card q-ma-sm" flat bordered>
          <q-item
            class="bg-dark text-white"
            :style="`border-top: 6px solid ${props.row.color}`"
          >
            <q-item-section avatar>
              <q-icon :name="props.row.icono" />
            </q-item-section>

            <q-item-section>
              <div class="row items-center no-wrap">
                <!-- <q-item-label>{{ props.row.color }}</q-item-label> -->
                <div class="col">
                  <q-item-label>{{ props.row.nombre }}</q-item-label>
                  <q-item-label caption class="text-accent-light">
                    {{ props.row.cuentaContable.nombreCompleto }}
                  </q-item-label>
                </div>
                <div class="col-auto q-pl-md">
                  <q-avatar
                    size="30px"
                    :class="{
                      'text-white': true,
                      'bg-positive': props.row.tipoCategoria.id === '1',
                      'bg-negative': props.row.tipoCategoria.id === '2'
                    }"
                    >{{ props.row.tipoCategoria.nombre[0] }}</q-avatar
                  >
                </div>
              </div>
            </q-item-section>
          </q-item>

          <q-card-section>
            {{ props.row.descripcion }}
          </q-card-section>

          <q-separator inset />

          <q-card-actions style="border: 0px solid red">
            <q-btn round flat icon="edit" @click="editRow(props)" />
            <!-- color="primary" -->
            <q-btn
              round
              flat
              icon="delete"
              class="q-ml-sm"
              @click="deleteRow(props)"
            />
            <!-- color="negative" -->
          </q-card-actions>
        </q-card>
      </template>
      <template v-slot:top-left>
        <q-btn
          label="Nueva categoria"
          color="primary"
          class=""
          @click="addRow()"
          icon="queue"
        />
      </template>

      <template v-slot:top-right>
        <q-input
          outlined
          dense
          debounce="300"
          v-model="filter"
          placeholder="Buscar"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template #body-cell-icono="props">
        <q-icon :name="props.row.icono" size="35px" color="cyan" />
      </template>
      <template v-slot:body-cell-acciones="props">
        <q-td :props="props" fit>
          <q-btn icon="edit" size="sm" flat dense @click="editRow(props)" />
          <q-btn
            icon="delete"
            size="sm"
            class="q-ml-sm"
            flat
            dense
            @click="deleteRow(props)"
          />
        </q-td>
      </template>
    </q-table>
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
import { ref, onMounted } from 'vue'
import { LISTA_CATEGORIAS, CATEGORIA_DELETE } from '/src/graphql/categorias'
// import { LISTA_CUENTAS_CONTABLES } from '/src/graphql/cuentasContableGql'
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
  icono: null,
  descripcion: null,
  color: null,
  tipoCategoria: null,
  tipoCategoriaId: '1',
  cuentaContable: null
}
const listaCategorias = ref([])
const filter = ref()
const editedItem = ref({ ...defaultItem })
const editedIndex = ref(null)
const rowIndexDelete = ref(null)
const showFormItem = ref(false)

const columns = [
  // { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
  {
    name: 'icono',
    label: '',
    field: 'icono',
    sortable: true,
    align: 'left'
  },
  {
    name: 'nombre',
    label: 'Nombre',
    field: 'nombre',
    sortable: true,
    align: 'left'
  },
  {
    name: 'descripcion',
    label: 'Descripción',
    field: 'descripcion',
    sortable: true,
    align: 'left'
  },

  {
    name: 'color',
    label: 'Color',
    field: 'color',
    sortable: true,
    align: 'left'
  },
  {
    name: 'cuenta_contable',
    label: 'Cuenta Contable',
    field: (row) => `${row.cuentaContable.id} - ${row.cuentaContable.nombre}`,
    sortable: true,
    align: 'left'
  },
  {
    name: 'tipo_categoria',
    label: 'Tipo Categoria',
    field: (row) => `${row.tipoCategoria.nombre}`,
    sortable: true,
    align: 'left'
  },
  {
    name: 'creacion',
    label: 'Fecha Creación',
    field: 'createdAt',
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
/**
 * onMount
 */
onMounted(() => {})
/**
 * METHODS
 */

function addRow() {
  editedItem.value = { ...defaultItem }
  editedIndex.value = null
  showFormItem.value = true
}
function editRow(item) {
  editedItem.value = {
    ...item.row,
    tipoCategoriaId: item.row.tipoCategoria.id
  }
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
function categoriaUpdated(itemUpdated) {
  showFormItem.value = false
  mostrarNotificacion('actualizó', itemUpdated)
  listaCategorias.value[editedIndex.value] = itemUpdated
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

onResultCategorias(({ data }) => {
  listaCategorias.value = JSON.parse(JSON.stringify(data.listaCategorias))
})
onErrorListaCategorias((error) => {
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
</script>

<style lang="scss" scoped>
@function color-texto($color) {
  @if (lightness($color) > 50) {
    @return rgb(51, 149, 162);
  } @else {
    @return rgb(217, 163, 230);
  }
}
</style>
